import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import PageNotFound from "./Pages/PageNotFound";
import Menu from "./Pages/Menu";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";

import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import AdminRoute from "./Components/Routes/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateCategory from "./Pages/Admin/CreateCategory";
import CreateProduct from "./Pages/Admin/CreateProduct";
import Users from "./Pages/Admin/Users";
import ContactPage from "./Pages/ContactPage";
import Products from "./Pages/Admin/Products";
import UpdateProducts from "./Pages/Admin/UpdateProduct";
import ProductPage from "./Pages/productPage";
import Checkout from "./Pages/Checkout";
import AdminOrders from "./Pages/Admin/Orders";
import AdminCharges from "./Pages/Admin/Charges";
import ModeratorDashboard from "./Pages/Moderator/ModeratorDashboard";
import ModeratorRoute from "./Components/Routes/ModeratorRoute";
import ModeratorProfile from "./Pages/Moderator/ModeratorProfile";
import ModeratorOrders from "./Pages/Moderator/ModeratorOrders";
import ClaimRedirectPage from "./Pages/Moderator/OrderClaimPage";
import AdminOrderStats from "./utils/AdminOrderStats";
import TrackOrder from "./Pages/orderTrackPage";
import FleentLanding from "./Pages/FleentLanding";
import OtherServices from "./Pages/OtherServices";
import ModeratorDocumentation from "./Pages/Moderator/ModeratorDocumentation";
import AdminPayments from "./Pages/Admin/AdminPayments";
import ModeratorEditOrder from "./Pages/Moderator/ModeratorEditOrder";

function App() {
  return (
    <>
      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<FleentLanding />} />
        <Route path="/otherServices" element={<OtherServices />} />
     
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          {/* <Route path="admin/stats" element={<AdminOrderStats />} /> */}
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product" element={<Products />} />
          <Route path="admin/product/:id" element={<UpdateProducts />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/charges" element={<AdminCharges />} />
          <Route path="admin/payments" element={<AdminPayments />} />
        </Route>
        <Route path="/dashboard" element={<ModeratorRoute/>}>
        <Route path="moderator" element={<ModeratorDashboard/>}/>
        <Route path="moderator/My-Profile" element={<ModeratorProfile/>}/>
        <Route path="moderator/orders" element={<ModeratorOrders/>}/>
        <Route path="moderator/claim/:orderId" element={<ClaimRedirectPage />} />
        <Route path="moderator/docs" element={<ModeratorDocumentation />} />
<Route
  path="/dashboard/moderator/orders/edit/:orderId"
  element={<ModeratorEditOrder />}
/>
        </Route>

        <Route path="/orderTrack/:orderId" element={<TrackOrder />} />
        <Route path="/Productpage/:id" element={<ProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/checkout-success/success" element={<Checkout />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
