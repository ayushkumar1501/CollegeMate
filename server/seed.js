const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Mentor = require('./models/Mentor');
const Review = require('./models/Review');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ar-mentorship');
  console.log('MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Mentor.deleteMany({});
    await Review.deleteMany({});

    // Create admin user 1 from env
    if (process.env.ADMIN1_EMAIL && process.env.ADMIN1_PASSWORD) {
      await User.create({
        name: process.env.ADMIN1_NAME || 'Admin 1',
        email: process.env.ADMIN1_EMAIL,
        phone: process.env.ADMIN1_PHONE || '0000000000',
        password: process.env.ADMIN1_PASSWORD,
        role: 'admin',
        isEmailVerified: true
      });
      console.log(`Admin 1 created: ${process.env.ADMIN1_EMAIL}`);
    }

    // Create admin user 2 from env
    if (process.env.ADMIN2_EMAIL && process.env.ADMIN2_PASSWORD) {
      await User.create({
        name: process.env.ADMIN2_NAME || 'Admin 2',
        email: process.env.ADMIN2_EMAIL,
        phone: process.env.ADMIN2_PHONE || '0000000000',
        password: process.env.ADMIN2_PASSWORD,
        role: 'admin',
        isEmailVerified: true
      });
      console.log(`Admin 2 created: ${process.env.ADMIN2_EMAIL}`);
    }

    // Create mentor - Only Abhishek Ranjan
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5001';
    const mentors = [
      {
        name: 'Abhishek Ranjan',
        bio: 'Founder of CollegeMate. Cracked 20+ off-campus internships at top MNCs including Expedia (joining as SDE). Expert in full-stack development, system design & placement prep. Mentored 200+ students to crack technical interviews and land top tech roles.',
        photo: `${serverUrl}/uploads/Abhishek_ranjan.jpg`,
        linkedIn: 'https://www.linkedin.com/in/abhishek-ranjan-54838b274/',
        instagram: 'https://www.instagram.com/abhishekranjan714/',
        order: 0
      }
    ];

    await Mentor.insertMany(mentors);
    console.log('Mentors seeded successfully');

    // Create realistic reviews
    const reviews = [
      {
        name: 'Rahul Verma',
        college: 'NIT Trichy',
        role: 'Final Year CSE',
        rating: 5,
        review: 'Abhishek bhaiya helped me crack my first off-campus internship at a startup. His resume tips and mock interview sessions were super helpful. The ₹200 I spent was totally worth it. Highly recommend for anyone struggling with placements!',
        isApproved: true,
        isSeeded: true
      },
      {
        name: 'Priya Sharma',
        college: 'BITS Pilani',
        role: 'Pre-final Year',
        rating: 5,
        review: 'I was confused about whether to go for product-based or service-based companies. One session with Abhishek cleared all my doubts. He gave me a proper roadmap for DSA and development. Now I feel much more confident about my preparation.',
        isApproved: true,
        isSeeded: true
      },
      {
        name: 'Arjun Patel',
        college: 'VIT Vellore',
        role: 'SDE Intern at Razorpay',
        rating: 5,
        review: 'Best mentorship I have received! Abhishek sir reviewed my projects and suggested improvements that made my portfolio stand out. His system design tips helped me crack Razorpay. Forever grateful 🙏',
        isApproved: true,
        isSeeded: true
      },
      {
        name: 'Sneha Reddy',
        college: 'IIIT Hyderabad',
        role: '3rd Year IT',
        rating: 5,
        review: 'Was struggling with competitive programming and felt demotivated. Abhishek bhaiya not only helped with CP strategies but also motivated me to keep going. His practical approach to problem-solving is amazing. Must try for all college students!',
        isApproved: true,
        isSeeded: true
      },
      {
        name: 'Karthik Nair',
        college: 'DTU Delhi',
        role: 'Placed at Microsoft',
        rating: 5,
        review: 'Took 3 sessions before my Microsoft interview. Abhishek sir covered everything from behavioral questions to system design. His tips on how to approach unknown problems saved me in the interview. Got selected! Thank you CollegeMate!',
        isApproved: true,
        isSeeded: true
      }
    ];

    await Review.insertMany(reviews);
    console.log('Reviews seeded successfully');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
