const https = require('https');

const getAssetId = (release, repo, token) => {
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          host: 'api.github.com',
          path: `/repos/${repo}/releases/tags/${release}`,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            'Authorization': `token ${token}`,
          },
        },
        res => {
          let json = '';
          res.on('data', chunk => {
            json += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              const release = JSON.parse(json);
              resolve(
                release.assets.find(asset => asset.name === 'version.json').id
              );
            } else {
              reject(json);
            }
          });
        }
      )
      .on('error', err => {
        reject(err);
      });
  });
};

const getAsset = (id, repo, token) => {
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          host: 'api.github.com',
          path: `/repos/${repo}/releases/assets/${id}`,
          headers: {
            'Accept': 'application/octet-stream',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            'Authorization': `token ${token}`,
          },
        },
        res => {
          if (res.statusCode == 200) {
            let data = '';
            res.on('data', chunk => {
              data += chunk;
            });
            res.on('end', () => {
              if (res.statusCode === 200) {
                resolve(data);
              } else {
                reject(data);
              }
            });
          } else if (res.statusCode === 302) {
            const url = res.headers.location;
            https.get(
              url,
              {
                headers: {
                  'Accept': 'application/octet-stream',
                  'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
                  'Authorization': `token ${token}`,
                },
              },
              res => {
                if (res.statusCode == 200) {
                  let data = '';
                  res.on('data', chunk => {
                    data += chunk;
                  });
                  res.on('end', () => {
                    if (res.statusCode === 200) {
                      resolve(data);
                    } else {
                      reject(data);
                    }
                  });
                } else {
                  reject(res.statusCode);
                }
              }
            );
          } else {
            reject(res.statusCode);
          }
        }
      )
      .on('error', err => {
        reject(err);
      });
  });
};

const githubToken = process.env.INPUT_GITHUB_TOKEN;
const repo = process.env.INPUT_REPO;
const release = process.env.INPUT_RELEASE;

getAssetId(release, repo, githubToken)
  .then(assetId => {
    getAsset(assetId, repo, githubToken)
      .then(content => {
        const version = JSON.parse(content);
        // print each key and value recursively
        const outputVariables = (parent, value) => {
          // loop through keys of object
          for (const key of Object.keys(value)) {
            if (
              value.hasOwnProperty(key) &&
              !['changes', 'changelogs'].includes(key)
            ) {
              const name = [parent, key].filter(key => key).join('_');
              if (typeof value[key] === 'object') {
                outputVariables(name, value[key]);
              } else {
                console.log(`::set-output name=${name}::"${value[key]}"}`);
              }
            }
          }
        };
        outputVariables('', version);
        console.log(
          `::set-output name=json::"${content.replaceAll('"', '\\"')}"}`
        );
      })
      .catch(err => {
        console.error('Error Getting Asset Contents');
        console.error(err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('Error Getting Asset ID');
    console.error(err);
    process.exit(1);
  });
