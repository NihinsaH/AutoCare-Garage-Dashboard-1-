import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  Car,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileChartColumn,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PackagePlus,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  User,
  UserPlus,
  Users,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
import RepairJobs from "./RepairJobs";
import Inventory from "./Inventory";
import SalesInvoices from "./SalesInvoices";
import Customers from "./Customers";
import Vehicles from "./Vehicles";
import Estimates from "./Estimates";
import Suppliers from "./Suppliers";
import Purchases from "./Purchases";
import Payments from "./Payments";
import Expenses from "./Expenses";
import Reports from "./Reports";
import UserManagement from "./UserManagement";
import SettingsPage from "./SettingsPage";

type Icon = typeof LayoutDashboard;

const navItems: { label: string; icon: Icon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Customers", icon: Users },
  { label: "Vehicles", icon: Car },
  { label: "Repair Jobs", icon: Wrench },
  { label: "Estimates", icon: FileText },
  { label: "Inventory", icon: Boxes },
  { label: "Suppliers", icon: Truck },
  { label: "Purchases", icon: ShoppingCart },
  { label: "Sales & Invoices", icon: ReceiptText },
  { label: "Payments", icon: CreditCard },
  { label: "Expenses", icon: WalletCards },
  { label: "Reports", icon: FileChartColumn },
  { label: "Users", icon: User },
  { label: "Settings", icon: Settings },
];

const summaryCards = [
  {
    label: "Today's Revenue",
    value: "LKR 85,000",
    note: "12.5% from yesterday",
    trend: "up",
    icon: CircleDollarSign,
    color: "blue",
  },
  {
    label: "Pending Payments",
    value: "LKR 125,000",
    note: "8 invoices pending",
    icon: CreditCard,
    color: "orange",
  },
  {
    label: "Active Jobs",
    value: "18",
    note: "5 due today",
    icon: Wrench,
    color: "violet",
  },
  {
    label: "Vehicles Received Today",
    value: "12",
    note: "3 more than yesterday",
    trend: "up",
    icon: Car,
    color: "cyan",
  },
  {
    label: "Low Stock Items",
    value: "8",
    note: "Requires attention",
    icon: AlertTriangle,
    color: "red",
  },
  {
    label: "Completed Jobs",
    value: "7",
    note: "2 awaiting delivery",
    icon: ClipboardCheck,
    color: "green",
  },
];

const statusItems = [
  { label: "Received", count: 5, color: "#3b82f6" },
  { label: "Inspection", count: 3, color: "#8b5cf6" },
  { label: "Waiting for Approval", count: 4, color: "#f59e0b" },
  { label: "In Progress", count: 8, color: "#2563eb" },
  { label: "Waiting for Parts", count: 3, color: "#ef4444" },
  { label: "Completed", count: 7, color: "#10b981" },
  { label: "Delivered", count: 12, color: "#64748b" },
  { label: "Cancelled", count: 1, color: "#94a3b8" },
];

const jobs = [
  {
    id: "JOB-1048",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    vehicle: "CAA-4587",
    type: "Toyota Prius",
    mechanic: "Kasun Silva",
    initials: "KS",
    status: "In Progress",
    cost: "LKR 42,500",
  },
  {
    id: "JOB-1047",
    customer: "Sachini Fernando",
    phone: "071 680 2240",
    vehicle: "WP CAB-9214",
    type: "Honda Vezel",
    mechanic: "Ruwan Jayasuriya",
    initials: "RJ",
    status: "Inspection",
    cost: "LKR 18,000",
  },
  {
    id: "JOB-1046",
    customer: "M. A. Traders",
    phone: "011 284 9022",
    vehicle: "WP NC-6732",
    type: "Isuzu Elf",
    mechanic: "Dinesh Kumara",
    initials: "DK",
    status: "Waiting for Parts",
    cost: "LKR 86,750",
  },
  {
    id: "JOB-1045",
    customer: "Tharindu Wijesinghe",
    phone: "076 445 1098",
    vehicle: "BGL-8031",
    type: "Suzuki Wagon R",
    mechanic: "Kasun Silva",
    initials: "KS",
    status: "Waiting for Approval",
    cost: "LKR 27,200",
  },
  {
    id: "JOB-1044",
    customer: "Fathima Rizna",
    phone: "075 330 8677",
    vehicle: "KX-1945",
    type: "Nissan X-Trail",
    mechanic: "Ajith Fernando",
    initials: "AF",
    status: "Completed",
    cost: "LKR 54,900",
  },
];

const lowStock = [
  { part: "Toyota Oil Filter", code: "TOF-041", condition: "New", quantity: 2, max: 15 },
  { part: "Brake Pad Set – Aqua", code: "BPA-102", condition: "New", quantity: 3, max: 12 },
  { part: "Vezel AC Compressor", code: "VAC-230", condition: "Reconditioned", quantity: 1, max: 5 },
  { part: "Wagon R Lower Arm", code: "WLA-089", condition: "Reconditioned", quantity: 2, max: 8 },
];

const transactions = [
  {
    invoice: "INV-2098",
    customer: "Fathima Rizna",
    date: "24 May 2024",
    amount: "LKR 54,900",
    status: "Paid",
  },
  {
    invoice: "INV-2097",
    customer: "Lanka Fresh Foods",
    date: "24 May 2024",
    amount: "LKR 32,500",
    status: "Partial",
  },
  {
    invoice: "INV-2096",
    customer: "Chamika Dias",
    date: "23 May 2024",
    amount: "LKR 21,800",
    status: "Paid",
  },
  {
    invoice: "INV-2095",
    customer: "S. M. Holdings",
    date: "23 May 2024",
    amount: "LKR 68,000",
    status: "Pending",
  },
];

const chartData = {
  Daily: {
    labels: ["18 May", "19 May", "20 May", "21 May", "22 May", "23 May", "24 May"],
    values: [42, 61, 48, 73, 62, 96, 85],
  },
  Weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
    values: [290, 380, 345, 470, 410, 525, 560],
  },
  Monthly: {
    labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
    values: [1100, 1250, 1190, 1380, 1510, 1420, 1680],
  },
};

const quickActions: { label: string; icon: Icon; primary?: boolean }[] = [
  { label: "New Repair Job", icon: Wrench, primary: true },
  { label: "Add Customer", icon: UserPlus },
  { label: "Add Vehicle", icon: Car },
  { label: "Create Estimate", icon: ClipboardList },
  { label: "Create Invoice", icon: ReceiptText },
  { label: "Record Payment", icon: CircleDollarSign },
  { label: "Add Part", icon: PackagePlus },
];

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Completed" || status === "Paid"
      ? "success"
      : status === "In Progress" || status === "Inspection"
        ? "info"
        : status === "Waiting for Parts" || status === "Pending"
          ? "danger"
          : "warning";
  return (
    <span className={`status-badge ${tone}`}>
      <span />
      {status}
    </span>
  );
}

function RevenueChart({ period }: { period: keyof typeof chartData }) {
  const { labels, values } = chartData[period];
  const max = Math.max(...values) * 1.15;
  const points = values.map((value, i) => {
    const x = 42 + (i * 648) / (values.length - 1);
    const y = 215 - (value / max) * 175;
    return [x, y];
  });
  const line = points.map(([x, y], i) => `${i ? "L" : "M"} ${x},${y}`).join(" ");
  const area = `${line} L 690,215 L 42,215 Z`;
  const scale = period === "Monthly" ? 500 : period === "Weekly" ? 150 : 25;

  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 720 260" role="img" aria-label={`${period} revenue chart`}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity=".23" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 40 + i * 43.75;
          const value = Math.round((max - (i * max) / 4) / scale) * scale;
          return (
            <g key={i}>
              <line x1="42" x2="690" y1={y} y2={y} stroke="#e7ebf2" strokeDasharray="4 5" />
              <text x="32" y={y + 4} textAnchor="end" className="axis-label">
                {value === 0 ? "0" : `${value}K`}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#chartFill)" />
        <path
          d={line}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="white" stroke="#2563eb" strokeWidth="3" />
            <text x={x} y="244" textAnchor="middle" className="axis-label">
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<keyof typeof chartData>("Daily");
  const [search, setSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [menu, setMenu] = useState<"notifications" | "profile" | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase();
    return jobs.filter((job) =>
      Object.values(job).some((value) => value.toLowerCase().includes(term)),
    );
  }, [search]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      notify("Dashboard data refreshed");
    }, 700);
  };

  const goTo = (label: string) => {
    setActivePage(label);
    setSidebarOpen(false);
    setMenu(null);
  };

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Wrench size={22} strokeWidth={2.4} />
          </div>
          <div>
            <strong>AutoCare</strong>
            <span>GARAGE</span>
          </div>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          <p>WORKSPACE</p>
          {navItems.map(({ label, icon: NavIcon }) => (
            <button
              key={label}
              className={activePage === label ? "active" : ""}
              onClick={() => goTo(label)}
            >
              <NavIcon size={18} />
              <span>{label}</span>
              {label === "Repair Jobs" && <em>18</em>}
              {activePage === label && <ChevronRight className="nav-arrow" size={15} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">DW</div>
          <div>
            <strong>Dinuka Wijeratne</strong>
            <span>Administrator</span>
          </div>
          <button aria-label="Log out" onClick={() => notify("You have been signed out")}>
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="page-heading">
            <h1>{activePage}</h1>
            <div>
              <span>AutoCare Garage</span>
              <ChevronRight size={13} />
              <b>{activePage}</b>
            </div>
          </div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={18} />
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search customers, vehicles, jobs..."
              />
              {globalSearch && (
                <button onClick={() => setGlobalSearch("")} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </label>
            <div className="menu-anchor">
              <button
                className="icon-button notification-button"
                onClick={() => setMenu(menu === "notifications" ? null : "notifications")}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span />
              </button>
              {menu === "notifications" && (
                <div className="dropdown notifications">
                  <div className="dropdown-title">
                    <strong>Notifications</strong>
                    <button onClick={() => notify("All notifications marked as read")}>
                      Mark all read
                    </button>
                  </div>
                  <button>
                    <span className="notif-icon warning">
                      <AlertTriangle size={17} />
                    </span>
                    <span>
                      <b>Low stock alert</b>
                      <small>Toyota Oil Filter is almost out</small>
                    </span>
                  </button>
                  <button>
                    <span className="notif-icon success">
                      <ClipboardCheck size={17} />
                    </span>
                    <span>
                      <b>Repair completed</b>
                      <small>JOB-1044 is ready for delivery</small>
                    </span>
                  </button>
                  <button>
                    <span className="notif-icon info">
                      <CircleDollarSign size={17} />
                    </span>
                    <span>
                      <b>Payment received</b>
                      <small>LKR 54,900 from Fathima Rizna</small>
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div className="menu-anchor">
              <button
                className="profile-button"
                onClick={() => setMenu(menu === "profile" ? null : "profile")}
              >
                <span className="avatar">DW</span>
                <span className="profile-copy">
                  <b>Dinuka W.</b>
                  <small>Administrator</small>
                </span>
                <ChevronDown size={15} />
              </button>
              {menu === "profile" && (
                <div className="dropdown profile-menu">
                  <button onClick={() => goTo("Users")}>
                    <User size={16} /> My Profile
                  </button>
                  <button onClick={() => goTo("Settings")}>
                    <Settings size={16} /> Settings
                  </button>
                  <button onClick={() => notify("You have been signed out")}>
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {activePage === "Dashboard" ? (
          <main className="dashboard">
            <section className="welcome-row">
              <div>
                <h2>Good morning, Dinuka</h2>
                <p>Here’s what’s happening at your garage today.</p>
              </div>
              <div className="welcome-actions">
                <span className="date-display">
                  <CalendarDays size={17} /> Friday, 24 May 2024
                </span>
                <label className="select-control">
                  <select
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value);
                      notify(`Showing ${e.target.value.toLowerCase()} data`);
                    }}
                  >
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                  <ChevronDown size={15} />
                </label>
                <button className="refresh-button" onClick={refresh}>
                  <RefreshCw size={17} className={refreshing ? "spin" : ""} /> Refresh
                </button>
              </div>
            </section>

            <section className="summary-grid">
              {summaryCards.map(({ label, value, note, icon: CardIcon, color, trend }) => (
                <article className="summary-card" key={label}>
                  <div className={`summary-icon ${color}`}>
                    <CardIcon size={21} />
                  </div>
                  <span className="summary-label">{label}</span>
                  <strong>{value}</strong>
                  <p className={trend === "up" ? "positive" : ""}>
                    {trend === "up" && <ArrowUpRight size={14} />}
                    {note}
                  </p>
                </article>
              ))}
            </section>

            <section className="top-grid">
              <article className="panel revenue-panel">
                <div className="panel-header">
                  <div>
                    <h3>Revenue Overview</h3>
                    <p>Revenue generated from repair jobs</p>
                  </div>
                  <div className="segmented">
                    {(Object.keys(chartData) as (keyof typeof chartData)[]).map((item) => (
                      <button
                        className={period === item ? "active" : ""}
                        key={item}
                        onClick={() => setPeriod(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="chart-summary">
                  <div>
                    <span>Total Revenue</span>
                    <strong>
                      {period === "Daily"
                        ? "LKR 467,000"
                        : period === "Weekly"
                          ? "LKR 2,980,000"
                          : "LKR 9,530,000"}
                    </strong>
                  </div>
                  <span>
                    <ArrowUpRight size={14} /> 8.4%
                  </span>
                </div>
                <RevenueChart period={period} />
              </article>

              <article className="panel status-panel">
                <div className="panel-header">
                  <div>
                    <h3>Repair Status Overview</h3>
                    <p>Current workflow distribution</p>
                  </div>
                  <button className="text-link" onClick={() => goTo("Repair Jobs")}>
                    View jobs <ChevronRight size={14} />
                  </button>
                </div>
                <div className="status-total">
                  <div className="donut">
                    <span>
                      <strong>43</strong>
                      <small>Total Jobs</small>
                    </span>
                  </div>
                  <div>
                    <b>18 active jobs</b>
                    <p>Currently being handled</p>
                  </div>
                </div>
                <div className="status-list">
                  {statusItems.map((item) => (
                    <div key={item.label}>
                      <span className="dot" style={{ background: item.color }} />
                      <span>{item.label}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="panel jobs-panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Repair Jobs</h3>
                  <p>Latest vehicle service and repair activity</p>
                </div>
                <div className="table-tools">
                  <label>
                    <Search size={16} />
                    <input
                      placeholder="Search jobs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                  <button className="primary-small" onClick={() => setModal("New Repair Job")}>
                    <Plus size={16} /> New Job
                  </button>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Vehicle Type</th>
                      <th>Mechanic</th>
                      <th>Status</th>
                      <th>Estimated Cost</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <button className="job-id" onClick={() => notify(`Opening ${job.id}`)}>
                            {job.id}
                          </button>
                        </td>
                        <td>
                          <b>{job.customer}</b>
                          <small>{job.phone}</small>
                        </td>
                        <td>
                          <b>{job.vehicle}</b>
                        </td>
                        <td>{job.type}</td>
                        <td>
                          <span className="mechanic">
                            <i>{job.initials}</i>
                            {job.mechanic}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={job.status} />
                        </td>
                        <td>
                          <b>{job.cost}</b>
                        </td>
                        <td>
                          <button
                            className="row-menu"
                            aria-label={`Actions for ${job.id}`}
                            onClick={() => notify(`Actions opened for ${job.id}`)}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!filteredJobs.length && (
                      <tr>
                        <td colSpan={8} className="empty-table">
                          No repair jobs match “{search}”
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span>Showing {filteredJobs.length} of 18 repair jobs</span>
                <button onClick={() => goTo("Repair Jobs")}>
                  View all repair jobs <ChevronRight size={14} />
                </button>
              </div>
            </section>

            <section className="bottom-grid">
              <article className="panel stock-panel">
                <div className="panel-header">
                  <div>
                    <h3>Low Stock Alerts</h3>
                    <p>Parts that need restocking</p>
                  </div>
                  <button className="text-link" onClick={() => goTo("Inventory")}>
                    Inventory <ChevronRight size={14} />
                  </button>
                </div>
                <div className="compact-list">
                  {lowStock.map((item) => (
                    <div className="stock-row" key={item.code}>
                      <span className="part-icon">
                        <Boxes size={17} />
                      </span>
                      <div className="part-copy">
                        <b>{item.part}</b>
                        <small>
                          {item.code} · <em>{item.condition}</em>
                        </small>
                      </div>
                      <div className="quantity">
                        <b>{item.quantity}</b>
                        <small>available</small>
                      </div>
                      <div className="stock-bar">
                        <span>
                          <i style={{ width: `${(item.quantity / item.max) * 100}%` }} />
                        </span>
                        <small>Critical</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel transaction-panel">
                <div className="panel-header">
                  <div>
                    <h3>Recent Transactions</h3>
                    <p>Latest invoice payments</p>
                  </div>
                  <button className="text-link" onClick={() => goTo("Payments")}>
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                <div className="compact-list">
                  {transactions.map((item) => (
                    <div className="transaction-row" key={item.invoice}>
                      <span className={`transaction-icon ${item.status === "Paid" ? "paid" : ""}`}>
                        {item.status === "Paid" ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </span>
                      <div>
                        <b>{item.customer}</b>
                        <small>
                          {item.invoice} · {item.date}
                        </small>
                      </div>
                      <div className="transaction-amount">
                        <b>{item.amount}</b>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="quick-section">
              <div className="section-title">
                <div>
                  <h3>Quick Actions</h3>
                  <p>Common tasks and shortcuts</p>
                </div>
              </div>
              <div className="quick-grid">
                {quickActions.map(({ label, icon: ActionIcon, primary }) => (
                  <button
                    className={primary ? "primary" : ""}
                    key={label}
                    onClick={() => setModal(label)}
                  >
                    <span>
                      <ActionIcon size={20} />
                    </span>
                    {label}
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
            </section>
            <footer>
              © 2024 AutoCare Garage · Colombo, Sri Lanka{" "}
              <span>
                System status: <b>All systems operational</b>
              </span>
            </footer>
          </main>
        ) : activePage === "Repair Jobs" ? (
          <RepairJobs notify={notify} />
        ) : activePage === "Customers" ? (
          <Customers notify={notify} />
        ) : activePage === "Vehicles" ? (
          <Vehicles notify={notify} />
        ) : activePage === "Estimates" ? (
          <Estimates notify={notify} />
        ) : activePage === "Inventory" ? (
          <Inventory notify={notify} />
        ) : activePage === "Suppliers" ? (
          <Suppliers notify={notify} />
        ) : activePage === "Purchases" ? (
          <Purchases notify={notify} />
        ) : activePage === "Sales & Invoices" ? (
          <SalesInvoices notify={notify} />
        ) : activePage === "Payments" ? (
          <Payments notify={notify} />
        ) : activePage === "Expenses" ? (
          <Expenses notify={notify} />
        ) : activePage === "Reports" ? (
          <Reports notify={notify} />
        ) : activePage === "Users" ? (
          <UserManagement notify={notify} />
        ) : activePage === "Settings" ? (
          <SettingsPage notify={notify} />
        ) : (
          <main className="dashboard page-placeholder">
            <div className="placeholder-card">
              <span>
                <Store size={28} />
              </span>
              <h2>{activePage}</h2>
              <p>
                Manage your garage’s {activePage.toLowerCase()} from this workspace. This page uses
                the same AutoCare design system and navigation.
              </p>
              <button onClick={() => setActivePage("Dashboard")}>
                <LayoutDashboard size={17} /> Return to Dashboard
              </button>
            </div>
          </main>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Close">
              <X size={19} />
            </button>
            <span className="modal-icon">
              <Gauge size={23} />
            </span>
            <h3 id="modal-title">{modal}</h3>
            <p>
              Start a new {modal.toLowerCase()} workflow. The full form will open in the relevant
              workspace.
            </p>
            <div className="modal-actions">
              <button onClick={() => setModal(null)}>Cancel</button>
              <button
                onClick={() => {
                  const action = modal;
                  setModal(null);
                  notify(`${action} workflow started`);
                }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="toast">
          <ClipboardCheck size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
