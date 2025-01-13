import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

export default function PrivacyPolicy() {
  const { t } = useTranslation('privacyPolicy');
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
          <div className="prose">
            <p>{t('sections.introduction.content')}</p>

            <h2 className="text-2xl font-semibold mt-4">{t('sections.dataCollection.title')}</h2>
            <p>{t('sections.dataCollection.content')}</p>
            <ul>
              <li>{t('sections.dataCollection.items.0')}</li>
              <li>{t('sections.dataCollection.items.1')}</li>
              <li>{t('sections.dataCollection.items.2')}</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-4">{t('sections.dataUse.title')}</h2>
            <p>{t('sections.dataUse.content')}</p>
            <ul>
              <li>{t('sections.dataUse.items.0')}</li>
              <li>{t('sections.dataUse.items.1')}</li>
              <li>{t('sections.dataUse.items.2')}</li>
              <li>{t('sections.dataUse.items.3')}</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-4">{t('sections.dataSecurity.title')}</h2>
            <p>{t('sections.dataSecurity.content')}</p>

            <h2 className="text-2xl font-semibold mt-4">{t('sections.cookies.title')}</h2>
            <p>{t('sections.cookies.content')}</p>

            <h2 className="text-2xl font-semibold mt-4">{t('sections.contact.title')}</h2>
            <p>{t('sections.contact.content')}</p>
          </div>

          <div className="mt-8">
            <Button
              name={t('button.backToRegistration')}
              onClick={() => navigate("/auth/register")}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
