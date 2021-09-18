import { AuthorCommiter } from './author.mock';
import { CommitData } from './commit.data.mock';

export class MockCommit {
  public url: string;
  public sha: string;
  public node_id: string;
  public html_url: string;
  public comments_url: string;
  public commit: CommitData;

  public author: AuthorCommiter;
  public committer: AuthorCommiter;
  public parents: Array<{
    url: string;
    sha: string;
  }>;

  public constructor(sha: string, message: string, date: string | null) {
    this.url = `https://api.github.com/repos/onezerocompany/test/commits/${sha}`;
    this.sha = sha;
    const lengthOfId = 7;

    this.node_id = sha.substring(0, lengthOfId);
    this.html_url = `https://github.com/onezerocompany/test/commit/${sha}`;
    this.comments_url = `https://api.github.com/repos/onezerocompany/test/commits/${sha}/comments`;
    this.commit = new CommitData(sha, message, date);
    this.author = new AuthorCommiter('octocat');
    this.committer = new AuthorCommiter('octocat');
    this.parents = [
      {
        url: `https://api.github.com/repos/onezerocompany/test/commits/${sha}`,
        sha,
      },
    ];
  }
}
