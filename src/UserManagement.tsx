import { FormEvent, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  KeyRound,
  LockKeyhole,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  UserX,
  X,
} from "lucide-react";

type Role = "Administrator" | "Manager" | "Cashier" | "Mechanic" | "Storekeeper";
type UserStatus = "Active" | "Inactive";
type AppUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  username: string;
  role: Role;
  status: UserStatus;
  lastLogin: string;
  joined: string;
  color: string;
};
type Mode = "list" | "form" | "details";
const initial: AppUser[] = [
  {
    id: "USR-001",
    name: "Dinuka Wijeratne",
    initials: "DW",
    email: "dinuka@autocare.lk",
    phone: "077 700 4501",
    username: "dinuka.admin",
    role: "Administrator",
    status: "Active",
    lastLogin: "Today, 8:12 AM",
    joined: "10 Jan 2020",
    color: "#2563eb",
  },
  {
    id: "USR-002",
    name: "Shalini Perera",
    initials: "SP",
    email: "shalini@autocare.lk",
    phone: "071 882 1094",
    username: "shalini.manager",
    role: "Manager",
    status: "Active",
    lastLogin: "Today, 7:55 AM",
    joined: "18 Mar 2020",
    color: "#7c3aed",
  },
  {
    id: "USR-003",
    name: "Amaya Fernando",
    initials: "AF",
    email: "cashier@autocare.lk",
    phone: "076 440 2388",
    username: "amaya.cashier",
    role: "Cashier",
    status: "Active",
    lastLogin: "Today, 9:03 AM",
    joined: "02 Jun 2022",
    color: "#db2777",
  },
  {
    id: "USR-004",
    name: "Kasun Silva",
    initials: "KS",
    email: "kasun@autocare.lk",
    phone: "077 553 8810",
    username: "kasun.mechanic",
    role: "Mechanic",
    status: "Active",
    lastLogin: "Yesterday, 5:42 PM",
    joined: "14 Aug 2020",
    color: "#059669",
  },
  {
    id: "USR-005",
    name: "Ruwan Jayasuriya",
    initials: "RJ",
    email: "ruwan@autocare.lk",
    phone: "071 330 9284",
    username: "ruwan.mechanic",
    role: "Mechanic",
    status: "Active",
    lastLogin: "24 May, 4:18 PM",
    joined: "21 Feb 2021",
    color: "#0891b2",
  },
  {
    id: "USR-006",
    name: "Sahan Gunawardena",
    initials: "SG",
    email: "stores@autocare.lk",
    phone: "075 228 1190",
    username: "sahan.store",
    role: "Storekeeper",
    status: "Active",
    lastLogin: "Today, 8:30 AM",
    joined: "11 Nov 2021",
    color: "#ea580c",
  },
  {
    id: "USR-007",
    name: "Ajith Fernando",
    initials: "AJ",
    email: "ajith@autocare.lk",
    phone: "072 889 4102",
    username: "ajith.mechanic",
    role: "Mechanic",
    status: "Inactive",
    lastLogin: "12 Apr 2024",
    joined: "06 May 2020",
    color: "#64748b",
  },
];
const permissionNames = [
  "Dashboard",
  "Customers",
  "Vehicles",
  "Repairs",
  "Inventory",
  "Purchases",
  "Sales",
  "Payments",
  "Expenses",
  "Reports",
  "Settings",
];
const roleDefaults: Record<Role, string[]> = {
  Administrator: permissionNames,
  Manager: permissionNames.filter((x) => x !== "Settings"),
  Cashier: ["Dashboard", "Customers", "Vehicles", "Sales", "Payments"],
  Mechanic: ["Dashboard", "Customers", "Vehicles", "Repairs", "Inventory"],
  Storekeeper: ["Dashboard", "Inventory", "Purchases", "Reports"],
};
export default function UserManagement({ notify }: { notify: (m: string) => void }) {
  const [users, setUsers] = useState(initial),
    [mode, setMode] = useState<Mode>("list"),
    [selectedId, setSelectedId] = useState(initial[0].id),
    [search, setSearch] = useState(""),
    [role, setRole] = useState("All Roles"),
    [status, setStatus] = useState("All Statuses"),
    [menu, setMenu] = useState<string | null>(null),
    [editing, setEditing] = useState(false),
    [dialog, setDialog] = useState<"status" | "reset" | null>(null);
  const [formRole, setFormRole] = useState<Role>("Cashier"),
    [formStatus, setFormStatus] = useState<UserStatus>("Active"),
    [permissions, setPermissions] = useState<string[]>(roleDefaults.Cashier),
    [userPermissions, setUserPermissions] = useState<Record<string, string[]>>(() =>
      Object.fromEntries(initial.map((user) => [user.id, [...roleDefaults[user.role]]])),
    ),
    [password, setPassword] = useState(""),
    [confirmPassword, setConfirmPassword] = useState(""),
    [passwordError, setPasswordError] = useState("");
  const selected = users.find((x) => x.id === selectedId) ?? users[0];
  const filtered = useMemo(
    () =>
      users.filter(
        (x) =>
          [x.name, x.email, x.phone, x.username].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          ) &&
          (role === "All Roles" || x.role === role) &&
          (status === "All Statuses" || x.status === status),
      ),
    [users, search, role, status],
  );
  const openDetails = (u: AppUser) => {
    setSelectedId(u.id);
    setMenu(null);
    setMode("details");
    window.scrollTo(0, 0);
  };
  const openForm = (u?: AppUser) => {
    if (u) {
      setSelectedId(u.id);
      setFormRole(u.role);
      setFormStatus(u.status);
      setPermissions(userPermissions[u.id] ?? roleDefaults[u.role]);
    } else {
      setFormRole("Cashier");
      setFormStatus("Active");
      setPermissions(roleDefaults.Cashier);
    }
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setEditing(!!u);
    setMenu(null);
    setMode("form");
    window.scrollTo(0, 0);
  };
  const setRoleAndPermissions = (r: Role) => {
    setFormRole(r);
    setPermissions([...roleDefaults[r]]);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!editing && password.length < 8) {
      setPasswordError("Password must contain at least 8 characters");
      return;
    }
    if (!editing && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    const values = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(values.get("fullName") ?? "");
    const email = String(values.get("email") ?? "");
    const phone = String(values.get("phone") ?? "");
    const username = String(values.get("username") ?? "");
    if (editing) {
      setUsers((items) =>
        items.map((user) =>
          user.id === selected.id
            ? { ...user, name, email, phone, username, role: formRole, status: formStatus }
            : user,
        ),
      );
      setUserPermissions((items) => ({ ...items, [selected.id]: [...permissions] }));
      notify(`${name} updated successfully`);
      setMode("details");
    } else {
      const id = `USR-${String(users.length + 1).padStart(3, "0")}`;
      const newUser: AppUser = {
        id,
        name,
        email,
        phone,
        username,
        role: formRole,
        status: formStatus,
        lastLogin: "Never",
        joined: "24 May 2024",
        initials: name
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase(),
        color: "#2563eb",
      };
      setUsers((items) => [newUser, ...items]);
      setUserPermissions((items) => ({ ...items, [id]: [...permissions] }));
      notify("New user account created");
      setMode("list");
    }
  };
  const toggleStatus = () => {
    setUsers((x) =>
      x.map((u) =>
        u.id === selected.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u,
      ),
    );
    setDialog(null);
    notify(`${selected.name} ${selected.status === "Active" ? "deactivated" : "activated"}`);
  };
  if (mode === "form")
    return (
      <main className="dashboard repair-page users-page">
        <div className="repair-subheader">
          <button className="back-button" onClick={() => setMode(editing ? "details" : "list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Users / {editing ? selected.id : "New User"}</span>
            <h2>{editing ? "Edit User" : "Add New User"}</h2>
            <p>Configure account credentials, role and system permissions.</p>
          </div>
          <span className="draft-indicator">
            {editing ? selected.id : "USR-008 · Automatic ID"}
          </span>
        </div>
        <form className="job-form user-form" onSubmit={submit}>
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <UserRound size={19} />
              </span>
              <div>
                <h3>Personal Information</h3>
                <p>Contact and account identification.</p>
              </div>
            </div>
            <div className="form-grid form-grid-3">
              <Field label="Full Name" required>
                <input
                  name="fullName"
                  required
                  defaultValue={editing ? selected.name : ""}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Email Address" required>
                <input
                  name="email"
                  required
                  type="email"
                  defaultValue={editing ? selected.email : ""}
                  placeholder="user@autocare.lk"
                />
              </Field>
              <Field label="Phone Number" required>
                <input
                  name="phone"
                  required
                  pattern="(?:0|\+94)[0-9 ]{9,12}"
                  defaultValue={editing ? selected.phone : ""}
                  placeholder="077 123 4567"
                />
              </Field>
              <Field label="Username" required>
                <input
                  name="username"
                  required
                  minLength={4}
                  defaultValue={editing ? selected.username : ""}
                  placeholder="first.role"
                />
              </Field>
              <Field label="Role" required>
                <Select
                  value={formRole}
                  change={(e) => setRoleAndPermissions(e.target.value as Role)}
                >
                  {["Administrator", "Manager", "Cashier", "Mechanic", "Storekeeper"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Account Status">
                <Select
                  value={formStatus}
                  change={(e) => setFormStatus(e.target.value as UserStatus)}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </Select>
              </Field>
            </div>
          </section>
          {!editing && (
            <section className="form-card">
              <div className="form-card-title">
                <span>
                  <KeyRound size={19} />
                </span>
                <div>
                  <h3>Login Credentials</h3>
                  <p>Create a secure initial password.</p>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Password" required>
                  <input
                    className={passwordError ? "input-error" : ""}
                    required
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Minimum 8 characters"
                  />
                </Field>
                <Field label="Confirm Password" required>
                  <input
                    className={passwordError ? "input-error" : ""}
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Re-enter password"
                  />
                </Field>
              </div>
              {passwordError && (
                <div className="form-error">
                  <X size={13} />
                  {passwordError}
                </div>
              )}
            </section>
          )}
          <section className="form-card">
            <div className="form-card-title">
              <span>
                <ShieldCheck size={19} />
              </span>
              <div>
                <h3>Role Permissions</h3>
                <p>Select the modules this user can access.</p>
              </div>
            </div>
            <div className="permission-grid">
              {permissionNames.map((x) => (
                <label key={x} className={permissions.includes(x) ? "checked" : ""}>
                  <input
                    type="checkbox"
                    checked={permissions.includes(x)}
                    onChange={() =>
                      setPermissions((p) => (p.includes(x) ? p.filter((v) => v !== x) : [...p, x]))
                    }
                  />
                  <span>
                    <Check size={13} />
                  </span>
                  <b>{x}</b>
                  <small>{permissions.includes(x) ? "Access allowed" : "No access"}</small>
                </label>
              ))}
            </div>
          </section>
          <div className="form-actions">
            <button type="button" onClick={() => setMode(editing ? "details" : "list")}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              <CheckCircle2 size={15} />
              {editing ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </main>
    );
  if (mode === "details")
    return (
      <main className="dashboard repair-page users-page">
        <div className="repair-subheader detail-header">
          <button className="back-button" onClick={() => setMode("list")}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <span>Users / {selected.id}</span>
            <h2>
              {selected.name} <UserStatus status={selected.status} />
            </h2>
            <p>
              {selected.role} · Joined {selected.joined}
            </p>
          </div>
          <div className="detail-actions">
            <button onClick={() => setDialog("reset")}>
              <KeyRound size={15} /> Reset Password
            </button>
            <button
              onClick={() => setDialog("status")}
              className={selected.status === "Active" ? "danger-action" : ""}
            >
              {selected.status === "Active" ? <UserX size={15} /> : <UserCheck size={15} />}{" "}
              {selected.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button className="primary-action" onClick={() => openForm(selected)}>
              <Edit3 size={15} /> Edit User
            </button>
          </div>
        </div>
        <section className="user-profile-hero">
          <span style={{ background: `${selected.color}15`, color: selected.color }}>
            {selected.initials}
          </span>
          <div>
            <small>TEAM MEMBER</small>
            <h3>{selected.name}</h3>
            <p>@{selected.username}</p>
            <div>
              <b>
                <Mail size={13} />
                {selected.email}
              </b>
              <b>
                <Phone size={13} />
                {selected.phone}
              </b>
            </div>
          </div>
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{selected.role}</dd>
            </div>
            <div>
              <dt>Last Login</dt>
              <dd>{selected.lastLogin}</dd>
            </div>
            <div>
              <dt>Account Status</dt>
              <dd>
                <UserStatus status={selected.status} />
              </dd>
            </div>
          </dl>
        </section>
        <div className="user-detail-grid">
          <article className="detail-card">
            <div className="detail-card-title">
              <div>
                <h3>Module Permissions</h3>
                <p>Access inherited from {selected.role} role</p>
              </div>
            </div>
            <div className="profile-permissions">
              {permissionNames.map((x) => {
                const allowed = (
                  userPermissions[selected.id] ?? roleDefaults[selected.role]
                ).includes(x);
                return (
                  <div className={allowed ? "allowed" : "denied"} key={x}>
                    <span>{allowed ? <Check size={13} /> : <X size={13} />}</span>
                    <b>{x}</b>
                    <small>{allowed ? "Full module access" : "Access restricted"}</small>
                  </div>
                );
              })}
            </div>
          </article>
          <aside>
            <article className="detail-card">
              <div className="detail-card-title">
                <h3>Account Activity</h3>
              </div>
              <div className="user-activity">
                <div>
                  <span>
                    <Activity size={14} />
                  </span>
                  <p>
                    <b>Signed in</b>
                    <small>{selected.lastLogin}</small>
                  </p>
                </div>
                <div>
                  <span>
                    <Eye size={14} />
                  </span>
                  <p>
                    <b>Viewed dashboard</b>
                    <small>Today, 8:14 AM</small>
                  </p>
                </div>
                <div>
                  <span>
                    <Edit3 size={14} />
                  </span>
                  <p>
                    <b>Updated repair job</b>
                    <small>Yesterday, 4:25 PM</small>
                  </p>
                </div>
              </div>
            </article>
            <article className="detail-card account-security">
              <div className="detail-card-title">
                <h3>Security</h3>
              </div>
              <p>
                <LockKeyhole size={14} />
                Password last changed <b>42 days ago</b>
              </p>
              <p>
                <Shield size={14} />
                Two-step verification <b>Not enabled</b>
              </p>
            </article>
          </aside>
        </div>
        {dialog && (
          <UserDialog
            type={dialog}
            user={selected}
            close={() => setDialog(null)}
            statusAction={toggleStatus}
            notify={notify}
          />
        )}
      </main>
    );
  return (
    <main className="dashboard repair-page users-page">
      <div className="repair-header">
        <div>
          <h2>User Management</h2>
          <p>Manage staff accounts, roles and system access permissions.</p>
        </div>
        <button className="new-job-button" onClick={() => openForm()}>
          <Plus size={16} /> Add User
        </button>
      </div>
      <section className="repair-summary">
        {[
          ["Total Users", users.length, "All staff accounts", Users, "blue"],
          [
            "Active Users",
            users.filter((x) => x.status === "Active").length,
            "Can access the system",
            UserCheck,
            "green",
          ],
          [
            "Inactive Users",
            users.filter((x) => x.status === "Inactive").length,
            "Access disabled",
            UserX,
            "orange",
          ],
          [
            "Roles",
            new Set(users.map((x) => x.role)).size,
            "Permission groups",
            ShieldCheck,
            "violet",
          ],
        ].map(([a, b, c, I, t]) => {
          const Icon = I as typeof Users;
          return (
            <article key={a as string}>
              <span className={t as string}>
                <Icon size={20} />
              </span>
              <div>
                <small>{a as string}</small>
                <strong>{b as number}</strong>
                <p>{c as string}</p>
              </div>
            </article>
          );
        })}
      </section>
      <section className="panel entity-panel">
        <div className="user-filters">
          <label className="job-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or username..."
            />
          </label>
          <FilterSelect
            label="Role"
            value={role}
            set={setRole}
            options={[
              "All Roles",
              "Administrator",
              "Manager",
              "Cashier",
              "Mechanic",
              "Storekeeper",
            ]}
          />
          <FilterSelect
            label="Status"
            value={status}
            set={setStatus}
            options={["All Statuses", "Active", "Inactive"]}
          />
          <button
            className="filter-button"
            onClick={() => {
              setSearch("");
              setRole("All Roles");
              setStatus("All Statuses");
            }}
          >
            <Filter size={15} />
          </button>
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>System Users</h3>
            <p>Showing {filtered.length} user accounts</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="repair-table users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className="customer-table-person">
                      <i style={{ background: `${u.color}15`, color: u.color }}>{u.initials}</i>
                      <span>
                        <b>{u.name}</b>
                        <small>@{u.username}</small>
                      </span>
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`role-badge ${u.role.toLowerCase()}`}>
                      <Shield size={12} />
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <UserStatus status={u.status} />
                  </td>
                  <td>
                    <b>{u.lastLogin}</b>
                  </td>
                  <td className="action-cell">
                    <button
                      className="row-menu"
                      onClick={() => setMenu(menu === u.id ? null : u.id)}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {menu === u.id && (
                      <div className="job-actions-menu">
                        <button onClick={() => openDetails(u)}>
                          <Eye size={14} /> View Profile
                        </button>
                        <button onClick={() => openForm(u)}>
                          <Edit3 size={14} /> Edit User
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(u.id);
                            setDialog("reset");
                          }}
                        >
                          <KeyRound size={14} /> Reset Password
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="no-jobs">
                    <Users size={24} />
                    <b>No users found</b>
                    <span>Try changing or resetting the filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="repair-pagination">
          <span>
            Showing 1–{filtered.length} of {filtered.length} users
          </span>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button>›</button>
          </div>
        </div>
      </section>
      {dialog && (
        <UserDialog
          type={dialog}
          user={selected}
          close={() => setDialog(null)}
          statusAction={toggleStatus}
          notify={notify}
        />
      )}
    </main>
  );
}
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="job-field">
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
function UserStatus({ status }: { status: UserStatus }) {
  return (
    <span className={`customer-status ${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}
function UserDialog({
  type,
  user,
  close,
  statusAction,
  notify,
}: {
  type: "status" | "reset";
  user: AppUser;
  close: () => void;
  statusAction: () => void;
  notify: (m: string) => void;
}) {
  const [temp, setTemp] = useState("");
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal-card sales-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <span
          className={`modal-icon ${type === "status" && user.status === "Active" ? "customer-warning" : ""}`}
        >
          {type === "reset" ? <KeyRound size={22} /> : <UserCog size={22} />}
        </span>
        <h3>
          {type === "reset"
            ? "Reset User Password"
            : `${user.status === "Active" ? "Deactivate" : "Activate"} User?`}
        </h3>
        {type === "reset" ? (
          <>
            <p>
              Create a temporary password for {user.name}. They will be asked to change it at next
              login.
            </p>
            <Field label="Temporary Password" required>
              <input
                type="password"
                minLength={8}
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </Field>
          </>
        ) : (
          <p>
            {user.status === "Active"
              ? "This user will immediately lose access to AutoCare Garage."
              : "This user will be able to sign in and access their assigned modules."}
          </p>
        )}
        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button
            onClick={() =>
              type === "reset"
                ? temp.length >= 8
                  ? (notify(`Temporary password created for ${user.name}`), close())
                  : notify("Temporary password must contain 8 characters")
                : statusAction()
            }
          >
            {type === "reset"
              ? "Reset Password"
              : user.status === "Active"
                ? "Deactivate"
                : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
