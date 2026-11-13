// Storefront API (public token). Checkout runs on the Shopify store, never on Good Chapter.
const SHOPIFY_STOREFRONT_URL = "https://good-chapter-she2du76.myshopify.com/api/2026-10/graphql.json";
const SHOPIFY_STOREFRONT_TOKEN = "559686c2d537ab6a2f8f79dc0a21e44c";

// Sample gift id to Shopify product variant.
export const shopifyVariants: Record<string, string> = {
  candle: "gid://shopify/ProductVariant/51042793586753",
  mug: "gid://shopify/ProductVariant/51042793619521",
  plant: "gid://shopify/ProductVariant/51042793717825",
  pan: "gid://shopify/ProductVariant/51042793783361",
  kettle: "gid://shopify/ProductVariant/51042793816129",
  towels: "gid://shopify/ProductVariant/51042793881665",
  toolbox: "gid://shopify/ProductVariant/51042793947201",
  lamp: "gid://shopify/ProductVariant/51042794012737",
};

const CART_CREATE = `mutation cartCreate($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`;

export async function createGiftCheckout(variantId: string): Promise<string> {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN },
    body: JSON.stringify({ query: CART_CREATE, variables: { input: { lines: [{ quantity: 1, merchandiseId: variantId }] } } }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}`);
  const json = await res.json();
  const cart = json?.data?.cartCreate;
  if (!cart?.cart?.checkoutUrl || cart.userErrors?.length) throw new Error("Checkout could not be created");
  const url = new URL(cart.cart.checkoutUrl);
  url.searchParams.set("channel", "online_store");
  return url.toString();
}
