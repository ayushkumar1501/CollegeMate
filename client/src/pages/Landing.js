import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Landing/Hero';
import About from '../components/Landing/About';
import MentorCarousel from '../components/Landing/MentorCarousel';
import Testimonials from '../components/Landing/Testimonials';
import BookingSection from '../components/Landing/BookingSection';
import FAQ from '../components/Landing/FAQ';
import SupportForm from '../components/Landing/SupportForm';

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>CollegeMate - Tech Mentorship for College Students | Abhishek Ranjan</title>
        <meta
          name="description"
          content="CollegeMate - Get personalized tech mentorship from Abhishek Ranjan. Cracked 20+ off-campus internships, joining Expedia as SDE. Book 1:1 sessions for ₹200/hour."
        />
        <meta
          name="keywords"
          content="CollegeMate, Abhishek Ranjan, tech mentorship, college students, career guidance, placement preparation, Expedia, off-campus internships, system design"
        />
        <meta property="og:title" content="CollegeMate - Expert Tech Mentorship by Abhishek Ranjan" />
        <meta
          property="og:description"
          content="Book affordable 1:1 mentorship sessions with Abhishek Ranjan. 200+ students mentored."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://collegemate.in" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CollegeMate",
            "description": "Tech mentorship platform for college students founded by Abhishek Ranjan",
            "founder": {
              "@type": "Person",
              "name": "Abhishek Ranjan"
            },
            "offers": {
              "@type": "Offer",
              "name": "1:1 Mentorship Session",
              "price": "200",
              "priceCurrency": "INR"
            }
          })}
        </script>
      </Helmet>

      <Hero />
      <About />
      <MentorCarousel />
      <Testimonials />
      <BookingSection />
      <FAQ />
      <SupportForm />
    </>
  );
};

export default Landing;
