require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const parentRoutes = require("./routes/parentRoutes");
const childRoutes = require("./routes/childRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const learningTreeRoutes = require("./routes/learningTreeRoutes");
const quizRoutes = require("./routes/quizRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const articleRoutes = require("./routes/articleRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/children", childRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/tree", learningTreeRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/homeworks", homeworkRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/subjects", subjectRoutes);

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
