import React from "react";

import async from "../components/Async";

import {
  Activity,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Calendar as CalendarIcon,
  CheckSquare,
  CreditCard,
  Globe,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  Monitor,
  ShoppingCart,
  PieChart,
  Sliders,
  User,
  Users
} from "react-feather";

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));

// Components components
const Alerts = async(() => import("../pages/components/Alerts"));
const Avatars = async(() => import("../pages/components/Avatars"));
const Badges = async(() => import("../pages/components/Badges"));
const Buttons = async(() => import("../pages/components/Buttons"));
const Cards = async(() => import("../pages/components/Cards"));
const Chips = async(() => import("../pages/components/Chips"));
const Dialogs = async(() => import("../pages/components/Dialogs"));
const ExpPanels = async(() => import("../pages/components/ExpansionPanels"));
const Lists = async(() => import("../pages/components/Lists"));
const Menus = async(() => import("../pages/components/Menus"));
const Pagination = async(() => import("../pages/components/Pagination"));
const Progress = async(() => import("../pages/components/Progress"));
const Snackbars = async(() => import("../pages/components/Snackbars"));
const Tooltips = async(() => import("../pages/components/Tooltips"));

// Dashboards components

// Forms components
const Pickers = async(() => import("../pages/forms/Pickers"));
const SelectionCtrls = async(() => import("../pages/forms/SelectionControls"));
const Selects = async(() => import("../pages/forms/Selects"));
const TextFields = async(() => import("../pages/forms/TextFields"));
const Dropzone = async(() => import("../pages/forms/Dropzone"));
const Editors = async(() => import("../pages/forms/Editors"));

// Icons components
const MaterialIcons = async(() => import("../pages/icons/MaterialIcons"));
const FeatherIcons = async(() => import("../pages/icons/FeatherIcons"));

// Pages components
const Blank = async(() => import("../pages/pages/Blank"));
const InvoiceDetails = async(() => import("../pages/pages/InvoiceDetails"));
const InvoiceList = async(() => import("../pages/pages/InvoiceList"));
const Orders = async(() => import("../pages/pages/Orders"));
const Pricing = async(() => import("../pages/pages/Pricing"));
const Profile = async(() => import("../pages/pages/Profile"));
const Settings = async(() => import("../pages/pages/Settings"));
const Tasks = async(() => import("../pages/pages/Tasks"));
const Projects = async(() => import("../pages/pages/Projects"));
const Calendar = async(() => import("../pages/pages/Calendar"));
const Test = async(() => import("../pages/pages/Test"));
// Tables components
const SimpleTable = async(() => import("../pages/tables/SimpleTable"));
const AdvancedTable = async(() => import("../pages/tables/AdvancedTable"));

// Chart components
const Chartjs = async(() => import("../pages/charts/Chartjs"));

// Maps components
const GoogleMaps = async(() => import("../pages/maps/GoogleMaps"));
const VectorMaps = async(() => import("../pages/maps/VectorMaps"));

// Documentation
const Docs = async(() => import("../pages/docs/Documentation"));
const Changelog = async(() => import("../pages/docs/Changelog"));
const Presentation = async(() => import("../pages/docs/Presentation"));

// SatPage
const SatVis = async(() => import('../pages/sat/Satvis'))


const radarRoutes = {
  id: "Real Time Sensor Feed",
  path: "/radar",
  icon: <Globe />,
  component: Blank,
  children: null
};

const satRoutes = {
  id: "Real Time Satellite Feed",
  path: "/sat",
  icon: <Activity />,
  component: SatVis,
  children: null
};

const profileRoutes = {
  id: "Profile",
  path: "/profile",
  icon: <User />,
  component: Profile,
  children: null
};

const projectsRoutes = {
  id: "Projects",
  path: "/projects",
  icon: <Briefcase />,
  badge: "8",
  component: Projects,
  children: null
};

const invoiceRoutes = {
  id: "Invoices",
  path: "/invoices",
  icon: <CreditCard />,
  children: [
    {
      path: "/invoices",
      name: "List",
      component: InvoiceList
    },
    {
      path: "/invoices/detail",
      name: "Details",
      component: InvoiceDetails
    }
  ]
};

const orderRoutes = {
  id: "Orders",
  path: "/orders",
  icon: <ShoppingCart />,
  component: Orders,
  children: null
};

const tasksRoutes = {
  id: "Tasks",
  path: "/tasks",
  icon: <AlertTriangle />,
  badge: "5",
  component: Tasks,
  children: null
};

const calendarRoutes = {
  id: "Calendar",
  path: "/calendar",
  icon: <CalendarIcon />,
  component: Calendar,
  children: null
};

const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <Users />,
  children: [
    {
      path: "/",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    }
  ]
};

const componentsRoutes = {
  id: "Components",
  path: "/components",
  header: "Elements",
  icon: <Grid />,
  children: [
    {
      path: "/components/alerts",
      name: "Alerts",
      component: Alerts
    },
    {
      path: "/components/avatars",
      name: "Avatars",
      component: Avatars
    },
    {
      path: "/components/badges",
      name: "Badges",
      component: Badges
    },
    {
      path: "/components/buttons",
      name: "Buttons",
      component: Buttons
    },
    {
      path: "/components/cards",
      name: "Cards",
      component: Cards
    },
    {
      path: "/components/chips",
      name: "Chips",
      component: Chips
    },
    {
      path: "/components/dialogs",
      name: "Dialogs",
      component: Dialogs
    },
    {
      path: "/components/expansion-panels",
      name: "Expansion Panels",
      component: ExpPanels
    },
    {
      path: "/components/lists",
      name: "Lists",
      component: Lists
    },
    {
      path: "/components/menus",
      name: "Menus",
      component: Menus
    },
    {
      path: "/components/pagination",
      name: "Pagination",
      component: Pagination
    },
    {
      path: "/components/progress",
      name: "Progress",
      component: Progress
    },
    {
      path: "/components/snackbars",
      name: "Snackbars",
      component: Snackbars
    },
    {
      path: "/components/tooltips",
      name: "Tooltips",
      component: Tooltips
    }
  ]
};

const formsRoutes = {
  id: "Forms",
  path: "/forms",
  icon: <CheckSquare />,
  children: [
    {
      path: "/forms/pickers",
      name: "Pickers",
      component: Pickers
    },
    {
      path: "/forms/selection-controls",
      name: "Selection Controls",
      component: SelectionCtrls
    },
    {
      path: "/forms/selects",
      name: "Selects",
      component: Selects
    },
    {
      path: "/forms/text-fields",
      name: "Text Fields",
      component: TextFields
    },
    {
      path: "/forms/dropzone",
      name: "Dropzone",
      component: Dropzone
    },
    {
      path: "/forms/editors",
      name: "Editors",
      component: Editors
    }
  ]
};

const tablesRoutes = {
  id: "Playbooks",
  path: "/tables",
  icon: <List />,
  children: [
    {
      path: "/tables/advanced-table",
      name: "Radar Performance Playbook",
      component: AdvancedTable
    },
    {
      path: "/tables/advanced-table1",
      name: "Satellite Event Playbook",
      component: AdvancedTable
    }
  ]
};

const iconsRoutes = {
  id: "Icons",
  path: "/icons",
  icon: <Heart />,
  children: [
    {
      path: "/icons/material-icons",
      name: "Material Icons",
      component: MaterialIcons
    },
    {
      path: "/icons/feather-icons",
      name: "Feather Icons",
      component: FeatherIcons
    }
  ]
};

const chartRoutes = {
  id: "Charts",
  path: "/charts",
  icon: <PieChart />,
  component: Chartjs,
  children: null
};

const mapsRoutes = {
  id: "Maps",
  path: "/maps",
  icon: <Map />,
  children: [
    {
      path: "/maps/google-maps",
      name: "Google Maps",
      component: GoogleMaps
    },
    {
      path: "/maps/vector-maps",
      name: "Vector Maps",
      component: VectorMaps
    }
  ]
};

const presentationRoutes = {
  id: "Presentation",
  path: "/presentation",
  header: "Docs",
  icon: <Monitor />,
  component: Presentation,
  children: null
};

const documentationRoutes = {
  id: "Getting Started",
  path: "/documentation",
  icon: <BookOpen />,
  component: Docs,
  children: null
};

const changelogRoutes = {
  id: "Changelog",
  path: "/changelog",
  badge: "v1.1.0",
  icon: <List />,
  component: Changelog,
  children: null
};

// This route is not visisble in the sidebar
const privateRoutes = {
  id: "Private",
  path: "/private",
  component: Test,
  children: null
};

export const dashboard = [
  radarRoutes,
  satRoutes,
  profileRoutes,
  tasksRoutes,
  tablesRoutes,
  privateRoutes
];

export const auth = [authRoutes];

export default [
  radarRoutes,
  satRoutes,
  profileRoutes,
  tasksRoutes,
  tablesRoutes
];
