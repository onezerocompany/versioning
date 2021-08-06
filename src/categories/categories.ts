import { readFileSync } from 'fs';
import { parse } from 'yaml';

const file = `${__dirname}/../../categories.yml`;

export enum CategoryScope {
  public = 'public',
  private = 'private',
}

export enum CategoryBump {
  none = 'none',
  patch = 'patch',
  minor = 'minor',
  major = 'major',
}

export const bumpOrder = [
  CategoryBump.none,
  CategoryBump.patch,
  CategoryBump.minor,
  CategoryBump.major,
];

export interface Category {
  id: string;
  title: string;
  description: string;
  color: string;
  label: string;
  tags: string[];
  scope: CategoryScope;
  bump: CategoryBump;
  triggers: {
    test: boolean;
    release: boolean;
  };
}

export const categories: Category[] = parse(
  readFileSync(file).toString()
) as Category[];

export const validateTag = (tag: string): boolean => {
  for (const category of categories) {
    if (category.tags.includes(tag)) return true;
  }

  return false;
};

export const resolveTag = (tag: string): Category =>
  categories.find(category => category.tags.includes(tag)) ??
  categories[categories.length - 1];

export const resolveID = (id: string): Category =>
  categories.find(category => category.id === id) ??
  categories[categories.length - 1];
