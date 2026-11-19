import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  ReceiptText,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
import { deductStock, getStockBalance, StockCondition } from "./stockStore";

type InvoiceStatus = "Paid" | "Unpaid" | "Partially Paid" | "Draft";
type InvoiceType = "Repair Invoice" | "Direct Sale";
type Mode = "list" | "repair" | "direct" | "details";

type Invoice = {
  number: string;
  date: string;
  customer: string;
  phone: string;
  vehicle: string;
  type: InvoiceType;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  status: InvoiceStatus;
  method: string;
};

type InvoiceLine = {
  description: string;
  code: string;
  kind: string;
  condition?: StockCondition;
  quantity: number;
  price: number;
  available?: number;
};

const formatLkr = (value: number) => `LKR ${Math.round(value).toLocaleString("en-LK")}`;

const initialInvoices: Invoice[] = [
  {
    number: "INV-2099",
    date: "24 May 2024",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    vehicle: "CAA-4587",
    type: "Repair Invoice",
    subtotal: 42500,
    discount: 2500,
    total: 40000,
    paid: 25000,
    status: "Partially Paid",
    method: "Cash",
  },
  {
    number: "INV-2098",
    date: "24 May 2024",
    customer: "Fathima Rizna",
    phone: "075 330 8677",
    vehicle: "KX-1945",
    type: "Repair Invoice",
    subtotal: 54900,
    discount: 0,
    total: 54900,
    paid: 54900,
    status: "Paid",
    method: "Card",
  },
  {
    number: "INV-2097",
    date: "24 May 2024",
    customer: "Lanka Fresh Foods",
    phone: "011 278 4055",
    vehicle: "WP PV-8804",
    type: "Repair Invoice",
    subtotal: 32500,
    discount: 0,
    total: 32500,
    paid: 15000,
    status: "Partially Paid",
    method: "Bank Transfer",
  },
  {
    number: "INV-2096",
    date: "23 May 2024",
    customer: "Chamika Dias",
    phone: "077 819 4432",
    vehicle: "—",
    type: "Direct Sale",
    subtotal: 21800,
    discount: 800,
    total: 21000,
    paid: 21000,
    status: "Paid",
    method: "Cash",
  },
  {
    number: "INV-2095",
    date: "23 May 2024",
    customer: "S. M. Holdings",
    phone: "011 245 6680",
    vehicle: "WP CAE-1190",
    type: "Repair Invoice",
    subtotal: 68000,
    discount: 3000,
    total: 65000,
    paid: 0,
    status: "Unpaid",
    method: "Other",
  },
  {
    number: "INV-2094",
    date: "22 May 2024",
    customer: "Tharindu Wijesinghe",
    phone: "076 445 1098",
    vehicle: "—",
    type: "Direct Sale",
    subtotal: 17700,
    discount: 0,
    total: 17700,
    paid: 0,
    status: "Draft",
    method: "Cash",
  },
];

const repairLines: InvoiceLine[] = [
  {
    description: "Engine diagnostic & tune-up",
    code: "SRV-ENG-04",
    kind: "Labour",
    quantity: 1,
    price: 8500,
  },
  {
    description: "NGK Iridium Spark Plug",
    code: "SP-NGK-IFR",
    kind: "Part",
    condition: "New",
    quantity: 4,
    price: 4250,
  },
  {
    description: "Synthetic Engine Oil 5W-30 4L",
    code: "EO-5W30-4L",
    kind: "Part",
    condition: "New",
    quantity: 1,
    price: 12500,
  },
  {
    description: "Oil & filter replacement",
    code: "SRV-OIL-01",
    kind: "Labour",
    quantity: 1,
    price: 4500,
  },
];

const completedJobs = [
  {
    id: "JOB-1040",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    vehicle: "CAA-4587",
    model: "Toyota Prius 2015",
    completed: "24 May 2024",
    lines: repairLines,
  },
  {
    id: "JOB-1044",
    customer: "Fathima Rizna",
    phone: "075 330 8677",
    vehicle: "KX-1945",
    model: "Nissan X-Trail 2016",
    completed: "22 May 2024",
    lines: [
      {
        description: "Full engine service",
        code: "SRV-FULL-02",
        kind: "Labour",
        quantity: 1,
        price: 12500,
      },
      {
        description: "Synthetic Engine Oil 5W-30 4L",
        code: "EO-5W30-4L",
        kind: "Part",
        condition: "New" as StockCondition,
        quantity: 1,
        price: 14500,
      },
      {
        description: "Front Brake Pad Set",
        code: "BPA-102",
        kind: "Part",
        condition: "New" as StockCondition,
        quantity: 1,
        price: 10500,
      },
      {
        description: "Brake service & inspection",
        code: "SRV-BRK-03",
        kind: "Labour",
        quantity: 1,
        price: 7500,
      },
    ],
  },
  {
    id: "JOB-1038",
    customer: "Lanka Fresh Foods",
    phone: "011 278 4055",
    vehicle: "WP PV-8804",
    model: "Toyota Hiace 2013",
    completed: "21 May 2024",
    lines: [
      {
        description: "Commercial vehicle inspection",
        code: "SRV-COM-01",
        kind: "Labour",
        quantity: 1,
        price: 9500,
      },
      {
        description: "Synthetic Engine Oil 5W-30 4L",
        code: "EO-5W30-4L",
        kind: "Part",
        condition: "New" as StockCondition,
        quantity: 2,
        price: 14500,
      },
    ],
  },
];

const partsCatalogue: InvoiceLine[] = [
  {
    description: "Motorcycle Tyre 90/90-17",
    code: "TYR-MC-090",
    kind: "Part",
    condition: "New",
    quantity: 1,
    price: 13500,
    available: 10,
  },
  {
    description: "Motorcycle Tyre 90/90-17",
    code: "TYR-MC-090",
    kind: "Part",
    condition: "Reconditioned",
    quantity: 1,
    price: 7500,
    available: 4,
  },
  {
    description: "Toyota Genuine Oil Filter",
    code: "TOF-041",
    kind: "Part",
    condition: "New",
    quantity: 1,
    price: 4200,
    available: 2,
  },
  {
    description: "Front Brake Pad Set",
    code: "BPA-102",
    kind: "Part",
    condition: "New",
    quantity: 1,
    price: 10500,
    available: 3,
  },
  {
    description: "A/C Compressor",
    code: "VAC-230",
    kind: "Part",
    condition: "Reconditioned",
    quantity: 1,
    price: 87500,
    available: 1,
  },
  {
    description: "Synthetic Engine Oil 5W-30 4L",
    code: "EO-5W30-4L",
    kind: "Part",
    condition: "New",
    quantity: 1,
    price: 14500,
    available: 28,
  },
  {
    description: "Iridium Spark Plug",
    code: "SP-NGK-IFR",
    kind: "Part",
    condition: "New",
    quantity: 1,
    price: 4250,
    available: 36,
  },
];

function Field({
  label,
  required,
  children,
  wide,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  wide?: boolean;
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
  onChange,
  children,
}: {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
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

function PaymentBadge({ status }: { status: InvoiceStatus }) {
  const tone =
    status === "Paid"
      ? "paid"
      : status === "Unpaid"
        ? "unpaid"
        : status === "Partially Paid"
          ? "partial"
          : "draft";
  return (
    <span className={`payment-status ${tone}`}>
      <i />
      {status}
    </span>
  );
}

export default function SalesInvoices({ notify }: { notify: (message: string) => void }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedNumber, setSelectedNumber] = useState(initialInvoices[0].number);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [actionInvoice, setActionInvoice] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [discount, setDiscount] = useState(2500);
  const [additional, setAdditional] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [selectedPart, setSelectedPart] = useState(partsCatalogue[0].code + "-New");
  const [directLines, setDirectLines] = useState<InvoiceLine[]>([
    { ...partsCatalogue[2], available: getStockBalance("TOF-041", "New", 2) },
  ]);
  const [invoiceLines, setInvoiceLines] = useState(repairLines);
  const [repairJobId, setRepairJobId] = useState("JOB-1040");

  const selected = invoices.find((invoice) => invoice.number === selectedNumber) ?? invoices[0];
  const selectedRepair = completedJobs.find((job) => job.id === repairJobId) ?? completedJobs[0];
  const outstanding = Math.max(0, selected.total - selected.paid);

  const filteredInvoices = useMemo(() => {
    const term = search.toLowerCase();
    return invoices.filter((invoice) => {
      const matchesSearch = [invoice.number, invoice.customer, invoice.phone].some((value) =>
        value.toLowerCase().includes(term),
      );
      return (
        matchesSearch &&
        (typeFilter === "All Types" || invoice.type === typeFilter) &&
        (statusFilter === "All Statuses" || invoice.status === statusFilter) &&
        (methodFilter === "All Methods" || invoice.method === methodFilter) &&
        (dateFilter !== "Today" || invoice.date === "24 May 2024")
      );
    });
  }, [invoices, search, typeFilter, statusFilter, methodFilter, dateFilter]);

  const openDetails = (invoice: Invoice) => {
    setSelectedNumber(invoice.number);
    setActionInvoice(null);
    setMode("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPayment = (invoice = selected) => {
    if (invoice.status === "Paid") {
      notify(`${invoice.number} is already fully paid`);
      return;
    }
    setSelectedNumber(invoice.number);
    setPaymentAmount(Math.max(0, invoice.total - invoice.paid));
    setPaymentReference("");
    setActionInvoice(null);
    setPaymentOpen(true);
  };

  const recordPayment = (event: FormEvent) => {
    event.preventDefault();
    const invoice = invoices.find((item) => item.number === selectedNumber)!;
    const balance = invoice.total - invoice.paid;
    if (paymentAmount <= 0 || paymentAmount > balance) {
      notify(`Payment must be between LKR 1 and ${formatLkr(balance)}`);
      return;
    }
    setInvoices((items) =>
      items.map((item) => {
        if (item.number !== selectedNumber) return item;
        const paid = item.paid + paymentAmount;
        return {
          ...item,
          paid,
          method: paymentMethod,
          status: paid >= item.total ? "Paid" : "Partially Paid",
        };
      }),
    );
    setPaymentOpen(false);
    notify(`${formatLkr(paymentAmount)} payment recorded for ${selectedNumber}`);
  };

  const currentLines = mode === "direct" ? directLines : invoiceLines;
  const subtotal = currentLines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const taxable = Math.max(0, subtotal - discount + additional);
  const tax = taxable * (taxRate / 100);
  const grandTotal = taxable + tax;

  const updateQuantity = (index: number, quantity: number) => {
    const line = currentLines[index];
    if (mode === "direct") {
      const available = getStockBalance(line.code, line.condition!, line.available ?? 0);
      if (quantity > available) {
        notify(`Only ${available} ${line.condition?.toLowerCase()} units are available`);
        return;
      }
      setDirectLines((items) =>
        items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, quantity: Math.max(1, quantity), available } : item,
        ),
      );
    } else {
      setInvoiceLines((items) =>
        items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, quantity: Math.max(1, quantity) } : item,
        ),
      );
    }
  };

  const addPart = () => {
    const [code, condition] = selectedPart.split(/-(?=[^-]+$)/) as [string, StockCondition];
    const cataloguePart = partsCatalogue.find(
      (part) => part.code === code && part.condition === condition,
    );
    if (!cataloguePart) return;
    const available = getStockBalance(
      cataloguePart.code,
      cataloguePart.condition!,
      cataloguePart.available ?? 0,
    );
    if (available < 1) {
      notify(`${cataloguePart.description} is out of ${condition.toLowerCase()} stock`);
      return;
    }
    const existing = directLines.findIndex(
      (line) => line.code === cataloguePart.code && line.condition === cataloguePart.condition,
    );
    if (existing >= 0) {
      updateQuantity(existing, directLines[existing].quantity + 1);
      return;
    }
    setDirectLines((items) => [...items, { ...cataloguePart, available }]);
  };

  const generateInvoice = () => {
    if (!currentLines.length) {
      notify("Add at least one item before generating the invoice");
      return;
    }
    setConfirmGenerate(true);
  };

  const finalizeInvoice = () => {
    if (mode === "direct") {
      const result = deductStock(
        directLines.map((line) => ({
          code: line.code,
          condition: line.condition!,
          quantity: line.quantity,
          fallback: line.available ?? 0,
        })),
      );
      if (!result.ok) {
        setConfirmGenerate(false);
        notify(`Stock changed. Only ${result.available} units remain for ${result.code}`);
        return;
      }
    }
    const newInvoice: Invoice = {
      number: "INV-2100",
      date: "24 May 2024",
      customer: mode === "direct" ? "Sachini Fernando" : selectedRepair.customer,
      phone: mode === "direct" ? "071 680 2240" : selectedRepair.phone,
      vehicle: mode === "direct" ? "—" : selectedRepair.vehicle,
      type: mode === "direct" ? "Direct Sale" : "Repair Invoice",
      subtotal,
      discount,
      total: grandTotal,
      paid: 0,
      status: "Unpaid",
      method: "Cash",
    };
    setInvoices((items) => [newInvoice, ...items.filter((item) => item.number !== "INV-2100")]);
    setSelectedNumber(newInvoice.number);
    setConfirmGenerate(false);
    setMode("details");
    notify(
      `${newInvoice.number} generated successfully${newInvoice.type === "Direct Sale" ? " and inventory stock deducted" : ""}`,
    );
  };

  if (mode === "repair" || mode === "direct") {
    return (
      <main className="dashboard repair-page sales-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Sales & Invoices / New Invoice</span>
            <h2>{mode === "repair" ? "Create Repair Invoice" : "Create Direct Sales Invoice"}</h2>
            <p>
              {mode === "repair"
                ? "Load a completed repair job and review all billable charges."
                : "Sell spare parts directly with live condition-level stock validation."}
            </p>
          </div>
          <span className="draft-indicator">INV-2100 · Draft</span>
        </div>

        <div className="invoice-create-layout">
          <div>
            {mode === "repair" ? (
              <section className="form-card">
                <div className="form-card-title">
                  <span>
                    <Wrench size={19} />
                  </span>
                  <div>
                    <h3>Completed Repair Job</h3>
                    <p>Select a job to load the customer, vehicle, labour and parts used.</p>
                  </div>
                </div>
                <Field label="Select Completed Job" required>
                  <Select
                    value={repairJobId}
                    onChange={(event) => {
                      const job = completedJobs.find((item) => item.id === event.target.value)!;
                      setRepairJobId(job.id);
                      setInvoiceLines(job.lines);
                      setDiscount(0);
                    }}
                  >
                    <option value="JOB-1040">JOB-1040 — Nimal Perera — CAA-4587</option>
                    <option value="JOB-1044">JOB-1044 — Fathima Rizna — KX-1945</option>
                    <option value="JOB-1038">JOB-1038 — Lanka Fresh Foods — WP PV-8804</option>
                  </Select>
                </Field>
                <div className="loaded-job">
                  <div>
                    <span>Customer</span>
                    <b>{selectedRepair.customer}</b>
                    <small>{selectedRepair.phone}</small>
                  </div>
                  <div>
                    <span>Vehicle</span>
                    <b>{selectedRepair.model}</b>
                    <small>{selectedRepair.vehicle}</small>
                  </div>
                  <div>
                    <span>Job Status</span>
                    <b className="completed-copy">
                      <Check size={13} /> Completed
                    </b>
                    <small>Completed {selectedRepair.completed}</small>
                  </div>
                  <div>
                    <span>Job Total</span>
                    <b>{formatLkr(subtotal)}</b>
                    <small>4 billable items</small>
                  </div>
                </div>
              </section>
            ) : (
              <section className="form-card">
                <div className="form-card-title">
                  <span>
                    <UserPlus size={19} />
                  </span>
                  <div>
                    <h3>Customer Information</h3>
                    <p>Select an existing customer or register a walk-in customer.</p>
                  </div>
                </div>
                <div className="mode-tabs">
                  <button
                    className={customerMode === "existing" ? "active" : ""}
                    onClick={() => setCustomerMode("existing")}
                    type="button"
                  >
                    Existing Customer
                  </button>
                  <button
                    className={customerMode === "new" ? "active" : ""}
                    onClick={() => setCustomerMode("new")}
                    type="button"
                  >
                    New / Walk-in Customer
                  </button>
                </div>
                <div className="form-grid">
                  {customerMode === "existing" && (
                    <Field label="Select Customer" required wide>
                      <Select>
                        <option>Sachini Fernando — 071 680 2240</option>
                        <option>Chamika Dias — 077 819 4432</option>
                        <option>Walk-in Customer</option>
                      </Select>
                    </Field>
                  )}
                  <Field label="Customer Name" required>
                    <input
                      defaultValue={customerMode === "existing" ? "Sachini Fernando" : ""}
                      required
                      placeholder="Full name"
                    />
                  </Field>
                  <Field label="Phone Number">
                    <input
                      defaultValue={customerMode === "existing" ? "071 680 2240" : ""}
                      placeholder="07X XXX XXXX"
                    />
                  </Field>
                  <Field label="Address" wide>
                    <input
                      defaultValue={customerMode === "existing" ? "18, Lake Road, Maharagama" : ""}
                      placeholder="Customer address"
                    />
                  </Field>
                </div>
              </section>
            )}

            <section className="form-card invoice-items-card">
              <div className="form-card-title">
                <span>{mode === "repair" ? <ReceiptText size={19} /> : <Package size={19} />}</span>
                <div>
                  <h3>{mode === "repair" ? "Services, Labour & Parts" : "Spare Parts"}</h3>
                  <p>
                    {mode === "repair"
                      ? "Charges loaded from the selected repair job."
                      : "Add one or more available inventory items."}
                  </p>
                </div>
              </div>
              {mode === "direct" && (
                <div className="part-selector">
                  <label>
                    <Search size={15} />
                    <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)}>
                      {partsCatalogue.map((part) => {
                        const available = getStockBalance(
                          part.code,
                          part.condition!,
                          part.available ?? 0,
                        );
                        return (
                          <option
                            key={`${part.code}-${part.condition}`}
                            value={`${part.code}-${part.condition}`}
                          >
                            {part.description} · {part.code} · {part.condition} ({available}{" "}
                            available)
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown size={14} />
                  </label>
                  <button type="button" onClick={addPart}>
                    <Plus size={15} /> Add Part
                  </button>
                </div>
              )}
              <div className="table-scroll">
                <table className="invoice-lines-table">
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Code / Type</th>
                      {mode === "direct" && <th>Condition</th>}
                      {mode === "direct" && <th>Available</th>}
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      {mode === "direct" && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {currentLines.map((line, index) => {
                      const available = line.condition
                        ? getStockBalance(line.code, line.condition, line.available ?? 0)
                        : undefined;
                      return (
                        <tr key={`${line.code}-${line.condition ?? index}`}>
                          <td>
                            <b>{line.description}</b>
                          </td>
                          <td>
                            <b>{line.code}</b>
                            <small>{line.kind}</small>
                          </td>
                          {mode === "direct" && (
                            <td>
                              <span
                                className={`condition-badge ${line.condition === "New" ? "new" : "recon"}`}
                              >
                                {line.condition}
                              </span>
                            </td>
                          )}
                          {mode === "direct" && (
                            <td>
                              <b className={available! <= 2 ? "low-copy" : ""}>{available} units</b>
                            </td>
                          )}
                          <td>
                            <input
                              className="quantity-input"
                              type="number"
                              min="1"
                              max={available}
                              value={line.quantity}
                              onChange={(e) => updateQuantity(index, Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <div className="price-input">
                              <span>LKR</span>
                              <input
                                type="number"
                                min="0"
                                value={line.price}
                                onChange={(e) => {
                                  const price = Number(e.target.value);
                                  if (mode === "direct")
                                    setDirectLines((items) =>
                                      items.map((item, i) =>
                                        i === index ? { ...item, price } : item,
                                      ),
                                    );
                                  else
                                    setInvoiceLines((items) =>
                                      items.map((item, i) =>
                                        i === index ? { ...item, price } : item,
                                      ),
                                    );
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <b>{formatLkr(line.quantity * line.price)}</b>
                          </td>
                          {mode === "direct" && (
                            <td>
                              <button
                                className="remove-line"
                                type="button"
                                onClick={() =>
                                  setDirectLines((items) => items.filter((_, i) => i !== index))
                                }
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {!currentLines.length && (
                      <tr>
                        <td colSpan={8} className="empty-invoice-lines">
                          Add a spare part to begin the invoice.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="form-card">
              <div className="form-card-title">
                <span>
                  <CalendarDays size={19} />
                </span>
                <div>
                  <h3>Invoice Details</h3>
                  <p>Set dates and any applicable adjustments.</p>
                </div>
              </div>
              <div className="form-grid form-grid-3">
                <Field label="Invoice Date" required>
                  <input type="date" defaultValue="2024-05-24" />
                </Field>
                <Field label="Due Date" required>
                  <input type="date" defaultValue="2024-06-07" />
                </Field>
                <Field label="Discount (LKR)">
                  <input
                    min="0"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                  />
                </Field>
                <Field label="Additional Charges (LKR)">
                  <input
                    min="0"
                    type="number"
                    value={additional}
                    onChange={(e) => setAdditional(Math.max(0, Number(e.target.value)))}
                  />
                </Field>
                <Field label="Tax">
                  <Select
                    value={String(taxRate)}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  >
                    <option value="0">No tax</option>
                    <option value="8">8%</option>
                    <option value="15">15%</option>
                  </Select>
                </Field>
                <Field label="Reference">
                  <input value={mode === "repair" ? repairJobId : "Direct counter sale"} readOnly />
                </Field>
                <Field label="Notes / Terms" wide>
                  <textarea defaultValue="Thank you for choosing AutoCare Garage. Parts sold are subject to the supplier's warranty terms." />
                </Field>
              </div>
            </section>
          </div>

          <aside className="invoice-summary-aside">
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Invoice Summary</h3>
              </div>
              <div className="invoice-calculation">
                <div>
                  <span>Subtotal</span>
                  <b>{formatLkr(subtotal)}</b>
                </div>
                <div>
                  <span>Discount</span>
                  <b className="discount-copy">− {formatLkr(Math.min(discount, subtotal))}</b>
                </div>
                <div>
                  <span>Additional Charges</span>
                  <b>+ {formatLkr(additional)}</b>
                </div>
                <div>
                  <span>Tax ({taxRate}%)</span>
                  <b>{formatLkr(tax)}</b>
                </div>
                <div className="grand-total">
                  <span>Grand Total</span>
                  <strong>{formatLkr(grandTotal)}</strong>
                </div>
              </div>
            </article>
            {mode === "direct" && (
              <article className="stock-deduction-note">
                <AlertCircle size={17} />
                <div>
                  <b>Live inventory deduction</b>
                  <p>
                    Generating this invoice will deduct each item from its selected New or
                    Reconditioned stock balance.
                  </p>
                </div>
              </article>
            )}
          </aside>
        </div>
        <div className="form-actions invoice-form-actions">
          <button type="button" onClick={() => setMode("list")}>
            Cancel
          </button>
          <button type="button" onClick={() => notify("Invoice saved as draft")}>
            <Save size={15} /> Save Draft
          </button>
          <button type="button" onClick={() => notify("Draft invoice sent to printer")}>
            <Printer size={15} /> Print
          </button>
          <button type="button" onClick={() => notify("PDF download prepared")}>
            <Download size={15} /> Download PDF
          </button>
          <button className="primary-action" type="button" onClick={generateInvoice}>
            <FileCheck2 size={15} /> Generate Invoice
          </button>
        </div>
        {renderModals()}
      </main>
    );
  }

  if (mode === "details") {
    const previewLines = selected.type === "Direct Sale" ? directLines : repairLines;
    return (
      <main className="dashboard repair-page sales-page">
        <div className="repair-subheader detail-header no-print">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Sales & Invoices / {selected.number}</span>
            <h2>
              {selected.number} <PaymentBadge status={selected.status} />
            </h2>
            <p>Issued on {selected.date} by Dinuka Wijeratne</p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify("PDF download prepared")}>
              <Download size={15} /> Download PDF
            </button>
            <button onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            {selected.status !== "Paid" && (
              <button className="primary-action" onClick={() => openPayment(selected)}>
                <Banknote size={15} /> Record Payment
              </button>
            )}
          </div>
        </div>

        <div className="invoice-preview-wrap">
          <article className="a4-invoice">
            <header className="invoice-document-header">
              <div className="invoice-document-brand">
                <span>
                  <Wrench size={26} />
                </span>
                <div>
                  <strong>AutoCare Garage</strong>
                  <small>TRUSTED VEHICLE CARE</small>
                </div>
              </div>
              <div>
                <h1>INVOICE</h1>
                <b>{selected.number}</b>
              </div>
            </header>
            <section className="invoice-garage-details">
              <div>
                <b>AutoCare Garage (Pvt) Ltd</b>
                <span>128, High Level Road, Nugegoda, Sri Lanka</span>
                <span>011 281 4500 · 077 700 4500</span>
                <span>service@autocare.lk</span>
              </div>
              <div>
                <span>Invoice Date</span>
                <b>{selected.date}</b>
                <span>Due Date</span>
                <b>07 Jun 2024</b>
              </div>
            </section>
            <section className="invoice-bill-grid">
              <div>
                <small>BILL TO</small>
                <b>{selected.customer}</b>
                <span>{selected.phone}</span>
                <span>42/6, Temple Road, Nugegoda</span>
              </div>
              {selected.vehicle !== "—" && (
                <div>
                  <small>VEHICLE DETAILS</small>
                  <b>Toyota Prius 2015</b>
                  <span>Registration: {selected.vehicle}</span>
                  <span>Repair Job: JOB-1040</span>
                </div>
              )}
            </section>
            <table className="invoice-document-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Qty.</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {previewLines.map((line, index) => (
                  <tr key={`${line.code}-${index}`}>
                    <td>{index + 1}</td>
                    <td>
                      <b>{line.description}</b>
                      <small>
                        {line.code}
                        {line.condition ? ` · ${line.condition}` : ""}
                      </small>
                    </td>
                    <td>{line.kind}</td>
                    <td>{line.quantity}</td>
                    <td>{formatLkr(line.price)}</td>
                    <td>
                      <b>{formatLkr(line.price * line.quantity)}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <section className="invoice-document-totals">
              <div>
                <b>Payment Information</b>
                <span>Method: {selected.method}</span>
                <span>Reference: {selected.paid ? "PAY-0837" : "Not paid"}</span>
              </div>
              <dl>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatLkr(selected.subtotal)}</dd>
                </div>
                <div>
                  <dt>Discount</dt>
                  <dd>− {formatLkr(selected.discount)}</dd>
                </div>
                <div className="document-total">
                  <dt>Total</dt>
                  <dd>{formatLkr(selected.total)}</dd>
                </div>
                <div>
                  <dt>Amount Paid</dt>
                  <dd className="paid-copy">{formatLkr(selected.paid)}</dd>
                </div>
                <div className="document-balance">
                  <dt>Balance Due</dt>
                  <dd>{formatLkr(selected.total - selected.paid)}</dd>
                </div>
              </dl>
            </section>
            <section className="payment-history">
              <h3>Payment History</h3>
              {selected.paid > 0 ? (
                <div>
                  <span>24 May 2024</span>
                  <b>{formatLkr(selected.paid)}</b>
                  <span>{selected.method}</span>
                  <span>PAY-0837</span>
                  <span>Recorded by Dinuka W.</span>
                </div>
              ) : (
                <p>No payments recorded for this invoice.</p>
              )}
            </section>
            <section className="invoice-signatures">
              <div>
                <span />
                <b>Customer Signature</b>
                <small>Date</small>
              </div>
              <div>
                <span />
                <b>Authorized Signature</b>
                <small>AutoCare Garage</small>
              </div>
            </section>
            <footer className="invoice-document-footer">
              <p>Thank you for choosing AutoCare Garage. We appreciate your business.</p>
              <span>
                Terms: Payment is due by the date shown above. Parts carry the supplier's stated
                warranty.
              </span>
            </footer>
          </article>
        </div>
        {renderModals()}
      </main>
    );
  }

  function renderModals() {
    if (!paymentOpen && !confirmGenerate) return null;
    const invoice = invoices.find((item) => item.number === selectedNumber) ?? selected;
    const balance = invoice.total - invoice.paid;
    return (
      <div
        className="modal-backdrop"
        role="presentation"
        onMouseDown={() => {
          setPaymentOpen(false);
          setConfirmGenerate(false);
        }}
      >
        <div
          className="modal-card sales-modal"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close"
            onClick={() => {
              setPaymentOpen(false);
              setConfirmGenerate(false);
            }}
          >
            <X size={18} />
          </button>
          {confirmGenerate ? (
            <>
              <span className="modal-icon">
                <FileCheck2 size={23} />
              </span>
              <h3>Generate final invoice?</h3>
              <p>
                {mode === "direct"
                  ? "This will finalize INV-2100 and permanently deduct the selected quantities from the correct inventory condition."
                  : "This will finalize INV-2100 for the selected completed repair job."}
              </p>
              <div className="confirm-total">
                <span>Invoice total</span>
                <strong>{formatLkr(grandTotal)}</strong>
              </div>
              <div className="modal-actions">
                <button onClick={() => setConfirmGenerate(false)}>Review Invoice</button>
                <button onClick={finalizeInvoice}>Generate Invoice</button>
              </div>
            </>
          ) : (
            <form onSubmit={recordPayment}>
              <span className="modal-icon">
                <Banknote size={23} />
              </span>
              <h3>Record Payment</h3>
              <p>
                {invoice.number} · {invoice.customer}
              </p>
              <div className="payment-balance">
                <div>
                  <span>Invoice Total</span>
                  <b>{formatLkr(invoice.total)}</b>
                </div>
                <div>
                  <span>Already Paid</span>
                  <b>{formatLkr(invoice.paid)}</b>
                </div>
                <div>
                  <span>Outstanding</span>
                  <strong>{formatLkr(balance)}</strong>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Amount Paid (LKR)" required>
                  <input
                    type="number"
                    min="1"
                    max={balance}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    required
                  />
                </Field>
                <Field label="Payment Date" required>
                  <input type="date" defaultValue="2024-05-24" required />
                </Field>
                <Field label="Payment Method" required>
                  <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Reference Number">
                  <input
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Receipt or transfer reference"
                  />
                </Field>
                <Field label="Notes" wide>
                  <textarea placeholder="Optional payment notes..." />
                </Field>
              </div>
              {paymentAmount > 0 && paymentAmount < balance && (
                <div className="partial-payment-note">
                  <AlertCircle size={14} /> Partial payment: {formatLkr(balance - paymentAmount)}{" "}
                  will remain outstanding.
                </div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={() => setPaymentOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Record Payment</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalOutstanding = invoices.reduce((sum, invoice) => sum + invoice.total - invoice.paid, 0);
  return (
    <main className="dashboard repair-page sales-page">
      <div className="repair-header sales-header">
        <div>
          <h2>Sales & Invoices</h2>
          <p>Create invoices, collect payments and monitor outstanding customer balances.</p>
        </div>
        <div>
          <button onClick={() => openPayment(invoices.find((item) => item.status !== "Paid")!)}>
            <Banknote size={15} /> Record Payment
          </button>
          <button onClick={() => setMode("direct")}>
            <ShoppingCart size={15} /> Direct Sales Invoice
          </button>
          <button className="new-job-button" onClick={() => setMode("repair")}>
            <Wrench size={15} /> Repair Invoice
          </button>
        </div>
      </div>
      <section className="inventory-summary sales-summary">
        {[
          {
            label: "Today's Sales",
            value: formatLkr(147400),
            note: "4 invoices today",
            icon: CircleDollarSign,
            tone: "blue",
          },
          {
            label: "Total Invoiced",
            value: formatLkr(totalInvoiced),
            note: "This month",
            icon: ReceiptText,
            tone: "cyan",
          },
          {
            label: "Paid Invoices",
            value: invoices.filter((item) => item.status === "Paid").length,
            note: formatLkr(75900),
            icon: FileCheck2,
            tone: "green",
          },
          {
            label: "Unpaid Invoices",
            value: invoices.filter((item) => item.status === "Unpaid").length,
            note: "Requires follow-up",
            icon: FileText,
            tone: "red",
          },
          {
            label: "Partially Paid",
            value: invoices.filter((item) => item.status === "Partially Paid").length,
            note: "Payments in progress",
            icon: WalletCards,
            tone: "violet",
          },
          {
            label: "Outstanding Amount",
            value: formatLkr(totalOutstanding),
            note: "Across active invoices",
            icon: AlertCircle,
            tone: "orange",
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
      <section className="panel sales-panel">
        <div className="sales-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice, customer or phone..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} />
              </button>
            )}
          </label>
          {[
            [
              "Invoice Type",
              typeFilter,
              setTypeFilter,
              ["All Types", "Repair Invoice", "Direct Sale"],
            ],
            [
              "Payment Status",
              statusFilter,
              setStatusFilter,
              ["All Statuses", "Paid", "Unpaid", "Partially Paid", "Draft"],
            ],
            ["Date", dateFilter, setDateFilter, ["This Month", "Today", "This Week", "Last Month"]],
            [
              "Payment Method",
              methodFilter,
              setMethodFilter,
              ["All Methods", "Cash", "Card", "Bank Transfer", "Other"],
            ],
          ].map(([label, value, setter, options]) => (
            <label key={label as string}>
              <span>{label as string}</span>
              <select
                value={value as string}
                onChange={(e) =>
                  (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
                }
              >
                {(options as string[]).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown size={13} />
            </label>
          ))}
          <button
            className="filter-button"
            title="Reset filters"
            onClick={() => {
              setSearch("");
              setTypeFilter("All Types");
              setStatusFilter("All Statuses");
              setDateFilter("This Month");
              setMethodFilter("All Methods");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Invoice Register</h3>
            <p>
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </p>
          </div>
          <button onClick={() => notify("Invoice register exported")}>
            <Download size={14} /> Export
          </button>
        </div>
        <div className="table-scroll">
          <table className="repair-table sales-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Vehicle Reg.</th>
                <th>Type</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Payment Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.number}>
                  <td>
                    <button className="inventory-code" onClick={() => openDetails(invoice)}>
                      {invoice.number}
                    </button>
                  </td>
                  <td>{invoice.date}</td>
                  <td>
                    <b>{invoice.customer}</b>
                    <small>{invoice.phone}</small>
                  </td>
                  <td>
                    {invoice.vehicle === "—" ? (
                      "—"
                    ) : (
                      <span className="reg-plate">{invoice.vehicle}</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`invoice-type ${invoice.type === "Direct Sale" ? "direct" : ""}`}
                    >
                      {invoice.type === "Direct Sale" ? (
                        <ShoppingCart size={12} />
                      ) : (
                        <Wrench size={12} />
                      )}
                      {invoice.type}
                    </span>
                  </td>
                  <td>{formatLkr(invoice.subtotal)}</td>
                  <td>{invoice.discount ? formatLkr(invoice.discount) : "—"}</td>
                  <td>
                    <b>{formatLkr(invoice.total)}</b>
                  </td>
                  <td className="paid-copy">{formatLkr(invoice.paid)}</td>
                  <td>
                    <b className={invoice.total - invoice.paid > 0 ? "balance-copy" : ""}>
                      {formatLkr(invoice.total - invoice.paid)}
                    </b>
                  </td>
                  <td>
                    <PaymentBadge status={invoice.status} />
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() =>
                        setActionInvoice(actionInvoice === invoice.number ? null : invoice.number)
                      }
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {actionInvoice === invoice.number && (
                      <div className="job-actions-menu sales-actions">
                        <button onClick={() => openDetails(invoice)}>
                          <Eye size={14} /> View Invoice
                        </button>
                        {invoice.status === "Draft" && (
                          <button
                            onClick={() => {
                              setMode(invoice.type === "Direct Sale" ? "direct" : "repair");
                              setActionInvoice(null);
                            }}
                          >
                            <Edit3 size={14} /> Edit Draft
                          </button>
                        )}
                        <button onClick={() => notify(`${invoice.number} sent to printer`)}>
                          <Printer size={14} /> Print
                        </button>
                        <button onClick={() => notify(`${invoice.number} PDF download prepared`)}>
                          <Download size={14} /> Download PDF
                        </button>
                        {invoice.status !== "Paid" && (
                          <button onClick={() => openPayment(invoice)}>
                            <Banknote size={14} /> Record Payment
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredInvoices.length && (
                <tr>
                  <td colSpan={12} className="no-jobs">
                    <ReceiptText size={24} />
                    <b>No invoices found</b>
                    <span>Try changing or resetting the filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filteredInvoices.length} of {filteredInvoices.length} invoices
          </span>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button disabled>›</button>
          </div>
        </div>
      </section>
      {renderModals()}
    </main>
  );
}
