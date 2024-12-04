import StyleChat from "../containers/StyleChat";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function StyleAdvisor() {
  return (
    <main>
      <Navbar />
      <div>
        <StyleChat />
      </div>
      <Footer />
    </main>
  );
}
