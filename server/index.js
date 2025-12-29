require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // CORS must be imported BEFORE use()

const app = express(); // app must be created BEFORE app.use()
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
  mongoose.set("debug", true);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.error("Mongo connect error", err));
}

/* ======================
   Routes
====================== */

// 🔐 USERS (REQUIRED by frontend)
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

// Existing API routes
app.use("/api/posts", require("./routes/posts"));
app.use("/api/payments", require("./routes/payments"));

/* ======================
   Server Start
====================== */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
