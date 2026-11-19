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
  Eye,
  FileText,
  Filter,
  Landmark,
  MoreHorizontal,
  Printer,
  ReceiptText,
  Search,
  WalletCards,
  X,
} from "lucide-react";

type Payment = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  invoice: string;
  method: "Cash" | "Card" | "Bank Transfer" | "Other";
  amount: number;
  reference: string;
  status: "Completed" | "Pending" | "Reversed";
};
type Invoice = { id: string; customer: string; total: number; paid: number };
type Mode = "list" | "form" | "details";
const initial: Payment[] = [
  {
    id: "PAY-0842",
    date: "24 May 2024",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    invoice: "INV-2099",
    method: "Cash",
    amount: 25000,
    reference: "RCPT-0842",
    status: "Completed",
  },
  {
    id: "PAY-0841",
    date: "24 May 2024",
    customer: "Fathima Rizna",
    phone: "075 330 8677",
    invoice: "INV-2098",
    method: "Card",
    amount: 54900,
    reference: "CARD-819204",
    status: "Completed",
  },
  {
    id: "PAY-0840",
    date: "24 May 2024",
    customer: "Lanka Fresh Foods",
    phone: "011 278 4055",
    invoice: "INV-2097",
    method: "Bank Transfer",
    amount: 15000,
    reference: "BOC-240524-771",
    status: "Completed",
  },
  {
    id: "PAY-0839",
    date: "23 May 2024",
    customer: "Chamika Dias",
    phone: "077 819 4432",
    invoice: "INV-2096",
    method: "Cash",
    amount: 21000,
    reference: "RCPT-0839",
    status: "Completed",
  },
  {
    id: "PAY-0838",
    date: "22 May 2024",
    customer: "Sachini Fernando",
    phone: "071 680 2240",
    invoice: "INV-2088",
    method: "Other",
    amount: 18000,
    reference: "CHEQUE-11984",
    status: "Pending",
  },
  {
    id: "PAY-0837",
    date: "21 May 2024",
    customer: "M. A. Traders",
    phone: "011 284 9022",
    invoice: "INV-2085",
    method: "Bank Transfer",
    amount: 86750,
    reference: "COM-TRF-882",
    status: "Completed",
  },
];
const invoices: Invoice[] = [
  { id: "INV-2099", customer: "Nimal Perera", total: 40000, paid: 25000 },
  { id: "INV-2097", customer: "Lanka Fresh Foods", total: 32500, paid: 15000 },
  { id: "INV-2095", customer: "S. M. Holdings", total: 65000, paid: 0 },
  { id: "INV-2088", customer: "Sachini Fernando", total: 48000, paid: 18000 },
];
const lkr = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
export default function Payments({ notify }: { notify: (m: string) => void }) {
  const [payments, setPayments] = useState(initial),
    [mode, setMode] = useState<Mode>("list"),
    [selectedId, setSelectedId] = useState(initial[0].id),
    [search, setSearch] = useState(""),
    [date, setDate] = useState("This Month"),
    [customer, setCustomer] = useState("All Customers"),
    [method, setMethod] = useState("All Methods"),
    [status, setStatus] = useState("All Statuses"),
    [menu, setMenu] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState(invoices[0].id),
    [amount, setAmount] = useState(15000),
    [paymentMethod, setPaymentMethod] = useState<Payment["method"]>("Cash"),
    [confirm, setConfirm] = useState(false);
  const selected = payments.find((x) => x.id === selectedId) ?? payments[0],
    invoice = invoices.find((x) => x.id === invoiceId) ?? invoices[0],
    remaining = invoice.total - invoice.paid;
  const filtered = useMemo(
    () =>
      payments.filter(
        (x) =>
          [x.id, x.customer, x.invoice, x.reference].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          ) &&
          (date !== "Today" || x.date === "24 May 2024") &&
          (customer === "All Customers" || x.customer === customer) &&
          (method === "All Methods" || x.method === method) &&
          (status === "All Statuses" || x.status === status),
      ),
    [payments, search, date, customer, method, status],
  );
  const openDetails = (p: Payment) => {
    setSelectedId(p.id);
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > remaining) {
      notify(`Amount must be between LKR 1 and ${lkr(remaining)}`);
      return;
    }
    setConfirm(true);
  };
  const save = () => {
    const p: Payment = {
      id: "PAY-0843",
      date: "24 May 2024",
      customer: invoice.customer,
      phone: "077 234 8891",
      invoice: invoice.id,
      method: paymentMethod,
      amount,
      reference: "RCPT-0843",
      status: "Completed",
    };
    setPayments((x) => [p, ...x]);
    setSelectedId(p.id);
    setConfirm(false);
    setMode("details");
    notify(`${lkr(amount)} payment recorded successfully`);
  };

  if (mode === "form")
    return (
      <main className="dashboard repair-page finance-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Payments / New Payment</span>
            <h2>Record Customer Payment</h2>
            <p>Allocate a full or partial payment against an outstanding invoice.</p>
          </div>
          <span className="draft-indicator">PAY-0843 · Automatic ID</span>
        </div>
        <form className="job-form payment-form" onSubmit={submit}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <ReceiptText size={19} />
              </span>
              <div>
                <h3>Invoice Selection</h3>
                <p>Select the customer and outstanding invoice.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field label="Customer" required>
                <Select
                  value={invoice.customer}
                  change={(e) => {
                    const match = invoices.find((x) => x.customer === e.target.value)!;
                    setInvoiceId(match.id);
                    setAmount(match.total - match.paid);
                  }}
                >
                  {[...new Set(invoices.map((x) => x.customer))].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Invoice" required>
                <Select
                  value={invoiceId}
                  change={(e) => {
                    setInvoiceId(e.target.value);
                    const i = invoices.find((x) => x.id === e.target.value)!;
                    setAmount(i.total - i.paid);
                  }}
                >
                  {invoices.map((x) => (
                    <option value={x.id} key={x.id}>
                      {x.id} — {x.customer}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="invoice-balance-strip">
              <div>
                <span>Invoice Total</span>
                <b>{lkr(invoice.total)}</b>
              </div>
              <div>
                <span>Amount Paid</span>
                <b className="paid-copy">{lkr(invoice.paid)}</b>
              </div>
              <div>
                <span>Remaining Balance</span>
                <strong>{lkr(remaining)}</strong>
              </div>
            </div>
          </section>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Banknote size={19} />
              </span>
              <div>
                <h3>Payment Information</h3>
                <p>Enter the amount, method and transaction details.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Payment Date" required>
                <input required type="date" defaultValue="2024-05-24" />
              </Field>
              <Field label="Amount Paid (LKR)" required>
                <input
                  required
                  type="number"
                  min="1"
                  max={remaining}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </Field>
              <Field label="Payment Method" required>
                <Select
                  value={paymentMethod}
                  change={(e) => setPaymentMethod(e.target.value as Payment["method"])}
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                  <option>Other</option>
                </Select>
              </Field>
              <Field label="Transaction Reference">
                <input placeholder="Receipt, card or bank reference" />
              </Field>
              <Field label="Notes" wide>
                <textarea placeholder="Optional payment notes..." />
              </Field>
            </div>
            {amount > 0 && amount < remaining && (
              <div className="partial-payment-note">
                <CircleDollarSign size={14} /> Partial payment: {lkr(remaining - amount)} will
                remain outstanding.
              </div>
            )}
            {amount === remaining && (
              <div className="inline-success">
                <CheckCircle2 size={14} /> This payment will fully settle the invoice.
              </div>
            )}
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode("list")}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              <Banknote size={15} /> Record Payment
            </button>
          </div>
        </form>
        {confirm && (
          <PaymentConfirm
            invoice={invoice}
            amount={amount}
            method={paymentMethod}
            close={() => setConfirm(false)}
            save={save}
          />
        )}
      </main>
    );

  if (mode === "details")
    return (
      <main className="dashboard repair-page finance-page">
        <div className="repair-subheader detail-header no-print">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Payments / {selected.id}</span>
            <h2>
              {selected.id} <PaymentStatus status={selected.status} />
            </h2>
            <p>
              Received {selected.date} · {selected.customer}
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify("Payment receipt PDF downloaded")}>
              <Download size={15} /> Download
            </button>
            <button className="primary-action" onClick={() => window.print()}>
              <Printer size={15} /> Print Receipt
            </button>
          </div>
        </div>
        <article className="payment-receipt">
          <header>
            <div>
              <span>
                <ReceiptText size={23} />
              </span>
              <div>
                <h3>AutoCare Garage</h3>
                <p>128, High Level Road, Nugegoda · 011 281 4500</p>
              </div>
            </div>
            <div>
              <small>PAYMENT RECEIPT</small>
              <strong>{selected.id}</strong>
            </div>
          </header>
          <div className="receipt-paid">
            <CheckCircle2 size={26} />
            <span>Payment Received</span>
            <strong>{lkr(selected.amount)}</strong>
            <p>Thank you for your payment</p>
          </div>
          <section className="receipt-grid">
            <div>
              <span>Received From</span>
              <b>{selected.customer}</b>
              <small>{selected.phone}</small>
            </div>
            <div>
              <span>Payment Date</span>
              <b>{selected.date}</b>
              <small>Recorded by Dinuka W.</small>
            </div>
            <div>
              <span>Invoice Number</span>
              <b>{selected.invoice}</b>
              <small>Customer invoice</small>
            </div>
            <div>
              <span>Payment Method</span>
              <b>{selected.method}</b>
              <small>{selected.reference}</small>
            </div>
          </section>
          <div className="receipt-summary">
            <div>
              <span>Invoice Total</span>
              <b>{lkr(selected.invoice === "INV-2099" ? 40000 : selected.amount)}</b>
            </div>
            <div>
              <span>Payment Amount</span>
              <b className="paid-copy">{lkr(selected.amount)}</b>
            </div>
            <div>
              <span>Remaining Balance</span>
              <strong>{lkr(selected.invoice === "INV-2099" ? 15000 : 0)}</strong>
            </div>
          </div>
          <footer>
            <div>
              <span />
              <b>Customer Signature</b>
            </div>
            <div>
              <span />
              <b>Authorized Signature</b>
            </div>
            <p>This receipt confirms payment received by AutoCare Garage.</p>
          </footer>
        </article>
        <section className="panel payment-history-panel no-print">
          <div className="repair-table-heading">
            <div>
              <h3>Invoice Payment History</h3>
              <p>All payments recorded against {selected.invoice}</p>
            </div>
          </div>
          <table className="customer-history-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Date</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <button className="inventory-code">{selected.id}</button>
                </td>
                <td>{selected.date}</td>
                <td>{selected.method}</td>
                <td>{selected.reference}</td>
                <td>
                  <b className="paid-copy">{lkr(selected.amount)}</b>
                </td>
                <td>
                  <PaymentStatus status={selected.status} />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    );

  const received = payments
    .filter((x) => x.status === "Completed")
    .reduce((s, x) => s + x.amount, 0);
  return (
    <main className="dashboard repair-page finance-page">
      <div className="repair-header">
        <div>
          <h2>Payments Management</h2>
          <p>Record customer collections and review invoice payment history.</p>
        </div>
        <button className="new-job-button" onClick={() => setMode("form")}>
          <Banknote size={16} /> Record Payment
        </button>
      </div>
      <section className="repair-summary">
        {[
          ["Total Payments Received", lkr(received), "This month", CircleDollarSign, "blue"],
          ["Outstanding Amount", lkr(132500), "Across unpaid invoices", CreditCard, "orange"],
          ["Partial Payments", 3, "Invoices with balances", WalletCards, "violet"],
          ["Today's Collections", lkr(94900), "3 payments today", Banknote, "green"],
        ].map(([a, b, c, I, t]) => {
          const Icon = I as typeof Banknote;
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
        <div className="payment-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payment, customer, invoice or reference..."
            />
          </label>
          <FilterSelect
            label="Date"
            value={date}
            set={setDate}
            options={["This Month", "Today", "This Week", "Last Month"]}
          />
          <FilterSelect
            label="Customer"
            value={customer}
            set={setCustomer}
            options={["All Customers", ...new Set(payments.map((x) => x.customer))]}
          />
          <FilterSelect
            label="Payment Method"
            value={method}
            set={setMethod}
            options={["All Methods", "Cash", "Card", "Bank Transfer", "Other"]}
          />
          <FilterSelect
            label="Status"
            value={status}
            set={setStatus}
            options={["All Statuses", "Completed", "Pending", "Reversed"]}
          />
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setDate("This Month");
              setCustomer("All Customers");
              setMethod("All Methods");
              setStatus("All Statuses");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Payment Register</h3>
            <p>Showing {filtered.length} customer payments</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Invoice ID</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <button className="inventory-code" onClick={() => openDetails(p)}>
                      {p.id}
                    </button>
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <b>{p.customer}</b>
                    <small>{p.phone}</small>
                  </td>
                  <td>
                    <button className="inventory-code">{p.invoice}</button>
                  </td>
                  <td>
                    <span className="method-badge">
                      {p.method === "Bank Transfer" ? (
                        <Landmark size={13} />
                      ) : (
                        <CreditCard size={13} />
                      )}{" "}
                      {p.method}
                    </span>
                  </td>
                  <td>
                    <b className="paid-copy">{lkr(p.amount)}</b>
                  </td>
                  <td>{p.reference}</td>
                  <td>
                    <PaymentStatus status={p.status} />
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setMenu(menu === p.id ? null : p.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {menu === p.id && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(p)}>
                          <Eye size={14} /> View Payment
                        </button>
                        <button onClick={() => notify("Receipt sent to printer")}>
                          <Printer size={14} /> Print Receipt
                        </button>
                        <button onClick={() => notify("Receipt downloaded")}>
                          <Download size={14} /> Download
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={9} className="no-jobs">
                    <ReceiptText size={24} />
                    <b>No payments found</b>
                    <span>Try changing or resetting the filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filtered.length} of {filtered.length} payments
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
  value,
  change,
  children,
}: {
  value: string;
  change: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
}) {
  return (
    <span className="job-select-wrap">
      <select value={value} onChange={change}>
        {children}
      </select>
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
function PaymentStatus({ status }: { status: Payment["status"] }) {
  return (
    <span className={`entity-status ${status === "Completed" ? "active" : status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}
function PaymentConfirm({
  invoice,
  amount,
  method,
  close,
  save,
}: {
  invoice: Invoice;
  amount: number;
  method: string;
  close: () => void;
  save: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <span className="modal-icon">
          <Banknote size={22} />
        </span>
        <h3>Confirm Payment</h3>
        <p>
          Record {lkr(amount)} against {invoice.id} using {method}?
        </p>
        <div className="confirm-total">
          <span>Balance after payment</span>
          <strong>{lkr(invoice.total - invoice.paid - amount)}</strong>
        </div>
        <div className="modal-actions">
          <button onClick={close}>Review</button>
          <button onClick={save}>Confirm Payment</button>
        </div>
      </div>
    </div>
  );
}
