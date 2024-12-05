import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";
import ContactForm from "../containers/ContactForm";

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <ContactForm />
      </div>
      <Footer />
    </>
  );
}
