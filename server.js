require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const childRoutes = require("./routes/childRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const questionBankRoutes = require("./routes/questionBankRoutes");
const examRoutes = require("./routes/examRoutes");
const learningTreeRoutes = require("./routes/learningTreeRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/children", childRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/questions", questionBankRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/tree", learningTreeRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Rafeeq API is running" });
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
