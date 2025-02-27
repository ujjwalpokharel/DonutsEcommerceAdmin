export interface OrderData {
  id: number;
  status: string;
  order_date: string;
  total_amount: number;
  user_id: number;
  customer_id: number;
  product: Product[];
}
export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  rating: number;
  OrderProduct: {
    quantity: number;
  };
}
export interface CustomerOrder {
  id: number;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  postal_code: string;
  city: string;
  address: string;
  appartment: string;
  order: OrderData[];
}
