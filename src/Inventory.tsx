import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Boxes,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  FileClock,
  Filter,
  ImagePlus,
  Minus,
  MoreHorizontal,
  Package,
  PackageCheck,
  PackagePlus,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings2,
  ShoppingCart,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { hydrateStock, setStockBalance } from "./stockStore";

type Condition = "New" | "Reconditioned";
type InventoryPart = {
  code: string;
  name: string;
  category: string;
  brand: string;
  vehicle: string;
  model: string;
  newQty: number;
  reconQty: number;
  purchase: number;
  selling: number;
  minimum: number;
  supplier: string;
  supplierPhone: string;
  description: string;
  active: boolean;
  color: string;
};

type HistoryItem = {
  date: string;
  type: string;
  reference: string;
  condition: Condition;
  added: number;
  removed: number;
  balance: number;
  by: string;
};

type Mode = "list" | "create" | "details" | "history";
type StockDialog = "purchase" | "adjustment" | "add" | null;

const initialParts: InventoryPart[] = [
  {
    code: "TYR-MC-090",
    name: "Motorcycle Tyre 90/90-17",
    category: "Tyres",
    brand: "CEAT",
    vehicle: "Motorbike",
    model: "Bajaj Pulsar, Yamaha FZ, Honda CB",
    newQty: 10,
    reconQty: 4,
    purchase: 10500,
    selling: 13500,
    minimum: 6,
    supplier: "Lanka Tyre House",
    supplierPhone: "011 268 7450",
    description: "Durable all-weather rear motorcycle tyre with deep road grip.",
    active: true,
    color: "#334155",
  },
  {
    code: "TOF-041",
    name: "Toyota Genuine Oil Filter",
    category: "Filters",
    brand: "Toyota",
    vehicle: "Car / Van",
    model: "Prius, Aqua, Axio, Hiace",
    newQty: 2,
    reconQty: 0,
    purchase: 2850,
    selling: 4200,
    minimum: 8,
    supplier: "Auto Miraj Parts",
    supplierPhone: "011 744 5500",
    description: "Genuine spin-on engine oil filter for Toyota petrol and hybrid engines.",
    active: true,
    color: "#2563eb",
  },
  {
    code: "BPA-102",
    name: "Front Brake Pad Set",
    category: "Brakes",
    brand: "Akebono",
    vehicle: "Car",
    model: "Toyota Aqua NHP10",
    newQty: 3,
    reconQty: 0,
    purchase: 7800,
    selling: 10500,
    minimum: 5,
    supplier: "Japan Auto Traders",
    supplierPhone: "077 730 2190",
    description: "Low-dust ceramic front brake pad set with fitting clips.",
    active: true,
    color: "#dc2626",
  },
  {
    code: "VAC-230",
    name: "A/C Compressor",
    category: "Air Conditioning",
    brand: "Denso",
    vehicle: "SUV",
    model: "Honda Vezel RU3 / RU4",
    newQty: 0,
    reconQty: 1,
    purchase: 68500,
    selling: 87500,
    minimum: 2,
    supplier: "Kandy Japanese Spares",
    supplierPhone: "081 222 4698",
    description: "Bench-tested Japanese reconditioned compressor with 30-day warranty.",
    active: true,
    color: "#7c3aed",
  },
  {
    code: "EO-5W30-4L",
    name: "Synthetic Engine Oil 5W-30 4L",
    category: "Lubricants",
    brand: "Mobil",
    vehicle: "Car / SUV",
    model: "Petrol & Hybrid vehicles",
    newQty: 28,
    reconQty: 0,
    purchase: 11800,
    selling: 14500,
    minimum: 10,
    supplier: "United Motors Lanka",
    supplierPhone: "011 244 7111",
    description: "Fully synthetic engine oil for modern petrol and hybrid engines.",
    active: true,
    color: "#ea580c",
  },
  {
    code: "WLA-089",
    name: "Front Lower Control Arm",
    category: "Suspension",
    brand: "Suzuki",
    vehicle: "Car",
    model: "Suzuki Wagon R MH44",
    newQty: 2,
    reconQty: 2,
    purchase: 14500,
    selling: 19500,
    minimum: 4,
    supplier: "Panchikawatte Motor Stores",
    supplierPhone: "011 243 8052",
    description: "Complete lower control arm assembly with bush and ball joint.",
    active: true,
    color: "#0891b2",
  },
  {
    code: "SP-NGK-IFR",
    name: "Iridium Spark Plug",
    category: "Engine Parts",
    brand: "NGK",
    vehicle: "Car",
    model: "Toyota Prius ZVW30",
    newQty: 36,
    reconQty: 0,
    purchase: 2900,
    selling: 4250,
    minimum: 12,
    supplier: "Japan Auto Traders",
    supplierPhone: "077 730 2190",
    description: "Long-life iridium spark plug, sold individually.",
    active: true,
    color: "#059669",
  },
  {
    code: "ALT-ISU-24V",
    name: "24V Alternator",
    category: "Electrical",
    brand: "Hitachi",
    vehicle: "Lorry",
    model: "Isuzu Elf NPR / NKR",
    newQty: 0,
    reconQty: 0,
    purchase: 42500,
    selling: 56000,
    minimum: 2,
    supplier: "Diesel Motors Parts",
    supplierPhone: "011 287 6000",
    description: "Reconditioned 24V alternator for light commercial Isuzu trucks.",
    active: true,
    color: "#475569",
  },
];

const initialHistory: Record<string, HistoryItem[]> = {
  "TYR-MC-090": [
    {
      date: "24 May 2024, 10:18 AM",
      type: "Direct Sale",
      reference: "INV-2099",
      condition: "New",
      added: 0,
      removed: 1,
      balance: 10,
      by: "Dinuka W.",
    },
    {
      date: "22 May 2024, 2:40 PM",
      type: "Purchase",
      reference: "PO-0541",
      condition: "New",
      added: 6,
      removed: 0,
      balance: 11,
      by: "Shalini P.",
    },
    {
      date: "21 May 2024, 4:05 PM",
      type: "Repair Usage",
      reference: "JOB-1039",
      condition: "Reconditioned",
      added: 0,
      removed: 1,
      balance: 4,
      by: "Kasun S.",
    },
    {
      date: "18 May 2024, 9:30 AM",
      type: "Customer Return",
      reference: "INV-2078",
      condition: "New",
      added: 1,
      removed: 0,
      balance: 5,
      by: "Dinuka W.",
    },
    {
      date: "15 May 2024, 11:22 AM",
      type: "Supplier Return",
      reference: "SR-0018",
      condition: "New",
      added: 0,
      removed: 2,
      balance: 4,
      by: "Shalini P.",
    },
    {
      date: "12 May 2024, 5:10 PM",
      type: "Adjustment",
      reference: "ADJ-0094",
      condition: "Reconditioned",
      added: 1,
      removed: 0,
      balance: 5,
      by: "Dinuka W.",
    },
  ],
};

const formatLkr = (value: number) => `LKR ${value.toLocaleString("en-LK")}`;

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

function ConditionBadge({ condition }: { condition: Condition }) {
  return (
    <span className={`condition-badge ${condition === "New" ? "new" : "recon"}`}>{condition}</span>
  );
}

function StockBadge({
  total,
  minimum,
  active = true,
}: {
  total: number;
  minimum: number;
  active?: boolean;
}) {
  const status = !active
    ? "Inactive"
    : total === 0
      ? "Out of Stock"
      : total <= minimum
        ? "Low Stock"
        : "In Stock";
  const tone = !active ? "inactive" : total === 0 ? "out" : total <= minimum ? "low" : "good";
  return (
    <span className={`stock-status ${tone}`}>
      <i />
      {status}
    </span>
  );
}

export default function Inventory({ notify }: { notify: (message: string) => void }) {
  const [parts, setParts] = useState(() => hydrateStock(initialParts));
  const [histories, setHistories] = useState(initialHistory);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedCode, setSelectedCode] = useState(initialParts[0].code);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [brand, setBrand] = useState("All Brands");
  const [condition, setCondition] = useState("All Conditions");
  const [supplier, setSupplier] = useState("All Suppliers");
  const [stockStatus, setStockStatus] = useState("All Stock");
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [dialog, setDialog] = useState<StockDialog>(null);
  const [confirmInactive, setConfirmInactive] = useState(false);
  const [stockCondition, setStockCondition] = useState<Condition>("New");
  const [stockAmount, setStockAmount] = useState(1);
  const [adjustmentDirection, setAdjustmentDirection] = useState<"Add" | "Remove">("Add");
  const [transactionType, setTransactionType] = useState("Purchase");
  const [reference, setReference] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(10500);
  const [sellingPrice, setSellingPrice] = useState(13500);
  const [imageName, setImageName] = useState("");

  const selected = parts.find((part) => part.code === selectedCode) ?? parts[0];
  const totalStock = parts.reduce((sum, part) => sum + part.newQty + part.reconQty, 0);
  const newStock = parts.reduce((sum, part) => sum + part.newQty, 0);
  const reconStock = parts.reduce((sum, part) => sum + part.reconQty, 0);
  const lowParts = parts.filter(
    (part) => part.newQty + part.reconQty > 0 && part.newQty + part.reconQty <= part.minimum,
  );
  const outParts = parts.filter((part) => part.newQty + part.reconQty === 0);

  const filteredParts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return parts.filter((part) => {
      const total = part.newQty + part.reconQty;
      const searchMatch = [part.name, part.code].some((value) =>
        value.toLowerCase().includes(term),
      );
      const conditionMatch =
        condition === "All Conditions" ||
        (condition === "New" && part.newQty > 0) ||
        (condition === "Reconditioned" && part.reconQty > 0);
      const statusMatch =
        stockStatus === "All Stock" ||
        (stockStatus === "In Stock" && total > part.minimum) ||
        (stockStatus === "Low Stock" && total > 0 && total <= part.minimum) ||
        (stockStatus === "Out of Stock" && total === 0);
      return (
        searchMatch &&
        (category === "All Categories" || part.category === category) &&
        (brand === "All Brands" || part.brand === brand) &&
        (supplier === "All Suppliers" || part.supplier === supplier) &&
        conditionMatch &&
        statusMatch
      );
    });
  }, [parts, search, category, brand, condition, supplier, stockStatus]);

  const openMode = (nextMode: Mode, part = selected) => {
    setSelectedCode(part.code);
    setActionCode(null);
    setMode(nextMode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openStockDialog = (type: StockDialog, part = selected) => {
    setSelectedCode(part.code);
    setDialog(type);
    setActionCode(null);
    setStockCondition(part.newQty === 0 && part.reconQty > 0 ? "Reconditioned" : "New");
    setStockAmount(1);
    setReference(type === "purchase" ? "PO-0542" : type === "adjustment" ? "ADJ-0095" : "");
    setTransactionType(type === "purchase" ? "Purchase" : "Adjustment");
  };

  const submitStock = (event: FormEvent) => {
    event.preventDefault();
    const part = parts.find((item) => item.code === selectedCode)!;
    const current = stockCondition === "New" ? part.newQty : part.reconQty;
    const removing = dialog === "adjustment" && adjustmentDirection === "Remove";
    if (removing && stockAmount > current) {
      notify(
        `Cannot remove ${stockAmount} units. Only ${current} ${stockCondition.toLowerCase()} units are available.`,
      );
      return;
    }
    const delta = removing ? -stockAmount : stockAmount;
    const updatedBalance = current + delta;
    setStockBalance(
      selectedCode,
      stockCondition,
      updatedBalance,
      stockCondition === "New" ? part.reconQty : part.newQty,
    );
    setParts((items) =>
      items.map((item) =>
        item.code !== selectedCode
          ? item
          : {
              ...item,
              newQty: stockCondition === "New" ? updatedBalance : item.newQty,
              reconQty: stockCondition === "Reconditioned" ? updatedBalance : item.reconQty,
            },
      ),
    );
    const entry: HistoryItem = {
      date: "24 May 2024, 3:42 PM",
      type: dialog === "purchase" ? "Purchase" : transactionType,
      reference: reference || "ADJ-0095",
      condition: stockCondition,
      added: delta > 0 ? stockAmount : 0,
      removed: delta < 0 ? stockAmount : 0,
      balance: updatedBalance,
      by: "Dinuka W.",
    };
    setHistories((items) => ({
      ...items,
      [selectedCode]: [entry, ...(items[selectedCode] ?? [])],
    }));
    setDialog(null);
    notify(`${stockCondition} stock updated successfully`);
  };

  const markInactive = () => {
    setParts((items) =>
      items.map((part) => (part.code === selectedCode ? { ...part, active: false } : part)),
    );
    setConfirmInactive(false);
    setActionCode(null);
    notify(`${selected.name} marked inactive`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setBrand("All Brands");
    setCondition("All Conditions");
    setSupplier("All Suppliers");
    setStockStatus("All Stock");
  };

  if (mode === "create") {
    const margin =
      sellingPrice > 0 ? Math.max(0, ((sellingPrice - purchasePrice) / sellingPrice) * 100) : 0;
    return (
      <main className="dashboard repair-page inventory-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Inventory / New Part</span>
            <h2>Add New Spare Part</h2>
            <p>Create a part record and enter its opening stock.</p>
          </div>
          <span className="draft-indicator">Inventory record</span>
        </div>
        <form
          className="job-form"
          onSubmit={(event) => {
            event.preventDefault();
            notify("New spare part added successfully");
            setMode("list");
          }}
        >
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <PackagePlus size={19} />
              </span>
              <div>
                <h3>Part Information</h3>
                <p>Basic identification and catalogue details.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Part Code" required>
                <input required placeholder="e.g. TOF-042" />
              </Field>
              <Field label="Part Name" required>
                <input required placeholder="Enter part name" />
              </Field>
              <Field label="Category" required>
                <Select>
                  <option>Engine Parts</option>
                  <option>Filters</option>
                  <option>Brakes</option>
                  <option>Electrical</option>
                  <option>Tyres</option>
                  <option>Suspension</option>
                </Select>
              </Field>
              <Field label="Brand" required>
                <input required placeholder="e.g. Toyota, Denso" />
              </Field>
              <Field label="Vehicle Type" required>
                <Select>
                  <option>Car</option>
                  <option>Motorbike</option>
                  <option>Three-Wheeler</option>
                  <option>Van</option>
                  <option>Lorry</option>
                  <option>All Vehicles</option>
                </Select>
              </Field>
              <Field label="Compatible Model" required>
                <input required placeholder="e.g. Toyota Aqua NHP10" />
              </Field>
              <Field label="Description" wide>
                <textarea placeholder="Part specifications, warranty and notes..." />
              </Field>
            </div>
          </section>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <ImagePlus size={19} />
              </span>
              <div>
                <h3>Part Image</h3>
                <p>Add a clear catalogue or product image.</p>
              </div>
            </div>
            <label className="upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")}
              />
              <span>
                <ImagePlus size={23} />
              </span>
              <b>{imageName || "Drop an image here or click to browse"}</b>
              <small>PNG or JPG up to 5 MB</small>
            </label>
          </section>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Tag size={19} />
              </span>
              <div>
                <h3>Stock & Pricing</h3>
                <p>New and reconditioned stock are always recorded separately.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Condition" required>
                <Select>
                  <option>New</option>
                  <option>Reconditioned</option>
                </Select>
              </Field>
              <Field label="Opening Quantity" required>
                <input min="0" type="number" defaultValue="0" required />
              </Field>
              <Field label="Minimum Stock" required>
                <input min="0" type="number" defaultValue="3" required />
              </Field>
              <Field label="Purchase Price (LKR)" required>
                <input
                  min="0"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  required
                />
              </Field>
              <Field label="Selling Price (LKR)" required>
                <input
                  min="0"
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  required
                />
              </Field>
              <Field label="Profit Margin">
                <div className="calculated-field">
                  <strong>{margin.toFixed(1)}%</strong>
                  <span>{formatLkr(Math.max(0, sellingPrice - purchasePrice))} profit</span>
                </div>
              </Field>
              <Field label="Supplier" required wide>
                <Select>
                  <option>Japan Auto Traders</option>
                  <option>Auto Miraj Parts</option>
                  <option>Lanka Tyre House</option>
                  <option>United Motors Lanka</option>
                  <option>Panchikawatte Motor Stores</option>
                </Select>
              </Field>
            </div>
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode("list")}>
              Cancel
            </button>
            <button type="button" onClick={() => notify("Part saved as draft")}>
              <Save size={16} /> Save Draft
            </button>
            <button className="primary-action" type="submit">
              <Plus size={16} /> Add Part
            </button>
          </div>
        </form>
      </main>
    );
  }

  if (mode === "details" || mode === "history") {
    const history = histories[selected.code] ?? [];
    const total = selected.newQty + selected.reconQty;
    return (
      <main className="dashboard repair-page inventory-page">
        <div className="repair-subheader detail-header">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Inventory / {selected.code}</span>
            <h2>
              {mode === "history" ? "Stock History" : selected.name}{" "}
              {mode === "details" && (
                <StockBadge total={total} minimum={selected.minimum} active={selected.active} />
              )}
            </h2>
            <p>{selected.code} · Last updated 24 May 2024 at 3:42 PM</p>
          </div>
          <div className="detail-actions">
            {mode === "history" ? (
              <button onClick={() => setMode("details")}>
                <Eye size={15} /> Part Details
              </button>
            ) : (
              <button onClick={() => setMode("history")}>
                <FileClock size={15} /> View History
              </button>
            )}
            <button onClick={() => notify("Edit part form opened")}>
              <Edit3 size={15} /> Edit Part
            </button>
            <button className="primary-action" onClick={() => openStockDialog("add")}>
              <Plus size={15} /> Add Stock
            </button>
          </div>
        </div>
        {mode === "history" ? (
          <section className="panel inventory-history">
            <div className="repair-table-heading">
              <div>
                <h3>Stock Movement Log</h3>
                <p>Every addition and removal for new and reconditioned stock.</p>
              </div>
              <button onClick={() => notify("Stock history exported")}>
                <ArrowDown size={14} /> Export
              </button>
            </div>
            <div className="table-scroll">
              <table className="repair-table inventory-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction Type</th>
                    <th>Reference</th>
                    <th>Condition</th>
                    <th>Stock Added</th>
                    <th>Stock Removed</th>
                    <th>Balance</th>
                    <th>Updated By</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={`${item.date}-${index}`}>
                      <td>
                        <b>{item.date.split(",")[0]}</b>
                        <small>{item.date.split(",").slice(1).join(",")}</small>
                      </td>
                      <td>
                        <span className="transaction-type">{item.type}</span>
                      </td>
                      <td>
                        <button className="inventory-code">{item.reference}</button>
                      </td>
                      <td>
                        <ConditionBadge condition={item.condition} />
                      </td>
                      <td>
                        {item.added ? (
                          <span className="stock-added">
                            <ArrowUp size={12} /> +{item.added}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {item.removed ? (
                          <span className="stock-removed">
                            <ArrowDown size={12} /> -{item.removed}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <b>{item.balance} units</b>
                      </td>
                      <td>{item.by}</td>
                    </tr>
                  ))}
                  {!history.length && (
                    <tr>
                      <td colSpan={8} className="no-jobs">
                        No stock movements recorded for this part.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className="inventory-detail-layout">
            <div>
              <article className="detail-card inventory-overview">
                <div className="part-hero">
                  <span style={{ background: `${selected.color}15`, color: selected.color }}>
                    <Package size={42} />
                  </span>
                  <div>
                    <small>{selected.category}</small>
                    <h3>{selected.name}</h3>
                    <p>{selected.description}</p>
                    <div>
                      <ConditionBadge condition="New" />
                      {selected.reconQty > 0 && <ConditionBadge condition="Reconditioned" />}
                    </div>
                  </div>
                </div>
              </article>
              <article className="detail-card">
                <div className="detail-card-title">
                  <div>
                    <h3>Part Information</h3>
                    <p>Catalogue and compatibility information</p>
                  </div>
                </div>
                <dl className="part-details-grid">
                  <div>
                    <dt>Part Code</dt>
                    <dd>{selected.code}</dd>
                  </div>
                  <div>
                    <dt>Brand</dt>
                    <dd>{selected.brand}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{selected.category}</dd>
                  </div>
                  <div>
                    <dt>Vehicle Type</dt>
                    <dd>{selected.vehicle}</dd>
                  </div>
                  <div className="wide">
                    <dt>Compatible Models</dt>
                    <dd>{selected.model}</dd>
                  </div>
                </dl>
              </article>
              <article className="detail-card">
                <div className="detail-card-title">
                  <div>
                    <h3>Pricing Information</h3>
                    <p>Current purchase and retail prices</p>
                  </div>
                </div>
                <div className="pricing-grid">
                  <div>
                    <span>Purchase Price</span>
                    <strong>{formatLkr(selected.purchase)}</strong>
                  </div>
                  <div>
                    <span>Selling Price</span>
                    <strong>{formatLkr(selected.selling)}</strong>
                  </div>
                  <div>
                    <span>Profit per Unit</span>
                    <strong className="positive-text">
                      {formatLkr(selected.selling - selected.purchase)}
                    </strong>
                  </div>
                  <div>
                    <span>Profit Margin</span>
                    <strong className="positive-text">
                      {(((selected.selling - selected.purchase) / selected.selling) * 100).toFixed(
                        1,
                      )}
                      %
                    </strong>
                  </div>
                </div>
              </article>
            </div>
            <aside>
              <article className="detail-card stock-balance-card">
                <div className="detail-card-title">
                  <h3>Available Stock</h3>
                </div>
                <div className="total-balance">
                  <span>Total Available</span>
                  <strong>{total}</strong>
                  <small>units across both conditions</small>
                </div>
                <div className="condition-balances">
                  <div>
                    <ConditionBadge condition="New" />
                    <strong>{selected.newQty}</strong>
                    <span>units</span>
                  </div>
                  <div>
                    <ConditionBadge condition="Reconditioned" />
                    <strong>{selected.reconQty}</strong>
                    <span>units</span>
                  </div>
                </div>
                <div className="minimum-row">
                  <span>Minimum stock level</span>
                  <b>{selected.minimum} units</b>
                </div>
              </article>
              <article className="detail-card supplier-card">
                <div className="detail-card-title">
                  <h3>Preferred Supplier</h3>
                </div>
                <div>
                  <span>
                    <Truck size={20} />
                  </span>
                  <b>{selected.supplier}</b>
                  <small>{selected.supplierPhone}</small>
                  <button onClick={() => openStockDialog("purchase")}>Record purchase</button>
                </div>
              </article>
              <article className="detail-card detail-action-list">
                <div className="detail-card-title">
                  <h3>Part Actions</h3>
                </div>
                <button onClick={() => openStockDialog("add")}>
                  <PackagePlus size={15} /> Add Stock
                </button>
                <button onClick={() => openStockDialog("adjustment")}>
                  <Settings2 size={15} /> Stock Adjustment
                </button>
                <button onClick={() => setMode("history")}>
                  <Clock3 size={15} /> View Stock History
                </button>
                <button className="danger" onClick={() => setConfirmInactive(true)}>
                  <X size={15} /> Mark Inactive
                </button>
              </article>
            </aside>
          </div>
        )}
        {renderDialogs()}
      </main>
    );
  }

  function renderDialogs() {
    if (!dialog && !confirmInactive) return null;
    return (
      <div
        className="modal-backdrop"
        role="presentation"
        onMouseDown={() => {
          setDialog(null);
          setConfirmInactive(false);
        }}
      >
        <div
          className="modal-card stock-modal"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close"
            onClick={() => {
              setDialog(null);
              setConfirmInactive(false);
            }}
          >
            <X size={18} />
          </button>
          {confirmInactive ? (
            <>
              <span className="modal-icon warning-icon">
                <AlertTriangle size={23} />
              </span>
              <h3>Mark part inactive?</h3>
              <p>
                {selected.name} will be hidden from normal stock selection. Existing history will be
                retained.
              </p>
              <div className="modal-actions">
                <button onClick={() => setConfirmInactive(false)}>Cancel</button>
                <button className="danger-confirm" onClick={markInactive}>
                  Mark Inactive
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={submitStock}>
              <span className="modal-icon">
                <PackagePlus size={23} />
              </span>
              <h3>
                {dialog === "purchase"
                  ? "Record Purchase"
                  : dialog === "adjustment"
                    ? "Stock Adjustment"
                    : "Add Stock"}
              </h3>
              <p className="stock-modal-part">
                {selected.name} · {selected.code}
              </p>
              <div className="stock-modal-grid">
                <Field label="Condition" required>
                  <Select
                    value={stockCondition}
                    onChange={(e) => setStockCondition(e.target.value as Condition)}
                  >
                    <option>New</option>
                    <option>Reconditioned</option>
                  </Select>
                </Field>
                {dialog === "adjustment" && (
                  <Field label="Direction" required>
                    <Select
                      value={adjustmentDirection}
                      onChange={(e) => setAdjustmentDirection(e.target.value as "Add" | "Remove")}
                    >
                      <option>Add</option>
                      <option>Remove</option>
                    </Select>
                  </Field>
                )}
                <Field label="Quantity" required>
                  <input
                    type="number"
                    min="1"
                    value={stockAmount}
                    onChange={(e) => setStockAmount(Math.max(1, Number(e.target.value)))}
                  />
                </Field>
                {dialog === "adjustment" && (
                  <Field label="Transaction Type" required>
                    <Select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                    >
                      <option>Adjustment</option>
                      <option>Repair Usage</option>
                      <option>Direct Sale</option>
                      <option>Customer Return</option>
                      <option>Supplier Return</option>
                    </Select>
                  </Field>
                )}
                <Field label="Reference" required>
                  <input
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="PO, job or invoice number"
                  />
                </Field>
              </div>
              <div className="stock-preview">
                <span>Current {stockCondition.toLowerCase()} stock</span>
                <b>{stockCondition === "New" ? selected.newQty : selected.reconQty} units</b>
                <ArrowUp size={15} />
                <span>New balance</span>
                <strong>
                  {Math.max(
                    0,
                    (stockCondition === "New" ? selected.newQty : selected.reconQty) +
                      (dialog === "adjustment" && adjustmentDirection === "Remove"
                        ? -stockAmount
                        : stockAmount),
                  )}{" "}
                  units
                </strong>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setDialog(null)}>
                  Cancel
                </button>
                <button type="submit">Confirm Update</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="dashboard repair-page inventory-page">
      <div className="repair-header inventory-header">
        <div>
          <h2>Spare Parts Inventory</h2>
          <p>Track availability, pricing and stock movement for every spare part.</p>
        </div>
        <div>
          <button onClick={() => openStockDialog("adjustment")}>
            <Settings2 size={15} /> Stock Adjustment
          </button>
          <button onClick={() => openStockDialog("purchase")}>
            <ShoppingCart size={15} /> Record Purchase
          </button>
          <button className="new-job-button" onClick={() => setMode("create")}>
            <Plus size={16} /> Add New Part
          </button>
        </div>
      </div>
      <section className="inventory-summary">
        {[
          {
            label: "Total Parts",
            value: parts.length,
            note: "Active catalogue items",
            icon: Boxes,
            tone: "blue",
          },
          {
            label: "Total Stock",
            value: totalStock,
            note: "All available units",
            icon: PackageCheck,
            tone: "cyan",
          },
          {
            label: "New Parts",
            value: newStock,
            note: "Brand new units",
            icon: PackagePlus,
            tone: "green",
          },
          {
            label: "Reconditioned",
            value: reconStock,
            note: "Tested used units",
            icon: RotateCcw,
            tone: "violet",
          },
          {
            label: "Low Stock",
            value: lowParts.length,
            note: "Need reordering",
            icon: AlertTriangle,
            tone: "orange",
          },
          {
            label: "Out of Stock",
            value: outParts.length,
            note: "Unavailable items",
            icon: Minus,
            tone: "red",
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
      {!!(lowParts.length || outParts.length) && (
        <section className="low-stock-alert">
          <div className="alert-heading">
            <span>
              <AlertTriangle size={18} />
            </span>
            <div>
              <h3>Low-stock alerts</h3>
              <p>
                {lowParts.length + outParts.length} parts need attention. Reorder before upcoming
                repair work.
              </p>
            </div>
          </div>
          <div className="alert-items">
            {[...outParts, ...lowParts].slice(0, 3).map((part) => (
              <div key={part.code}>
                <span className="alert-part-icon">
                  <Package size={17} />
                </span>
                <div>
                  <b>{part.name}</b>
                  <small>
                    {part.code} · {part.supplier}
                  </small>
                </div>
                <span>
                  <b>{part.newQty + part.reconQty}</b>
                  <small>in stock</small>
                </span>
                <span>
                  <b>{Math.max(part.minimum * 2 - (part.newQty + part.reconQty), part.minimum)}</b>
                  <small>reorder</small>
                </span>
                <button onClick={() => openStockDialog("purchase", part)}>Order stock</button>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="panel inventory-panel">
        <div className="inventory-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part name or code..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} />
              </button>
            )}
          </label>
          {[
            [
              "Category",
              category,
              setCategory,
              ["All Categories", ...Array.from(new Set(parts.map((p) => p.category)))],
            ],
            [
              "Brand",
              brand,
              setBrand,
              ["All Brands", ...Array.from(new Set(parts.map((p) => p.brand)))],
            ],
            ["Condition", condition, setCondition, ["All Conditions", "New", "Reconditioned"]],
            [
              "Supplier",
              supplier,
              setSupplier,
              ["All Suppliers", ...Array.from(new Set(parts.map((p) => p.supplier)))],
            ],
            [
              "Stock Status",
              stockStatus,
              setStockStatus,
              ["All Stock", "In Stock", "Low Stock", "Out of Stock"],
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
          <button className="filter-button" onClick={resetFilters} title="Reset filters">
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>Parts Catalogue</h3>
            <p>
              Showing {filteredParts.length} of {parts.length} spare parts
            </p>
          </div>
          <button onClick={() => notify("Inventory list exported")}>
            <ArrowDown size={14} /> Export
          </button>
        </div>
        <div className="table-scroll">
          <table className="repair-table inventory-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Part Code</th>
                <th>Part Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Vehicle Compatibility</th>
                <th>Condition & Quantity</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Min.</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((part) => {
                const total = part.newQty + part.reconQty;
                return (
                  <tr key={part.code}>
                    <td>
                      <span
                        className="part-thumbnail"
                        style={{ background: `${part.color}12`, color: part.color }}
                      >
                        <Package size={20} />
                      </span>
                    </td>
                    <td>
                      <button className="inventory-code" onClick={() => openMode("details", part)}>
                        {part.code}
                      </button>
                    </td>
                    <td>
                      <b>{part.name}</b>
                      <small>{part.description.slice(0, 38)}…</small>
                    </td>
                    <td>{part.category}</td>
                    <td>
                      <b>{part.brand}</b>
                    </td>
                    <td>
                      <b>{part.vehicle}</b>
                      <small>{part.model}</small>
                    </td>
                    <td>
                      <div className="split-stock">
                        <span>
                          <ConditionBadge condition="New" />
                          <b>{part.newQty}</b>
                        </span>
                        <span>
                          <ConditionBadge condition="Reconditioned" />
                          <b>{part.reconQty}</b>
                        </span>
                      </div>
                    </td>
                    <td>{formatLkr(part.purchase)}</td>
                    <td>
                      <b>{formatLkr(part.selling)}</b>
                    </td>
                    <td>{part.minimum}</td>
                    <td>
                      <StockBadge total={total} minimum={part.minimum} active={part.active} />
                    </td>
                    <td className="action-cell">
                      <button
                        className="row-menu"
                        onClick={() => setActionCode(actionCode === part.code ? null : part.code)}
                      >
                        <MoreHorizontal size={17} />
                      </button>
                      {actionCode === part.code && (
                        <div className="job-actions-menu inventory-actions">
                          <button onClick={() => openMode("details", part)}>
                            <Eye size={14} /> View Details
                          </button>
                          <button onClick={() => notify(`Editing ${part.code}`)}>
                            <Edit3 size={14} /> Edit Part
                          </button>
                          <button onClick={() => openStockDialog("add", part)}>
                            <PackagePlus size={14} /> Add Stock
                          </button>
                          <button onClick={() => openStockDialog("purchase", part)}>
                            <ShoppingCart size={14} /> Record Purchase
                          </button>
                          <button onClick={() => openStockDialog("adjustment", part)}>
                            <Settings2 size={14} /> Stock Adjustment
                          </button>
                          <button onClick={() => openMode("history", part)}>
                            <FileClock size={14} /> View History
                          </button>
                          <button
                            className="danger"
                            onClick={() => {
                              setSelectedCode(part.code);
                              setConfirmInactive(true);
                            }}
                          >
                            <X size={14} /> Mark Inactive
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!filteredParts.length && (
                <tr>
                  <td colSpan={12} className="no-jobs">
                    <Boxes size={24} />
                    <b>No parts found</b>
                    <span>Try clearing or changing the inventory filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filteredParts.length} of {filteredParts.length} parts
          </span>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button disabled>›</button>
          </div>
        </div>
      </section>
      {renderDialogs()}
    </main>
  );
}
