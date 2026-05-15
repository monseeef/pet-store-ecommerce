const express = require("express"); // Importing the Express framework
const app = express(); // Creating an instance of the Express application
require('./config/database'); // Importing database configuration
const cookieParser = require('cookie-parser'); // Importing cookie-parser for parsing cookies
const apiRoutes = require('./routes/api'); // Import

// Middleware to handle data parsing

const cors = require("cors");

const splitOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://petopia-store.vercel.app",
  "https://petopia-store-admin.vercel.app",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  process.env.ADMIN_VERCEL_URL,
  process.env.VERCEL_ADMIN_URL,
  ...splitOrigins(process.env.EXTRA_ALLOWED_ORIGINS),
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, "")));

const corsOptions = {
  origin(origin, callback) {
    // Non-browser requests such as Postman, health checks, and same-origin server calls do not send Origin.
    if (!origin) {
      return callback(null, true);
    }

    return callback(null, allowedOrigins.has(origin.replace(/\/$/, "")));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));





app.use(express.json()); // Middleware for parsing JSON bodies

app.use(cookieParser()); // Middleware for parsing cookies





// Defining routes for authentication and user-related actions

app.use('/api', apiRoutes);



app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies



module.exports = app;
