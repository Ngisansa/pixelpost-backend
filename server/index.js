require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* ======================
   Global Middleware
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   Database
====================== */
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.error("Mongo connect error", err));
}

/* ======================
   Routes
====================== */

// Users (IMPORTANT: fixes /users/me)
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

// Payments (Paystack)
const paymentsRoutes = require("./routes/payments");
app.use("/payments", paymentsRoutes);

// Other existing routes
app.use("/api/posts", require("./routes/posts"));

/* ======================
   Health Check (optional but recommended)
====================== */
app.get("/", (req, res) => {
  res.send("PixelPost Backend Running");
});

/* ======================
   Server Start
====================== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
