export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];


export const STATUS_STYLES = {
  requested: "bg-blue-500/10 text-blue-600 border border-blue-500/25 dark:text-blue-400",
  accepted: "bg-indigo-500/10 text-indigo-600 border border-indigo-500/25 dark:text-indigo-400",
  "in-progress": "bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:text-amber-400",
  completed: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:text-rose-400",
  cancelled: "bg-slate-500/10 text-slate-500 border border-slate-500/25 dark:text-slate-400",
};

export const PAYMENT_STYLES = {
  paid: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:text-emerald-400",
  unpaid: "bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:text-amber-400",
};

export const STATUS_LABELS = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const ROLE_LABELS = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export const DASHBOARD_HOME = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};


export const SIDEBAR_MENUS = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: "LayoutDashboard" },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: "ClipboardList" },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: "CreditCard" },
    { label: "Update Profile", href: "/dashboard/profile", icon: "UserRound" },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: "LayoutDashboard" },
    { label: "Add a Service", href: "/dashboard/technician/add-service", icon: "CirclePlus" },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: "Wrench" },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: "Inbox" },
    { label: "Update Profile", href: "/dashboard/profile", icon: "UserRound" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: "LayoutDashboard" },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: "Users" },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: "BadgeCheck" },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: "ClipboardList" },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: "Banknote" },
    { label: "Update Profile", href: "/dashboard/profile", icon: "UserRound" },
  ],
};

export const CONTACT = {
  email: "support@fixmate.com",
  phone: "+880 1700-000000",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
};
