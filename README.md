# Secure Alert Login System

A secure web-based login and registration system built using Node.js, Express.js, MySQL, bcrypt, Nodemailer, HTML, CSS, and JavaScript.

This project improves login security by hashing passwords, tracking failed login attempts, locking accounts after multiple wrong attempts, and sending email alerts to registered users.

---

## Features

* User registration
* User login
* Password hashing using bcrypt
* MySQL database integration
* Failed login attempt tracking
* Account lock after 3 wrong attempts
* Email alert system using Nodemailer
* Separate login and registration pages
* Show/hide password eye button
* Frontend using HTML, CSS, and JavaScript

---

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* MySQL
* bcrypt
* Nodemailer
* dotenv

---

## Project Structure

```text
secure-login/
│── server.js
│── db.js
│── mailer.js
│── package.json
│── package-lock.json
│── README.md
│── .gitignore
│
└── public/
    │── login.html
    │── register.html
    │── style.css
```

---

## How It Works

1. User registers using email and password.
2. Password is hashed using bcrypt before storing in MySQL.
3. User logs in using email and password.
4. System checks the email in MySQL.
5. bcrypt compares entered password with the stored hashed password.
6. If password is correct, login is successful.
7. If password is wrong, failed attempt count increases.
8. After 3 wrong attempts, the account is locked.
9. An email alert is sent to the registered user.

---

## Database Table

Create the database and table in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS login_system;

USE login_system;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  failedAttempts INT DEFAULT 0,
  isLocked BOOLEAN DEFAULT FALSE
);
```

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/thespidi/secure-alert-login-system.git
```

### 2. Open project folder

```bash
cd secure-alert-login-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env` file

Create a `.env` file in the main project folder and add:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=login_system

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

Note: Do not upload `.env` to GitHub.

### 5. Start the server

```bash
node server.js
```

### 6. Open in browser

```text
http://localhost:3000
```

---

## API Routes

### Register User

```http
POST /register
```

Used to register a new user.

### Login User

```http
POST /login
```

Used to login a user and check password.

---

## Security Features

### Password Hashing

Passwords are not stored directly. They are converted into hashed form using bcrypt.

### Failed Attempt Tracking

Every wrong password attempt increases the failed attempt count.

### Account Locking

After 3 wrong attempts, the account is locked.

### Email Alert

An email alert is sent when a wrong login attempt happens or when the account is locked.

---

## Frontend Pages

### Login Page

```text
public/login.html
```

### Register Page

```text
public/register.html
```

### Styling

```text
public/style.css
```

---

## Important Note

This project uses environment variables for private data such as MySQL password and Gmail app password. The `.env` file should never be uploaded to GitHub.

---

## Future Improvements

* OTP verification
* JWT authentication
* Auto-unlock after 15 minutes
* Admin dashboard
* CAPTCHA after multiple failed attempts
* Better email templates

---

