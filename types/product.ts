export type ProductType = "course" | "app" | "template";

export interface Product {
  slug: string;
  name: string;
  type: ProductType;
  short_description: string;
  price: number;
  currency: string;
  is_active: boolean;
}
