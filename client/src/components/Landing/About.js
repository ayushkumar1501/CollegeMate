import { motion } from 'framer-motion';
import { FiLinkedin, FiInstagram } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const About = () => {
  const { mentors } = useSelector((state) => state.mentor);
  const mentor = mentors[0]; // Abhishek Ranjan

  return (
    <section id="about" className="py-20 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={mentor?.photo || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/Abhishek_ranjan.jpg`}
                alt="Abhishek Ranjan"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-primary to-secondary p-4 rounded-xl">
                <p className="text-white font-bold">Founder & Lead Mentor</p>
              </div>
            </div>
            <div className="absolute top-8 -left-8 w-full h-full bg-primary/20 rounded-2xl -z-0"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium">About the Founder</span>
            <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-6">
              Abhishek Ranjan
            </h2>
            <p className="text-light-400 text-lg leading-relaxed mb-6">
  Abhishek Ranjan is the founder of Collegemate, bringing over two years of hands-on experience in the technology industry. A passionate educator and mentor, he has guided more than 200 college students through their academic and early professional journeys.
            </p>

            <p className="text-light-400 text-lg leading-relaxed mb-6">
              His expertise spans full-stack development, system design, and career mentorship. Abhishek focuses on placement preparation, technical interview coaching, and helping students build strong portfolios and resumes that stand out to leading tech companies.
            </p>

            <p className="text-light-400 text-lg leading-relaxed mb-6">
              He has successfully cracked over 20 off-campus, high-paying internship opportunities and has interned with leading multinational companies, including Expedia. He is set to join Expedia as a Software Development Engineer (SDE).
            </p>
            <p className="text-light-400 text-lg leading-relaxed mb-8">
              Driven by a mission to make quality tech education accessible and goal-oriented, Abhishek and the Collegemate team are committed to providing clear learning paths and consistent motivation, enabling aspiring developers to become industry-ready professionals.
            </p>

            <div className="flex items-center space-x-4">
              <a
                href="https://linkedin.com/in/abhishek-ranjan-54838b274"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-dark-700 hover:bg-primary/20 px-4 py-2 rounded-lg transition"
              >
                <FiLinkedin className="text-primary" />
                <span className="text-light-100">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/abhishekranjan714/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-dark-700 hover:bg-primary/20 px-4 py-2 rounded-lg transition"
              >
                <FiInstagram className="text-primary" />
                <span className="text-light-100">Instagram</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
