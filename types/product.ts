export type ProductType = "course" | "app" | "template";
export type ProductStatus = "ready" | "not_ready";

export interface ProductFile {
  id: string;
  product_slug: string;
  file_name: string;
  file_path: string;
  release_repository: string;
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

export interface ProductHighlight {
  icon: string;
  title: string;
  text: string;
}

export interface ProductGalleryImage {
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
}

export interface ProductMonthlyPricing {
  introductory_price: number;
  renewal_price: number;
  duration_months: number;
}

export interface Product {
  slug: string;
  name: string;
  type: ProductType;
  status?: ProductStatus;
  icon: { src: string; alt: string; width: number; height: number };
  short_description: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  promise: string;
  /** The one-time lifetime price. */
  price: number;
  monthly_pricing?: ProductMonthlyPricing;
  currency: string;
  is_active: boolean;
  audience: string[];
  problems: string[];
  includes: string[];
  outcomes: string[];
  badges?: string[];
  highlights?: ProductHighlight[];
  gallery?: ProductGalleryImage[];
  faq: Array<{ question: string; answer: string }>;
  files?: ProductFile[];
  lessons?: CourseLesson[];
}
