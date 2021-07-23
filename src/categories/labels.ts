import { categories } from './categories';

let output = '';

for (const category of categories) {
  output += `${category.label} = {`;
  output += `  color = "${category.color}"`;
  output += `  description = "${category.description}"`;
  output += '}';
}

// eslint-disable-next-line no-console
console.log(output);
export { output };
