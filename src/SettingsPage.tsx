import { FormEvent, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CloudDownload,
  CloudUpload,
  CreditCard,
  FileText,
  Globe2,
  ImagePlus,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  X,
} from "lucide-react";

type Section =
  | "Garage Profile"
  | "Invoice Settings"
  | "Business Settings"
  | "Inventory Settings"
  | "Security Settings"
  | "System Preferences";
type Config = {
  business: string;
  address: string;
  phone: string;
  email: string;
  registration: string;
  invoicePrefix: string;
  estimatePrefix: string;
  tax: string;
  discount: string;
  terms: string;
  footer: string;
  currency: string;
  language: string;
  dateFormat: string;
  timezone: string;
  lowStock: string;
  preventNegative: boolean;
  trackConditions: boolean;
  autoUpdate: boolean;
  session: string;
  twoFactor: boolean;
  loginAlerts: boolean;
  emailNotifications: boolean;
  stockAlerts: boolean;
  paymentAlerts: boolean;
  repairAlerts: boolean;
  dailySummary: boolean;
  autoBackup: boolean;
};
const defaults: Config = {
  business: "AutoCare Garage (Pvt) Ltd",
  address: "128, High Level Road, Nugegoda, Colombo, Sri Lanka",
  phone: "011 281 4500",
  email: "service@autocare.lk",
  registration: "PV 00218456",
  invoicePrefix: "INV",
  estimatePrefix: "EST",
  tax: "0",
  discount: "0",
  terms: "14 Days",
  footer: "Thank you for choosing AutoCare Garage. We appreciate your business.",
  currency: "LKR — Sri Lankan Rupee",
  language: "English",
  dateFormat: "DD MMM YYYY",
  timezone: "Asia/Colombo (GMT+5:30)",
  lowStock: "5",
  preventNegative: true,
  trackConditions: true,
  autoUpdate: true,
  session: "30 minutes",
  twoFactor: false,
  loginAlerts: true,
  emailNotifications: true,
  stockAlerts: true,
  paymentAlerts: true,
  repairAlerts: true,
  dailySummary: false,
  autoBackup: true,
};
const nav: [Section, typeof Building2, string][] = [
  ["Garage Profile", Building2, "Business identity and contact details"],
  ["Invoice Settings", ReceiptText, "Prefixes, tax and payment terms"],
  ["Business Settings", Globe2, "Currency, language and region"],
  ["Inventory Settings", Package, "Stock alerts and preferences"],
  ["Security Settings", ShieldCheck, "Password and login security"],
  ["System Preferences", SlidersHorizontal, "Notifications and backups"],
];
export default function SettingsPage({ notify }: { notify: (m: string) => void }) {
  const [section, setSection] = useState<Section>("Garage Profile"),
    [config, setConfig] = useState(defaults),
    [saved, setSaved] = useState(defaults),
    [confirmSave, setConfirmSave] = useState(false),
    [logo, setLogo] = useState(""),
    [currentPassword, setCurrentPassword] = useState(""),
    [newPassword, setNewPassword] = useState(""),
    [confirmPassword, setConfirmPassword] = useState(""),
    [passwordError, setPasswordError] = useState("");
  const update = <K extends keyof Config>(key: K, value: Config[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (section === "Security Settings" && newPassword) {
      if (!currentPassword) {
        setPasswordError("Current password is required");
        return;
      }
      if (newPassword.length < 8) {
        setPasswordError("New password must contain at least 8 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }
    }
    setConfirmSave(true);
  };
  const finishSave = () => {
    setSaved(config);
    setConfirmSave(false);
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    notify(`${section} saved successfully`);
  };
  const cancel = () => {
    setConfig(saved);
    setPasswordError("");
    notify("Unsaved settings were discarded");
  };
  const dirty = JSON.stringify(config) !== JSON.stringify(saved);
  return (
    <main className="dashboard repair-page settings-page">
      <div className="repair-header">
        <div>
          <h2>Settings</h2>
          <p>Configure garage information, billing, inventory, security and system preferences.</p>
        </div>
        <span className={`settings-saved-state ${dirty ? "unsaved" : ""}`}>
          {dirty ? <RefreshCw size={14} /> : <CheckCircle2 size={14} />}
          {dirty ? "Unsaved changes" : "All changes saved"}
        </span>
      </div>
      <div className="settings-layout">
        <aside className="settings-nav">
          <div>
            <Settings size={18} />
            <span>
              <b>System Settings</b>
              <small>AutoCare Garage</small>
            </span>
          </div>
          <nav>
            {nav.map(([name, Icon, desc]) => (
              <button
                className={section === name ? "active" : ""}
                onClick={() => setSection(name)}
                key={name}
              >
                <span>
                  <Icon size={17} />
                </span>
                <div>
                  <b>{name}</b>
                  <small>{desc}</small>
                </div>
                <ChevronRight size={14} />
              </button>
            ))}
          </nav>
        </aside>
        <form className="settings-content" onSubmit={save}>
          <header>
            <div>
              <h3>{section}</h3>
              <p>{nav.find((x) => x[0] === section)?.[2]}</p>
            </div>
          </header>
          {section === "Garage Profile" && (
            <>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <ImagePlus size={18} />
                  </span>
                  <div>
                    <h4>Garage Logo</h4>
                    <p>Used on invoices, estimates and printed reports.</p>
                  </div>
                </div>
                <div className="logo-upload">
                  <span>{logo ? <ImagePlus size={30} /> : <Building2 size={30} />}</span>
                  <div>
                    <b>{logo || "AutoCare Garage logo"}</b>
                    <small>PNG, JPG or SVG. Recommended 400 × 400 px.</small>
                    <label>
                      <Upload size={13} /> Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files?.[0]?.name ?? "")}
                      />
                    </label>
                    {logo && (
                      <button type="button" onClick={() => setLogo("")}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </section>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <Building2 size={18} />
                  </span>
                  <div>
                    <h4>Business Details</h4>
                    <p>Official garage identity and contact information.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <SettingField label="Business Name" icon={Building2}>
                    <input
                      required
                      value={config.business}
                      onChange={(e) => update("business", e.target.value)}
                    />
                  </SettingField>
                  <SettingField label="Business Registration No." icon={FileText}>
                    <input
                      required
                      value={config.registration}
                      onChange={(e) => update("registration", e.target.value)}
                    />
                  </SettingField>
                  <SettingField label="Phone Number" icon={Phone}>
                    <input
                      required
                      value={config.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </SettingField>
                  <SettingField label="Email Address" icon={Mail}>
                    <input
                      required
                      type="email"
                      value={config.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </SettingField>
                  <SettingField label="Business Address" icon={MapPin} wide>
                    <textarea
                      required
                      value={config.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </SettingField>
                </div>
              </section>
            </>
          )}
          {section === "Invoice Settings" && (
            <>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <ReceiptText size={18} />
                  </span>
                  <div>
                    <h4>Document Numbering</h4>
                    <p>Prefixes used for generated invoices and estimates.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <SettingField label="Invoice Prefix" icon={FileText}>
                    <input
                      required
                      maxLength={8}
                      value={config.invoicePrefix}
                      onChange={(e) => update("invoicePrefix", e.target.value.toUpperCase())}
                    />
                    <small>Next invoice: {config.invoicePrefix}-2101</small>
                  </SettingField>
                  <SettingField label="Estimate Prefix" icon={FileText}>
                    <input
                      required
                      maxLength={8}
                      value={config.estimatePrefix}
                      onChange={(e) => update("estimatePrefix", e.target.value.toUpperCase())}
                    />
                    <small>Next estimate: {config.estimatePrefix}-0543</small>
                  </SettingField>
                </div>
              </section>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <CreditCard size={18} />
                  </span>
                  <div>
                    <h4>Pricing & Terms</h4>
                    <p>Default values for new customer documents.</p>
                  </div>
                </div>
                <div className="settings-grid settings-grid-3">
                  <SettingField label="Tax Rate (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.tax}
                      onChange={(e) => update("tax", e.target.value)}
                    />
                  </SettingField>
                  <SettingField label="Default Discount (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.discount}
                      onChange={(e) => update("discount", e.target.value)}
                    />
                  </SettingField>
                  <SettingField label="Payment Terms">
                    <select value={config.terms} onChange={(e) => update("terms", e.target.value)}>
                      <option>Due on Receipt</option>
                      <option>7 Days</option>
                      <option>14 Days</option>
                      <option>30 Days</option>
                    </select>
                  </SettingField>
                  <SettingField label="Invoice Footer Notes" wide>
                    <textarea
                      value={config.footer}
                      onChange={(e) => update("footer", e.target.value)}
                    />
                  </SettingField>
                </div>
              </section>
            </>
          )}
          {section === "Business Settings" && (
            <section className="settings-section">
              <div className="settings-section-title">
                <span>
                  <Globe2 size={18} />
                </span>
                <div>
                  <h4>Regional Settings</h4>
                  <p>Currency, language, date and time preferences.</p>
                </div>
              </div>
              <div className="settings-grid">
                <SettingField label="Currency">
                  <select
                    value={config.currency}
                    onChange={(e) => update("currency", e.target.value)}
                  >
                    <option>LKR — Sri Lankan Rupee</option>
                  </select>
                </SettingField>
                <SettingField label="Language">
                  <select
                    value={config.language}
                    onChange={(e) => update("language", e.target.value)}
                  >
                    <option>English</option>
                  </select>
                </SettingField>
                <SettingField label="Date Format">
                  <select
                    value={config.dateFormat}
                    onChange={(e) => update("dateFormat", e.target.value)}
                  >
                    <option>DD MMM YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </SettingField>
                <SettingField label="Time Zone">
                  <select
                    value={config.timezone}
                    onChange={(e) => update("timezone", e.target.value)}
                  >
                    <option>Asia/Colombo (GMT+5:30)</option>
                  </select>
                </SettingField>
              </div>
              <div className="setting-preview">
                <Clock3 size={17} />
                <div>
                  <span>Current local format</span>
                  <b>24 May 2024 · 3:42 PM · LKR 125,000.00</b>
                </div>
              </div>
            </section>
          )}
          {section === "Inventory Settings" && (
            <>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <Package size={18} />
                  </span>
                  <div>
                    <h4>Stock Alerts</h4>
                    <p>Configure when employees are warned about low stock.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <SettingField label="Default Low Stock Threshold">
                    <div className="setting-suffix">
                      <input
                        type="number"
                        min="0"
                        value={config.lowStock}
                        onChange={(e) => update("lowStock", e.target.value)}
                      />
                      <span>units</span>
                    </div>
                    <small>Individual parts can override this value.</small>
                  </SettingField>
                </div>
              </section>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <SlidersHorizontal size={18} />
                  </span>
                  <div>
                    <h4>Stock Management</h4>
                    <p>Choose how stock quantities are controlled.</p>
                  </div>
                </div>
                <div className="toggle-list">
                  <Toggle
                    label="Prevent negative stock"
                    description="Block repair usage and direct sales when insufficient stock is available."
                    checked={config.preventNegative}
                    set={(v) => update("preventNegative", v)}
                  />
                  <Toggle
                    label="Track New and Reconditioned separately"
                    description="Maintain independent quantities for each part condition."
                    checked={config.trackConditions}
                    set={(v) => update("trackConditions", v)}
                  />
                  <Toggle
                    label="Automatically update stock"
                    description="Update quantities when purchases are received and sales are finalized."
                    checked={config.autoUpdate}
                    set={(v) => update("autoUpdate", v)}
                  />
                </div>
              </section>
            </>
          )}
          {section === "Security Settings" && (
            <>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <LockKeyhole size={18} />
                  </span>
                  <div>
                    <h4>Change Password</h4>
                    <p>Update the password for your administrator account.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <SettingField label="Current Password">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setPasswordError("");
                      }}
                    />
                  </SettingField>
                  <div />
                  <SettingField label="New Password">
                    <input
                      className={passwordError ? "input-error" : ""}
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Minimum 8 characters"
                    />
                  </SettingField>
                  <SettingField label="Confirm New Password">
                    <input
                      className={passwordError ? "input-error" : ""}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                    />
                  </SettingField>
                </div>
                {passwordError && (
                  <div className="form-error">
                    <X size={13} />
                    {passwordError}
                  </div>
                )}
              </section>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <h4>Login Security</h4>
                    <p>Session and account protection preferences.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <SettingField label="Session Timeout">
                    <select
                      value={config.session}
                      onChange={(e) => update("session", e.target.value)}
                    >
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </SettingField>
                </div>
                <div className="toggle-list">
                  <Toggle
                    label="Two-step verification"
                    description="Require an additional security code when signing in."
                    checked={config.twoFactor}
                    set={(v) => update("twoFactor", v)}
                  />
                  <Toggle
                    label="New login alerts"
                    description="Send an email when the account is accessed from a new device."
                    checked={config.loginAlerts}
                    set={(v) => update("loginAlerts", v)}
                  />
                </div>
              </section>
            </>
          )}
          {section === "System Preferences" && (
            <>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <Bell size={18} />
                  </span>
                  <div>
                    <h4>Notifications</h4>
                    <p>Select which operational alerts are enabled.</p>
                  </div>
                </div>
                <div className="toggle-list">
                  <Toggle
                    label="Email notifications"
                    description="Send important system alerts to the administrator email."
                    checked={config.emailNotifications}
                    set={(v) => update("emailNotifications", v)}
                  />
                  <Toggle
                    label="Low stock alerts"
                    description="Notify storekeepers when parts reach their minimum level."
                    checked={config.stockAlerts}
                    set={(v) => update("stockAlerts", v)}
                  />
                  <Toggle
                    label="Outstanding payment alerts"
                    description="Notify cashiers about overdue customer invoices."
                    checked={config.paymentAlerts}
                    set={(v) => update("paymentAlerts", v)}
                  />
                  <Toggle
                    label="Repair completion alerts"
                    description="Notify staff when repair jobs are ready for delivery."
                    checked={config.repairAlerts}
                    set={(v) => update("repairAlerts", v)}
                  />
                  <Toggle
                    label="Daily summary email"
                    description="Send a daily garage performance summary at 6:00 PM."
                    checked={config.dailySummary}
                    set={(v) => update("dailySummary", v)}
                  />
                </div>
              </section>
              <section className="settings-section">
                <div className="settings-section-title">
                  <span>
                    <CloudDownload size={18} />
                  </span>
                  <div>
                    <h4>Backup & Restore</h4>
                    <p>Protect and recover application data.</p>
                  </div>
                </div>
                <div className="backup-grid">
                  <article>
                    <CloudDownload size={22} />
                    <div>
                      <b>Download Backup</b>
                      <p>Create a complete backup of customers, jobs and transactions.</p>
                      <small>Last backup: 24 May 2024, 2:00 AM</small>
                    </div>
                    <button type="button" onClick={() => notify("System backup download started")}>
                      Download
                    </button>
                  </article>
                  <article>
                    <CloudUpload size={22} />
                    <div>
                      <b>Restore Backup</b>
                      <p>Restore system data from a previous AutoCare backup file.</p>
                      <small>Only .autocare backup files are supported.</small>
                    </div>
                    <label>
                      Choose File
                      <input
                        type="file"
                        accept=".autocare"
                        onChange={() => notify("Backup file selected for validation")}
                      />
                    </label>
                  </article>
                </div>
                <div className="toggle-list">
                  <Toggle
                    label="Automatic daily backup"
                    description="Create an encrypted backup every day at 2:00 AM."
                    checked={config.autoBackup}
                    set={(v) => update("autoBackup", v)}
                  />
                </div>
              </section>
            </>
          )}
          <footer className="settings-actions">
            <button type="button" onClick={cancel}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              <Save size={15} /> Save Changes
            </button>
          </footer>
        </form>
      </div>
      {confirmSave && (
        <div className="modal-backdrop" onMouseDown={() => setConfirmSave(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setConfirmSave(false)}>
              <X size={18} />
            </button>
            <span className="modal-icon">
              <Save size={22} />
            </span>
            <h3>Save {section}?</h3>
            <p>Your changes will be applied to AutoCare Garage immediately.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmSave(false)}>Review</button>
              <button onClick={finishSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
function SettingField({
  label,
  icon: Icon,
  wide,
  children,
}: {
  label: string;
  icon?: typeof Building2;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`setting-field ${wide ? "wide" : ""}`}>
      <span>
        {Icon && <Icon size={13} />} {label}
      </span>
      {children}
    </label>
  );
}
function Toggle({
  label,
  description,
  checked,
  set,
}: {
  label: string;
  description: string;
  checked: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <label>
      <div>
        <b>{label}</b>
        <p>{description}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} />
      <span>
        <i />
      </span>
    </label>
  );
}
