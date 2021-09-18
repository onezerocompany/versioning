const reverse = (str: string): string => str.split('').reverse().join('');

export class CommitData {
  public url: string;
  public author: {
    name: string;
    email: string;
    date?: string;
  };

  public committer: {
    name: string;
    email: string;
    date?: string;
  };

  public message: string;
  public tree: {
    url: string;
    sha: string;
  };

  public comment_count = 0;
  public verification = {
    verified: false,
    reason: 'unsigned',
    signature: null,
    payload: null,
  };

  public constructor(sha: string, message: string, date: string | null) {
    this.url = `https://api.github.com/repos/onezerocompany/test/git/commits/${sha}`;
    this.author = {
      name: 'Monalisa Octocat',
      email: 'support@github.com',
      // eslint-disable-next-line no-undefined
      date: date === null ? undefined : date,
    };
    this.committer = {
      name: 'Monalisa Octocat',
      email: 'support@github.com',
      // eslint-disable-next-line no-undefined
      date: date === null ? undefined : date,
    };
    this.message = message;
    this.tree = {
      url: `https://api.github.com/repos/onezerocompany/test/git/trees/${reverse(
        sha
      )}`,
      sha: reverse(sha),
    };
  }
}
