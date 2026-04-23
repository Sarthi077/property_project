# 🏠 RentEra — Property Rental Platform

A production-ready, full-stack **Property Rental Web Application** built with React, Node.js, Express, and MySQL — featuring secure JWT authentication, email verification, image uploads, and a sleek glassmorphism UI.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat&logo=jsonwebtokens)

---

## 📌 Overview

**RentEra** is a modern, feature-complete property rental platform where landlords can list, manage, and edit properties — and renters can browse and view detailed listings. Built with performance and security in mind, it features JWT-based authentication with email verification, multipart image uploads, and a pixel-perfect glassmorphism dark-mode UI with smooth animations.

### Key Highlights

- 🔐 **Secure Auth Pipeline** — JWT tokens, bcrypt password hashing, token blacklisting on logout, and email verification gating for all sensitive actions.
- 📧 **Email Verification** — Nodemailer + Ethereal SMTP integration; users must verify their email before listing or managing properties.
- 🔑 **Password Recovery** — Full forgot-password / reset-password flow with secure tokenized email links.
- 🏘️ **Property Management** — Owners can create, edit (with dirty-state detection), and soft-delete their listings.
- 🖼️ **Image Uploads** — Multipart form handling via Formidable; multiple property images stored on disk and served statically.
- 🌍 **Public Listings** — Paginated public feed available to all visitors without login.
- 🎨 **Premium UI** — Glassmorphism dark mode, Framer Motion animations, Lucide icons, and TailwindCSS.
- 👤 **Owner Controls** — Property owners see an exclusive **Edit Property** button on the detail page and profile page, invisible to other users.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 (Vite), TailwindCSS, Framer Motion, Lucide React |
| **State Management** | React Context API (`AuthContext`, `ThemeContext`) |
| **Routing** | React Router DOM v7 |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js v5 |
| **Database** | MySQL 8 (via `mysql2`) |
| **Authentication** | JWT (`jsonwebtoken`), Bcrypt |
| **Email** | Nodemailer with Ethereal SMTP |
| **File Uploads** | Formidable v3 (multipart/form-data) |
| **Slug Generation** | Slugify |
| **Dev Server** | Nodemon |
| **Build Tool** | Vite |

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration** — Unique email validation, bcrypt password hashing.
- **JWT Authentication** — Signed tokens with configurable expiry; verified on every protected route.
- **Token Blacklisting** — On logout, the JWT is stored in a `blacklist_token` table so it can never be reused.
- **Email Verification Gate** — The `isEmailVerify` middleware blocks all property and profile actions until the user verifies their email address.
- **Password Recovery** — Forgot password sends a tokenized reset link via Ethereal email; reset password validates the token and updates the hash.

### 🏠 Property Listings
- **Create Listings** — Name, description, city, country, monthly rent, security deposit, bedrooms, and multiple photos.
- **Edit Listings** — Pre-populated form with **dirty-state detection** — the "Update Property" button stays disabled until the user actually changes something.
- **Soft Delete** — Properties are deactivated (`is_active = false`) rather than permanently deleted.
- **Image Management** — Multiple images per property; editing replaces old images automatically (old files deleted from disk).
- **Auto-Slug** — Property slugs are auto-generated from the name using Slugify with uniqueness enforcement.

### 🌍 Public Feed
- **Browse All Properties** — Server-side paginated public listing (`?page=1&limit=10`) accessible without login.
- **Property Detail Page** — Full image carousel with thumbnails, property stats, description, and contact CTA.
- **Owner Badge** — Property owners see a "Your Listing" badge and an exclusive **Edit Property** button on the detail page.

### 👤 User Profile
- **Profile Dashboard** — View all your active listings, edit profile name, change password, or delete account.
- **Edit Profile** — Update display name in a smooth animated modal.
- **Change Password** — Secure old-password-required flow.
- **My Properties** — Edit or soft-delete any of your listings from the profile grid.

### 🎨 Premium UI/UX
- **Glassmorphism Dark Mode** — Translucent cards with `backdrop-blur`, dark color palette, and vibrant accent colors.
- **Framer Motion Animations** — Page transitions, modal enter/exit, and card hover effects.
- **Toast Notifications** — Auto-dismissing success / error toasts for every action.
- **Responsive Design** — Mobile-first grid layouts for all pages.
- **Lazy Loading** — All pages are lazy-loaded via `React.lazy` + `Suspense` for fast initial load.

---

## 📁 Project Structure

```
property_rent_project/
│
├── Backend/
│   ├── config/
│   │   └── db.js                   # MySQL connection pool (mysql2)
│   │
│   ├── controller/
│   │   ├── userController.js       # Register, Login, Profile, Logout, Delete, Change Password
│   │   ├── propertyController.js   # Create, Update, Delete, List (my), List (all public)
│   │   ├── emailTokenController.js # Email verification token logic
│   │   └── passwordController.js   # Forgot password & reset password
│   │
│   ├── middleware/
│   │   ├── isAuthenticated.js      # JWT verification → sets req.user
│   │   └── isEmailVerify.js        # Blocks actions if email not verified
│   │
│   ├── routes/
│   │   ├── userRoute.js            # /api/user/*
│   │   ├── propertyRoute.js        # /api/property/*
│   │   ├── emailVerifyRoute.js     # /api/verify/*
│   │   └── passwordRoute.js        # /api/password/*
│   │
│   ├── uploads/
│   │   └── properties/             # Uploaded property images (served statically)
│   │
│   ├── .env                        # Environment variables (see below)
│   ├── package.json
│   └── index.js                    # Express server entry point (port 4000)
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   └── PropertyCard.jsx    # Reusable property listing card
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state + all API calls
│   │   │   └── ThemeContext.jsx    # Dark/light theme toggle
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Public paginated property feed
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── AddProperty.jsx     # Create new listing form
│   │   │   ├── PropertyDetail.jsx  # Full listing detail + owner edit
│   │   │   ├── Profile.jsx         # User dashboard + my properties
│   │   │   ├── ForgotPassword.jsx  # Request password reset
│   │   │   └── ResetPassword.jsx   # Set new password via token
│   │   │
│   │   ├── App.jsx                 # Router with Protected / Guest routes
│   │   ├── index.css               # Global styles, CSS variables, utilities
│   │   └── main.jsx                # React entry point
│   │
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

The project uses **MySQL** with the database name `property_project`.

### `users` table
| Column | Type | Notes |
|---|---|---|
| `user_id` | INT (PK, AUTO_INCREMENT) | Primary key |
| `user_name` | VARCHAR | Display name |
| `user_email` | VARCHAR (UNIQUE) | Login email |
| `user_pass` | VARCHAR | Bcrypt hash |
| `is_verify` | BOOLEAN | Email verified flag |
| `created_at` | TIMESTAMP | Auto set |

### `fields` table *(properties)*
| Column | Type | Notes |
|---|---|---|
| `p_id` | VARCHAR (PK) | Random numeric ID from frontend |
| `name` | VARCHAR | Property name |
| `slug` | VARCHAR (UNIQUE) | Auto-generated from name |
| `description` | TEXT | Optional |
| `city` | VARCHAR | |
| `country` | VARCHAR | |
| `rent` | DECIMAL | Monthly rent (₹) |
| `amount` | DECIMAL | Security deposit (₹) |
| `bedRooms` | INT | Number of bedrooms |
| `user_id` | INT (FK → users) | Owner |
| `is_active` | BOOLEAN | Soft-delete flag (default `true`) |
| `created_at` | TIMESTAMP | Auto set |

### `property_image` table
| Column | Type | Notes |
|---|---|---|
| `id` | INT (PK, AUTO_INCREMENT) | |
| `p_id` | VARCHAR (FK → fields) | Property reference |
| `image_url` | VARCHAR | Relative path e.g. `uploads/properties/img.jpg` |

### `email_token` table
| Column | Type | Notes |
|---|---|---|
| `id` | INT (PK) | |
| `user_id` | INT (FK → users) | |
| `token` | VARCHAR | Verification / reset token |
| `created_at` | TIMESTAMP | |

### `blacklist_token` table
| Column | Type | Notes |
|---|---|---|
| `t_id` | INT (PK, AUTO_INCREMENT) | |
| `token` | TEXT | Blacklisted JWT |

---

## 🌐 API Reference

### Auth — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signin` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login → returns JWT |
| GET | `/profile` | ✅ + ✉️ | Get own profile |
| POST | `/edit-user-profile/:id` | ✅ + ✉️ | Update display name |
| POST | `/change-password-user-profile/:id` | ✅ + ✉️ | Change password |
| GET | `/logout/:id` | ✅ + ✉️ | Logout (blacklists token) |
| GET | `/profile/delete/:id` | ✅ + ✉️ | Soft-delete account |

### Email Verification — `/api/verify`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/verify-email` | ❌ | Verify email via token link |

### Password Reset — `/api/password`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/forget-password` | ❌ | Send reset link to email |
| POST | `/reset-password` | ❌ | Reset password using token |

### Properties — `/api/property`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-property` | ✅ + ✉️ | Create a new listing |
| POST | `/update-property/:id` | ✅ + ✉️ | Update an existing listing |
| DELETE | `/delete-property/:id` | ✅ + ✉️ | Soft-delete a listing |
| GET | `/list-property/` | ✅ + ✉️ | List own properties (with images) |
| GET | `/list-all-property/` | ❌ | Public paginated feed (with images) |

> **Legend:** ✅ = JWT required · ✉️ = Email verification required

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | >= 18.x |
| MySQL | >= 8.0 |
| npm | >= 9.x |

---

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd property_rent_project
```

---

### Step 2 — MySQL Database Setup

Open your MySQL client (MySQL Workbench, DBeaver, or CLI) and run:

```sql
CREATE DATABASE property_project;
USE property_project;

CREATE TABLE users (
  user_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_name  VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_pass  VARCHAR(255) NOT NULL,
  is_verify  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fields (
  p_id        VARCHAR(255) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  city        VARCHAR(255),
  country     VARCHAR(255),
  rent        DECIMAL(10,2),
  amount      DECIMAL(10,2),
  bedRooms    INT,
  user_id     INT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE property_image (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  p_id      VARCHAR(255),
  image_url VARCHAR(500),
  FOREIGN KEY (p_id) REFERENCES fields(p_id) ON DELETE CASCADE
);

CREATE TABLE email_token (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  token      VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE blacklist_token (
  t_id  INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT NOT NULL
);
```

---

### Step 3 — Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
# Server
PORT=4000
APP_URL=http://localhost:4000

# JWT
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRES_IN=1h

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=property_project

# Email — Get free credentials at https://ethereal.email
ETHEREAL_HOST=smtp.ethereal.email
ETHEREAL_PORT=587
ETHEREAL_USER=your_ethereal_email@ethereal.email
ETHEREAL_PASS=your_ethereal_password
```

Create the uploads directory:

```bash
# Windows
mkdir uploads\properties

# Mac / Linux
mkdir -p uploads/properties
```

Start the backend server:

```bash
npm start
```

> ✅ Server running at **http://localhost:4000**

---

### Step 4 — Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

> ✅ Frontend running at **http://localhost:5173**

---

### Step 5 — Email Setup (Ethereal — Free for Development)

1. Go to **[https://ethereal.email](https://ethereal.email)**
2. Click **"Create Ethereal Account"** — it instantly generates credentials
3. Copy the `Host`, `Port`, `Username`, and `Password` into your `.env`
4. All app emails (verification links, password resets) appear in the Ethereal inbox — **no real emails are delivered**

---

## 📦 Available Scripts

### Backend (`/Backend`)

| Script | Command | Description |
|---|---|---|
| Start (dev) | `npm start` | Start server with Nodemon (auto-restarts on changes) |

### Frontend (`/Frontend`)

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start Vite dev server with HMR at port 5173 |
| Production build | `npm run build` | Compile optimized bundle to `dist/` |
| Preview build | `npm run preview` | Preview the production build locally |
| Lint | `npm run lint` | Run ESLint on all source files |

---

## 🔧 Environment Variables Reference

| Variable | Required | Example | Description |
|---|---|---|---|
| `PORT` | ✅ | `4000` | Express server port |
| `APP_URL` | ✅ | `http://localhost:4000` | Used in email links |
| `JWT_SECRET` | ✅ | `my_super_secret` | JWT signing key — **keep private!** |
| `JWT_EXPIRES_IN` | ✅ | `1h` | Token lifetime |
| `DB_HOST` | ✅ | `localhost` | MySQL host |
| `DB_USER` | ✅ | `root` | MySQL username |
| `DB_PASSWORD` | ✅ | `password` | MySQL password |
| `DB_DATABASE` | ✅ | `property_project` | MySQL database name |
| `ETHEREAL_HOST` | ✅ | `smtp.ethereal.email` | SMTP host |
| `ETHEREAL_PORT` | ✅ | `587` | SMTP port |
| `ETHEREAL_USER` | ✅ | `user@ethereal.email` | Ethereal username |
| `ETHEREAL_PASS` | ✅ | `abc123` | Ethereal password |

---

## 🔑 How Authentication Works

```
1. Register    → Password hashed with Bcrypt → Stored in DB
                 → Verification email sent via Nodemailer
2. Verify      → User clicks link in email → is_verify = TRUE in DB
3. Login       → JWT created and returned to frontend
                 → Stored in localStorage
4. API Request → Authorization: Bearer <token> sent in header
                 → isAuthenticated: verifies JWT + checks blacklist table
                 → isEmailVerify:   confirms is_verify = TRUE
5. Logout      → JWT written to blacklist_token → can never be reused
```

---

## 🛣️ Frontend Routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Home — paginated public property feed |
| `/property/:id` | Public | Property detail with image carousel |
| `/login` | Guest only | Login form |
| `/register` | Guest only | Registration form |
| `/forgot-password` | Guest only | Request password reset |
| `/reset-password` | Public | Set new password via email token |
| `/add-property` | 🔒 Protected | Create new listing |
| `/profile` | 🔒 Protected | User dashboard + my listings |

---

## 📸 User Flows

### Landlord Flow (List & Manage a Property)
```
Register → Verify Email → Login
  → Add Property (fill form + upload images) → Publish
  → Profile → See my listings → Edit ✏️ or Delete 🗑️
  → Click own property → "Edit Property" button appears (owners only)
```

### Renter Flow (Browse & Contact)
```
Visit Home → Browse paginated listings
  → Click any card → View Property Detail
  → Login → "Contact Landlord" button appears
```

---

## ⚠️ Common Issues & Fixes

| Problem | Fix |
|---|---|
| `Cannot connect to MySQL` | Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`. Ensure MySQL service is running. |
| `Email not received` | Ethereal emails appear in the Ethereal web inbox — not your real email inbox. |
| `JWT expired or invalid` | Log out and log back in to get a fresh token. |
| `Property not showing in Profile` | Ensure MySQL default for `is_active` is `TRUE`. New properties explicitly set `is_active = 1`. |
| `Images not loading` | Ensure `Backend/uploads/properties/` directory exists. Backend serves it statically. |
| `CORS errors in browser` | Confirm both servers are running. Backend uses open `cors()` middleware. |
| `"user is not verified"` error | Click the verification link sent to your Ethereal inbox before trying protected actions. |

---

## 🤝 Contributing

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a **Pull Request**

---

## 👤 Author

Built with ❤️ as a full-stack learning project.

- **GitHub:** [@Sarthi077](https://github.com/Sarthi077)

---

> ⭐ If you found this project useful, give it a star on GitHub!
