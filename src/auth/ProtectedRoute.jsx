// import { Navigate, useLocation, Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { setUser, clearUser } from "@/store/userSlice";
// import { toast } from "sonner";
// import { API_URL } from "@/lib/contant";
// import Loader from "@/components/loader/Loader";

// const ProtectedRoute = () => {
//   const token = localStorage.getItem("token");
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // If token exists, validate user
//     if (token) {
//       fetch(`${API_URL}/User/me`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => {
//           if (!res.ok) {
//             throw new Error("Failed to fetch user details");
//           }
//           return res.json();
//         })
//         .then((data) => {
//           dispatch(
//             setUser({
//               userName: data.userName,
//               email: data.email,
//               role: data.role,
//             })
//           );
//         })
//         .catch((err) => {
//           console.error("Error fetching user:", err);
//           localStorage.removeItem("token");
//           dispatch(clearUser());
//           toast.error("Session expired. Please log in again.", {
//             position: "top-right",
//           });
//           navigate("/login", { replace: true });
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, [token, dispatch, navigate]);

//   // Redirect to login if not logged in
//   if (!token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Show loader while fetching user info
//   if (loading) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//         <Loader />
//       </div>
//     );
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;



// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected child routes (e.g., Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;