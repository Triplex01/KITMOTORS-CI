import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Diagnostics from "./pages/Diagnostics";
import History from "./pages/History";
import Settings from "./pages/Settings";
import VehicleDetails from "./pages/VehicleDetails";
import AddVehicle from "./pages/AddVehicle";
import Layout from "./components/Layout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/diagnostics"
        element={
          <ProtectedRoute>
            <Layout>
              <Diagnostics />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout>
              <History />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/vehicle/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <VehicleDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/add-vehicle"
        element={
          <ProtectedRoute>
            <Layout>
              <AddVehicle />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<div className="flex items-center justify-center h-screen"><p className="text-2xl">Page not found</p></div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
