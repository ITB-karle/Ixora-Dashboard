import { createRouter, createWebHistory } from "vue-router";
// import Tables from "../views/Tables.vue";
// import Billing from "../views/Billing.vue";
// import VirtualReality from "../views/VirtualReality.vue";
// import RTL from "../views/Rtl.vue";
// import Profile from "../views/Profile.vue";
// import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

import AccountManagement from "../views/AccountManagement.vue";
import PatientsList from "../views/PatientsList.vue";

import CreateUser from "../views/CreateUser.vue";
import EditUser from "../views/EditUser.vue";
import CreatePatient from "../views/CreatePatient.vue";
import EditPatient from "../views/EditPatient.vue";
import PatientDetails from "../views/PatientDetails.vue";
import CreateMedication from "../views/CreateMedication.vue";
import EditMedication from "../views/EditMedication.vue";
import CreateReminder from "../views/CreateReminder.vue";
import EditReminder from "../views/EditReminder.vue";
import CreateIntroduction from "../views/CreateIntroduction.vue";
import EditIntroduction from "../views/EditIntroduction.vue";
import CreateReport from "../views/CreateReport.vue";
import EditReport from "../views/EditReport.vue";
import CreateVital from "../views/CreateVital.vue";
import EditVital from "../views/EditVital.vue";
import MonthlyReminder from "../views/MonthlyReminder.vue";
import ForumList from "../views/ForumList.vue";
import CreateForum from "../views/CreateForum.vue";
import EditForum from "../views/EditForum.vue";
import NotificationList from "../views/NotificationList.vue";
import CreateNotification from "../views/CreateNotification.vue";
import EditNotification from "../views/EditNotification.vue";

import FullCalendar from "../views/FullCalendar.vue";

import DailyReminder from "../views/DailyReminder.vue";



const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/account-management",
  },
  // {
  //   path: "/dashboard-default",
  //   name: "Dashboard",
  //   component: Dashboard,
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   component: Tables,
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   component: Billing,
  // },
  // {
  //   path: "/virtual-reality",
  //   name: "Virtual Reality",
  //   component: VirtualReality,
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL",
  //   component: RTL,
  // },
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: Profile,
  // },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  // {
  //   path: "/signup",
  //   name: "Signup",
  //   component: Signup,
  // },
  {
    path: "/account-management",
    name: "Account Management",
    component: AccountManagement,
  },
  {
    path: "/patients-list",
    name: "Patients List",
    component: PatientsList,
  },
  {
    path: "/create-user",
    name: "Create User",
    component: CreateUser,
  },
  {
    path: "/edit-user",
    name: "Edit User",
    component: EditUser,
  },
  {
    path: "/create-patient",
    name: "Create Patient",
    component: CreatePatient,
  },
  {
    path: "/edit-patient",
    name: "Edit Patient",
    component: EditPatient,
  },
  {
    path: "/patient-details",
    name: "Patient Details",
    component: PatientDetails,
  },
  {
    path: "/create-medication",
    name: "Create Medication",
    component: CreateMedication,
  },
  {
    path: "/edit-medication",
    name: "Edit Medication",
    component: EditMedication,
  },
  {
    path: "/create-reminder",
    name: "Create Reminder",
    component: CreateReminder,
  },
  {
    path: "/edit-reminder",
    name: "Edit Reminder",
    component: EditReminder,
  },
  {
    path: "/create-introduction",
    name: "Create Introduction",
    component: CreateIntroduction
  },
  {
    path: "/edit-introduction",
    name: "Edit Introduction",
    component: EditIntroduction,
  },
  {
    path: "/create-report",
    name: "Create Report",
    component: CreateReport,
  },
  {
    path: "/edit-report",
    name: "Edit Report",
    component: EditReport,
  },
  {
    path: "/create-vital",
    name: "Create Vital",
    component: CreateVital,
  },
  {
    path: "/edit-vital",
    name: "Edit Vital",
    component: EditVital,
  },
  {
    path: "/monthly-reminder",
    name: "Monthly Reminder",
    component: MonthlyReminder,
  },
  {
    path: "/forum-list",
    name: "Forum List",
    component: ForumList,
  },
  {
    path: "/create-forum",
    name: "Create Forum",
    component: CreateForum,
  },
  {
    path: "/edit-forum",
    name: "Edit Forum",
    component: EditForum,
  },
  {
    path: "/notification-list",
    name: "Notification List",
    component: NotificationList,
  },
  {
    path: "/create-notification",
    name: "Create Notification",
    component: CreateNotification,
  },
  {
    path: "/edit-notification",
    name: "Edit Notification",
    component: EditNotification,
  },
  {
    path: "/full-calendar",
    name: "Full Calendar",
    component: FullCalendar,
  },
  {
    path: "/daily-reminder",
    name: "Daily Reminder",
    component: DailyReminder,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
