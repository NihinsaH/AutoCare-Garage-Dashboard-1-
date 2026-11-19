import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  FileCheck2,
  Filter,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { getStockBalance, setStockBalance, StockCondition } from "./stockStore";

type Status = "Paid" | "Partially Paid" | "Unpaid" | "Draft" | "Received";
type Purchase = {
  id: string;
  supplier: string;
  phone: string;
  reference: string;
  date: string;
  due: string;
  items: number;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  status: Status;
};
type Line = {
  code: string;
  name: string;
  category: string;
  condition: "Brand New" | "Reconditioned";
  qty: number;
  cost: number;
  fallback: number;
};
type Mode = "list" | "form" | "details";
const initial: Purchase[] = [
  {
    id: "PUR-0542",
    supplier: "Japan Auto Traders",
    phone: "077 730 2190",
    reference: "JAT-INV-8841",
    date: "24 May 2024",
    due: "23 Jun 2024",
    items: 12,
    subtotal: 226500,
    discount: 5000,
    total: 221500,
    paid: 100000,
    status: "Partially Paid",
  },
  {
    id: "PUR-0541",
    supplier: "Lanka Tyre House",
    phone: "011 268 7450",
    reference: "LTH-240522",
    date: "22 May 2024",
    due: "22 May 2024",
    items: 8,
    subtotal: 186500,
    discount: 0,
    total: 186500,
    paid: 186500,
    status: "Paid",
  },
  {
    id: "PUR-0540",
    supplier: "United Motors Lanka",
    phone: "011 244 7111",
    reference: "UML-55192",
    date: "20 May 2024",
    due: "03 Jun 2024",
    items: 16,
    subtotal: 312000,
    discount: 12000,
    total: 300000,
    paid: 0,
    status: "Unpaid",
  },
  {
    id: "PUR-0539",
    supplier: "Kandy Japanese Spares",
    phone: "081 222 4698",
    reference: "KJS-1198",
    date: "18 May 2024",
    due: "17 Jun 2024",
    items: 4,
    subtotal: 137000,
    discount: 0,
    total: 137000,
    paid: 137000,
    status: "Received",
  },
  {
    id: "PUR-0538",
    supplier: "Diesel Motors Parts",
    phone: "011 287 6000",
    reference: "DMP-88421",
    date: "16 May 2024",
    due: "30 May 2024",
    items: 6,
    subtotal: 255000,
    discount: 10000,
    total: 245000,
    paid: 0,
    status: "Draft",
  },
];
const defaultLines: Line[] = [
  {
    code: "SP-NGK-IFR",
    name: "NGK Iridium Spark Plug",
    category: "Engine Parts",
    condition: "Brand New",
    qty: 8,
    cost: 2900,
    fallback: 36,
  },
  {
    code: "BPA-102",
    name: "Front Brake Pad Set",
    category: "Brakes",
    condition: "Brand New",
    qty: 2,
    cost: 7800,
    fallback: 3,
  },
  {
    code: "TYR-MC-090",
    name: "Motorcycle Tyre 90/90-17",
    category: "Tyres",
    condition: "Reconditioned",
    qty: 2,
    cost: 5500,
    fallback: 4,
  },
];
const catalog = [
  ["TOF-041", "Toyota Genuine Oil Filter", "Filters", 2850, 2],
  ["EO-5W30-4L", "Synthetic Engine Oil 5W-30 4L", "Lubricants", 11800, 28],
  ["VAC-230", "A/C Compressor", "Air Conditioning", 68500, 1],
];
const stockDefaults: Record<string, { newQty: number; reconQty: number }> = {
  "SP-NGK-IFR": { newQty: 36, reconQty: 0 },
  "BPA-102": { newQty: 3, reconQty: 0 },
  "TYR-MC-090": { newQty: 10, reconQty: 4 },
  "TOF-041": { newQty: 2, reconQty: 0 },
  "EO-5W30-4L": { newQty: 28, reconQty: 0 },
  "VAC-230": { newQty: 0, reconQty: 1 },
};
const lkr = (n: number) => `LKR ${Math.round(n).toLocaleString("en-LK")}`;

export default function Purchases({ notify }: { notify: (m: string) => void }) {
  const [purchases, setPurchases] = useState(initial),
    [mode, setMode] = useState<Mode>("list"),
    [selectedId, setSelectedId] = useState(initial[0].id),
    [search, setSearch] = useState(""),
    [supplier, setSupplier] = useState("All Suppliers"),
    [date, setDate] = useState("This Month"),
    [menu, setMenu] = useState<string | null>(null);
  const [lines, setLines] = useState(defaultLines),
    [discount, setDiscount] = useState(5000),
    [paid, setPaid] = useState(100000),
    [editing, setEditing] = useState(false),
    [confirmReceive, setConfirmReceive] = useState(false),
    [paymentOpen, setPaymentOpen] = useState(false);
  const selected = purchases.find((x) => x.id === selectedId) ?? purchases[0];
  const subtotal = lines.reduce((s, x) => s + x.qty * x.cost, 0),
    total = Math.max(0, subtotal - discount),
    balance = Math.max(0, total - paid);
  const filtered = useMemo(
    () =>
      purchases.filter(
        (x) =>
          [x.id, x.supplier, x.reference].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          ) &&
          (supplier === "All Suppliers" || x.supplier === supplier) &&
          (date !== "Today" || x.date === "24 May 2024"),
      ),
    [purchases, search, supplier, date],
  );
  const openDetails = (p: Purchase) => {
    setSelectedId(p.id);
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const openForm = (p?: Purchase) => {
    if (p) setSelectedId(p.id);
    setEditing(!!p);
    setLines(defaultLines);
    setMenu(null);
    setMode("form");
    window.scrollTo(0, 0);
  };
  const receive = () => {
    for (const line of lines) {
      const condition: StockCondition = line.condition === "Brand New" ? "New" : "Reconditioned";
      const defaults = stockDefaults[line.code] ?? { newQty: 0, reconQty: 0 };
      const current = getStockBalance(
        line.code,
        condition,
        condition === "New" ? defaults.newQty : defaults.reconQty,
      );
      const otherCondition: StockCondition = condition === "New" ? "Reconditioned" : "New";
      const other = getStockBalance(
        line.code,
        otherCondition,
        otherCondition === "New" ? defaults.newQty : defaults.reconQty,
      );
      setStockBalance(line.code, condition, current + line.qty, other);
    }
    setConfirmReceive(false);
    setPurchases((x) => x.map((p) => (p.id === selected.id ? { ...p, status: "Received" } : p)));
    notify("Purchase received and condition-specific inventory stock increased");
  };
  const recordPayment = (amount: number) => {
    const outstanding = selected.total - selected.paid;
    if (amount <= 0 || amount > outstanding) {
      notify(`Payment must be between LKR 1 and ${lkr(outstanding)}`);
      return;
    }
    setPurchases((x) =>
      x.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              paid: Math.min(p.total, p.paid + amount),
              status: p.paid + amount >= p.total ? "Paid" : "Partially Paid",
            }
          : p,
      ),
    );
    setPaymentOpen(false);
    notify(`${lkr(amount)} supplier payment recorded`);
  };

  if (mode === "form")
    return (
      <main className="dashboard repair-page finance-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Purchases / {editing ? selected.id : "New Purchase"}</span>
            <h2>{editing ? "Edit Purchase" : "Create Purchase"}</h2>
            <p>Record supplier items, costs, payment and receiving details.</p>
          </div>
          <span className="draft-indicator">{editing ? selected.id : "PUR-0543"} · Draft</span>
        </div>
        <form
          id="purchase-form"
          className="finance-form"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            notify(editing ? `${selected.id} updated` : "PUR-0543 saved successfully");
            setMode("list");
          }}
        >
          <div>
            <section className="form-card">
              <div className="form-card-title">
                <span>
                  <Truck size={19} />
                </span>
                <div>
                  <h3>Supplier & Reference</h3>
                  <p>Purchase source and invoice dates.</p>
                </div>
              </div>
              <div className="form-grid form-grid-3">
                <Field label="Supplier" required>
                  <Select defaultValue={selected.supplier}>
                    {[
                      "Japan Auto Traders",
                      "Lanka Tyre House",
                      "United Motors Lanka",
                      "Kandy Japanese Spares",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Invoice / Reference No." required>
                  <input
                    required
                    defaultValue={editing ? selected.reference : ""}
                    placeholder="Supplier invoice number"
                  />
                </Field>
                <Field label="Purchase Date" required>
                  <input required type="date" defaultValue="2024-05-24" />
                </Field>
                <Field label="Due Date" required>
                  <input required type="date" defaultValue="2024-06-23" />
                </Field>
              </div>
            </section>
            <section className="form-card purchase-items">
              <div className="form-card-title">
                <span>
                  <Boxes size={19} />
                </span>
                <div>
                  <h3>Purchased Spare Parts</h3>
                  <p>New and reconditioned quantities are received separately.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const x = catalog[lines.length % catalog.length];
                    setLines((v) => [
                      ...v,
                      {
                        code: x[0] as string,
                        name: x[1] as string,
                        category: x[2] as string,
                        condition: "Brand New",
                        qty: 1,
                        cost: x[3] as number,
                        fallback: x[4] as number,
                      },
                    ]);
                  }}
                >
                  <Plus size={14} /> Add Part
                </button>
              </div>
              <div className="table-scroll">
                <table className="invoice-lines-table purchase-lines">
                  <thead>
                    <tr>
                      <th>Part / Code</th>
                      <th>Category</th>
                      <th>Condition</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Line Total</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={`${line.code}-${i}`}>
                        <td>
                          <b>{line.name}</b>
                          <small>{line.code}</small>
                        </td>
                        <td>
                          <input
                            value={line.category}
                            onChange={(e) =>
                              setLines((v) =>
                                v.map((x, j) => (j === i ? { ...x, category: e.target.value } : x)),
                              )
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={line.condition}
                            onChange={(e) =>
                              setLines((v) =>
                                v.map((x, j) =>
                                  j === i
                                    ? { ...x, condition: e.target.value as Line["condition"] }
                                    : x,
                                ),
                              )
                            }
                          >
                            <option>Brand New</option>
                            <option>Reconditioned</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="quantity-input"
                            type="number"
                            min="1"
                            value={line.qty}
                            onChange={(e) =>
                              setLines((v) =>
                                v.map((x, j) =>
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
                              value={line.cost}
                              onChange={(e) =>
                                setLines((v) =>
                                  v.map((x, j) =>
                                    j === i ? { ...x, cost: Number(e.target.value) } : x,
                                  ),
                                )
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <b>{lkr(line.qty * line.cost)}</b>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="remove-line"
                            onClick={() => setLines((v) => v.filter((_, j) => j !== i))}
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
                  <CreditCard size={19} />
                </span>
                <div>
                  <h3>Payment & Notes</h3>
                  <p>Record an initial full or partial supplier payment.</p>
                </div>
              </div>
              <div className="form-grid form-grid-3">
                <Field label="Discount (LKR)">
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </Field>
                <Field label="Payment Amount (LKR)">
                  <input
                    type="number"
                    min="0"
                    max={total}
                    value={paid}
                    onChange={(e) => setPaid(Math.min(total, Number(e.target.value)))}
                  />
                </Field>
                <Field label="Balance">
                  <input disabled value={lkr(balance)} />
                </Field>
                <Field label="Notes" wide>
                  <textarea placeholder="Delivery, warranty and payment notes..." />
                </Field>
              </div>
            </section>
          </div>
          <aside className="invoice-summary-aside">
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Purchase Summary</h3>
              </div>
              <div className="invoice-calculation">
                <div>
                  <span>Items</span>
                  <b>{lines.reduce((s, x) => s + x.qty, 0)} units</b>
                </div>
                <div>
                  <span>Subtotal</span>
                  <b>{lkr(subtotal)}</b>
                </div>
                <div>
                  <span>Discount</span>
                  <b className="discount-copy">− {lkr(discount)}</b>
                </div>
                <div className="grand-total">
                  <span>Total Purchase</span>
                  <strong>{lkr(total)}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <b className="paid-copy">{lkr(paid)}</b>
                </div>
                <div>
                  <span>Balance</span>
                  <b className="balance-copy">{lkr(balance)}</b>
                </div>
              </div>
            </article>
            <div className="stock-deduction-note purchase-stock-note">
              <PackageCheck size={17} />
              <div>
                <b>Stock receiving</b>
                <p>Inventory increases only after the purchase is finalized and received.</p>
              </div>
            </div>
          </aside>
        </form>
        <div className="form-actions">
          <button onClick={() => setMode(editing ? "details" : "list")}>Cancel</button>
          <button onClick={() => notify("Purchase saved as draft")}>Save Draft</button>
          <button className="primary-action" type="submit" form="purchase-form">
            <ShoppingCart size={15} /> Save Purchase
          </button>
        </div>
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
            <span>Purchases / {selected.id}</span>
            <h2>
              {selected.id} <PurchaseStatus status={selected.status} />
            </h2>
            <p>
              {selected.supplier} · Reference {selected.reference}
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify("Purchase sent to printer")}>
              <Printer size={15} /> Print
            </button>
            <button onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit
            </button>
            {selected.total > selected.paid && (
              <button className="primary-action" onClick={() => setPaymentOpen(true)}>
                <Banknote size={15} /> Record Payment
              </button>
            )}
          </div>
        </div>
        <section className="purchase-detail-grid">
          <div>
            <article className="detail-card">
              <div className="detail-card-title">
                <div>
                  <h3>Purchase Items</h3>
                  <p>Parts received from {selected.supplier}</p>
                </div>
              </div>
              <table className="customer-history-table">
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Condition</th>
                    <th>Qty.</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultLines.map((x) => (
                    <tr key={x.code}>
                      <td>
                        <b>{x.name}</b>
                      </td>
                      <td>
                        <button className="inventory-code">{x.code}</button>
                      </td>
                      <td>{x.category}</td>
                      <td>
                        <span
                          className={`condition-badge ${x.condition === "Brand New" ? "new" : "recon"}`}
                        >
                          {x.condition}
                        </span>
                      </td>
                      <td>{x.qty}</td>
                      <td>{lkr(x.cost)}</td>
                      <td>
                        <b>{lkr(x.qty * x.cost)}</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="detail-card finance-notes">
              <div className="detail-card-title">
                <h3>Purchase Notes</h3>
              </div>
              <p>
                All items checked against supplier invoice. Genuine parts include manufacturer
                warranty. Reconditioned units include a 30-day supplier warranty.
              </p>
            </article>
          </div>
          <aside>
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Supplier</h3>
              </div>
              <div className="purchase-supplier">
                <span>
                  <Truck size={22} />
                </span>
                <b>{selected.supplier}</b>
                <small>{selected.phone}</small>
                <p>{selected.reference}</p>
              </div>
            </article>
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Cost Summary</h3>
              </div>
              <div className="invoice-calculation">
                <div>
                  <span>Subtotal</span>
                  <b>{lkr(selected.subtotal)}</b>
                </div>
                <div>
                  <span>Discount</span>
                  <b>− {lkr(selected.discount)}</b>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>{lkr(selected.total)}</strong>
                </div>
                <div>
                  <span>Paid</span>
                  <b className="paid-copy">{lkr(selected.paid)}</b>
                </div>
                <div>
                  <span>Balance</span>
                  <b className="balance-copy">{lkr(selected.total - selected.paid)}</b>
                </div>
              </div>
            </article>
            {selected.status !== "Received" && (
              <button className="receive-purchase" onClick={() => setConfirmReceive(true)}>
                <PackageCheck size={16} /> Receive Purchase into Stock
              </button>
            )}
          </aside>
        </section>
        {(confirmReceive || paymentOpen) && (
          <PurchaseModal
            receive={confirmReceive}
            purchase={selected}
            close={() => {
              setConfirmReceive(false);
              setPaymentOpen(false);
            }}
            receiveAction={receive}
            pay={recordPayment}
          />
        )}
      </main>
    );

  const totalValue = purchases.reduce((s, x) => s + x.total, 0);
  return (
    <main className="dashboard repair-page finance-page">
      <div className="repair-header">
        <div>
          <h2>Purchase Management</h2>
          <p>Manage supplier purchases, receiving and outstanding balances.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Create Purchase
        </button>
      </div>
      <section className="repair-summary">
        {[
          ["Total Purchases", purchases.length, "This month", ShoppingCart, "blue"],
          [
            "Pending Payments",
            purchases.filter((x) => x.total > x.paid).length,
            lkr(purchases.reduce((s, x) => s + x.total - x.paid, 0)),
            Clock3,
            "orange",
          ],
          [
            "Completed Purchases",
            purchases.filter((x) => x.status === "Paid" || x.status === "Received").length,
            "Paid or received",
            CheckCircle2,
            "green",
          ],
          ["Total Purchase Value", lkr(totalValue), "May 2024", CircleDollarSign, "violet"],
        ].map(([a, b, c, I, t]) => {
          const Icon = I as typeof ShoppingCart;
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
        <div className="purchase-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search purchase, supplier or reference..."
            />
          </label>
          <FilterSelect
            label="Supplier"
            value={supplier}
            set={setSupplier}
            options={["All Suppliers", ...new Set(purchases.map((x) => x.supplier))]}
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
              setSupplier("All Suppliers");
              setDate("This Month");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Purchase Register</h3>
            <p>Showing {filtered.length} purchases</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table purchase-table">
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Supplier</th>
                <th>Reference No.</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment Status</th>
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
                  <td>
                    <b>{p.supplier}</b>
                    <small>{p.phone}</small>
                  </td>
                  <td>{p.reference}</td>
                  <td>{p.date}</td>
                  <td>{p.items} items</td>
                  <td>
                    <b>{lkr(p.total)}</b>
                    <small>{lkr(p.total - p.paid)} balance</small>
                  </td>
                  <td>
                    <PurchaseStatus status={p.status} />
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
                          <Eye size={14} /> View Purchase
                        </button>
                        <button onClick={() => openForm(p)}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button onClick={() => notify("Purchase printed")}>
                          <Printer size={14} /> Print
                        </button>
                        {p.total > p.paid && (
                          <button
                            onClick={() => {
                              setSelectedId(p.id);
                              setPaymentOpen(true);
                            }}
                          >
                            <Banknote size={14} /> Record Payment
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="no-jobs">
                    <ShoppingCart size={24} />
                    <b>No purchases found</b>
                    <span>Try changing or resetting the filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filtered.length} of {filtered.length} purchases
          </span>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>›</button>
          </div>
        </div>
      </section>
      {paymentOpen && (
        <PurchaseModal
          receive={false}
          purchase={selected}
          close={() => setPaymentOpen(false)}
          receiveAction={() => {}}
          pay={recordPayment}
        />
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
function PurchaseStatus({ status }: { status: Status }) {
  const cls =
    status === "Paid" || status === "Received"
      ? "paid"
      : status === "Partially Paid"
        ? "partial"
        : status === "Unpaid"
          ? "unpaid"
          : "draft";
  return (
    <span className={`payment-status ${cls}`}>
      <i />
      {status}
    </span>
  );
}
function PurchaseModal({
  receive,
  purchase,
  close,
  receiveAction,
  pay,
}: {
  receive: boolean;
  purchase: Purchase;
  close: () => void;
  receiveAction: () => void;
  pay: (n: number) => void;
}) {
  const [amount, setAmount] = useState(purchase.total - purchase.paid);
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal-card sales-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <span className="modal-icon">
          {receive ? <PackageCheck size={22} /> : <Banknote size={22} />}
        </span>
        <h3>{receive ? "Receive Purchase" : "Record Supplier Payment"}</h3>
        <p>
          {purchase.id} · {purchase.supplier}
        </p>
        {receive ? (
          <div className="receive-warning">
            <Boxes size={16} />
            <p>
              Confirm all quantities were checked. Brand New and Reconditioned stock balances will
              increase separately.
            </p>
          </div>
        ) : (
          <div className="form-grid">
            <Field label="Outstanding Balance">
              <input disabled value={lkr(purchase.total - purchase.paid)} />
            </Field>
            <Field label="Payment Amount" required>
              <input
                type="number"
                min="1"
                max={purchase.total - purchase.paid}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Field>
            <Field label="Payment Method">
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
        )}
        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button onClick={() => (receive ? receiveAction() : pay(amount))}>
            {receive ? "Confirm Receiving" : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
