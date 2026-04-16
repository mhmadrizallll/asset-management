import express from "express";
import routes from "./routes";

const app = express();

// Body parser middleware - HARUS ditambahkan SEBELUM routes
app.use(express.json()); // Untuk parsing application/json
app.use(express.urlencoded({ extended: true })); // Untuk parsing form data

app.use("/api", routes);

export default app;
