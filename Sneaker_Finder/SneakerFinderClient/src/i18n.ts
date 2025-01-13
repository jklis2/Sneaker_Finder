import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import settingsEN from './translations/en/settingsEN.json';
import settingsPL from './translations/pl/settingsPL.json';
import myOrdersEN from './translations/en/myOrdersEN.json';
import myOrdersPL from './translations/pl/myOrdersPL.json';
import orderCardEN from './translations/en/orderCardEN.json';
import orderCardPL from './translations/pl/orderCardPL.json';
import cartEN from './translations/en/cartEN.json';
import cartPL from './translations/pl/cartPL.json';
import checkoutEN from './translations/en/checkoutEN.json';
import checkoutPL from './translations/pl/checkoutPL.json';
import checkoutSuccessEN from './translations/en/checkoutSuccessEN.json';
import checkoutSuccessPL from './translations/pl/checkoutSuccessPL.json';
import contactFormEN from './translations/en/contactFormEN.json';
import contactFormPL from './translations/pl/contactFormPL.json';
import styleAdvisorEN from './translations/en/styleAdvisorEN.json';
import styleAdvisorPL from './translations/pl/styleAdvisorPL.json';
import allProductsEN from './translations/en/allProductsEN.json';
import allProductsPL from './translations/pl/allProductsPL.json';
import allBrandsEN from './translations/en/allBrandsEN.json';
import allBrandsPL from './translations/pl/allBrandsPL.json';
import privacyPolicyEN from './translations/en/privacyPolicyEN.json';
import privacyPolicyPL from './translations/pl/privacyPolicyPL.json';
import loginFormEN from './translations/en/loginFormEN.json';
import loginFormPL from './translations/pl/loginFormPL.json';
import registerFormEN from './translations/en/registerFormEN.json';
import registerFormPL from './translations/pl/registerFormPL.json';
import addToCartEN from './translations/en/addToCartEN.json';
import addToCartPL from './translations/pl/addToCartPL.json';
import orderConfirmationEN from './translations/en/orderConfirmationEN.json';
import orderConfirmationPL from './translations/pl/orderConfirmationPL.json';
import footerEN from './translations/en/footerEN.json';
import footerPL from './translations/pl/footerPL.json';
import navbarEN from './translations/en/navbarEN.json';
import navbarPL from './translations/pl/navbarPL.json';
import homeEN from './translations/en/homeEN.json';
import homePL from './translations/pl/homePL.json';
import productEN from './translations/en/productEN.json';
import productPL from './translations/pl/productPL.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        settings: settingsEN,
        myOrders: myOrdersEN,
        orderCard: orderCardEN,
        cart: cartEN,
        checkout: checkoutEN,
        checkoutSuccess: checkoutSuccessEN,
        contactForm: contactFormEN,
        styleAdvisor: styleAdvisorEN,
        allProducts: allProductsEN,
        allBrands: allBrandsEN,
        privacyPolicy: privacyPolicyEN,
        loginForm: loginFormEN,
        registerForm: registerFormEN,
        addToCart: addToCartEN,
        orderConfirmation: orderConfirmationEN,
        footer: footerEN,
        navbar: navbarEN,
        home: homeEN,
        product: productEN
      },
      pl: {
        settings: settingsPL,
        myOrders: myOrdersPL,
        orderCard: orderCardPL,
        cart: cartPL,
        checkout: checkoutPL,
        checkoutSuccess: checkoutSuccessPL,
        contactForm: contactFormPL,
        styleAdvisor: styleAdvisorPL,
        allProducts: allProductsPL,
        allBrands: allBrandsPL,
        privacyPolicy: privacyPolicyPL,
        loginForm: loginFormPL,
        registerForm: registerFormPL,
        addToCart: addToCartPL,
        orderConfirmation: orderConfirmationPL,
        footer: footerPL,
        navbar: navbarPL,
        home: homePL,
        product: productPL
      }
    },
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
