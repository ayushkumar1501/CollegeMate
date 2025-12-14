# CollegeMate - Full-Stack Mentorship Booking Platform

A modern, full-stack mentorship booking platform where students can book 1-hour video call sessions with Abhishek Ranjan for ₹200.

## About the Founder

Abhishek Ranjan is the founder of CollegeMate and a dedicated tech mentor with hands-on industry experience. He has cracked over 20 high-paying off-campus internships and has interned at top multinational companies, including Expedia, where he is set to join as a Software Development Engineer. With expertise in full-stack development, system design, and placement preparation, Abhishek has mentored 200+ college students.

## Features

- 🎨 Modern dark theme with smooth animations
- 🔐 JWT + Google OAuth authentication
- 💳 Razorpay payment integration
- 📧 Email notifications via Nodemailer
- 📱 Fully responsive design
- 👨‍💼 Admin dashboard with analytics
- 📅 Calendar management for blocking slots

## Tech Stack

- **Frontend:** React.js, Redux Toolkit, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Google OAuth 2.0
- **Payment:** Razorpay
- **Email:** Nodemailer

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account
- Google OAuth credentials

### Installation

1. Clone and install dependencies:
```bash
cd ar-mentorship
npm run install:all
```

2. Configure environment variables:

**Server (.env in /server):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/collegemate
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLIENT_URL=http://localhost:3000
```

**Client (.env in /client):**
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Seed the database:
```bash
cd server
node seed.js
```

4. Start development servers:
```bash
# From root directory
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001


## Project Structure

```
ar-mentorship/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store & slices
│   │   └── services/       # API services
│   └── public/
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── config/             # Configuration
└── package.json
```

## 🚀 Production Deployment Guide

### Recommended Setup
- **Frontend:** Vercel or Netlify (free tier works great)
- **Backend:** Render (free tier available)
- **Database:** MongoDB Atlas (already configured)

---

### Step 1: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** `collegemate-api`
   - **Root Directory:** `ar-mentorship/server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. Add Environment Variables in Render dashboard:
```
PORT=5001
MONGODB_URI=mongodb+srv://...your_atlas_uri...
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=rzp_live_xxxxx (use LIVE key for production!)
RAZORPAY_KEY_SECRET=your_live_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=CollegeMate <your_email@gmail.com>
CLIENT_URL=
SERVER_URL=
ADMIN_NOTIFICATION_EMAIL=abhiself28@gmail.com
ADMIN1_EMAIL=
ADMIN1_NAME=
ADMIN1_PHONE=
ADMIN1_PASSWORD=
//similarly for ADMIN2
```

6. Deploy and note your backend URL (e.g., `https://collegemate-api.onrender.com`)

---

### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `ar-mentorship/client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variables:
```
REACT_APP_API_URL=https://collegemate-api.onrender.com/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

6. Deploy!

---

### Step 3: Connect Custom Domain (collegemate.in)

**On Vercel:**
1. Go to Project Settings → Domains
2. Add `collegemate.in` and `www.collegemate.in`
3. Update DNS records at your domain registrar:
   - A record: `76.76.19.19`
   - CNAME for www: `cname.vercel-dns.com`

---

### Step 4: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add to Authorized JavaScript origins:
   - `https://collegemate.in`
   - `https://www.collegemate.in`
5. Add to Authorized redirect URIs:
   - `https://collegemate.in`
   - `https://www.collegemate.in`

---

### Step 5: Switch Razorpay to Live Mode

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Complete KYC verification
3. Switch to Live Mode
4. Get Live API Keys (Settings → API Keys)
5. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Render

---

### Step 6: Re-seed Database for Production

After backend is deployed, run seed once:
```bash
# SSH into Render or run locally with production MONGODB_URI
cd server
node seed.js
```

---

### Post-Deployment Checklist

- [ ] Test user registration & login
- [ ] Test Google OAuth login
- [ ] Test booking flow with ₹200 payment
- [ ] Verify emails are being sent
- [ ] Check admin dashboard works
- [ ] Test review submission
- [ ] Verify profile picture loads
- [ ] Check all Razorpay policy links work
- [ ] Test on mobile devices

---

### Troubleshooting

**CORS errors:** Ensure `CLIENT_URL` in backend matches your frontend domain exactly

**Profile pic not loading:** Re-run `seed.js` after setting `SERVER_URL` env variable

**Payment failing:** Make sure you're using LIVE Razorpay keys, not test keys

**Google OAuth not working:** Verify domains are added in Google Cloud Console

---

## License

MIT License - © 2025 CollegeMate
