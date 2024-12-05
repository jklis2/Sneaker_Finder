import { useState } from "react";
import ContactInput from "../components/ContactInput";
import Button from "../components/Button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Skontaktuj się z nami
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Masz pytania? Chętnie na nie odpowiemy. Wyślij nam wiadomość, a my
        skontaktujemy się z Tobą tak szybko, jak to możliwe.
      </p>

      <form className="space-y-6">
        <ContactInput
          label="Imię i nazwisko"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jan Kowalski"
        />

        <ContactInput
          label="Adres email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jan.kowalski@example.com"
        />

        <ContactInput
          label="Temat"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="W czym możemy pomóc?"
        />

        <ContactInput
          label="Wiadomość"
          id="message"
          name="message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          placeholder="Twoja wiadomość..."
          rows={5}
        />

        <div>
          <Button name="Wyślij wiadomość" />
        </div>
      </form>
    </div>
  );
}
