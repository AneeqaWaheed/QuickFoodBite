import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import orderRoute from "./routes/orderRoute.js";
import contactRoute from "./routes/contactRoute.js";
import chargesRoutes from "./routes/chargesRoute.js";
// import deliveryChargeRoute from "./routes/SettingSchemaRoute.js";
// import SettingSchema from "./models/SettingSchema.js";

//congigure env
dotenv.config();

//database config
connectDB();

//rest objects
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

// //routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cors());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/product", productRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/charges", chargesRoutes);
// app.use("/api/v1/setting", SettingSchema);

app.use("/api/v1/orders", orderRoute);
// app.use("/api/v1/deliveryCharges", deliveryChargeRoute);
// //rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to QUICKFOODBITE</h1>");
});
//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server running  mode on ${PORT}`);
});
