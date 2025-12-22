// import React from "react";
// import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Toaster } from "./components/ui/sonner";
// import { Provider } from "react-redux";
// import { store, persistor } from "./store/store";
// import Dashboard from "./app/main/dashboard/Dashboard";
// import Login from "./app/login/Login";
// import Setting from "./app/setting/Setting";
// import Layout from "./Layout";
// import Account from "./app/common/Account";
// import NotFound from "./app/common/NotFound";
// import { PersistGate } from "redux-persist/integration/react";
// import Unauthorized from "./app/common/Unauthorized";
// import Loader from "./components/loader/Loader";
// import Option from "./app/main/multiple_template/Option";
// import SingleOption from "./app/main/single_option/SingleOption";
// import Users from "./app/main/user/Users";
// import CreateCalender from "./app/user/calender/CreateCalender"
// import ApproveCalender from "./app/admin/ApproveCalender"
// import ProtectedRoute from "./auth/ProtectedRoute";
// import Add from "./app/template/add";
// import Change from "./app/template/change"; 

// import SuperAdminDashboard from "./app/superAdmin/SuperAdminDashboard";
// import ForgetPassword from "./app/login/ForgetPassword";
// import ManagerCalendar from "./app/manager/ApproveCalenderManager";
// import AdminCalendarApproval from "./app/admin/ApproveCalender";
// import CreativeUpload from "./app/user/creative/CreativeUpload";
// import SettingThemes from "./app/setting/SettingThemes";
// import AddCategory from "./app/setting/AddCategory";
// import AllEvent from "./app/user/AllEvent";
// import BirthdayCalender from "./components/BirthdayCalender";
// import ViewCreative from "./components/ViewCreative";

// function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={<Loader />} persistor={persistor}>
//         <Router>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/loader" element={<Loader />} />
//             <Route path="/forgetpassword" element={<ForgetPassword />} />
//             <Route element={<ProtectedRoute />}>
//             <Route path="/" element={<Layout><Dashboard /></Layout>} />
//           <Route path="/themesSetting" element={<Layout><SettingThemes /></Layout>} />
//           <Route path="/setting" element={<Layout><Setting /></Layout>} />
//           <Route path="/addcategory" element={<Layout><AddCategory /></Layout>} />
//             <Route path="/template/add" element={<Layout><Add /></Layout>} /> 
//             <Route path="/template/change" element={<Layout><Change /></Layout>} /> 

//             </Route>
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//         <Toaster position="top-center" />
//       </PersistGate>
//     </Provider>
//   );
// }

// export default App;




// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Toaster } from "./components/ui/sonner";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "./store/store";

// // Pages
// import Login from "./app/login/Login";
// import ForgetPassword from "./app/login/ForgetPassword";
// import Dashboard from "./app/main/dashboard/Dashboard";
// import Setting from "./app/setting/Setting";
// import SettingThemes from "./app/setting/SettingThemes";
// import AddCategory from "./app/setting/AddCategory";

// // Common
// import LandingPage from "./app/landing/landing";
// import Layout from "./Layout";
// import NotFound from "./app/common/NotFound";
// import Unauthorized from "./app/common/Unauthorized";
// import Loader from "./components/loader/Loader";

// // Auth
// import ProtectedRoute from "./auth/ProtectedRoute";

// function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={<Loader />} persistor={persistor}>
//         <Router>
//           {/* All Routes */}
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/landing" element={<LandingPage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgetpassword" element={<ForgetPassword />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />

//             {/* Protected Routes – Login ke baad sirf yeh dikhega */}
//             <Route element={<ProtectedRoute />}>
//               <Route path="/" element={<Layout><Dashboard /></Layout>} />
//               <Route path="/setting" element={<Layout><Setting /></Layout>} />
//               <Route path="/themesSetting" element={<Layout><SettingThemes /></Layout>} />
//               <Route path="/addcategory" element={<Layout><AddCategory /></Layout>} />
//               {/* Baad mein aur pages yahan add kar dena */}
//             </Route>

//             {/* 404 */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>

//           <Toaster position="top-center" richColors closeButton />
//         </Router>
//       </PersistGate>
//     </Provider>
//   );
// }

// export default App;




// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

// Pages
import Login from "./app/login/Login";
import ForgetPassword from "./app/login/ForgetPassword";
import Dashboard from "./app/main/dashboard/Dashboard";
import Setting from "./app/setting/Setting";
import SettingThemes from "./app/setting/SettingThemes";
import Resume from "./app/tracker/resumes";
import Jobposts from "./app/tracker/job-posts";

import Layout from "./Layout";
import NotFound from "./app/common/NotFound";
import Loader from "./components/loader/Loader";

// Protected Route
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Router>
          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/setting" element={<Layout><Setting /></Layout>} />
              <Route path="/themesSetting" element={<Layout><SettingThemes /></Layout>} />
              <Route path="/tracker/job-posts" element={<Layout><Jobposts /></Layout>} />
              <Route path="/tracker/resumes" element={<Layout><Resume /></Layout>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster position="top-center" richColors closeButton />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;