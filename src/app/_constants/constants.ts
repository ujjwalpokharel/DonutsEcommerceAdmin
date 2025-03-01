const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const constants = {
  loginUrl: `${apiUrl}/auth/login`,
  signupUrl: `${apiUrl}/admins`,
  category: `${apiUrl}/category`,
  products: `${apiUrl}/products`,
  slider: `${apiUrl}/product-slider-image`,
  customer: `${apiUrl}/customer`,
  order: `${apiUrl}/order`,
};
