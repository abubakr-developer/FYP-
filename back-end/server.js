import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import user from './models/user.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use("/uploads", express.static("uploads"));
app.use("/files", express.static("files"));

app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/university", universityRoutes);

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");
    app.listen(port, () => console.log(`Server started on PORT:${port}`));
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

startServer();