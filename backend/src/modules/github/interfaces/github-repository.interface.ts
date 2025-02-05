export interface GithubRepository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  starCount: number;
  forkCount: number;
  primaryLanguage: string | null;
  full_name: string | null | undefined;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  created_at: string;
  updated_at: string;
}
