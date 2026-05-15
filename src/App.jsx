import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./pages/AddCategory";
import ViewCategory from "./pages/viewCategory";
import PublicLayout from "./components/PublicLayout";
import PrivateLayout from "./components/PrivateLayout";
import PrivateRoute from "./routes/PrivateRoute";
import PendingExpenses from "./pages/PendingExpenses";
import ExpenseHistory from "./pages/ExpenseHistory";
import AllExpenses from "./pages/AllExpenses";
import AddTask from "./pages/AddTask";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkspaceDetails from "./pages/WorkspaceDetails";
import CreateWorkspace from "./pages/CreateWorkspace";
import JoinWorkspace from "./pages/Joinworkspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<PrivateLayout />}>
           

              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="add-category" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
              <Route path="categories" element={<ProtectedRoute><ViewCategory /></ProtectedRoute>} />
              <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><AllExpenses /></ProtectedRoute>} />
              <Route path="/expenses/pending" element={<ProtectedRoute><PendingExpenses /></ProtectedRoute>} />
              <Route path="/expenses/history" element={<ProtectedRoute><ExpenseHistory /></ProtectedRoute>} />
              <Route path="/join/:inviteCode" element={<JoinWorkspace />}/>
              <Route path="/create-workspace" element={<CreateWorkspace/>}/>
            </Route>
          </Route>
        </Routes>
    </BrowserRouter >
  );
}

export default App;