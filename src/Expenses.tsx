import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  ImagePlus,
  MoreHorizontal,
  Paperclip,
  Plus,
  ReceiptText,
  Search,
  Tag,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

type Category =
  | "Rent"
  | "Electricity"
  | "Water"
  | "Salaries"
  | "Tools"
  | "Maintenance"
  | "Transport"
  | "Other";
type Expense = {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  method: "Cash" | "Card" | "Bank Transfer" | "Other";
  paidTo: string;
  reference: string;
  status: "Paid" | "Pending";
  receipt: string;
  notes: string;
};
type Mode = "list" | "form" | "details";
const initial: Expense[] = [
  {
    id: "EXP-0382",
    date: "24 May 2024",
    description: "Workshop electricity bill — May",
    category: "Electricity",
    amount: 48500,
    method: "Bank Transfer",
    paidTo: "Ceylon Electricity Board",
    reference: "CEB-2405-88192",
    status: "Paid",
    receipt: "ceb-may-2024.pdf",
    notes: "Monthly workshop and office electricity bill.",
  },
  {
    id: "EXP-0381",
    date: "23 May 2024",
    description: "Mechanic tool set and torque wrench",
    category: "Tools",
    amount: 76200,
    method: "Card",
    paidTo: "Tool Mart Lanka",
    reference: "TM-INV-4491",
    status: "Paid",
    receipt: "toolmart-4491.jpg",
    notes: "Workshop tool replacement approved by manager.",
  },
  {
    id: "EXP-0380",
    date: "20 May 2024",
    description: "Staff salaries — May advance",
    category: "Salaries",
    amount: 285000,
    method: "Bank Transfer",
    paidTo: "Garage Staff Payroll",
    reference: "PAYROLL-MAY-A",
    status: "Paid",
    receipt: "payroll-may.pdf",
    notes: "First salary installment for May.",
  },
  {
    id: "EXP-0379",
    date: "18 May 2024",
    description: "Recovery truck diesel",
    category: "Transport",
    amount: 18500,
    method: "Cash",
    paidTo: "Lanka IOC — Nugegoda",
    reference: "LIOC-88104",
    status: "Paid",
    receipt: "fuel-88104.jpg",
    notes: "Fuel for customer vehicle recovery trip.",
  },
  {
    id: "EXP-0378",
    date: "15 May 2024",
    description: "Hydraulic lift maintenance",
    category: "Maintenance",
    amount: 65000,
    method: "Other",
    paidTo: "Industrial Lift Services",
    reference: "ILS-2024-119",
    status: "Pending",
    receipt: "",
    notes: "Awaiting final inspection before cheque release.",
  },
  {
    id: "EXP-0377",
    date: "01 May 2024",
    description: "Workshop monthly rent",
    category: "Rent",
    amount: 180000,
    method: "Bank Transfer",
    paidTo: "S. P. Properties",
    reference: "RENT-MAY-24",
    status: "Paid",
    receipt: "rent-may.pdf",
    notes: "May 2024 workshop rent.",
  },
];
const lkr = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
export default function Expenses({ notify }: { notify: (m: string) => void }) {
  const [expenses, setExpenses] = useState(initial),
    [mode, setMode] = useState<Mode>("list"),
    [selectedId, setSelectedId] = useState(initial[0].id),
    [search, setSearch] = useState(""),
    [date, setDate] = useState("This Month"),
    [category, setCategory] = useState("All Categories"),
    [method, setMethod] = useState("All Methods"),
    [menu, setMenu] = useState<string | null>(null),
    [editing, setEditing] = useState(false),
    [deleteOpen, setDeleteOpen] = useState(false),
    [receipt, setReceipt] = useState("");
  const selected = expenses.find((x) => x.id === selectedId) ?? expenses[0];
  const filtered = useMemo(
    () =>
      expenses.filter(
        (x) =>
          [x.id, x.description, x.paidTo].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          ) &&
          (date !== "Today" || x.date === "24 May 2024") &&
          (category === "All Categories" || x.category === category) &&
          (method === "All Methods" || x.method === method),
      ),
    [expenses, search, date, category, method],
  );
  const openDetails = (x: Expense) => {
    setSelectedId(x.id);
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const openForm = (x?: Expense) => {
    if (x) setSelectedId(x.id);
    setEditing(!!x);
    setReceipt(x?.receipt ?? "");
    setMenu(null);
    setMode("form");
    window.scrollTo(0, 0);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    notify(editing ? `${selected.id} updated successfully` : "Expense added successfully");
    setMode(editing ? "details" : "list");
  };
  const remove = () => {
    setExpenses((x) => x.filter((e) => e.id !== selected.id));
    setDeleteOpen(false);
    setMode("list");
    notify(`${selected.id} deleted successfully`);
  };
  if (mode === "form")
    return (
      <main className="dashboard repair-page finance-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Expenses / {editing ? selected.id : "New Expense"}</span>
            <h2>{editing ? "Edit Expense" : "Add Expense"}</h2>
            <p>Record garage operating costs and supporting receipts.</p>
          </div>
          <span className="draft-indicator">
            {editing ? selected.id : "EXP-0383 · Automatic ID"}
          </span>
        </div>
        <form className="job-form" onSubmit={submit}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <WalletCards size={19} />
              </span>
              <div>
                <h3>Expense Information</h3>
                <p>Basic expense, payment and recipient details.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Expense ID">
                <input disabled value={editing ? selected.id : "EXP-0383"} />
              </Field>
              <Field label="Expense Date" required>
                <input required type="date" defaultValue="2024-05-24" />
              </Field>
              <Field label="Category" required>
                <Select defaultValue={editing ? selected.category : "Other"}>
                  {[
                    "Rent",
                    "Electricity",
                    "Water",
                    "Salaries",
                    "Tools",
                    "Maintenance",
                    "Transport",
                    "Other",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Description" wide required>
                <input
                  required
                  defaultValue={editing ? selected.description : ""}
                  placeholder="Describe the expense"
                />
              </Field>
              <Field label="Amount (LKR)" required>
                <input
                  required
                  type="number"
                  min="1"
                  defaultValue={editing ? selected.amount : ""}
                />
              </Field>
              <Field label="Payment Method" required>
                <Select defaultValue={editing ? selected.method : "Cash"}>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                  <option>Other</option>
                </Select>
              </Field>
              <Field label="Paid To" required>
                <input
                  required
                  defaultValue={editing ? selected.paidTo : ""}
                  placeholder="Person or company"
                />
              </Field>
              <Field label="Reference Number">
                <input
                  defaultValue={editing ? selected.reference : ""}
                  placeholder="Invoice or transaction reference"
                />
              </Field>
              <Field label="Payment Status" required>
                <Select defaultValue={editing ? selected.status : "Paid"}>
                  <option>Paid</option>
                  <option>Pending</option>
                </Select>
              </Field>
              <Field label="Notes" wide>
                <textarea
                  defaultValue={editing ? selected.notes : ""}
                  placeholder="Approval, purpose or internal notes..."
                />
              </Field>
            </div>
          </section>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Paperclip size={19} />
              </span>
              <div>
                <h3>Receipt Attachment</h3>
                <p>Attach a supplier invoice, bill or payment receipt.</p>
              </div>
            </div>
            <label className="upload-zone">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceipt(e.target.files?.[0]?.name ?? "")}
              />
              <span>
                <ImagePlus size={23} />
              </span>
              <b>{receipt || "Drop receipt here or click to browse"}</b>
              <small>PNG, JPG or PDF up to 10 MB</small>
            </label>
            {receipt && (
              <div className="attachment-list">
                <span>
                  <FileText size={14} />
                  {receipt}
                  <button type="button" onClick={() => setReceipt("")}>
                    <X size={13} />
                  </button>
                </span>
              </div>
            )}
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode(editing ? "details" : "list")}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              <CheckCircle2 size={15} /> {editing ? "Save Changes" : "Save Expense"}
            </button>
          </div>
        </form>
      </main>
    );
  if (mode === "details")
    return (
      <main className="dashboard repair-page finance-page">
        <div className="repair-subheader detail-header">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Expenses / {selected.id}</span>
            <h2>
              {selected.id} <ExpenseStatus status={selected.status} />
            </h2>
            <p>
              Recorded {selected.date} · {selected.category}
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify("Expense receipt downloaded")}>
              <Download size={15} /> Receipt
            </button>
            <button onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit Expense
            </button>
            <button className="danger-action" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
        <section className="expense-detail-layout">
          <article className="detail-card expense-main">
            <header>
              <span className={`expense-category-icon ${selected.category.toLowerCase()}`}>
                <WalletCards size={26} />
              </span>
              <div>
                <small>{selected.category}</small>
                <h3>{selected.description}</h3>
                <p>
                  {selected.id} · {selected.date}
                </p>
              </div>
              <strong>{lkr(selected.amount)}</strong>
            </header>
            <div className="expense-info-grid">
              <Info label="Paid To" value={selected.paidTo} />
              <Info label="Payment Method" value={selected.method} />
              <Info label="Reference Number" value={selected.reference} />
              <Info label="Payment Status" value={selected.status} />
            </div>
            <div className="expense-notes">
              <span>Notes</span>
              <p>{selected.notes}</p>
            </div>
          </article>
          <aside>
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Receipt Attachment</h3>
              </div>
              {selected.receipt ? (
                <div className="receipt-file">
                  <span>
                    <FileText size={23} />
                  </span>
                  <b>{selected.receipt}</b>
                  <small>Uploaded {selected.date}</small>
                  <button onClick={() => notify("Receipt opened")}>
                    <Eye size={13} /> View Receipt
                  </button>
                </div>
              ) : (
                <div className="empty-receipt">
                  <Paperclip size={22} />
                  <b>No receipt attached</b>
                  <p>Edit this expense to add a receipt.</p>
                </div>
              )}
            </article>
            <article className="detail-card expense-audit">
              <div className="detail-card-title">
                <h3>Record Information</h3>
              </div>
              <dl>
                <div>
                  <dt>Created By</dt>
                  <dd>Dinuka Wijeratne</dd>
                </div>
                <div>
                  <dt>Created On</dt>
                  <dd>{selected.date}, 2:45 PM</dd>
                </div>
                <div>
                  <dt>Last Updated</dt>
                  <dd>{selected.date}, 3:10 PM</dd>
                </div>
              </dl>
            </article>
          </aside>
        </section>
        {deleteOpen && (
          <DeleteExpense expense={selected} close={() => setDeleteOpen(false)} remove={remove} />
        )}
      </main>
    );
  const total = expenses.reduce((s, x) => s + x.amount, 0);
  return (
    <main className="dashboard repair-page finance-page">
      <div className="repair-header">
        <div>
          <h2>Expenses Management</h2>
          <p>Track workshop operating costs, bills and supporting receipts.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Add Expense
        </button>
      </div>
      <section className="repair-summary">
        {[
          ["Total Expenses", lkr(total), "All recorded expenses", WalletCards, "blue"],
          ["This Month", lkr(total), "May 2024", CalendarDays, "green"],
          [
            "Pending Expenses",
            expenses.filter((x) => x.status === "Pending").length,
            lkr(expenses.filter((x) => x.status === "Pending").reduce((s, x) => s + x.amount, 0)),
            Banknote,
            "orange",
          ],
          [
            "Expense Categories",
            new Set(expenses.map((x) => x.category)).size,
            "Active cost categories",
            Tag,
            "violet",
          ],
        ].map(([a, b, c, I, t]) => {
          const Icon = I as typeof WalletCards;
          return (
            <article key={a as string}>
              <span className={t as string}>
                <Icon size={20} />
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
        <div className="expense-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expense, description or payee..."
            />
          </label>
          <FilterSelect
            label="Date"
            value={date}
            set={setDate}
            options={["This Month", "Today", "This Week", "Last Month"]}
          />
          <FilterSelect
            label="Category"
            value={category}
            set={setCategory}
            options={[
              "All Categories",
              "Rent",
              "Electricity",
              "Water",
              "Salaries",
              "Tools",
              "Maintenance",
              "Transport",
              "Other",
            ]}
          />
          <FilterSelect
            label="Payment Method"
            value={method}
            set={setMethod}
            options={["All Methods", "Cash", "Card", "Bank Transfer", "Other"]}
          />
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setDate("This Month");
              setCategory("All Categories");
              setMethod("All Methods");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Expense Register</h3>
            <p>Showing {filtered.length} expenses</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table expense-table">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Paid To</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((x) => (
                <tr key={x.id}>
                  <td>
                    <button className="inventory-code" onClick={() => openDetails(x)}>
                      {x.id}
                    </button>
                  </td>
                  <td>{x.date}</td>
                  <td>
                    <b>{x.description}</b>
                    <small>{x.reference}</small>
                  </td>
                  <td>
                    <span className="expense-category">
                      <Tag size={12} />
                      {x.category}
                    </span>
                  </td>
                  <td>
                    <b>{lkr(x.amount)}</b>
                  </td>
                  <td>{x.method}</td>
                  <td>{x.paidTo}</td>
                  <td>
                    <ExpenseStatus status={x.status} />
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setMenu(menu === x.id ? null : x.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {menu === x.id && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(x)}>
                          <Eye size={14} /> View Expense
                        </button>
                        <button onClick={() => openForm(x)}>
                          <Edit3 size={14} /> Edit Expense
                        </button>
                        <button
                          className="danger"
                          onClick={() => {
                            setSelectedId(x.id);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="finance-empty">
            <WalletCards size={28} />
            <b>No expenses found</b>
            <p>Try changing the filters or add a new expense.</p>
          </div>
        )}
        <div className="repair-pagination">
          <span>
            Showing 1–{filtered.length} of {filtered.length} expenses
          </span>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>›</button>
          </div>
        </div>
      </section>
      {deleteOpen && (
        <DeleteExpense expense={selected} close={() => setDeleteOpen(false)} remove={remove} />
      )}
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
function ExpenseStatus({ status }: { status: Expense["status"] }) {
  return (
    <span className={`payment-status ${status === "Paid" ? "paid" : "partial"}`}>
      <i />
      {status}
    </span>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function DeleteExpense({
  expense,
  close,
  remove,
}: {
  expense: Expense;
  close: () => void;
  remove: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <span className="modal-icon customer-warning">
          <Trash2 size={22} />
        </span>
        <h3>Delete expense?</h3>
        <p>
          {expense.id} — {expense.description} will be permanently removed. This action cannot be
          undone.
        </p>
        <div className="confirm-total">
          <span>Expense amount</span>
          <strong className="balance-copy">{lkr(expense.amount)}</strong>
        </div>
        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button className="danger-confirm" onClick={remove}>
            Delete Expense
          </button>
        </div>
      </div>
    </div>
  );
}
