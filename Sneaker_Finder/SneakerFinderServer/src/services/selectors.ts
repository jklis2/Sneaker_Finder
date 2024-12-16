interface Selectors {
  title: string;
  price: string;
  exampleTestButton: string;
  productLinks: string;
  paginationNext: string;
  brand: string;
  brandMeta: string;
  color: string;
  image: string;
  sizes: string;
  additionalInfo: string;
}

export const selectors: Selectors = {
  title: "h1.product_title",
  price: "p.price .woocommerce-Price-amount",
  exampleTestButton: "button[data-cy*='test']",
  productLinks: "ul.products li.product a.woocommerce-loop-product__link",
  paginationNext: "a.next.page-numbers",
  brand: ".woocommerce-product-attributes-item--attribute_pa_producent .woocommerce-product-attributes-item__value p",
  brandMeta: ".single-product__meta",
  color: ".woocommerce-product-attributes-item--attribute_pa_kolor .woocommerce-product-attributes-item__value p",
  image: ".woocommerce-product-gallery__wrapper img:first-child",
  sizes: ".woocommerce-product-attributes-item--attribute_pa_rozmiar .woocommerce-product-attributes-item__value p",
  additionalInfo: "#tab-additional_information .woocommerce-product-attributes"
};
