import Login from "./Login";
import Register from "./Register";
import Activities from "./Activities";
import AddActivity from "./AddActivity";
import EditActivity from "./EditActivity";
import ActivityDetail from "./ActivityDetail";
import ProtectedRoute from "./ProtectedRoute";
import { Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div>
      <nav style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {token ? (
          <>
            <Link to="/activities">Activities</Link>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities/new"
          element={
            <ProtectedRoute>
              <AddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <ProtectedRoute>
              <ActivityDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities/:id/edit"
          element={
            <ProtectedRoute>
              <EditActivity />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/activities" replace />} />
      </Routes>
    </div>
  );
}
export default App;
