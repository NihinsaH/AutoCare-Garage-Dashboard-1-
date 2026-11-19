import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Wrench,
  X,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  city: string;
  registered: string;
  type: "Individual" | "Business";
  status: "Active" | "Inactive";
  vehicles: number;
  jobs: number;
  spent: number;
  outstanding: number;
  notes: string;
  color: string;
};

type CustomerForm = {
  name: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  city: string;
  type: "Individual" | "Business";
  notes: string;
};

type Mode = "list" | "form" | "details";
type Tab = "Overview" | "Vehicles" | "Repair History" | "Invoices" | "Payments";

const initialCustomers: Customer[] = [
  {
    id: "CUS-1028",
    name: "Nimal Perera",
    initials: "NP",
    phone: "077 234 8891",
    altPhone: "071 445 2030",
    email: "nimal.perera@gmail.com",
    address: "42/6, Temple Road",
    city: "Nugegoda",
    registered: "12 Jan 2021",
    type: "Individual",
    status: "Active",
    vehicles: 2,
    jobs: 14,
    spent: 486500,
    outstanding: 15000,
    notes: "Prefers a phone call before additional repairs above LKR 5,000.",
    color: "#2563eb",
  },
  {
    id: "CUS-1027",
    name: "Sachini Fernando",
    initials: "SF",
    phone: "071 680 2240",
    altPhone: "",
    email: "sachini.f@gmail.com",
    address: "18, Lake Road",
    city: "Maharagama",
    registered: "08 Mar 2022",
    type: "Individual",
    status: "Active",
    vehicles: 1,
    jobs: 6,
    spent: 218400,
    outstanding: 0,
    notes: "Contact by WhatsApp when the vehicle is ready.",
    color: "#7c3aed",
  },
  {
    id: "CUS-1026",
    name: "Lanka Fresh Foods",
    initials: "LF",
    phone: "011 278 4055",
    altPhone: "077 228 4055",
    email: "fleet@lankafresh.lk",
    address: "67, Industrial Estate",
    city: "Homagama",
    registered: "24 Aug 2020",
    type: "Business",
    status: "Active",
    vehicles: 8,
    jobs: 31,
    spent: 1865000,
    outstanding: 17500,
    notes: "Fleet account. Invoices require purchase order references.",
    color: "#0891b2",
  },
  {
    id: "CUS-1025",
    name: "Fathima Rizna",
    initials: "FR",
    phone: "075 330 8677",
    altPhone: "",
    email: "fathima.rizna@yahoo.com",
    address: "31/2, Main Street",
    city: "Dehiwala",
    registered: "17 Sep 2022",
    type: "Individual",
    status: "Active",
    vehicles: 2,
    jobs: 9,
    spent: 325800,
    outstanding: 0,
    notes: "",
    color: "#db2777",
  },
  {
    id: "CUS-1024",
    name: "M. A. Traders",
    initials: "MT",
    phone: "011 284 9022",
    altPhone: "076 840 9022",
    email: "admin@matraders.lk",
    address: "144, Kandy Road",
    city: "Kelaniya",
    registered: "05 Nov 2019",
    type: "Business",
    status: "Active",
    vehicles: 5,
    jobs: 24,
    spent: 1246000,
    outstanding: 86750,
    notes: "Commercial account with 14-day payment terms.",
    color: "#ea580c",
  },
  {
    id: "CUS-1023",
    name: "Tharindu Wijesinghe",
    initials: "TW",
    phone: "076 445 1098",
    altPhone: "",
    email: "tharinduw@gmail.com",
    address: "9, Station Lane",
    city: "Kottawa",
    registered: "20 May 2024",
    type: "Individual",
    status: "Active",
    vehicles: 1,
    jobs: 2,
    spent: 47200,
    outstanding: 0,
    notes: "New customer referral from Nimal Perera.",
    color: "#059669",
  },
  {
    id: "CUS-1022",
    name: "Chamika Dias",
    initials: "CD",
    phone: "077 819 4432",
    altPhone: "",
    email: "chamika.dias@gmail.com",
    address: "82, Flower Road",
    city: "Colombo 07",
    registered: "14 May 2024",
    type: "Individual",
    status: "Active",
    vehicles: 1,
    jobs: 1,
    spent: 21000,
    outstanding: 0,
    notes: "",
    color: "#4f46e5",
  },
  {
    id: "CUS-1021",
    name: "S. M. Holdings",
    initials: "SM",
    phone: "011 245 6680",
    altPhone: "",
    email: "operations@smholdings.lk",
    address: "210, Galle Road",
    city: "Colombo 03",
    registered: "03 Feb 2020",
    type: "Business",
    status: "Inactive",
    vehicles: 3,
    jobs: 11,
    spent: 648000,
    outstanding: 65000,
    notes: "Account temporarily inactive pending settlement.",
    color: "#64748b",
  },
];

const vehicles = [
  {
    reg: "CAA-4587",
    vehicle: "Toyota Prius",
    year: "2015",
    type: "Car",
    color: "Pearl White",
    mileage: "128,450 km",
    jobs: 9,
    lastVisit: "24 May 2024",
  },
  {
    reg: "WP KR-7741",
    vehicle: "Suzuki Alto",
    year: "2018",
    type: "Car",
    color: "Silver",
    mileage: "74,280 km",
    jobs: 5,
    lastVisit: "12 Apr 2024",
  },
];

const repairHistory = [
  {
    id: "JOB-1048",
    vehicle: "CAA-4587",
    date: "24 May 2024",
    service: "Engine diagnostic & tune-up",
    status: "In Progress",
    cost: 42500,
  },
  {
    id: "JOB-1016",
    vehicle: "CAA-4587",
    date: "08 Apr 2024",
    service: "Full service & oil change",
    status: "Completed",
    cost: 28500,
  },
  {
    id: "JOB-0982",
    vehicle: "WP KR-7741",
    date: "21 Feb 2024",
    service: "Brake pad replacement",
    status: "Completed",
    cost: 24800,
  },
  {
    id: "JOB-0914",
    vehicle: "CAA-4587",
    date: "17 Nov 2023",
    service: "Hybrid battery inspection",
    status: "Completed",
    cost: 18000,
  },
];

const invoiceHistory = [
  { number: "INV-2099", date: "24 May 2024", total: 40000, paid: 25000 },
  { number: "INV-2012", date: "08 Apr 2024", total: 28500, paid: 28500 },
  { number: "INV-1974", date: "21 Feb 2024", total: 24800, paid: 24800 },
  { number: "INV-1848", date: "17 Nov 2023", total: 18000, paid: 18000 },
];

const paymentHistory = [
  {
    date: "24 May 2024",
    invoice: "INV-2099",
    amount: 25000,
    method: "Cash",
    reference: "PAY-0837",
  },
  {
    date: "08 Apr 2024",
    invoice: "INV-2012",
    amount: 28500,
    method: "Card",
    reference: "PAY-0794",
  },
  {
    date: "21 Feb 2024",
    invoice: "INV-1974",
    amount: 24800,
    method: "Bank Transfer",
    reference: "PAY-0718",
  },
];

const emptyForm: CustomerForm = {
  name: "",
  phone: "",
  altPhone: "",
  email: "",
  address: "",
  city: "",
  type: "Individual",
  notes: "",
};

const formatLkr = (value: number) => `LKR ${value.toLocaleString("en-LK")}`;

function Field({
  label,
  required,
  wide,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className={`job-field ${wide ? "wide" : ""}`}>
      <span>
        {label} {required && <em>*</em>}
      </span>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
}) {
  return (
    <span className="job-select-wrap">
      <select value={value} onChange={onChange}>
        {children}
      </select>
      <ChevronDown size={14} />
    </span>
  );
}

function CustomerStatus({ status }: { status: Customer["status"] }) {
  return (
    <span className={`customer-status ${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}

export default function Customers({ notify }: { notify: (message: string) => void }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState(initialCustomers[0].id);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("All Registration Dates");
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selected = customers.find((customer) => customer.id === selectedId) ?? customers[0];
  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase().trim();
    return customers.filter((customer) => {
      const searchMatch = [customer.name, customer.phone, customer.email].some((value) =>
        value.toLowerCase().includes(term),
      );
      const statusMatch = statusFilter === "All Statuses" || customer.status === statusFilter;
      const dateMatch =
        dateFilter === "All Registration Dates" ||
        (dateFilter === "This Month" && customer.registered.includes("May 2024")) ||
        (dateFilter === "This Year" && customer.registered.includes("2024")) ||
        (dateFilter === "Before 2024" && !customer.registered.includes("2024"));
      return searchMatch && statusMatch && dateMatch;
    });
  }, [customers, search, statusFilter, dateFilter]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleCustomers = filteredCustomers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openDetails = (customer: Customer) => {
    setSelectedId(customer.id);
    setActionId(null);
    setActiveTab("Overview");
    setMode("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openForm = (customer?: Customer) => {
    setEditing(!!customer);
    setActionId(null);
    setFormErrors({});
    if (customer) {
      setSelectedId(customer.id);
      setForm({
        name: customer.name,
        phone: customer.phone,
        altPhone: customer.altPhone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        type: customer.type,
        notes: customer.notes,
      });
    } else {
      setForm(emptyForm);
    }
    setMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const phonePattern = /^(?:0|\+94)\d{9}$/;
    const compactPhone = form.phone.replace(/\s/g, "");
    const compactAlt = form.altPhone.replace(/\s/g, "");
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!phonePattern.test(compactPhone)) errors.phone = "Enter a valid Sri Lankan phone number";
    if (compactAlt && !phonePattern.test(compactAlt))
      errors.altPhone = "Enter a valid alternative phone number";
    if (!form.email.includes("@")) errors.email = "Enter a valid email address";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.city.trim()) errors.city = "City is required";
    setFormErrors(errors);
    return !Object.keys(errors).length;
  };

  const saveCustomer = (event: FormEvent, addAnother = false) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (editing) {
      setCustomers((items) =>
        items.map((customer) => (customer.id === selectedId ? { ...customer, ...form } : customer)),
      );
      notify(`${form.name} updated successfully`);
      setMode("details");
      return;
    }
    const id = `CUS-${1029 + customers.length - initialCustomers.length}`;
    const initials = form.name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const customer: Customer = {
      ...form,
      id,
      initials,
      registered: "24 May 2024",
      status: "Active",
      vehicles: 0,
      jobs: 0,
      spent: 0,
      outstanding: 0,
      color: "#2563eb",
    };
    setCustomers((items) => [customer, ...items]);
    notify(`${form.name} added successfully`);
    if (addAnother) {
      setForm(emptyForm);
      setFormErrors({});
    } else {
      setSelectedId(id);
      setMode("details");
    }
  };

  const deactivateCustomer = () => {
    if (!deactivateId) return;
    const customer = customers.find((item) => item.id === deactivateId)!;
    setCustomers((items) =>
      items.map((item) => (item.id === deactivateId ? { ...item, status: "Inactive" } : item)),
    );
    setDeactivateId(null);
    setActionId(null);
    notify(`${customer.name} deactivated`);
  };

  if (mode === "form") {
    const update = (key: keyof CustomerForm, value: string) => {
      setForm((current) => ({ ...current, [key]: value }));
      setFormErrors((errors) => ({ ...errors, [key]: "" }));
    };
    return (
      <main className="dashboard repair-page customer-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Customers / {editing ? selected.id : "New Customer"}</span>
            <h2>{editing ? "Edit Customer" : "Add New Customer"}</h2>
            <p>
              {editing
                ? "Update the customer’s contact and account information."
                : "Create a customer profile for vehicles, jobs and billing."}
            </p>
          </div>
          <span className="draft-indicator">
            {editing ? selected.id : `CUS-${1029 + customers.length - initialCustomers.length}`} ·{" "}
            {editing ? "Editing" : "Automatic ID"}
          </span>
        </div>
        <form className="job-form customer-form" onSubmit={(event) => saveCustomer(event)}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Users size={19} />
              </span>
              <div>
                <h3>Customer Information</h3>
                <p>Basic account and contact details.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Customer ID">
                <input
                  value={
                    editing
                      ? selected.id
                      : `CUS-${1029 + customers.length - initialCustomers.length}`
                  }
                  disabled
                />
              </Field>
              <Field label="Full Name" required>
                <input
                  className={formErrors.name ? "input-error" : ""}
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Customer or business name"
                />
                {formErrors.name && <small className="error-copy">{formErrors.name}</small>}
              </Field>
              <Field label="Customer Type" required>
                <Select value={form.type} onChange={(event) => update("type", event.target.value)}>
                  <option>Individual</option>
                  <option>Business</option>
                </Select>
              </Field>
              <Field label="Phone Number" required hint="Use 07X XXX XXXX or +94 format">
                <input
                  className={formErrors.phone ? "input-error" : ""}
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="077 123 4567"
                />
                {formErrors.phone && <small className="error-copy">{formErrors.phone}</small>}
              </Field>
              <Field label="Alternative Phone">
                <input
                  className={formErrors.altPhone ? "input-error" : ""}
                  value={form.altPhone}
                  onChange={(event) => update("altPhone", event.target.value)}
                  placeholder="Optional phone number"
                />
                {formErrors.altPhone && <small className="error-copy">{formErrors.altPhone}</small>}
              </Field>
              <Field label="Email Address" required>
                <input
                  className={formErrors.email ? "input-error" : ""}
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="customer@email.com"
                />
                {formErrors.email && <small className="error-copy">{formErrors.email}</small>}
              </Field>
              <Field label="Address" required wide>
                <input
                  className={formErrors.address ? "input-error" : ""}
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  placeholder="House number and street"
                />
                {formErrors.address && <small className="error-copy">{formErrors.address}</small>}
              </Field>
              <Field label="City" required>
                <input
                  className={formErrors.city ? "input-error" : ""}
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                  placeholder="e.g. Nugegoda"
                />
                {formErrors.city && <small className="error-copy">{formErrors.city}</small>}
              </Field>
              <Field label="Notes" wide>
                <textarea
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  placeholder="Preferences, account terms or internal notes..."
                />
              </Field>
            </div>
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode(editing ? "details" : "list")}>
              Cancel
            </button>
            {!editing && (
              <button
                type="button"
                onClick={(event) => saveCustomer(event as unknown as FormEvent, true)}
              >
                <UserPlus size={15} /> Save & Add Another
              </button>
            )}
            <button className="primary-action" type="submit">
              <CheckCircle2 size={15} /> {editing ? "Save Changes" : "Save Customer"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  if (mode === "details") {
    return (
      <main className="dashboard repair-page customer-page">
        <div className="repair-subheader detail-header customer-detail-header">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Customers / {selected.id}</span>
            <h2>
              {selected.name} <CustomerStatus status={selected.status} />
            </h2>
            <p>
              Customer since {selected.registered} · {selected.type} account
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify(`Adding a vehicle for ${selected.name}`)}>
              <Car size={15} /> Add Vehicle
            </button>
            <button onClick={() => notify(`New repair job started for ${selected.name}`)}>
              <Wrench size={15} /> Create Repair Job
            </button>
            <button className="primary-action" onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit Customer
            </button>
          </div>
        </div>

        <section className="customer-profile-card">
          <div
            className="customer-profile-avatar"
            style={{ background: `${selected.color}15`, color: selected.color }}
          >
            {selected.initials}
          </div>
          <div className="customer-profile-copy">
            <div>
              <h3>{selected.name}</h3>
              <span className={`customer-type ${selected.type.toLowerCase()}`}>
                {selected.type === "Business" ? (
                  <BriefcaseBusiness size={12} />
                ) : (
                  <Users size={12} />
                )}
                {selected.type}
              </span>
            </div>
            <p>{selected.id}</p>
            <div className="customer-contact-row">
              <span>
                <Phone size={14} /> {selected.phone}
              </span>
              <span>
                <Mail size={14} /> {selected.email}
              </span>
              <span>
                <MapPin size={14} /> {selected.address}, {selected.city}
              </span>
            </div>
          </div>
          <div className="customer-registered">
            <CalendarDays size={17} />
            <span>Registered</span>
            <b>{selected.registered}</b>
          </div>
        </section>

        <section className="customer-detail-summary">
          {[
            {
              label: "Total Vehicles",
              value: selected.vehicles,
              note: "Registered vehicles",
              icon: Car,
              tone: "blue",
            },
            {
              label: "Total Repair Jobs",
              value: selected.jobs,
              note: "All service visits",
              icon: Wrench,
              tone: "violet",
            },
            {
              label: "Total Spent",
              value: formatLkr(selected.spent),
              note: "Lifetime value",
              icon: CircleDollarSign,
              tone: "green",
            },
            {
              label: "Outstanding Payments",
              value: formatLkr(selected.outstanding),
              note: selected.outstanding ? "Payment due" : "Account settled",
              icon: CreditCard,
              tone: selected.outstanding ? "orange" : "cyan",
            },
          ].map(({ label, value, note, icon: Icon, tone }) => (
            <article key={label}>
              <span className={tone}>
                <Icon size={19} />
              </span>
              <div>
                <small>{label}</small>
                <strong>{value}</strong>
                <p>{note}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="panel customer-tabs-card">
          <nav className="customer-tabs" aria-label="Customer details">
            {(["Overview", "Vehicles", "Repair History", "Invoices", "Payments"] as Tab[]).map(
              (tab) => (
                <button
                  className={activeTab === tab ? "active" : ""}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Vehicles" && <span>{selected.vehicles}</span>}
                  {tab === "Repair History" && <span>{selected.jobs}</span>}
                </button>
              ),
            )}
          </nav>
          <div className="customer-tab-content">
            {activeTab === "Overview" && <Overview customer={selected} notify={notify} />}
            {activeTab === "Vehicles" && <VehiclesTab notify={notify} />}
            {activeTab === "Repair History" && <RepairTab notify={notify} />}
            {activeTab === "Invoices" && (
              <InvoicesTab notify={notify} onView={() => notify("Invoice details opened")} />
            )}
            {activeTab === "Payments" && <PaymentsTab />}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard repair-page customer-page">
      <div className="repair-header customer-header">
        <div>
          <h2>Customer Management</h2>
          <p>Manage customer profiles, vehicles, repair history and account activity.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Add New Customer
        </button>
      </div>
      <section className="repair-summary customer-summary">
        {[
          {
            label: "Total Customers",
            value: customers.length,
            note: "All registered accounts",
            icon: Users,
            tone: "blue",
          },
          {
            label: "Active Customers",
            value: customers.filter((item) => item.status === "Active").length,
            note: "Currently active",
            icon: UserCheck,
            tone: "green",
          },
          {
            label: "New This Month",
            value: customers.filter((item) => item.registered.includes("May 2024")).length,
            note: "May 2024 registrations",
            icon: UserPlus,
            tone: "violet",
          },
          {
            label: "Pending Payments",
            value: customers.filter((item) => item.outstanding > 0).length,
            note: formatLkr(customers.reduce((sum, item) => sum + item.outstanding, 0)),
            icon: CreditCard,
            tone: "orange",
          },
        ].map(({ label, value, note, icon: Icon, tone }) => (
          <article key={label}>
            <span className={tone}>
              <Icon size={20} />
            </span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
              <p>{note}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="panel customer-panel">
        <div className="customer-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, phone number or email..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} />
              </button>
            )}
          </label>
          <label>
            <span>Customer Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <label>
            <span>Registration Date</span>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
              <option>All Registration Dates</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>Before 2024</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All Statuses");
              setDateFilter("All Registration Dates");
            }}
            title="Reset filters"
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Customer Directory</h3>
            <p>Showing {filteredCustomers.length} registered customers</p>
          </div>
          <button onClick={() => notify("Customer directory exported")}>
            <FileText size={14} /> Export
          </button>
        </div>
        <div className="table-scroll">
          <table className="repair-table customer-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Registered Date</th>
                <th>Total Vehicles</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <button className="inventory-code" onClick={() => openDetails(customer)}>
                      {customer.id}
                    </button>
                  </td>
                  <td>
                    <span className="customer-table-person">
                      <i style={{ background: `${customer.color}15`, color: customer.color }}>
                        {customer.initials}
                      </i>
                      <span>
                        <b>{customer.name}</b>
                        <small>{customer.type}</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <b>{customer.phone}</b>
                    {customer.altPhone && <small>{customer.altPhone}</small>}
                  </td>
                  <td>{customer.email}</td>
                  <td>
                    <b>{customer.address}</b>
                    <small>{customer.city}</small>
                  </td>
                  <td>{customer.registered}</td>
                  <td>
                    <span className="vehicle-count">
                      <Car size={13} /> {customer.vehicles}
                    </span>
                  </td>
                  <td>
                    <b>{formatLkr(customer.spent)}</b>
                    {customer.outstanding > 0 && (
                      <small className="outstanding-copy">
                        {formatLkr(customer.outstanding)} due
                      </small>
                    )}
                  </td>
                  <td>
                    <CustomerStatus status={customer.status} />
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setActionId(actionId === customer.id ? null : customer.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {actionId === customer.id && (
                      <div className="job-actions-menu customer-actions">
                        <button onClick={() => openDetails(customer)}>
                          <Eye size={14} /> View Customer
                        </button>
                        <button onClick={() => openForm(customer)}>
                          <Edit3 size={14} /> Edit Customer
                        </button>
                        {customer.status === "Active" && (
                          <button className="danger" onClick={() => setDeactivateId(customer.id)}>
                            <Trash2 size={14} /> Deactivate
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredCustomers.length && (
                <tr>
                  <td colSpan={10} className="no-jobs">
                    <Users size={24} />
                    <b>No customers found</b>
                    <span>Try changing or resetting the filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing {filteredCustomers.length ? (safePage - 1) * pageSize + 1 : 0}–
            {Math.min(safePage * pageSize, filteredCustomers.length)} of {filteredCustomers.length}{" "}
            customers
          </span>
          <div>
            <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <button
                className={safePage === item ? "active" : ""}
                key={item}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
            <button disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {deactivateId && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setDeactivateId(null)}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setDeactivateId(null)}>
              <X size={18} />
            </button>
            <span className="modal-icon customer-warning">
              <Trash2 size={22} />
            </span>
            <h3>Deactivate customer?</h3>
            <p>
              This customer will be unavailable for new jobs and invoices. Their vehicles and
              transaction history will be retained.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeactivateId(null)}>Cancel</button>
              <button className="danger-confirm" onClick={deactivateCustomer}>
                Deactivate Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Overview({ customer, notify }: { customer: Customer; notify: (message: string) => void }) {
  return (
    <div className="customer-overview-grid">
      <article className="customer-info-panel">
        <div className="customer-tab-heading">
          <div>
            <h3>Customer Information</h3>
            <p>Contact and account details</p>
          </div>
        </div>
        <dl>
          <div>
            <dt>
              <Users size={14} /> Full Name
            </dt>
            <dd>{customer.name}</dd>
          </div>
          <div>
            <dt>
              <Phone size={14} /> Primary Phone
            </dt>
            <dd>{customer.phone}</dd>
          </div>
          <div>
            <dt>
              <Phone size={14} /> Alternative Phone
            </dt>
            <dd>{customer.altPhone || "Not provided"}</dd>
          </div>
          <div>
            <dt>
              <Mail size={14} /> Email Address
            </dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt>
              <BriefcaseBusiness size={14} /> Customer Type
            </dt>
            <dd>{customer.type}</dd>
          </div>
          <div>
            <dt>
              <MapPin size={14} /> Address
            </dt>
            <dd>
              {customer.address}, {customer.city}
            </dd>
          </div>
        </dl>
        <div className="customer-notes">
          <span>Internal Notes</span>
          <p>{customer.notes || "No internal notes have been added."}</p>
        </div>
      </article>
      <article className="recent-activity-panel">
        <div className="customer-tab-heading">
          <div>
            <h3>Recent Activity</h3>
            <p>Latest customer interactions</p>
          </div>
          <button onClick={() => notify("Full activity timeline opened")}>View all</button>
        </div>
        <div className="activity-timeline">
          <div>
            <span className="blue">
              <Wrench size={14} />
            </span>
            <div>
              <b>Repair job JOB-1048 created</b>
              <p>Engine diagnostic for CAA-4587</p>
              <small>Today, 8:35 AM</small>
            </div>
          </div>
          <div>
            <span className="green">
              <CreditCard size={14} />
            </span>
            <div>
              <b>Payment received</b>
              <p>LKR 25,000 against INV-2099</p>
              <small>Today, 10:45 AM</small>
            </div>
          </div>
          <div>
            <span className="violet">
              <Car size={14} />
            </span>
            <div>
              <b>Vehicle details updated</b>
              <p>Mileage updated for Toyota Prius</p>
              <small>24 May 2024</small>
            </div>
          </div>
          <div>
            <span className="orange">
              <ReceiptText size={14} />
            </span>
            <div>
              <b>Invoice INV-2012 paid</b>
              <p>Full settlement of LKR 28,500</p>
              <small>08 Apr 2024</small>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function VehiclesTab({ notify }: { notify: (message: string) => void }) {
  return (
    <div>
      <div className="customer-tab-heading">
        <div>
          <h3>Registered Vehicles</h3>
          <p>Vehicles owned by this customer</p>
        </div>
        <button onClick={() => notify("Add vehicle form opened")}>
          <Plus size={13} /> Add Vehicle
        </button>
      </div>
      <div className="customer-vehicle-grid">
        {vehicles.map((vehicle) => (
          <article key={vehicle.reg}>
            <div className="vehicle-card-head">
              <span>
                <Car size={22} />
              </span>
              <div>
                <h4>{vehicle.vehicle}</h4>
                <b>{vehicle.reg}</b>
              </div>
              <button onClick={() => notify(`${vehicle.reg} details opened`)}>
                <Eye size={14} />
              </button>
            </div>
            <dl>
              <div>
                <dt>Year</dt>
                <dd>{vehicle.year}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{vehicle.type}</dd>
              </div>
              <div>
                <dt>Colour</dt>
                <dd>{vehicle.color}</dd>
              </div>
              <div>
                <dt>Mileage</dt>
                <dd>{vehicle.mileage}</dd>
              </div>
            </dl>
            <footer>
              <span>{vehicle.jobs} repair jobs</span>
              <span>Last visit: {vehicle.lastVisit}</span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

function RepairTab({ notify }: { notify: (message: string) => void }) {
  return (
    <div>
      <div className="customer-tab-heading">
        <div>
          <h3>Repair History</h3>
          <p>Service and repair jobs for all customer vehicles</p>
        </div>
        <button onClick={() => notify("New repair job started")}>
          <Plus size={13} /> Create Job
        </button>
      </div>
      <div className="table-scroll">
        <table className="customer-history-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Vehicle</th>
              <th>Repair Date</th>
              <th>Services</th>
              <th>Status</th>
              <th>Cost</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {repairHistory.map((job) => (
              <tr key={job.id}>
                <td>
                  <button className="inventory-code">{job.id}</button>
                </td>
                <td>
                  <span className="reg-plate">{job.vehicle}</span>
                </td>
                <td>{job.date}</td>
                <td>
                  <b>{job.service}</b>
                </td>
                <td>
                  <span className={`job-status ${job.status === "Completed" ? "success" : "info"}`}>
                    <span />
                    {job.status}
                  </span>
                </td>
                <td>
                  <b>{formatLkr(job.cost)}</b>
                </td>
                <td>
                  <button className="row-menu" onClick={() => notify(`${job.id} opened`)}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesTab({
  notify,
  onView,
}: {
  notify: (message: string) => void;
  onView: () => void;
}) {
  return (
    <div>
      <div className="customer-tab-heading">
        <div>
          <h3>Customer Invoices</h3>
          <p>Invoice totals and payment balances</p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="customer-history-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoiceHistory.map((invoice) => {
              const balance = invoice.total - invoice.paid;
              return (
                <tr key={invoice.number}>
                  <td>
                    <button className="inventory-code" onClick={onView}>
                      {invoice.number}
                    </button>
                  </td>
                  <td>{invoice.date}</td>
                  <td>
                    <b>{formatLkr(invoice.total)}</b>
                  </td>
                  <td className="paid-copy">{formatLkr(invoice.paid)}</td>
                  <td>
                    <b className={balance ? "balance-copy" : ""}>{formatLkr(balance)}</b>
                  </td>
                  <td>
                    <span className={`payment-status ${balance ? "partial" : "paid"}`}>
                      <i />
                      {balance ? "Partially Paid" : "Paid"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-invoice-button"
                      onClick={() => notify(`${invoice.number} opened`)}
                    >
                      <Eye size={13} /> View Invoice
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsTab() {
  return (
    <div>
      <div className="customer-tab-heading">
        <div>
          <h3>Payment History</h3>
          <p>Payments received from this customer</p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="customer-history-table">
          <thead>
            <tr>
              <th>Payment Date</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.reference}>
                <td>{payment.date}</td>
                <td>
                  <button className="inventory-code">{payment.invoice}</button>
                </td>
                <td>
                  <b className="paid-copy">{formatLkr(payment.amount)}</b>
                </td>
                <td>
                  <span className="payment-method">
                    <CreditCard size={13} /> {payment.method}
                  </span>
                </td>
                <td>{payment.reference}</td>
                <td>
                  <span className="payment-status paid">
                    <i />
                    Received
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
