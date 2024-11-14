
import './App.css';
import { CreateEmployeeForm } from './components/CreateEmployee';
import { DashboardPage } from './components/Dashboard';
import { LoginPage } from './components/loginPage';
import { NavBar } from './components/navBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from './components/NoPage';
import { EditEmployeeForm } from './components/EditEmp';
import EmployeeList from './components/EmployeeList';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar /> }>
          <Route index element={<LoginPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="create-employee" element={<CreateEmployeeForm />} />
          <Route path="edit-employee" element={<EditEmployeeForm />} />
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="*" element={< NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
