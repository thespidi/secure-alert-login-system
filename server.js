const express = require('express');
const path = require('path');
const app = express();

const db = require('./db');
const bcrypt = require('bcrypt');
const sendAlert = require('./mailer');

// middleware
app.use(express.json());
app.use(express.static('public'));

/* =========================
   REGISTER ROUTE
========================= */
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.send("Error in registration");
        }
        res.send("User registered");
      }
    );

  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

/* =========================
   LOGIN ROUTE
========================= */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database error");
      }

      if (results.length === 0) {
        return res.send("User not found");
      }

      const user = results[0];

      if (user.isLocked) {
        return res.send("Account locked");
      }

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        db.query(
          "UPDATE users SET failedAttempts = 0 WHERE id = ?",
          [user.id]
        );

        return res.send("Login success");

      } else {
        let attempts = user.failedAttempts + 1;

        db.query(
          "UPDATE users SET failedAttempts = ? WHERE id = ?",
          [attempts, user.id]
        );

        // alert on wrong attempt
        sendAlert(user.email, "⚠️ Wrong login attempt detected!");

        if (attempts >= 3) {
          db.query(
            "UPDATE users SET isLocked = 1 WHERE id = ?",
            [user.id]
          );

          // alert on account lock
          sendAlert(
            user.email,
            "🚨 Your account has been locked due to multiple failed attempts!"
          );
        }

        return res.send("Wrong password");
      }
    }
  );
});

/* =========================
   OPEN LOGIN PAGE BY DEFAULT
========================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});