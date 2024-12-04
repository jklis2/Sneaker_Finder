interface Selectors {
  title: string;
  price: string;
  exampleTestButton: string;
}

export const selectors: Selectors = {
  title: ".single-product__title",
  price: ".summary .woocommerce-Price-amount",
  exampleTestButton: "button[data-cy*='test']",
};
