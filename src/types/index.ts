export type CategoryId =
  | 'finance'
  | 'health'
  | 'datetime'
  | 'text'
  | 'developer'
  | 'generators'
  | 'image'
  | 'travel';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  iconBg?: string;
  iconText?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: CategoryId;
  iconName: string;
  isPopular?: boolean;
  tags: string[];
  howToUse: string[];
  howItWorks: string;
  faqs: FAQItem[];
  relatedToolSlugs: string[];
}
