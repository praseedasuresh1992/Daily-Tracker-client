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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected Routes */} 
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<PrivateLayout />}>

              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="categories" element={<ViewCategory />} />
              <Route path="/add-task" element={<AddTask />} />
              <Route path="/expenses" element={<AllExpenses />} />
              <Route path="/expenses/pending" element={<PendingExpenses />} />
              <Route path="/expenses/history" element={<ExpenseHistory />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;