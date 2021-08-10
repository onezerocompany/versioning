import { categories } from './categories';

let output = '';

for (const category of categories) {
  output += `${category.label} = {\n`;
  output += `  color = "${category.color}"\n`;
  output += `  description = "${category.description}"\n`;
  output += '}\n';
}

// eslint-disable-next-line no-console
console.log(output);
export { output };
