import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import SignIn from "./components/Login/SignIn";
import ActivateAccount from "./components/Login/ActivateAccount";
import ForgetPassword from "./components/Login/Forgetpassword";
import ResetPassword from "./components/Login/ResetPassword";
import AdminHome from "./components/Home/admin";
import ManagerHome from "./components/Home/manager";
import CustomerHome from "./components/Home/customer";
import Admin from "./components/Main/Admin";
import Manager from "./components/Main/Manager";
import CustomerHomee from "./components/Main/Customer";
import Error from "./components/Error/error";

import AddAdmin from "./components/Admin/addAdmin/adminInter";
import AddManager from "./components/Admin/addManager/userInter";
import Employee from "./components/Employee/eCards";
import Customer from "./components/Customer/cCards";
import Supplier from "./components/Supplier/Scards";
import Invoices from "./components/Invoice/invoices";
import FuelDelivery from "./components/Fuel Delivery/fuelDelivery";
import Inventory from "./components/Inventory/inventory";
import PetrolPump from "./components/Petrol Pump/petrolPump";
import DailyAccount from "./components/DailyAccount/dailyAccount";
import CustomerInvoice from "./components/CustomerInvoice/customerInvoice";
import GenerateBill from "./components/Customer/generateBill";
import PostOrder from "./components/Customer/postOrder";
import PaidOrder from "./components/Customer/paidOrder";
import Policy from "./components/PrivatePolicy/privatePolicy";
import Licensing from "./components/Licensing/licensing";
import About from "./components/About/about";
import Services from "./components/Servic/servecies";
import Contact from "./components/Contact/contact";
import FuelPrice from "./components/Price/fuelCard";

export const UserContext = createContext();

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userRole, setUserRole }}>
        <Routes>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/activate_account" element={<ActivateAccount />} />
          <Route path="/forget_password" element={<ForgetPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="*" element={<Error />} />

          <Route
            path="/admin/*"
            element={
              userRole === "Admin" ? (
                <Admin />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privatePolicy" element={<Policy />} />
            <Route path="licensing" element={<Licensing />} />
            <Route path="userInter" element={<AddManager />} />
            <Route path="adminInter" element={<AddAdmin />} />
          </Route>

          <Route
            path="/*"
            element={
              userRole === "Manager" ? (
                <Manager />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          >
            <Route index element={<ManagerHome />} />
            <Route path="employees" element={<Employee />} />
            <Route path="customers" element={<Customer />} />
            <Route path="suppliers" element={<Supplier />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="fuelDelivery" element={<FuelDelivery />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="petrolPump" element={<PetrolPump />} />
            <Route path="dailyAccount" element={<DailyAccount />} />
            <Route path="privatePolicy" element={<Policy />} />
            <Route path="licensing" element={<Licensing />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="customerInvoices" element={<CustomerInvoice />} />
            <Route path="fuelType" element={<FuelPrice />} />
          </Route>

          <Route
            path="/customer/*"
            element={
              userRole === "Customer" ? (
                <CustomerHomee />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          >
            <Route index element={<CustomerHome />} />
            <Route path="generateBill" element={<GenerateBill />} />
            <Route path="postOrder" element={<PostOrder />} />
            <Route path="paidOrder" element={<PaidOrder />} />
            <Route path="privatePolicy" element={<Policy />} />
            <Route path="licensing" element={<Licensing />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
