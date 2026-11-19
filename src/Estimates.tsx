import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  Edit3,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Printer,
  ReceiptText,
  Search,
  Send,
  Trash2,
  Wrench,
  X,
  XCircle,
} from "lucide-react";

type Status = "Draft" | "Pending" | "Approved" | "Rejected" | "Expired" | "Converted";
type Estimate = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  vehicle: string;
  model: string;
  amount: number;
  valid: string;
  status: Status;
};
type Item = {
  description: string;
  type: "Service" | "Labour" | "Part";
  qty: number;
  price: number;
};
type Mode = "list" | "form" | "details";

const initial: Estimate[] = [
  {
    id: "EST-0542",
    date: "24 May 2024",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    vehicle: "CAA-4587",
    model: "Toyota Prius",
    amount: 42500,
    valid: "07 Jun 2024",
    status: "Approved",
  },
  {
    id: "EST-0541",
    date: "24 May 2024",
    customer: "Sachini Fernando",
    phone: "071 680 2240",
    vehicle: "WP CAB-9214",
    model: "Honda Vezel",
    amount: 68500,
    valid: "07 Jun 2024",
    status: "Pending",
  },
  {
    id: "EST-0540",
    date: "23 May 2024",
    customer: "M. A. Traders",
    phone: "011 284 9022",
    vehicle: "WP NC-6732",
    model: "Isuzu Elf",
    amount: 86750,
    valid: "06 Jun 2024",
    status: "Draft",
  },
  {
    id: "EST-0539",
    date: "22 May 2024",
    customer: "Fathima Rizna",
    phone: "075 330 8677",
    vehicle: "KX-1945",
    model: "Nissan X-Trail",
    amount: 54900,
    valid: "05 Jun 2024",
    status: "Converted",
  },
  {
    id: "EST-0538",
    date: "20 May 2024",
    customer: "Tharindu Wijesinghe",
    phone: "076 445 1098",
    vehicle: "BGL-8031",
    model: "Suzuki Wagon R",
    amount: 27200,
    valid: "03 Jun 2024",
    status: "Rejected",
  },
  {
    id: "EST-0537",
    date: "04 May 2024",
    customer: "Chamika Dias",
    phone: "077 819 4432",
    vehicle: "BIK-7721",
    model: "Yamaha FZ-S",
    amount: 12400,
    valid: "18 May 2024",
    status: "Expired",
  },
];
const defaultItems: Item[] = [
  { description: "Engine diagnostic & tune-up", type: "Labour", qty: 1, price: 8500 },
  { description: "NGK Iridium Spark Plug", type: "Part", qty: 4, price: 4250 },
  { description: "Synthetic Engine Oil 5W-30 4L", type: "Part", qty: 1, price: 12500 },
  { description: "Oil & filter replacement", type: "Service", qty: 1, price: 4500 },
];
const lkr = (n: number) => `LKR ${Math.round(n).toLocaleString("en-LK")}`;

export default function Estimates({ notify }: { notify: (message: string) => void }) {
  const [estimates, setEstimates] = useState(initial);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState(initial[0].id);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [date, setDate] = useState("This Month");
  const [menu, setMenu] = useState<string | null>(null);
  const [items, setItems] = useState(defaultItems);
  const [discount, setDiscount] = useState(2500);
  const [additional, setAdditional] = useState(0);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState<"Approve" | "Reject" | "Convert" | null>(null);
  const selected = estimates.find((e) => e.id === selectedId) ?? estimates[0];
  const subtotal = items.reduce((sum, x) => sum + x.qty * x.price, 0);
  const total = Math.max(0, subtotal - discount + additional);
  const filtered = useMemo(
    () =>
      estimates.filter(
        (e) =>
          [e.id, e.customer, e.vehicle].some((x) =>
            x.toLowerCase().includes(search.toLowerCase()),
          ) &&
          (status === "All Statuses" || e.status === status) &&
          (date !== "Today" || e.date === "24 May 2024"),
      ),
    [estimates, search, status, date],
  );

  const openDetails = (e: Estimate) => {
    setSelectedId(e.id);
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const openForm = (e?: Estimate) => {
    if (e) setSelectedId(e.id);
    setEditing(!!e);
    setItems(defaultItems);
    setMenu(null);
    setMode("form");
    window.scrollTo(0, 0);
  };
  const finalize = () => {
    const action = confirm!;
    if (action === "Convert") notify(`${selected.id} converted to invoice INV-2101`);
    else {
      setEstimates((list) =>
        list.map((e) =>
          e.id === selected.id
            ? { ...e, status: action === "Approve" ? "Approved" : "Rejected" }
            : e,
        ),
      );
      notify(`${selected.id} ${action.toLowerCase()}d successfully`);
    }
    setConfirm(null);
  };

  if (mode === "form")
    return (
      <main className="dashboard repair-page entity-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Estimates / {editing ? selected.id : "New Estimate"}</span>
            <h2>{editing ? "Edit Estimate" : "Create Estimate"}</h2>
            <p>Prepare itemized service, labour and parts pricing for customer approval.</p>
          </div>
          <span className="draft-indicator">{editing ? selected.id : "EST-0543"} · Draft</span>
        </div>
        <form
          id="estimate-form"
          className="estimate-form"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            notify(editing ? `${selected.id} updated` : "EST-0543 created and sent for approval");
            setMode("list");
          }}
        >
          <div>
            <section className="form-card">
              <div className="form-card-title">
                <span>
                  <FileText size={19} />
                </span>
                <div>
                  <h3>Customer & Vehicle</h3>
                  <p>Select the customer, vehicle and optional repair job.</p>
                </div>
              </div>
              <div className="form-grid form-grid-3">
                <Field label="Customer" required>
                  <Select defaultValue={selected.customer}>
                    {["Nimal Perera", "Sachini Fernando", "M. A. Traders", "Fathima Rizna"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
                  </Select>
                </Field>
                <Field label="Vehicle" required>
                  <Select defaultValue={selected.vehicle}>
                    <option>{selected.vehicle}</option>
                    <option>WP KR-7741</option>
                  </Select>
                </Field>
                <Field label="Repair Job (Optional)">
                  <Select defaultValue="JOB-1048">
                    <option>None</option>
                    <option>JOB-1048 — In Progress</option>
                  </Select>
                </Field>
                <Field label="Problem Description" wide required>
                  <textarea
                    required
                    defaultValue="Engine warning light is on, with reduced power and unusual vibration while accelerating."
                  />
                </Field>
              </div>
            </section>
            <section className="form-card estimate-items">
              <div className="form-card-title">
                <span>
                  <Wrench size={19} />
                </span>
                <div>
                  <h3>Services, Labour & Spare Parts</h3>
                  <p>Add all proposed work and required parts.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setItems((x) => [
                      ...x,
                      { description: "New service item", type: "Service", qty: 1, price: 0 },
                    ])
                  }
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="table-scroll">
                <table className="invoice-lines-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Line Total</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            className="line-description"
                            value={item.description}
                            onChange={(e) =>
                              setItems((list) =>
                                list.map((x, j) =>
                                  j === i ? { ...x, description: e.target.value } : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={item.type}
                            onChange={(e) =>
                              setItems((list) =>
                                list.map((x, j) =>
                                  j === i ? { ...x, type: e.target.value as Item["type"] } : x,
                                ),
                              )
                            }
                          >
                            <option>Service</option>
                            <option>Labour</option>
                            <option>Part</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="quantity-input"
                            min="1"
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              setItems((list) =>
                                list.map((x, j) =>
                                  j === i ? { ...x, qty: Number(e.target.value) } : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td>
                          <div className="price-input">
                            <span>LKR</span>
                            <input
                              type="number"
                              min="0"
                              value={item.price}
                              onChange={(e) =>
                                setItems((list) =>
                                  list.map((x, j) =>
                                    j === i ? { ...x, price: Number(e.target.value) } : x,
                                  ),
                                )
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <b>{lkr(item.qty * item.price)}</b>
                        </td>
                        <td>
                          <button
                            className="remove-line"
                            type="button"
                            onClick={() => setItems((x) => x.filter((_, j) => j !== i))}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="form-card">
              <div className="form-card-title">
                <span>
                  <Clock3 size={19} />
                </span>
                <div>
                  <h3>Validity & Notes</h3>
                  <p>Set pricing adjustments and customer terms.</p>
                </div>
              </div>
              <div className="form-grid form-grid-3">
                <Field label="Estimate Date" required>
                  <input type="date" defaultValue="2024-05-24" />
                </Field>
                <Field label="Valid Until" required>
                  <input type="date" defaultValue="2024-06-07" />
                </Field>
                <Field label="Discount (LKR)">
                  <input
                    min="0"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </Field>
                <Field label="Additional Charges (LKR)">
                  <input
                    min="0"
                    type="number"
                    value={additional}
                    onChange={(e) => setAdditional(Number(e.target.value))}
                  />
                </Field>
                <Field label="Notes / Terms" wide>
                  <textarea defaultValue="Estimate is valid for 14 days. Additional work requires customer approval." />
                </Field>
              </div>
            </section>
          </div>
          <aside className="invoice-summary-aside">
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Estimate Summary</h3>
              </div>
              <div className="invoice-calculation">
                <div>
                  <span>Subtotal</span>
                  <b>{lkr(subtotal)}</b>
                </div>
                <div>
                  <span>Discount</span>
                  <b className="discount-copy">− {lkr(discount)}</b>
                </div>
                <div>
                  <span>Additional</span>
                  <b>+ {lkr(additional)}</b>
                </div>
                <div className="grand-total">
                  <span>Estimated Total</span>
                  <strong>{lkr(total)}</strong>
                </div>
              </div>
            </article>
            <div className="estimate-note">
              <AlertCircle size={16} />
              <p>
                Prices are estimates and may change after inspection. Customer approval is required
                before work begins.
              </p>
            </div>
          </aside>
        </form>
        <div className="form-actions">
          <button type="button" onClick={() => setMode(editing ? "details" : "list")}>
            Cancel
          </button>
          <button type="button" onClick={() => notify("Estimate saved as draft")}>
            <FileText size={15} /> Save Draft
          </button>
          <button className="primary-action" type="submit" form="estimate-form">
            <Send size={15} /> Save & Send
          </button>
        </div>
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
            <span>Estimates / {selected.id}</span>
            <h2>
              {selected.id} <StatusBadge status={selected.status} />
            </h2>
            <p>
              Created {selected.date} · Valid until {selected.valid}
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify("Estimate PDF downloaded")}>
              <Download size={15} /> PDF
            </button>
            <button onClick={() => notify("Estimate sent to printer")}>
              <Printer size={15} /> Print
            </button>
            <button onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit
            </button>
          </div>
        </div>
        <section className="estimate-document">
          <header>
            <div>
              <span>
                <Wrench size={22} />
              </span>
              <div>
                <h3>AutoCare Garage</h3>
                <p>128, High Level Road, Nugegoda · 011 281 4500</p>
              </div>
            </div>
            <div>
              <small>ESTIMATE</small>
              <strong>{selected.id}</strong>
            </div>
          </header>
          <div className="estimate-party">
            <div>
              <small>PREPARED FOR</small>
              <b>{selected.customer}</b>
              <span>{selected.phone}</span>
            </div>
            <div>
              <small>VEHICLE</small>
              <b>{selected.model}</b>
              <span>{selected.vehicle}</span>
            </div>
            <div>
              <small>VALID UNTIL</small>
              <b>{selected.valid}</b>
              <span>14-day validity</span>
            </div>
          </div>
          <div className="estimate-problem">
            <b>Problem Description</b>
            <p>
              Engine warning light is on. Customer reports reduced power and unusual vibration when
              accelerating.
            </p>
          </div>
          <table className="invoice-document-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Type</th>
                <th>Qty.</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {defaultItems.map((item, i) => (
                <tr key={item.description}>
                  <td>{i + 1}</td>
                  <td>
                    <b>{item.description}</b>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.qty}</td>
                  <td>{lkr(item.price)}</td>
                  <td>
                    <b>{lkr(item.qty * item.price)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="estimate-total-area">
            <div>
              <b>Notes & Terms</b>
              <p>Estimate valid for 14 days. Work will begin after written or verbal approval.</p>
            </div>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{lkr(42500)}</dd>
              </div>
              <div>
                <dt>Discount</dt>
                <dd>− {lkr(2500)}</dd>
              </div>
              <div>
                <dt>Estimated Total</dt>
                <dd>{lkr(selected.amount)}</dd>
              </div>
            </dl>
          </div>
        </section>
        <div className="estimate-detail-actions">
          {selected.status === "Pending" && (
            <>
              <button className="reject" onClick={() => setConfirm("Reject")}>
                <XCircle size={15} /> Reject
              </button>
              <button className="approve" onClick={() => setConfirm("Approve")}>
                <CheckCircle2 size={15} /> Approve
              </button>
            </>
          )}
          {selected.status === "Approved" && (
            <button className="convert" onClick={() => setConfirm("Convert")}>
              <ReceiptText size={15} /> Convert to Invoice
            </button>
          )}
        </div>
        {confirm && (
          <Confirm
            action={confirm}
            estimate={selected}
            close={() => setConfirm(null)}
            confirm={finalize}
          />
        )}
      </main>
    );

  const totalValue = estimates.reduce((s, e) => s + e.amount, 0);
  return (
    <main className="dashboard repair-page entity-page">
      <div className="repair-header">
        <div>
          <h2>Estimates Management</h2>
          <p>Create, approve and convert customer repair estimates.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Create Estimate
        </button>
      </div>
      <section className="estimate-summary">
        {[
          ["Total Estimates", estimates.length, "This month", FileText, "blue"],
          [
            "Pending",
            estimates.filter((x) => x.status === "Pending").length,
            "Awaiting response",
            Clock3,
            "orange",
          ],
          [
            "Approved",
            estimates.filter((x) => x.status === "Approved").length,
            "Ready for work",
            CheckCircle2,
            "green",
          ],
          [
            "Rejected",
            estimates.filter((x) => x.status === "Rejected").length,
            "Customer declined",
            XCircle,
            "red",
          ],
          ["Estimated Value", lkr(totalValue), "Total proposed value", CircleDollarSign, "violet"],
        ].map(([a, b, c, Icon, t]) => {
          const SummaryIcon = Icon as typeof FileText;
          return (
            <article key={a as string}>
              <span className={t as string}>
                <SummaryIcon size={19} />
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
        <div className="estimate-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search estimate, customer or vehicle..."
            />
          </label>
          <FilterSelect
            label="Status"
            value={status}
            set={setStatus}
            options={[
              "All Statuses",
              "Draft",
              "Pending",
              "Approved",
              "Rejected",
              "Expired",
              "Converted",
            ]}
          />
          <FilterSelect
            label="Date"
            value={date}
            set={setDate}
            options={["This Month", "Today", "This Week", "Last Month"]}
          />
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setStatus("All Statuses");
              setDate("This Month");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Estimate Register</h3>
            <p>Showing {filtered.length} estimates</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table estimates-table">
            <thead>
              <tr>
                <th>Estimate ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>
                    <button className="inventory-code" onClick={() => openDetails(e)}>
                      {e.id}
                    </button>
                  </td>
                  <td>{e.date}</td>
                  <td>
                    <b>{e.customer}</b>
                    <small>{e.phone}</small>
                  </td>
                  <td>
                    <b>{e.vehicle}</b>
                    <small>{e.model}</small>
                  </td>
                  <td>
                    <b>{lkr(e.amount)}</b>
                  </td>
                  <td>{e.valid}</td>
                  <td>
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setMenu(menu === e.id ? null : e.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {menu === e.id && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(e)}>
                          <Eye size={14} /> View Estimate
                        </button>
                        <button onClick={() => openForm(e)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button onClick={() => notify("Estimate printed")}>
                          <Printer size={14} /> Print
                        </button>
                        <button onClick={() => notify("PDF downloaded")}>
                          <Download size={14} /> Download PDF
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
            Showing 1–{filtered.length} of {filtered.length} estimates
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
function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`entity-status ${status.toLowerCase().replace(/ /g, "-")}`}>
      <i />
      {status}
    </span>
  );
}
function Confirm({
  action,
  estimate,
  close,
  confirm,
}: {
  action: string;
  estimate: Estimate;
  close: () => void;
  confirm: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <span className={`modal-icon ${action === "Reject" ? "customer-warning" : ""}`}>
          {action === "Approve" ? (
            <Check size={22} />
          ) : action === "Reject" ? (
            <X size={22} />
          ) : (
            <ReceiptText size={22} />
          )}
        </span>
        <h3>{action} estimate?</h3>
        <p>
          {action === "Convert"
            ? `${estimate.id} will be finalized and used to create a customer invoice.`
            : `Confirm that ${estimate.id} should be marked ${action.toLowerCase()}.`}
        </p>
        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button onClick={confirm}>Confirm {action}</button>
        </div>
      </div>
    </div>
  );
}
