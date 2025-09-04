const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:4000", // Local backend
  "https://payment-roster-dashboard-3.onrender.com", // Render backend (for internal calls)
  // Add your Vercel frontend URL here when you have it
  // "https://your-vercel-project.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Setup PostgreSQL client with error logging and SSL config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Mount auth routes
app.use("/api", authRoutes);

// Test SMTP connection route for quick testing
app.get("/api/test-smtp", async (req, res) => {
  try {
    await authRoutes.transporter.verify();
    res.json({ message: 'SMTP connection successful' });
  } catch (error) {
    console.error('SMTP connection error:', error);
    res.status(500).json({ error: 'SMTP connection failed', details: error.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user in PostgreSQL
    const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Register (for admin to add users)
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, role || 'employee']
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Get all payments
app.get("/api/payments", authenticateToken, async (req, res) => {
  try {
    // Fetch payments with employee name from PostgreSQL
    const result = await pool.query(`
      SELECT p.*, u.name as employee_name
      FROM payments p
      JOIN users u ON p.employee_id = u.id
      ORDER BY p.date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new payment
app.post("/api/payments", authenticateToken, async (req, res) => {
  try {
    const { employee_id, amount, date, status, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO payments (employee_id, amount, date, status, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [employee_id, amount, date, status || 'pending', notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update payment
app.put("/api/payments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, amount, date, status, notes } = req.body;

    const result = await pool.query(
      `UPDATE payments SET employee_id = $1, amount = $2, date = $3, status = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [employee_id, amount, date, status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete payment
app.delete("/api/payments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users (for admin)
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user role (admin only)
app.patch("/api/users/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const userId = req.params.id;
  const { role } = req.body;
  if (!role || !["employee", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User role updated", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Start server
if (require.main === module) {
  app.listen(4000, () => console.log("Server running on port 4000"));
}

module.exports = app;
