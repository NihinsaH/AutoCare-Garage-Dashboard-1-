import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  FileText,
  Filter,
  Fuel,
  Gauge,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings2,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";

type Vehicle = {
  reg: string;
  customer: string;
  phone: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  colour: string;
  fuel: string;
  chassis: string;
  engine: string;
  last: string;
  jobs: number;
};
type Mode = "list" | "form" | "details";
type Tab = "Overview" | "Repair History" | "Estimates" | "Invoices";

const vehicles: Vehicle[] = [
  {
    reg: "CAA-4587",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    type: "Car",
    brand: "Toyota",
    model: "Prius",
    year: 2015,
    colour: "Pearl White",
    fuel: "Hybrid",
    chassis: "ZVW30-5482190",
    engine: "2ZR-FXE-841902",
    last: "24 May 2024",
    jobs: 9,
  },
  {
    reg: "WP CAB-9214",
    customer: "Sachini Fernando",
    phone: "071 680 2240",
    type: "Car",
    brand: "Honda",
    model: "Vezel",
    year: 2017,
    colour: "Black",
    fuel: "Hybrid",
    chassis: "RU3-1218492",
    engine: "LEB-3201849",
    last: "24 May 2024",
    jobs: 6,
  },
  {
    reg: "WP NC-6732",
    customer: "M. A. Traders",
    phone: "011 284 9022",
    type: "Lorry",
    brand: "Isuzu",
    model: "Elf",
    year: 2012,
    colour: "White",
    fuel: "Diesel",
    chassis: "NKR85-7002184",
    engine: "4JJ1-892110",
    last: "23 May 2024",
    jobs: 14,
  },
  {
    reg: "BIK-7721",
    customer: "Chamika Dias",
    phone: "077 819 4432",
    type: "Motorbike",
    brand: "Yamaha",
    model: "FZ-S",
    year: 2020,
    colour: "Blue",
    fuel: "Petrol",
    chassis: "ME1RG4450L0012841",
    engine: "G3J8E-109284",
    last: "22 May 2024",
    jobs: 2,
  },
  {
    reg: "QY-3058",
    customer: "Suresh Raj",
    phone: "072 442 9001",
    type: "Three-Wheeler",
    brand: "Bajaj",
    model: "RE",
    year: 2018,
    colour: "Green",
    fuel: "Petrol",
    chassis: "MD2A25BZ8JWL44320",
    engine: "AZZWEJ44129",
    last: "20 May 2024",
    jobs: 7,
  },
  {
    reg: "WP PV-8804",
    customer: "Lanka Fresh Foods",
    phone: "011 278 4055",
    type: "Van",
    brand: "Toyota",
    model: "Hiace",
    year: 2013,
    colour: "Silver",
    fuel: "Diesel",
    chassis: "KDH201-0149208",
    engine: "1KD-2481920",
    last: "21 May 2024",
    jobs: 18,
  },
];
const repairs = [
  {
    id: "JOB-1048",
    date: "24 May 2024",
    service: "Engine diagnostic & tune-up",
    status: "In Progress",
    cost: 42500,
  },
  {
    id: "JOB-1016",
    date: "08 Apr 2024",
    service: "Full service & oil change",
    status: "Completed",
    cost: 28500,
  },
  {
    id: "JOB-0914",
    date: "17 Nov 2023",
    service: "Hybrid battery inspection",
    status: "Completed",
    cost: 18000,
  },
];
const estimates = [
  { id: "EST-0542", date: "24 May 2024", amount: 42500, status: "Approved" },
  { id: "EST-0498", date: "08 Apr 2024", amount: 28500, status: "Converted" },
];
const invoices = [
  { id: "INV-2099", date: "24 May 2024", total: 40000, balance: 15000, status: "Partially Paid" },
  { id: "INV-2012", date: "08 Apr 2024", total: 28500, balance: 0, status: "Paid" },
];
const lkr = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

export default function Vehicles({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<Mode>("list");
  const [selected, setSelected] = useState(vehicles[0]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [brand, setBrand] = useState("All Brands");
  const [customer, setCustomer] = useState("All Customers");
  const [menu, setMenu] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const filtered = useMemo(
    () =>
      vehicles.filter((v) => {
        const term = search.toLowerCase();
        return (
          [v.reg, v.customer].some((x) => x.toLowerCase().includes(term)) &&
          (type === "All Types" || v.type === type) &&
          (brand === "All Brands" || v.brand === brand) &&
          (customer === "All Customers" || v.customer === customer)
        );
      }),
    [search, type, brand, customer],
  );

  const openDetails = (v: Vehicle) => {
    setSelected(v);
    setTab("Overview");
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const openForm = (v?: Vehicle) => {
    if (v) setSelected(v);
    setEditing(!!v);
    setMenu(null);
    setSaved(false);
    setMode("form");
    window.scrollTo(0, 0);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    notify(editing ? `${selected.reg} updated successfully` : "Vehicle added successfully");
    setTimeout(() => setMode(editing ? "details" : "list"), 350);
  };

  if (mode === "form")
    return (
      <main className="dashboard repair-page entity-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Vehicles / {editing ? selected.reg : "New Vehicle"}</span>
            <h2>{editing ? "Edit Vehicle" : "Add New Vehicle"}</h2>
            <p>Register ownership, identification and technical information.</p>
          </div>
          <span className="draft-indicator">{editing ? selected.reg : "New registration"}</span>
        </div>
        <form className="job-form" onSubmit={submit}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Car size={19} />
              </span>
              <div>
                <h3>Vehicle Information</h3>
                <p>Fields marked with an asterisk are required.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Customer" required>
                <Select defaultValue={editing ? selected.customer : "Nimal Perera"}>
                  {["Nimal Perera", "Sachini Fernando", "Lanka Fresh Foods", "M. A. Traders"].map(
                    (x) => (
                      <option key={x}>{x}</option>
                    ),
                  )}
                </Select>
              </Field>
              <Field label="Registration No." required>
                <input
                  required
                  defaultValue={editing ? selected.reg : ""}
                  placeholder="e.g. CAA-4587"
                  pattern="[A-Za-z0-9 -]{4,15}"
                />
              </Field>
              <Field label="Vehicle Type" required>
                <Select defaultValue={editing ? selected.type : "Car"}>
                  {["Motorbike", "Three-Wheeler", "Car", "Van", "Lorry", "Other"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Brand" required>
                <input
                  required
                  defaultValue={editing ? selected.brand : ""}
                  placeholder="e.g. Toyota"
                />
              </Field>
              <Field label="Model" required>
                <input
                  required
                  defaultValue={editing ? selected.model : ""}
                  placeholder="e.g. Prius"
                />
              </Field>
              <Field label="Year" required>
                <input
                  required
                  type="number"
                  min="1950"
                  max="2025"
                  defaultValue={editing ? selected.year : 2020}
                />
              </Field>
              <Field label="Colour">
                <input defaultValue={editing ? selected.colour : ""} placeholder="Vehicle colour" />
              </Field>
              <Field label="Fuel Type" required>
                <Select defaultValue={editing ? selected.fuel : "Petrol"}>
                  {["Petrol", "Diesel", "Hybrid", "Electric", "Other"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Chassis No." required>
                <input
                  required
                  defaultValue={editing ? selected.chassis : ""}
                  placeholder="Chassis / VIN number"
                />
              </Field>
              <Field label="Engine No." required>
                <input
                  required
                  defaultValue={editing ? selected.engine : ""}
                  placeholder="Engine number"
                />
              </Field>
              <Field label="Notes" wide>
                <textarea placeholder="Condition, accessories or customer requests..." />
              </Field>
            </div>
            {saved && (
              <div className="inline-success">
                <CheckCircle2 size={15} /> Vehicle information validated and saved.
              </div>
            )}
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode(editing ? "details" : "list")}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              <CheckCircle2 size={15} /> {editing ? "Save Changes" : "Save Vehicle"}
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
            <span>Vehicles / {selected.reg}</span>
            <h2>
              {selected.brand} {selected.model} <span className="entity-status active">Active</span>
            </h2>
            <p>
              {selected.reg} · {selected.year} · {selected.type}
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify(`Estimate workflow started for ${selected.reg}`)}>
              <FileText size={15} /> Create Estimate
            </button>
            <button onClick={() => notify(`Repair job started for ${selected.reg}`)}>
              <Wrench size={15} /> Create Repair Job
            </button>
            <button className="primary-action" onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit Vehicle
            </button>
          </div>
        </div>
        <section className="entity-hero">
          <span className="entity-hero-icon">
            <Car size={34} />
          </span>
          <div>
            <small>{selected.type}</small>
            <h3>
              {selected.brand} {selected.model}
            </h3>
            <p>{selected.reg}</p>
          </div>
          <dl>
            <div>
              <dt>Owner</dt>
              <dd>{selected.customer}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{selected.phone}</dd>
            </div>
            <div>
              <dt>Last Service</dt>
              <dd>{selected.last}</dd>
            </div>
            <div>
              <dt>Total Jobs</dt>
              <dd>{selected.jobs}</dd>
            </div>
          </dl>
        </section>
        <section className="panel customer-tabs-card">
          <nav className="customer-tabs">
            {(["Overview", "Repair History", "Estimates", "Invoices"] as Tab[]).map((x) => (
              <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
                {x}
              </button>
            ))}
          </nav>
          <div className="customer-tab-content">
            {tab === "Overview" && (
              <div className="entity-overview">
                <article>
                  <div className="customer-tab-heading">
                    <div>
                      <h3>Vehicle Specifications</h3>
                      <p>Registration and technical information</p>
                    </div>
                  </div>
                  <dl className="entity-specs">
                    <Spec icon={Car} label="Registration" value={selected.reg} />
                    <Spec
                      icon={Settings2}
                      label="Brand / Model"
                      value={`${selected.brand} ${selected.model}`}
                    />
                    <Spec
                      icon={CalendarDays}
                      label="Manufactured Year"
                      value={String(selected.year)}
                    />
                    <Spec icon={Palette} label="Colour" value={selected.colour} />
                    <Spec icon={Fuel} label="Fuel Type" value={selected.fuel} />
                    <Spec icon={Gauge} label="Current Mileage" value="128,450 km" />
                    <Spec icon={FileText} label="Chassis Number" value={selected.chassis} />
                    <Spec icon={Settings2} label="Engine Number" value={selected.engine} />
                  </dl>
                </article>
                <article>
                  <div className="customer-tab-heading">
                    <div>
                      <h3>Owner Information</h3>
                      <p>Registered customer</p>
                    </div>
                  </div>
                  <div className="owner-card">
                    <span>
                      <User size={23} />
                    </span>
                    <h4>{selected.customer}</h4>
                    <p>{selected.phone}</p>
                    <button onClick={() => notify("Customer profile opened")}>
                      View Customer Profile
                    </button>
                  </div>
                </article>
              </div>
            )}
            {tab === "Repair History" && (
              <HistoryTable rows={repairs} type="repair" notify={notify} />
            )}
            {tab === "Estimates" && (
              <HistoryTable rows={estimates} type="estimate" notify={notify} />
            )}
            {tab === "Invoices" && <HistoryTable rows={invoices} type="invoice" notify={notify} />}
          </div>
        </section>
      </main>
    );

  return (
    <main className="dashboard repair-page entity-page">
      <div className="repair-header">
        <div>
          <h2>Vehicle Management</h2>
          <p>Register vehicles and review their complete garage history.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>
      <section className="repair-summary">
        {[
          ["Total Vehicles", "186", "All registered vehicles", Car, "blue"],
          ["Cars", "112", "60% of fleet", Car, "green"],
          ["Motorbikes", "38", "20% of fleet", Bike, "violet"],
          ["Three-Wheelers", "21", "11% of fleet", Truck, "orange"],
        ].map(([label, value, note, Icon, tone]) => (
          <article key={label as string}>
            <span className={tone as string}>
              <Icon size={20} />
            </span>
            <div>
              <small>{label as string}</small>
              <strong>{value as string}</strong>
              <p>{note as string}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="panel entity-panel">
        <div className="entity-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registration or customer..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} />
              </button>
            )}
          </label>
          <FilterSelect
            label="Customer"
            value={customer}
            set={setCustomer}
            options={["All Customers", ...new Set(vehicles.map((v) => v.customer))]}
          />
          <FilterSelect
            label="Vehicle Type"
            value={type}
            set={setType}
            options={["All Types", ...new Set(vehicles.map((v) => v.type))]}
          />
          <FilterSelect
            label="Brand"
            value={brand}
            set={setBrand}
            options={["All Brands", ...new Set(vehicles.map((v) => v.brand))]}
          />
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setType("All Types");
              setBrand("All Brands");
              setCustomer("All Customers");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Vehicle Directory</h3>
            <p>Showing {filtered.length} registered vehicles</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table vehicle-table">
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Brand / Model</th>
                <th>Year</th>
                <th>Fuel</th>
                <th>Last Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.reg}>
                  <td>
                    <button className="reg-button" onClick={() => openDetails(v)}>
                      {v.reg}
                    </button>
                  </td>
                  <td>
                    <b>{v.customer}</b>
                    <small>{v.phone}</small>
                  </td>
                  <td>
                    <span className="vehicle-type">
                      <Car size={13} /> {v.type}
                    </span>
                  </td>
                  <td>
                    <b>
                      {v.brand} {v.model}
                    </b>
                    <small>{v.colour}</small>
                  </td>
                  <td>{v.year}</td>
                  <td>{v.fuel}</td>
                  <td>{v.last}</td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setMenu(menu === v.reg ? null : v.reg)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {menu === v.reg && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(v)}>
                          <Eye size={14} /> View Vehicle
                        </button>
                        <button onClick={() => openForm(v)}>
                          <Edit3 size={14} /> Edit Vehicle
                        </button>
                        <button onClick={() => notify(`Repair job started for ${v.reg}`)}>
                          <Wrench size={14} /> Create Repair Job
                        </button>
                        <button onClick={() => notify(`Estimate started for ${v.reg}`)}>
                          <FileText size={14} /> Create Estimate
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
            Showing 1–{filtered.length} of {filtered.length} vehicles
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
function Select({
  defaultValue,
  children,
}: {
  defaultValue: string | number;
  children: React.ReactNode;
}) {
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
function Spec({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
  return (
    <div>
      <dt>
        <Icon size={14} /> {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
function HistoryTable({
  rows,
  type,
  notify,
}: {
  rows: Record<string, string | number>[];
  type: string;
  notify: (m: string) => void;
}) {
  const keys =
    type === "repair"
      ? ["id", "date", "service", "status", "cost"]
      : type === "estimate"
        ? ["id", "date", "amount", "status"]
        : ["id", "date", "total", "balance", "status"];
  return (
    <div>
      <div className="customer-tab-heading">
        <div>
          <h3>
            {type === "repair"
              ? "Repair History"
              : type === "estimate"
                ? "Vehicle Estimates"
                : "Vehicle Invoices"}
          </h3>
          <p>Complete records linked to this vehicle</p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="customer-history-table">
          <thead>
            <tr>
              {keys.map((k) => (
                <th key={k}>
                  {k === "id"
                    ? type === "repair"
                      ? "Job ID"
                      : type === "estimate"
                        ? "Estimate ID"
                        : "Invoice"
                    : k}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {keys.map((k) => (
                  <td key={k}>
                    {["cost", "amount", "total", "balance"].includes(k) ? (
                      <b>{lkr(row[k] as number)}</b>
                    ) : k === "status" ? (
                      <span
                        className={`entity-status ${(row[k] as string).toLowerCase().replace(/ /g, "-")}`}
                      >
                        {row[k]}
                      </span>
                    ) : (
                      <b>{row[k]}</b>
                    )}
                  </td>
                ))}
                <td>
                  <button className="row-menu" onClick={() => notify(`${row.id} opened`)}>
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
