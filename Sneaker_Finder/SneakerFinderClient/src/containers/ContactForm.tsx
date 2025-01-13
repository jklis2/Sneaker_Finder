import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t } = useTranslation('contactForm');
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
    <div className="max-w-[600px] mx-4 sm:mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {t('title')}
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        {t('description')}
      </p>

      <form className="space-y-6">
        <Input
          label={t('form.name.label')}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('form.name.placeholder')}
        />

        <Input
          label={t('form.email.label')}
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('form.email.placeholder')}
        />

        <Input
          label={t('form.subject.label')}
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t('form.subject.placeholder')}
        />

        <Input
          label={t('form.message.label')}
          id="message"
          name="message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('form.message.placeholder')}
          rows={5}
        />

        <div>
          <Button name={t('buttons.submit')} />
        </div>
      </form>
    </div>
  );
}
