export class MockTag {
  public name: string;
  public commit: {
    sha: string;
    url: string;
  };

  public zipball_url: string;
  public tarball_url: string;
  public node_id: string;

  public constructor(name: string, sha: string) {
    this.name = name;
    this.commit = {
      sha,
      url: `https://api.github.com/repos/onezerocompany/test/commits/${sha}`,
    };
    this.zipball_url = `https://api.github.com/repos/onezerocompany/test/zipball/${name}`;
    this.tarball_url = `https://api.github.com/repos/onezerocompany/test/tarball/${name}`;
    const lengthOfId = 7;

    this.node_id = sha.slice(0, lengthOfId);
  }
}
