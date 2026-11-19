import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  PackagePlus,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";

type Supplier = {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  reg: string;
  categories: string[];
  purchases: number;
  purchaseValue: number;
  outstanding: number;
  terms: string;
  status: "Active" | "Inactive";
  notes: string;
};
type Mode = "list" | "form" | "details";
type Tab = "Overview" | "Purchase History" | "Supplied Parts" | "Payments";
const data: Supplier[] = [
  {
    id: "SUP-0084",
    company: "Japan Auto Traders",
    contact: "Ruwan Abeysekara",
    phone: "077 730 2190",
    email: "sales@japanauto.lk",
    address: "184, Panchikawatte Road, Colombo 10",
    reg: "PV-98214",
    categories: ["Engine Parts", "Brakes", "Filters"],
    purchases: 28,
    purchaseValue: 2485000,
    outstanding: 185000,
    terms: "30 Days",
    status: "Active",
    notes: "Primary supplier for Japanese genuine and OEM parts.",
  },
  {
    id: "SUP-0083",
    company: "Lanka Tyre House",
    contact: "Mohan Raj",
    phone: "011 268 7450",
    email: "orders@lankatyre.lk",
    address: "77, High Level Road, Kirulapone",
    reg: "PV-77541",
    categories: ["Tyres", "Tubes"],
    purchases: 19,
    purchaseValue: 1268000,
    outstanding: 0,
    terms: "Cash on Delivery",
    status: "Active",
    notes: "CEAT and Michelin authorized distributor.",
  },
  {
    id: "SUP-0082",
    company: "United Motors Lanka",
    contact: "Shanika Perera",
    phone: "011 244 7111",
    email: "parts@unitedmotors.lk",
    address: "100, Hyde Park Corner, Colombo 02",
    reg: "PQ-18452",
    categories: ["Lubricants", "Filters", "Electrical"],
    purchases: 22,
    purchaseValue: 1895000,
    outstanding: 92000,
    terms: "14 Days",
    status: "Active",
    notes: "Monthly lubricant and filter orders.",
  },
  {
    id: "SUP-0081",
    company: "Kandy Japanese Spares",
    contact: "Sampath Kumara",
    phone: "081 222 4698",
    email: "kjspares@gmail.com",
    address: "42, William Gopallawa Mawatha, Kandy",
    reg: "CP-44920",
    categories: ["Reconditioned Parts", "A/C Parts"],
    purchases: 12,
    purchaseValue: 975000,
    outstanding: 68500,
    terms: "30 Days",
    status: "Active",
    notes: "Reconditioned parts include a 30-day supplier warranty.",
  },
  {
    id: "SUP-0080",
    company: "Diesel Motors Parts",
    contact: "Nuwan Jayasinghe",
    phone: "011 287 6000",
    email: "parts@dieselmotors.lk",
    address: "218, Avissawella Road, Orugodawatta",
    reg: "PV-61028",
    categories: ["Diesel Parts", "Electrical"],
    purchases: 16,
    purchaseValue: 1640000,
    outstanding: 0,
    terms: "14 Days",
    status: "Active",
    notes: "Commercial vehicle and Isuzu specialist.",
  },
  {
    id: "SUP-0079",
    company: "Southern Auto Components",
    contact: "Isuru de Silva",
    phone: "091 223 8841",
    email: "southernauto@gmail.com",
    address: "16, Wakwella Road, Galle",
    reg: "SP-28914",
    categories: ["Body Parts"],
    purchases: 4,
    purchaseValue: 240000,
    outstanding: 35000,
    terms: "Cash on Delivery",
    status: "Inactive",
    notes: "Account inactive due to inconsistent lead times.",
  },
];
const purchases = [
  { po: "PO-0541", date: "22 May 2024", items: 8, total: 186500, paid: 100000, status: "Partial" },
  { po: "PO-0518", date: "10 Apr 2024", items: 14, total: 328000, paid: 328000, status: "Paid" },
  { po: "PO-0489", date: "18 Mar 2024", items: 6, total: 142500, paid: 142500, status: "Paid" },
];
const parts = [
  {
    code: "SP-NGK-IFR",
    name: "NGK Iridium Spark Plug",
    category: "Engine Parts",
    condition: "New",
    price: 2900,
    last: "22 May 2024",
  },
  {
    code: "BPA-102",
    name: "Front Brake Pad Set",
    category: "Brakes",
    condition: "New",
    price: 7800,
    last: "22 May 2024",
  },
  {
    code: "TOF-041",
    name: "Toyota Genuine Oil Filter",
    category: "Filters",
    condition: "New",
    price: 2850,
    last: "10 Apr 2024",
  },
];
const payments = [
  {
    date: "22 May 2024",
    reference: "PAY-S-0194",
    purchase: "PO-0541",
    method: "Bank Transfer",
    amount: 100000,
  },
  {
    date: "10 Apr 2024",
    reference: "PAY-S-0171",
    purchase: "PO-0518",
    method: "Cheque",
    amount: 328000,
  },
  {
    date: "18 Mar 2024",
    reference: "PAY-S-0154",
    purchase: "PO-0489",
    method: "Bank Transfer",
    amount: 142500,
  },
];
const lkr = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

export default function Suppliers({ notify }: { notify: (m: string) => void }) {
  const [suppliers, setSuppliers] = useState(data),
    [mode, setMode] = useState<Mode>("list"),
    [selectedId, setSelectedId] = useState(data[0].id),
    [tab, setTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All Statuses"),
    [category, setCategory] = useState("All Categories"),
    [menu, setMenu] = useState<string | null>(null),
    [editing, setEditing] = useState(false),
    [deactivate, setDeactivate] = useState(false),
    [payment, setPayment] = useState(false);
  const selected = suppliers.find((x) => x.id === selectedId) ?? suppliers[0];
  const filtered = useMemo(
    () =>
      suppliers.filter(
        (x) =>
          [x.company, x.contact, x.phone].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          ) &&
          (status === "All Statuses" || x.status === status) &&
          (category === "All Categories" || x.categories.includes(category)),
      ),
    [suppliers, search, status, category],
  );
  const openDetails = (s: Supplier) => {
    setSelectedId(s.id);
    setTab("Overview");
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const openForm = (s?: Supplier) => {
    if (s) setSelectedId(s.id);
    setEditing(!!s);
    setMenu(null);
    setMode("form");
    window.scrollTo(0, 0);
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    notify(
      editing ? `${selected.company} updated successfully` : "New supplier added successfully",
    );
    setMode(editing ? "details" : "list");
  };
  const markInactive = () => {
    setSuppliers((x) => x.map((s) => (s.id === selected.id ? { ...s, status: "Inactive" } : s)));
    setDeactivate(false);
    notify(`${selected.company} marked inactive`);
  };

  if (mode === "form")
    return (
      <main className="dashboard repair-page entity-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Suppliers / {editing ? selected.id : "New Supplier"}</span>
            <h2>{editing ? "Edit Supplier" : "Add New Supplier"}</h2>
            <p>Record company, contact, supply and payment information.</p>
          </div>
          <span className="draft-indicator">
            {editing ? selected.id : "SUP-0085 · Automatic ID"}
          </span>
        </div>
        <form className="job-form" onSubmit={save}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Building2 size={19} />
              </span>
              <div>
                <h3>Company Information</h3>
                <p>Supplier identity and primary contact.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Supplier ID">
                <input disabled value={editing ? selected.id : "SUP-0085"} />
              </Field>
              <Field label="Company Name" required>
                <input
                  required
                  defaultValue={editing ? selected.company : ""}
                  placeholder="Registered company name"
                />
              </Field>
              <Field label="Contact Person" required>
                <input
                  required
                  defaultValue={editing ? selected.contact : ""}
                  placeholder="Primary contact"
                />
              </Field>
              <Field label="Phone Number" required>
                <input
                  required
                  pattern="(?:0|\+94)[0-9 ]{9,12}"
                  defaultValue={editing ? selected.phone : ""}
                  placeholder="011 234 5678"
                />
              </Field>
              <Field label="Email Address" required>
                <input
                  required
                  type="email"
                  defaultValue={editing ? selected.email : ""}
                  placeholder="supplier@company.lk"
                />
              </Field>
              <Field label="Business Registration No.">
                <input defaultValue={editing ? selected.reg : ""} placeholder="e.g. PV-12345" />
              </Field>
              <Field label="Address" wide required>
                <input
                  required
                  defaultValue={editing ? selected.address : ""}
                  placeholder="Street, city and district"
                />
              </Field>
            </div>
          </section>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Boxes size={19} />
              </span>
              <div>
                <h3>Supply & Payment Details</h3>
                <p>Categories, account terms and internal notes.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field label="Supplied Categories" required>
                <input
                  required
                  defaultValue={editing ? selected.categories.join(", ") : ""}
                  placeholder="e.g. Engine Parts, Filters, Brakes"
                />
              </Field>
              <Field label="Payment Terms" required>
                <Select defaultValue={editing ? selected.terms : "30 Days"}>
                  {["Cash on Delivery", "7 Days", "14 Days", "30 Days", "60 Days"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Notes" wide>
                <textarea
                  defaultValue={editing ? selected.notes : ""}
                  placeholder="Warranty, delivery and account notes..."
                />
              </Field>
            </div>
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode(editing ? "details" : "list")}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              <CheckCircle2 size={15} /> {editing ? "Save Changes" : "Save Supplier"}
            </button>
          </div>
        </form>
      </main>
    );

  if (mode === "details")
    return (
      <main className="dashboard repair-page entity-page">
        <div className="repair-subheader detail-header">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Suppliers / {selected.id}</span>
            <h2>
              {selected.company}{" "}
              <span className={`entity-status ${selected.status.toLowerCase()}`}>
                {selected.status}
              </span>
            </h2>
            <p>{selected.id} · Supplier since January 2020</p>
          </div>
          <div className="detail-actions">
            <button onClick={() => setPayment(true)}>
              <Banknote size={15} /> Record Payment
            </button>
            <button onClick={() => notify(`Purchase order started for ${selected.company}`)}>
              <ShoppingCart size={15} /> Create Purchase
            </button>
            <button className="primary-action" onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit Supplier
            </button>
          </div>
        </div>
        <section className="supplier-hero">
          <span>
            <Building2 size={28} />
          </span>
          <div>
            <small>SUPPLIER COMPANY</small>
            <h3>{selected.company}</h3>
            <p>{selected.categories.join(" · ")}</p>
          </div>
          <dl>
            <div>
              <dt>Total Purchases</dt>
              <dd>{selected.purchases}</dd>
            </div>
            <div>
              <dt>Purchase Value</dt>
              <dd>{lkr(selected.purchaseValue)}</dd>
            </div>
            <div>
              <dt>Outstanding</dt>
              <dd className={selected.outstanding ? "balance-copy" : ""}>
                {lkr(selected.outstanding)}
              </dd>
            </div>
            <div>
              <dt>Payment Terms</dt>
              <dd>{selected.terms}</dd>
            </div>
          </dl>
        </section>
        <section className="panel customer-tabs-card">
          <nav className="customer-tabs">
            {(["Overview", "Purchase History", "Supplied Parts", "Payments"] as Tab[]).map((x) => (
              <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
                {x}
              </button>
            ))}
          </nav>
          <div className="customer-tab-content">
            {tab === "Overview" && (
              <div className="supplier-overview">
                <article>
                  <div className="customer-tab-heading">
                    <div>
                      <h3>Company Details</h3>
                      <p>Business and contact information</p>
                    </div>
                  </div>
                  <dl className="supplier-info">
                    <Info icon={Building2} label="Company" value={selected.company} />
                    <Info icon={User} label="Contact Person" value={selected.contact} />
                    <Info icon={Phone} label="Phone" value={selected.phone} />
                    <Info icon={Mail} label="Email" value={selected.email} />
                    <Info icon={MapPin} label="Address" value={selected.address} />
                    <Info icon={FileText} label="Registration No." value={selected.reg} />
                  </dl>
                </article>
                <article>
                  <div className="customer-tab-heading">
                    <div>
                      <h3>Account Information</h3>
                      <p>Supply and payment preferences</p>
                    </div>
                  </div>
                  <div className="supplier-account">
                    <span>Supplied Categories</span>
                    <div>
                      {selected.categories.map((x) => (
                        <b key={x}>{x}</b>
                      ))}
                    </div>
                    <span>Payment Terms</span>
                    <strong>{selected.terms}</strong>
                    <span>Internal Notes</span>
                    <p>{selected.notes}</p>
                    {selected.status === "Active" && (
                      <button onClick={() => setDeactivate(true)}>
                        <Trash2 size={13} /> Mark Supplier Inactive
                      </button>
                    )}
                  </div>
                </article>
              </div>
            )}
            {tab === "Purchase History" && (
              <TabTable
                title="Purchase History"
                subtitle="Purchase orders issued to this supplier"
                headers={["Purchase Order", "Date", "Items", "Total", "Paid", "Status"]}
                rows={purchases.map((x) => [
                  x.po,
                  x.date,
                  x.items,
                  lkr(x.total),
                  lkr(x.paid),
                  x.status,
                ])}
                notify={notify}
              />
            )}
            {tab === "Supplied Parts" && (
              <TabTable
                title="Supplied Parts"
                subtitle="Inventory items sourced from this supplier"
                headers={[
                  "Part Code",
                  "Part Name",
                  "Category",
                  "Condition",
                  "Purchase Price",
                  "Last Purchased",
                ]}
                rows={parts.map((x) => [
                  x.code,
                  x.name,
                  x.category,
                  x.condition,
                  lkr(x.price),
                  x.last,
                ])}
                notify={notify}
              />
            )}
            {tab === "Payments" && (
              <TabTable
                title="Supplier Payments"
                subtitle="Payments made against purchase orders"
                headers={["Date", "Reference", "Purchase Order", "Method", "Amount", "Status"]}
                rows={payments.map((x) => [
                  x.date,
                  x.reference,
                  x.purchase,
                  x.method,
                  lkr(x.amount),
                  "Paid",
                ])}
                notify={notify}
              />
            )}
          </div>
        </section>
        {(deactivate || payment) && (
          <SupplierModal
            payment={payment}
            supplier={selected}
            close={() => {
              setPayment(false);
              setDeactivate(false);
            }}
            confirm={
              payment
                ? () => {
                    setPayment(false);
                    notify(`Payment recorded for ${selected.company}`);
                  }
                : markInactive
            }
          />
        )}
      </main>
    );

  const outstanding = suppliers.reduce((s, x) => s + x.outstanding, 0),
    purchasesTotal = suppliers.reduce((s, x) => s + x.purchaseValue, 0);
  return (
    <main className="dashboard repair-page entity-page">
      <div className="repair-header">
        <div>
          <h2>Supplier Management</h2>
          <p>Manage vendors, purchases, supplied parts and account balances.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>
      <section className="repair-summary">
        {[
          ["Total Suppliers", suppliers.length, "Registered vendors", Truck, "blue"],
          [
            "Active Suppliers",
            suppliers.filter((x) => x.status === "Active").length,
            "Currently trading",
            CheckCircle2,
            "green",
          ],
          [
            "Total Purchases",
            lkr(purchasesTotal),
            "Lifetime purchase value",
            ShoppingCart,
            "violet",
          ],
          ["Outstanding Payments", lkr(outstanding), "Supplier balances due", CreditCard, "orange"],
        ].map(([a, b, c, I, t]) => {
          const SummaryIcon = I as typeof Truck;
          return (
            <article key={a as string}>
              <span className={t as string}>
                <SummaryIcon size={20} />
              </span>
              <div>
                <small>{a as string}</small>
                <strong>{b as string | number}</strong>
                <p>{c as string}</p>
              </div>
            </article>
          );
        })}
      </section>
      <section className="panel entity-panel">
        <div className="supplier-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, contact or phone..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} />
              </button>
            )}
          </label>
          <FilterSelect
            label="Status"
            value={status}
            set={setStatus}
            options={["All Statuses", "Active", "Inactive"]}
          />
          <FilterSelect
            label="Category"
            value={category}
            set={setCategory}
            options={[
              "All Categories",
              "Engine Parts",
              "Brakes",
              "Filters",
              "Tyres",
              "Lubricants",
              "Electrical",
              "Reconditioned Parts",
            ]}
          />
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setStatus("All Statuses");
              setCategory("All Categories");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Supplier Directory</h3>
            <p>Showing {filtered.length} suppliers</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table supplier-table">
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Categories</th>
                <th>Purchases</th>
                <th>Outstanding Balance</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <button className="inventory-code" onClick={() => openDetails(s)}>
                      {s.id}
                    </button>
                  </td>
                  <td>
                    <span className="supplier-company">
                      <i>
                        <Building2 size={17} />
                      </i>
                      <b>{s.company}</b>
                    </span>
                  </td>
                  <td>
                    <b>{s.contact}</b>
                    <small>{s.email}</small>
                  </td>
                  <td>{s.phone}</td>
                  <td>
                    <div className="category-tags">
                      {s.categories.slice(0, 2).map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                      {s.categories.length > 2 && <span>+{s.categories.length - 2}</span>}
                    </div>
                  </td>
                  <td>
                    <b>{lkr(s.purchaseValue)}</b>
                    <small>{s.purchases} orders</small>
                  </td>
                  <td>
                    <b className={s.outstanding ? "balance-copy" : ""}>{lkr(s.outstanding)}</b>
                  </td>
                  <td>
                    <span className={`entity-status ${s.status.toLowerCase()}`}>
                      <i />
                      {s.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setMenu(menu === s.id ? null : s.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {menu === s.id && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(s)}>
                          <Eye size={14} /> View Supplier
                        </button>
                        <button onClick={() => openForm(s)}>
                          <Edit3 size={14} /> Edit Supplier
                        </button>
                        <button onClick={() => notify("Purchase workflow opened")}>
                          <PackagePlus size={14} /> Create Purchase
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filtered.length} of {filtered.length} suppliers
          </span>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>›</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`job-field ${wide ? "wide" : ""}`}>
      <span>
        {label} {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}
function Select({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  return (
    <span className="job-select-wrap">
      <select defaultValue={defaultValue}>{children}</select>
      <ChevronDown size={14} />
    </span>
  );
}
function FilterSelect({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (x: string) => void;
  options: string[];
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <ChevronDown size={13} />
    </label>
  );
}
function Info({ icon: I, label, value }: { icon: typeof Truck; label: string; value: string }) {
  return (
    <div>
      <dt>
        <I size={14} />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
function TabTable({
  title,
  subtitle,
  headers,
  rows,
  notify,
}: {
  title: string;
  subtitle: string;
  headers: string[];
  rows: (string | number)[][];
  notify: (m: string) => void;
}) {
  return (
    <div>
      <div className="customer-tab-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="customer-history-table">
          <thead>
            <tr>
              {headers.map((x) => (
                <th key={x}>{x}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((x, j) => (
                  <td key={j}>
                    {j === 0 ? (
                      <button className="inventory-code">{x}</button>
                    ) : j === row.length - 1 ? (
                      <span className="entity-status active">{x}</span>
                    ) : (
                      <b>{x}</b>
                    )}
                  </td>
                ))}
                <td>
                  <button className="row-menu" onClick={() => notify(`${row[0]} opened`)}>
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
function SupplierModal({
  payment,
  supplier,
  close,
  confirm,
}: {
  payment: boolean;
  supplier: Supplier;
  close: () => void;
  confirm: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal-card sales-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <span className={`modal-icon ${payment ? "" : "customer-warning"}`}>
          {payment ? <Banknote size={22} /> : <Trash2 size={22} />}
        </span>
        <h3>{payment ? "Record Supplier Payment" : "Mark Supplier Inactive?"}</h3>
        {payment ? (
          <>
            <p>
              {supplier.company} · Outstanding {lkr(supplier.outstanding)}
            </p>
            <div className="form-grid">
              <Field label="Amount (LKR)" required>
                <input
                  type="number"
                  max={supplier.outstanding}
                  defaultValue={supplier.outstanding}
                />
              </Field>
              <Field label="Payment Date" required>
                <input type="date" defaultValue="2024-05-24" />
              </Field>
              <Field label="Method" required>
                <Select defaultValue="Bank Transfer">
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Bank Transfer</option>
                </Select>
              </Field>
              <Field label="Reference">
                <input placeholder="Transaction reference" />
              </Field>
            </div>
          </>
        ) : (
          <p>
            This supplier will be hidden from new purchases. Existing parts, purchases and payment
            history will remain available.
          </p>
        )}
        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button onClick={confirm}>{payment ? "Record Payment" : "Mark Inactive"}</button>
        </div>
      </div>
    </div>
  );
}
