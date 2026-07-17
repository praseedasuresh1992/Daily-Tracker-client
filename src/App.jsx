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
import WorkspaceDetails from "./pages/WorkspaceDetails";
import CreateWorkspace from "./pages/CreateWorkspace";
import JoinWorkspace from "./pages/Joinworkspace";
import TrashPage from "./pages/TrashPage";
import MyWorkspaces from "./pages/MyWorkspace";
import WorkspaceAddTask from "./pages/WorkspaceAddTask";
import MemberTasks from "./pages/MemberTasks";
import AddWorkspaceCategory from "./pages/addWorkspaceCategory";
import BoardView from "./pages/BoardView";

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
           

              <Route path="dashboard" element={<Dashboard /> }/>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="categories" element={<ViewCategory />} />
              <Route path="/add-task" element={<AddTask />} />
              <Route path="/expenses" element={<AllExpenses />} />
              <Route path="/expenses/pending" element={<PendingExpenses />} />
              <Route path="/expenses/history" element={<ExpenseHistory />} />
              <Route path="/board" element={<BoardView />}/>
              <Route path="/join-workspace" element={<JoinWorkspace />}/>
              <Route path="/create-workspace" element={<CreateWorkspace/>}/>
              <Route path="/workspaces" element={<MyWorkspaces />}/>
              <Route path="/workspace/:workspaceId" element={<WorkspaceDetails />} />
              <Route path="/workspace/:workspaceId/add-task/:memberId" element={<WorkspaceAddTask />}/>
              <Route path="/workspace/:workspaceId/member/:memberId/tasks" element={<MemberTasks />}/>
              <Route path="/workspace/:workspaceId/add-category" element={<AddWorkspaceCategory />}/>
              {/* <Route path="/workspace/:workspaceId/categories" element={<WorkspaceCategories />}/> */}
              <Route path="/trash" element={<TrashPage/>}/>
            </Route>
          </Route>
        </Routes>
    </BrowserRouter >
  );
}

export default App;