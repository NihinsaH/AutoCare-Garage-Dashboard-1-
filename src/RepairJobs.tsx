import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  FilePlus2,
  FileText,
  Filter,
  ImagePlus,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Printer,
  Save,
  Search,
  Settings2,
  User,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

type RepairJobsProps = {
  notify: (message: string) => void;
};

type PageMode = "list" | "create" | "details";

const repairJobs = [
  {
    id: "JOB-1048",
    date: "24 May 2024",
    customer: "Nimal Perera",
    phone: "077 234 8891",
    reg: "CAA-4587",
    type: "Car",
    model: "Toyota Prius",
    mechanic: "Kasun Silva",
    initials: "KS",
    priority: "High",
    status: "In Progress",
    cost: "LKR 42,500",
  },
  {
    id: "JOB-1047",
    date: "24 May 2024",
    customer: "Sachini Fernando",
    phone: "071 680 2240",
    reg: "WP CAB-9214",
    type: "Car",
    model: "Honda Vezel",
    mechanic: "Ruwan Jayasuriya",
    initials: "RJ",
    priority: "Medium",
    status: "Inspection",
    cost: "LKR 18,000",
  },
  {
    id: "JOB-1046",
    date: "23 May 2024",
    customer: "M. A. Traders",
    phone: "011 284 9022",
    reg: "WP NC-6732",
    type: "Lorry",
    model: "Isuzu Elf",
    mechanic: "Dinesh Kumara",
    initials: "DK",
    priority: "Urgent",
    status: "Waiting for Parts",
    cost: "LKR 86,750",
  },
  {
    id: "JOB-1045",
    date: "23 May 2024",
    customer: "Tharindu Wijesinghe",
    phone: "076 445 1098",
    reg: "BGL-8031",
    type: "Car",
    model: "Suzuki Wagon R",
    mechanic: "Kasun Silva",
    initials: "KS",
    priority: "Low",
    status: "Waiting for Approval",
    cost: "LKR 27,200",
  },
  {
    id: "JOB-1044",
    date: "22 May 2024",
    customer: "Fathima Rizna",
    phone: "075 330 8677",
    reg: "KX-1945",
    type: "Car",
    model: "Nissan X-Trail",
    mechanic: "Ajith Fernando",
    initials: "AF",
    priority: "Medium",
    status: "Completed",
    cost: "LKR 54,900",
  },
  {
    id: "JOB-1043",
    date: "22 May 2024",
    customer: "Chamika Dias",
    phone: "077 819 4432",
    reg: "BIK-7721",
    type: "Motorbike",
    model: "Yamaha FZ-S",
    mechanic: "Ruwan Jayasuriya",
    initials: "RJ",
    priority: "Low",
    status: "Received",
    cost: "LKR 12,400",
  },
  {
    id: "JOB-1042",
    date: "21 May 2024",
    customer: "Lanka Fresh Foods",
    phone: "011 278 4055",
    reg: "WP PV-8804",
    type: "Van",
    model: "Toyota Hiace",
    mechanic: "Dinesh Kumara",
    initials: "DK",
    priority: "High",
    status: "Quality Check",
    cost: "LKR 63,800",
  },
  {
    id: "JOB-1041",
    date: "20 May 2024",
    customer: "Suresh Raj",
    phone: "072 442 9001",
    reg: "QY-3058",
    type: "Three-Wheeler",
    model: "Bajaj RE",
    mechanic: "Ajith Fernando",
    initials: "AF",
    priority: "Medium",
    status: "Delivered",
    cost: "LKR 16,750",
  },
];

const summary = [
  { label: "Total Jobs", value: "148", note: "This month", icon: ClipboardList, tone: "blue" },
  { label: "Active Jobs", value: "18", note: "5 due today", icon: Wrench, tone: "violet" },
  {
    label: "Waiting for Approval",
    value: "4",
    note: "LKR 112,400 pending",
    icon: Clock3,
    tone: "orange",
  },
  {
    label: "Completed Jobs",
    value: "37",
    note: "7 completed today",
    icon: ClipboardCheck,
    tone: "green",
  },
];

const timeline = [
  { label: "Received", meta: "24 May, 8:35 AM", done: true },
  { label: "Inspection", meta: "24 May, 9:20 AM", done: true },
  { label: "Estimate", meta: "24 May, 10:15 AM", done: true },
  { label: "Approval", meta: "24 May, 11:05 AM", done: true },
  { label: "In Progress", meta: "Started at 11:30 AM", done: true, active: true },
  { label: "Quality Check", meta: "Pending", done: false },
  { label: "Completed", meta: "Pending", done: false },
  { label: "Delivered", meta: "Pending", done: false },
];

function JobBadge({ status }: { status: string }) {
  const tone =
    status === "Completed" || status === "Delivered"
      ? "success"
      : status === "In Progress" || status === "Inspection" || status === "Quality Check"
        ? "info"
        : status === "Waiting for Parts"
          ? "danger"
          : status === "Waiting for Approval"
            ? "warning"
            : "neutral";
  return (
    <span className={`job-status ${tone}`}>
      <span />
      {status}
    </span>
  );
}

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

function SelectBox({
  defaultValue,
  children,
}: {
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="job-select-wrap">
      <select defaultValue={defaultValue}>{children}</select>
      <ChevronDown size={14} />
    </span>
  );
}

export default function RepairJobs({ notify }: RepairJobsProps) {
  const [mode, setMode] = useState<PageMode>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [vehicleType, setVehicleType] = useState("All Vehicles");
  const [mechanic, setMechanic] = useState("All Mechanics");
  const [date, setDate] = useState("This Month");
  const [page, setPage] = useState(1);
  const [actionJob, setActionJob] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState(repairJobs[0]);
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [vehicleMode, setVehicleMode] = useState<"existing" | "new">("existing");
  const [attachments, setAttachments] = useState<string[]>([]);

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase();
    return repairJobs.filter((job) => {
      const matchesSearch = [job.id, job.customer, job.reg].some((item) =>
        item.toLowerCase().includes(term),
      );
      const matchesStatus = status === "All Statuses" || job.status === status;
      const matchesVehicle = vehicleType === "All Vehicles" || job.type === vehicleType;
      const matchesMechanic = mechanic === "All Mechanics" || job.mechanic === mechanic;
      return matchesSearch && matchesStatus && matchesVehicle && matchesMechanic;
    });
  }, [search, status, vehicleType, mechanic]);

  const openDetails = (job = repairJobs[0]) => {
    setSelectedJob(job);
    setActionJob(null);
    setMode("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openForm = () => {
    setActionJob(null);
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (event: FormEvent, draft = false) => {
    event.preventDefault();
    notify(draft ? "Repair job saved as draft" : "JOB-1049 created successfully");
    setMode("list");
  };

  if (mode === "create") {
    return (
      <main className="dashboard repair-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Repair Jobs / New Job</span>
            <h2>Create New Repair Job</h2>
            <p>Register the vehicle and capture all service requirements.</p>
          </div>
          <span className="draft-indicator">Draft · Auto-saved just now</span>
        </div>

        <form className="job-form" onSubmit={(event) => handleSubmit(event)}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Users size={19} />
              </span>
              <div>
                <h3>Customer Information</h3>
                <p>Select an existing customer or register a new customer.</p>
              </div>
            </div>
            <div className="mode-tabs">
              <button
                type="button"
                className={customerMode === "existing" ? "active" : ""}
                onClick={() => setCustomerMode("existing")}
              >
                Existing Customer
              </button>
              <button
                type="button"
                className={customerMode === "new" ? "active" : ""}
                onClick={() => setCustomerMode("new")}
              >
                Register New Customer
              </button>
            </div>
            <div className="form-grid">
              {customerMode === "existing" && (
                <Field label="Select Customer" required wide>
                  <SelectBox defaultValue="Nimal Perera">
                    <option>Nimal Perera — 077 234 8891</option>
                    <option>Sachini Fernando — 071 680 2240</option>
                    <option>Fathima Rizna — 075 330 8677</option>
                  </SelectBox>
                </Field>
              )}
              <Field label="Customer Name" required>
                <input
                  required
                  defaultValue={customerMode === "existing" ? "Nimal Perera" : ""}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Phone Number" required>
                <input
                  required
                  defaultValue={customerMode === "existing" ? "077 234 8891" : ""}
                  placeholder="07X XXX XXXX"
                />
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  defaultValue={customerMode === "existing" ? "nimal.perera@gmail.com" : ""}
                  placeholder="customer@email.com"
                />
              </Field>
              <Field label="Address" wide>
                <input
                  defaultValue={customerMode === "existing" ? "42/6, Temple Road, Nugegoda" : ""}
                  placeholder="Street, city and district"
                />
              </Field>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Car size={19} />
              </span>
              <div>
                <h3>Vehicle Information</h3>
                <p>Select a registered vehicle or add a new one.</p>
              </div>
            </div>
            <div className="mode-tabs">
              <button
                type="button"
                className={vehicleMode === "existing" ? "active" : ""}
                onClick={() => setVehicleMode("existing")}
              >
                Existing Vehicle
              </button>
              <button
                type="button"
                className={vehicleMode === "new" ? "active" : ""}
                onClick={() => setVehicleMode("new")}
              >
                Register New Vehicle
              </button>
            </div>
            <div className="form-grid form-grid-3">
              {vehicleMode === "existing" && (
                <Field label="Select Vehicle" required wide>
                  <SelectBox defaultValue="CAA-4587">
                    <option value="CAA-4587">CAA-4587 — Toyota Prius 2015</option>
                    <option value="WP KR-7741">WP KR-7741 — Suzuki Alto 2018</option>
                  </SelectBox>
                </Field>
              )}
              <Field label="Registration Number" required>
                <input
                  required
                  defaultValue={vehicleMode === "existing" ? "CAA-4587" : ""}
                  placeholder="e.g. CAA-4587"
                />
              </Field>
              <Field label="Vehicle Type" required>
                <SelectBox defaultValue="Car">
                  <option>Motorbike</option>
                  <option>Three-Wheeler</option>
                  <option>Car</option>
                  <option>Van</option>
                  <option>Lorry</option>
                  <option>Other</option>
                </SelectBox>
              </Field>
              <Field label="Brand" required>
                <input
                  required
                  defaultValue={vehicleMode === "existing" ? "Toyota" : ""}
                  placeholder="e.g. Toyota"
                />
              </Field>
              <Field label="Model" required>
                <input
                  required
                  defaultValue={vehicleMode === "existing" ? "Prius" : ""}
                  placeholder="e.g. Prius"
                />
              </Field>
              <Field label="Current Mileage">
                <div className="input-suffix">
                  <input type="number" defaultValue="128450" />
                  <span>km</span>
                </div>
              </Field>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-title">
              <span>
                <Wrench size={19} />
              </span>
              <div>
                <h3>Repair Details</h3>
                <p>Record the complaint, inspection details and job schedule.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Job ID">
                <input value="JOB-1049" disabled />
              </Field>
              <Field label="Received Date" required>
                <input required type="datetime-local" defaultValue="2024-05-24T14:30" />
              </Field>
              <Field label="Expected Completion" required>
                <input required type="date" defaultValue="2024-05-27" />
              </Field>
              <Field label="Priority" required>
                <SelectBox defaultValue="Medium">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </SelectBox>
              </Field>
              <Field label="Assign Mechanic">
                <SelectBox defaultValue="Kasun Silva">
                  <option>Kasun Silva</option>
                  <option>Ruwan Jayasuriya</option>
                  <option>Dinesh Kumara</option>
                  <option>Ajith Fernando</option>
                </SelectBox>
              </Field>
              <Field label="Required Services">
                <SelectBox defaultValue="General Repair">
                  <option>General Repair</option>
                  <option>Full Service</option>
                  <option>Engine Repair</option>
                  <option>Electrical Repair</option>
                  <option>Body Repair</option>
                </SelectBox>
              </Field>
              <Field label="Customer Complaint" required wide>
                <textarea
                  required
                  defaultValue="Engine warning light is on. Customer reports reduced power and unusual vibration when accelerating."
                />
              </Field>
              <Field label="Initial Inspection Notes" wide>
                <textarea placeholder="Record visible issues, diagnostic findings and condition at receipt..." />
              </Field>
              <Field label="Additional Notes" wide>
                <textarea placeholder="Add internal notes or special customer requests..." />
              </Field>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-title">
              <span>
                <ImagePlus size={19} />
              </span>
              <div>
                <h3>Vehicle Images & Attachments</h3>
                <p>Upload inspection photos, documents or diagnostic reports.</p>
              </div>
            </div>
            <label className="upload-zone">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(event) =>
                  setAttachments(Array.from(event.target.files ?? []).map((file) => file.name))
                }
              />
              <span>
                <ImagePlus size={23} />
              </span>
              <b>Drop files here or click to browse</b>
              <small>PNG, JPG or PDF up to 10 MB each</small>
            </label>
            {!!attachments.length && (
              <div className="attachment-list">
                {attachments.map((file) => (
                  <span key={file}>
                    <FileText size={14} />
                    {file}
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((items) => items.filter((item) => item !== file))
                      }
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="form-actions">
            <button type="button" onClick={() => setMode("list")}>
              Cancel
            </button>
            <button
              type="button"
              onClick={(event) => handleSubmit(event as unknown as FormEvent, true)}
            >
              <Save size={16} /> Save Draft
            </button>
            <button type="submit" className="primary-action">
              <Plus size={16} /> Create Job
            </button>
          </div>
        </form>
      </main>
    );
  }

  if (mode === "details") {
    return (
      <main className="dashboard repair-page">
        <div className="repair-subheader detail-header">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Repair Jobs / {selectedJob.id}</span>
            <h2>
              {selectedJob.id} <JobBadge status={selectedJob.status} />
            </h2>
            <p>Created on {selectedJob.date} at 8:35 AM by Dinuka Wijeratne</p>
          </div>
          <div className="detail-actions">
            <button onClick={() => notify("Job card sent to printer")}>
              <Printer size={15} /> Print Job Card
            </button>
            <button className="primary-action" onClick={openForm}>
              <Edit3 size={15} /> Edit Job
            </button>
          </div>
        </div>

        <section className="detail-layout">
          <div className="detail-main">
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Repair Progress</h3>
                <p>Current stage and job history</p>
              </div>
              <div className="repair-timeline">
                {timeline.map((item, index) => (
                  <div
                    className={`${item.done ? "done" : ""} ${item.active ? "active" : ""}`}
                    key={item.label}
                  >
                    <span>{item.done ? <Check size={14} /> : index + 1}</span>
                    <b>{item.label}</b>
                    <small>{item.meta}</small>
                  </div>
                ))}
              </div>
            </article>

            <div className="detail-info-grid">
              <article className="detail-card info-card">
                <div className="detail-card-title">
                  <h3>Customer Information</h3>
                  <button onClick={() => notify("Customer profile opened")}>View profile</button>
                </div>
                <div className="person-heading">
                  <span>NP</span>
                  <div>
                    <b>{selectedJob.customer}</b>
                    <small>Customer since January 2021</small>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>
                      <Phone size={14} /> Phone
                    </dt>
                    <dd>{selectedJob.phone}</dd>
                  </div>
                  <div>
                    <dt>
                      <Mail size={14} /> Email
                    </dt>
                    <dd>nimal.perera@gmail.com</dd>
                  </div>
                  <div>
                    <dt>
                      <MapPin size={14} /> Address
                    </dt>
                    <dd>42/6, Temple Road, Nugegoda</dd>
                  </div>
                </dl>
              </article>
              <article className="detail-card info-card">
                <div className="detail-card-title">
                  <h3>Vehicle Information</h3>
                  <button onClick={() => notify("Vehicle history opened")}>Vehicle history</button>
                </div>
                <div className="vehicle-heading">
                  <span>
                    <Car size={22} />
                  </span>
                  <div>
                    <b>{selectedJob.model}</b>
                    <small>{selectedJob.reg}</small>
                  </div>
                </div>
                <dl className="vehicle-specs">
                  <div>
                    <dt>Type</dt>
                    <dd>{selectedJob.type}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>2015</dd>
                  </div>
                  <div>
                    <dt>Colour</dt>
                    <dd>Pearl White</dd>
                  </div>
                  <div>
                    <dt>Mileage</dt>
                    <dd>128,450 km</dd>
                  </div>
                </dl>
              </article>
            </div>

            <article className="detail-card complaint-card">
              <div className="detail-card-title">
                <h3>Complaint & Inspection</h3>
              </div>
              <div>
                <span>Customer Complaint</span>
                <p>
                  Engine warning light is on. Customer reports reduced power and unusual vibration
                  when accelerating, particularly above 60 km/h.
                </p>
              </div>
              <div>
                <span>Inspection Findings</span>
                <p>
                  Diagnostic scan indicates ignition misfire on cylinder 3. Spark plugs show
                  excessive wear. Engine oil level is below the recommended minimum and the air
                  filter requires replacement.
                </p>
              </div>
              <div>
                <span>Additional Notes</span>
                <p>
                  Customer requested a call before any additional work exceeding LKR 5,000 is
                  performed.
                </p>
              </div>
            </article>

            <article className="detail-card services-card">
              <div className="detail-card-title">
                <div>
                  <h3>Services & Parts</h3>
                  <p>Labour and inventory allocated to this job</p>
                </div>
                <button onClick={() => notify("Add service panel opened")}>
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Item / Service</th>
                    <th>Type</th>
                    <th>Qty.</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Engine diagnostic & tune-up</b>
                      <small>SRV-ENG-04</small>
                    </td>
                    <td>
                      <span className="item-type service">Service</span>
                    </td>
                    <td>1</td>
                    <td>LKR 8,500</td>
                    <td>
                      <b>LKR 8,500</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>NGK Iridium Spark Plug</b>
                      <small>NGK-IFR5T11</small>
                    </td>
                    <td>
                      <span className="item-type part">Part</span>
                    </td>
                    <td>4</td>
                    <td>LKR 4,250</td>
                    <td>
                      <b>LKR 17,000</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Toyota Genuine Engine Oil 5W-30</b>
                      <small>TGO-5W30-4L</small>
                    </td>
                    <td>
                      <span className="item-type part">Part</span>
                    </td>
                    <td>1</td>
                    <td>LKR 12,500</td>
                    <td>
                      <b>LKR 12,500</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Engine oil & filter replacement</b>
                      <small>SRV-OIL-01</small>
                    </td>
                    <td>
                      <span className="item-type service">Service</span>
                    </td>
                    <td>1</td>
                    <td>LKR 4,500</td>
                    <td>
                      <b>LKR 4,500</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>

          <aside className="detail-aside">
            <article className="detail-card assignment-card">
              <div className="detail-card-title">
                <h3>Assigned Mechanic</h3>
                <button onClick={() => notify("Mechanic assignment opened")}>
                  <Edit3 size={14} />
                </button>
              </div>
              <div className="assigned-person">
                <span>{selectedJob.initials}</span>
                <div>
                  <b>{selectedJob.mechanic}</b>
                  <small>Senior Technician</small>
                </div>
                <i>Available</i>
              </div>
              <div className="job-meta">
                <div>
                  <span>Priority</span>
                  <b className="priority high">{selectedJob.priority}</b>
                </div>
                <div>
                  <span>Expected Completion</span>
                  <b>27 May 2024</b>
                </div>
                <div>
                  <span>Bay Assignment</span>
                  <b>Service Bay 03</b>
                </div>
              </div>
            </article>

            <article className="detail-card cost-card">
              <div className="detail-card-title">
                <h3>Cost Summary</h3>
              </div>
              <div>
                <span>Parts total</span>
                <b>LKR 29,500</b>
              </div>
              <div>
                <span>Labour total</span>
                <b>LKR 13,000</b>
              </div>
              <div>
                <span>Discount</span>
                <b>—</b>
              </div>
              <div>
                <span>Tax</span>
                <b>Included</b>
              </div>
              <div className="cost-total">
                <span>Estimated Total</span>
                <strong>LKR 42,500</strong>
              </div>
              <button onClick={() => notify("Estimate EST-0872 opened")}>
                <FileText size={15} /> View Estimate EST-0872
              </button>
            </article>

            <article className="detail-card activity-card">
              <div className="detail-card-title">
                <h3>Recent Activity</h3>
              </div>
              <div>
                <span>
                  <UserCheck size={14} />
                </span>
                <p>
                  <b>Job assigned to Kasun Silva</b>
                  <small>Today at 11:25 AM</small>
                </p>
              </div>
              <div>
                <span>
                  <ClipboardCheck size={14} />
                </span>
                <p>
                  <b>Estimate approved by customer</b>
                  <small>Today at 11:05 AM</small>
                </p>
              </div>
              <div>
                <span>
                  <FileText size={14} />
                </span>
                <p>
                  <b>Estimate EST-0872 created</b>
                  <small>Today at 10:15 AM</small>
                </p>
              </div>
            </article>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard repair-page">
      <section className="repair-header">
        <div>
          <h2>Repair Job Management</h2>
          <p>Track, assign and manage all vehicle repair jobs from one place.</p>
        </div>
        <button className="new-job-button" onClick={openForm}>
          <Plus size={17} /> New Repair Job
        </button>
      </section>

      <section className="repair-summary">
        {summary.map(({ label, value, note, icon: Icon, tone }) => (
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

      <section className="panel repair-table-panel">
        <div className="repair-filters">
          <label className="job-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Job ID, customer or vehicle registration..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All Statuses</option>
              <option>Received</option>
              <option>Inspection</option>
              <option>Waiting for Approval</option>
              <option>In Progress</option>
              <option>Waiting for Parts</option>
              <option>Quality Check</option>
              <option>Completed</option>
              <option>Delivered</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <label>
            <span>Vehicle Type</span>
            <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
              <option>All Vehicles</option>
              <option>Motorbike</option>
              <option>Three-Wheeler</option>
              <option>Car</option>
              <option>Van</option>
              <option>Lorry</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <label>
            <span>Mechanic</span>
            <select value={mechanic} onChange={(event) => setMechanic(event.target.value)}>
              <option>All Mechanics</option>
              <option>Kasun Silva</option>
              <option>Ruwan Jayasuriya</option>
              <option>Dinesh Kumara</option>
              <option>Ajith Fernando</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <label>
            <span>Date</span>
            <select value={date} onChange={(event) => setDate(event.target.value)}>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom Range</option>
            </select>
            <CalendarDays size={13} />
          </label>
          <button className="filter-button" onClick={() => notify("Advanced filters opened")}>
            <Filter size={16} />
          </button>
        </div>

        <div className="repair-table-heading">
          <div>
            <h3>All Repair Jobs</h3>
            <p>{filteredJobs.length} jobs found · Updated just now</p>
          </div>
          <button onClick={() => notify("Table settings opened")}>
            <Settings2 size={15} /> Columns
          </button>
        </div>
        <div className="table-scroll repair-table-scroll">
          <table className="repair-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" aria-label="Select all jobs" />
                </th>
                <th>Job ID / Date</th>
                <th>Customer / Phone</th>
                <th>Vehicle Registration</th>
                <th>Type / Model</th>
                <th>Assigned Mechanic</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Estimated Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <input type="checkbox" aria-label={`Select ${job.id}`} />
                  </td>
                  <td>
                    <button className="job-id" onClick={() => openDetails(job)}>
                      {job.id}
                    </button>
                    <small>{job.date}</small>
                  </td>
                  <td>
                    <b>{job.customer}</b>
                    <small>{job.phone}</small>
                  </td>
                  <td>
                    <span className="reg-plate">{job.reg}</span>
                  </td>
                  <td>
                    <b>{job.type}</b>
                    <small>{job.model}</small>
                  </td>
                  <td>
                    <span className="table-mechanic">
                      <i>{job.initials}</i>
                      <b>{job.mechanic}</b>
                    </span>
                  </td>
                  <td>
                    <span className={`priority ${job.priority.toLowerCase()}`}>{job.priority}</span>
                  </td>
                  <td>
                    <JobBadge status={job.status} />
                  </td>
                  <td>
                    <b>{job.cost}</b>
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setActionJob(actionJob === job.id ? null : job.id)}
                      aria-label={`Actions for ${job.id}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {actionJob === job.id && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(job)}>
                          <Eye size={14} /> View Job Details
                        </button>
                        <button onClick={openForm}>
                          <Edit3 size={14} /> Edit Job
                        </button>
                        <button
                          onClick={() => {
                            setActionJob(null);
                            notify(`Assign mechanic for ${job.id}`);
                          }}
                        >
                          <UserCheck size={14} /> Assign Mechanic
                        </button>
                        <button
                          onClick={() => {
                            setActionJob(null);
                            notify(`Update status for ${job.id}`);
                          }}
                        >
                          <Settings2 size={14} /> Update Status
                        </button>
                        <button
                          onClick={() => {
                            setActionJob(null);
                            notify(`Estimate created for ${job.id}`);
                          }}
                        >
                          <FilePlus2 size={14} /> Create Estimate
                        </button>
                        <button
                          onClick={() => {
                            setActionJob(null);
                            notify(`${job.id} sent to printer`);
                          }}
                        >
                          <Printer size={14} /> Print Job Card
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredJobs.length && (
                <tr>
                  <td className="no-jobs" colSpan={10}>
                    <Search size={22} />
                    <b>No repair jobs found</b>
                    <span>Try changing your search or filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filteredJobs.length} of {filteredJobs.length || 0} jobs
          </span>
          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((item) => (
              <button
                className={page === item ? "active" : ""}
                onClick={() => setPage(item)}
                key={item}
              >
                {item}
              </button>
            ))}
            <span>…</span>
            <button onClick={() => setPage(8)}>8</button>
            <button
              disabled={page === 8}
              onClick={() => setPage((value) => Math.min(8, value + 1))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
