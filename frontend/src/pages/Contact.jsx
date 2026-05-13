// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// import { useState } from "react";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Logic to handle form submission, like sending data to a server
//     alert("Your message has been sent!");
//   };

//   return (
//     <>
//         <Navbar />
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="max-w-lg w-full px-6 py-8 mt-14 bg-white shadow-md rounded-lg">
//           <div className="flex flex-col justify-center items-center mb-8">
//             <h1 className="text-3xl font-light text-gray-700">Contact Us</h1>
//             <p className="mt-2 text-gray-600">We&apos;d love to hear from you!</p>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 required
//                 className="mt-1 px-4 py-2 w-full border rounded-md"
//                 onChange={handleChange}
//                 value={formData.name}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 required
//                 className="mt-1 px-4 py-2 w-full border rounded-md"
//                 onChange={handleChange}
//                 value={formData.email}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="message" className="block text-gray-700">
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 name="message"
//                 rows="4"
//                 required
//                 className="mt-1 px-4 py-2 w-full border rounded-md"
//                 onChange={handleChange}
//                 value={formData.message}
//               ></textarea>
//             </div>
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="bg-amber-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-amber-600 w-full"
//               >
//                 Send Message
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Contact;

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import emailjs from 'emailjs-com'; // Import EmailJS library

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/services/reducer/authSlice";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUser());
}, [dispatch]);

  useEffect(() => {
    // Initialize EmailJS with your User ID
    emailjs.init("ws5NX7Lnh6XvmFxP8");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send email using EmailJS
      await emailjs.sendForm('service_owj72jj', 'template_kwy05vv', event.target, 'ws5NX7Lnh6XvmFxP8');
      alert('Your message has been sent!');
      // Clear form after submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      alert('There was an error. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-lg w-full px-6 py-8 mt-14 bg-white shadow-md rounded-lg">
          <div className="flex flex-col justify-center items-center mb-8">
            <h1 className="text-3xl font-light text-gray-700">Contact Us</h1>
            <p className="mt-2 text-gray-600">We&apos;d love to hear from you!</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 px-4 py-2 w-full border rounded-md"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 px-4 py-2 w-full border rounded-md"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="mt-1 px-4 py-2 w-full border rounded-md"
                onChange={handleChange}
                value={formData.message}
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-amber-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-amber-600 w-full"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      {/* Include the EmailJS script */}
      <div id="success" style={{ display: 'none' }}></div>
      <div id="error" style={{ display: 'none' }}></div>
    </>
  );
};

export default Contact;


