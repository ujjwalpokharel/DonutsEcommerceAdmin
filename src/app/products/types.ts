export interface CategoryData {
  id: number;
  category_name: string;
  createdAt: string;
  updatedAt: string;
  product: [];
}

export interface CategoryPostData {
  name: string;
  price: string;
  description: string;
  rating: string;
  categoryIds: number[];
  image: File;
}

export interface GetCategoryData {
  categories: [];
  description: string;
  id: number;
  image: string;
  name: string;
  price: number;
  rating: number;
  sliderImage: [];
}
export interface SliderImage {
  image: File;
  altText: string;
  id: number;
}
