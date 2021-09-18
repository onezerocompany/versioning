import { AuthorCommiter } from './author.mock';
import { ReleaseAsset } from './release.asset.mock';

export class Release {
  public url: string;
  public html_url: string;
  public assets_url: string;
  public upload_url: string;
  public tarball_url: string;
  public zipball_url: string;
  public discussion_url =
    'https://github.com/onezerocompany/test/discussions/90';

  public id: number;
  public node_id: string;
  public tag_name: string;
  public target_commitish: string;
  public name: string;
  // eslint-disable-next-line id-denylist
  public body: string;
  public draft = false;
  public prerelease = false;
  public created_at: string;
  public published_at: string;
  public author: AuthorCommiter;
  public assets: ReleaseAsset[];

  // eslint-disable-next-line id-denylist
  public constructor(id: number, tag: string, body: string, date: string) {
    this.url = `https://api.github.com/repos/onezerocompany/test/releases/${id}`;
    this.html_url = `https://github.com/onezerocompany/test/releases/${tag}`;
    this.assets_url = `https://api.github.com/repos/onezerocompany/test/releases/${id}/assets`;
    this.upload_url = `https://uploads.github.com/repos/onezerocompany/test/releases/${id}/assets`;
    this.tarball_url = `https://api.github.com/repos/onezerocompany/test/tarball/${tag}`;
    this.zipball_url = `https://api.github.com/repos/onezerocompany/test/zipball/${tag}`;
    this.id = id;
    this.node_id = `abc${id}`;
    this.tag_name = tag;
    this.target_commitish = 'main';
    this.name = tag;
    // eslint-disable-next-line id-denylist
    this.body = body;
    this.created_at = date;
    this.published_at = date;
    this.author = new AuthorCommiter('octocat');
    this.assets = [new ReleaseAsset('version.json', tag, id, date)];
  }
}
