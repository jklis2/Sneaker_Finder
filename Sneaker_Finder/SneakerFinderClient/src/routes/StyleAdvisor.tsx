import StyleAdvisorForm from "../containers/StyleAdvisorForm";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function StyleAdvisor() {
  return (
    <main>
      <Navbar />
      <div>
        <StyleAdvisorForm />
      </div>
      <Footer />
    </main>
  );
}
