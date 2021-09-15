export class AuthorCommiter {
  public login: string;
  public id = 1;
  public node_id = 'F9227B82=';
  public avatar_url = 'https://github.com/images/error/octocat_happy.gif';
  public gravatar_id = '';
  public url: string;
  public html_url: string;
  public followers_url: string;
  public following_url: string;
  public gists_url: string;
  public starred_url: string;
  public subscriptions_url: string;
  public organizations_url: string;
  public repos_url: string;
  public events_url: string;
  public received_events_url: string;
  public type = 'User';
  public site_admin = false;

  public constructor(username: string) {
    this.login = username;
    this.url = `https://api.github.com/users/${username}`;
    this.html_url = `https://github.com/${username}`;
    this.followers_url = `https://api.github.com/users/${username}/followers`;
    this.following_url = `https://api.github.com/users/${username}/following{/other_user}`;
    this.gists_url = `https://api.github.com/users/${username}/gists{/gist_id}`;
    this.starred_url = `https://api.github.com/users/${username}/starred{/owner}{/repo}`;
    this.subscriptions_url = `https://api.github.com/users/${username}/subscriptions`;
    this.organizations_url = `https://api.github.com/users/${username}/orgs`;
    this.repos_url = `https://api.github.com/users/${username}/repos`;
    this.events_url = `https://api.github.com/users/${username}/events{/privacy}`;
    this.received_events_url = `https://api.github.com/users/${username}/received_events`;
  }
}
