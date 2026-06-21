export type ProductType = "course" | "app" | "template";

export interface ProductFile {
  id: string;
  product_slug: string;
  file_name: string;
  file_path: string;
  version: string;
  platform: "linux" | "windows" | "mac" | "pdf" | "zip";
  is_active: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  video_url: string;
  sort_order: number;
  is_preview: boolean;
}

export interface Product {
  slug: string;
  name: string;
  type: ProductType;
  short_description: string;
  description: string;
  promise: string;
  price: number;
  currency: string;
  is_active: boolean;
  audience: string[];
  problems: string[];
  includes: string[];
  outcomes: string[];
  faq: Array<{ question: string; answer: string }>;
  files?: ProductFile[];
  lessons?: CourseLesson[];
}
