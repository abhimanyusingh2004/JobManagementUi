
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