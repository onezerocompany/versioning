import { debug } from '@actions/core';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'yaml';

const file = resolve(`${__dirname}/../../categories.yml`);

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
  let valid = false;

  for (const category of categories) {
    if (category.tags.includes(tag)) valid = true;
  }

  debug(`Tag validation for ${tag} resulted in ${valid ? 'valid' : 'invalid'}`);

  return valid;
};

export const resolveTag = (tag: string): Category => {
  const resolved =
    categories.find(category => category.tags.includes(tag)) ??
    categories[categories.length - 1];

  debug(`Resolved tag ${tag} to ${resolved.id}`);

  return resolved;
};

export const resolveID = (id: string): Category => {
  const resolved =
    categories.find(category => category.id === id) ??
    categories[categories.length - 1];

  debug(`Resolved id ${id} to ${resolved.id}`);

  return resolved;
};
