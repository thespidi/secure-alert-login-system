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
   GYM EXERCISE ROUTES
========================= */

// Get all exercises for logged-in user
app.get('/exercises', (req, res) => {
  const email = req.query.email;

  db.query(
    "SELECT * FROM user_exercises WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Database error" });
      }

      res.json(results);
    }
  );
});

// Add new exercise
app.post('/exercises', (req, res) => {
  const { email, day, exercise, setsReps, working } = req.body;

  db.query(
    "INSERT INTO user_exercises (email, day, exercise, setsReps, working) VALUES (?, ?, ?, ?, ?)",
    [email, day, exercise, setsReps, working],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error adding exercise");
      }

      res.send("Exercise added");
    }
  );
});

// Update exercise
app.put('/exercises/:id', (req, res) => {
  const id = req.params.id;
  const { day, exercise, setsReps, working } = req.body;

  db.query(
    "UPDATE user_exercises SET day = ?, exercise = ?, setsReps = ?, working = ? WHERE id = ?",
    [day, exercise, setsReps, working, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error updating exercise");
      }

      res.send("Exercise updated");
    }
  );
});

// Delete exercise
app.delete('/exercises/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM user_exercises WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error deleting exercise");
      }

      res.send("Exercise deleted");
    }
  );
});

/* =========================
   OPEN LOGIN PAGE BY DEFAULT
========================= */
app.get('/user-info', (req, res) => {
  const email = req.query.email;

  db.query(
    "SELECT email, failedAttempts, isLocked FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.json({ error: "User not found" });
      }

      res.json(results[0]);
    }
  );
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});