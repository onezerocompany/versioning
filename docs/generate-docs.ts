import { writeFileSync } from 'fs';
import { categories } from '../functions/src/change-categories';
import { ChangelogType } from '../functions/src/changelogs';

const style = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather&family=Open+Sans&family=Source+Code+Pro&display=swap');
html, body {
  background: #f9f9f9;
  font-family: 'Open Sans', sans-serif;
  color: rgb(92, 130, 170);
}
.category {
  display: inline-block;
  vertical-align: middle;
  border-radius: 40px;
  background: #f9f9f9;
  box-shadow:  20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  margin: 30px;
  padding: 30px 40px;
  max-width: 380px;
}
h1, h2, h3, h4, h5, h6, p {
  margin: 0;
  padding: 0;
}
.rules {
  padding: 40px;
  font-family: 'Merriweather', serif;
}
.rules h1 {
  font-size: 38px;
  margin-bottom: 20px;
}
.rules p {
  font-size: 22px;
  padding: 8px 0;
}
.category h1, .category h4 {
  font-family: 'Merriweather', serif;
}
.category h4 {
  margin-top: 12px;
  margin-bottom: 18px;
}
.category p {
  display: inline-block;
  background: rgb(92, 130, 170);
  color: #f9f9f9;
  font-size: 16px;
  border-radius: 40px;
  margin: 5px;
  padding: 4px 12px;
}
.category p span {
  opacity: 0.7;
  font-size: 12px;
  padding-right: 6px;
}
.category p.test {
  background: rgb(108, 90, 199);
}
.category p.release {
  background: rgb(19, 209, 171);
}
.category p.inactive {
  opacity: 0.4;
}
.category p.internal {
  background: rgb(150, 150, 150);
}
.category p.external {
  background: rgb(228, 55, 119);
}
pre {
  font-family: 'Source Code Pro', monospace;
}
.examples {
  background: #f1f0f0;
  color: #817f7f;
  border-radius: 10px;
  padding: 20px;
  overflow: scroll;
}
.categories-title {
  margin-top: 60px;
  margin-bottom: 40px;
  margin-left: 30px;
  font-size: 52px;
  font-family: 'Source Code Pro', monospace;
}
@media (prefers-color-scheme: dark) {
  html, body, .category {
    background: #35343d;
    color: #c7c2c2;
  }
  .category {
    box-shadow: 20px 20px 60px rgba(5, 5, 8, 0.55),
      -20px -20px 60px rgba(84, 84, 105, 0.53);
  }
  .examples {
    background: #252525;
    color: #cdcdcd;
  }
}
`

var html = `<html><head><title>Changelog Categories</title><style>${style}</style></head><body>`

html += '<div class="rules">'
html += '<h1>The 5 commandments of commiting.</h1>'
html += '<p class="commit-rule">1. The title shall not contain any changelog tags'
html += '<p class="commit-rule">2. Every line in the message shall contain a tag'
html += '<p class="commit-rule">3. Only one change per line, and try to keep them short!'
html += '<p class="commit-rule">4. Everything except names shall be lowercased'
html += '<p class="commit-rule">5. Follow rules 1, 2, 3 and 4 religously'
html += '</div>'

// html += '<h2 class="categories-title">Changelog Categories</h2>'
for (let category of categories) {

  html += '<div class="category">'
    html += '<h1>' + category.title + '</h1>'
    html += '<h4>' + category.description + '</h4>'
    html += `<p class="${category.changelogType == ChangelogType.external ? 'external' : 'internal'}"><span>CHANGELOG</span> ${category.changelogType}</p>`
    html += '<p class="version"><span>VERSION INCREASE</span> ' + category.versionBump + '</p>'
    html += `<p class="test ${category.triggers.tests ? '' : 'inactive'}"><span>TRIGGERS TESTS</span> ${category.triggers.tests ? 'yes' : 'no'}</p>`
    html += `<p class="release ${category.triggers.release ? '' : 'inactive'}"><span>TRIGGERS RELEASE</span> ${category.triggers.release ? 'yes' : 'no'}</p>`
    html += '<pre class="examples">'
      for (let key of category.keys) {
        html += `[${key}]> {{insert your message here}}\n`
      }
    html += '</pre>'
  html += '</div>'

}

html += '</body>'

writeFileSync('index.html', html)