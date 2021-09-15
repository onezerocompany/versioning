import { AuthorCommiter } from './author.mock';

export class ReleaseUpload {
  public url: string;
  public browser_download_url: string;
  public id: number;
  public node_id: string;
  public name: string;
  public label: string;
  public state = 'uploaded';
  public content_type = 'application/zip';
  public size = 1024;
  public download_count = 42;
  public created_at: string;
  public updated_at: string;
  public uploader = new AuthorCommiter('octocat');

  public constructor(name: string, id: number, tag: string, date: string) {
    this.url = `https://api.github.com/repos/onezerocompany/test/releases/assets/${id}`;
    this.browser_download_url = `https://github.com/onezerocompany/test/releases/download/${tag}/${name}`;
    this.id = id;
    this.node_id = `abc${id}`;
    this.name = name;
    this.label = `${name}-${tag}`;
    this.created_at = date;
    this.updated_at = date;
  }
}
