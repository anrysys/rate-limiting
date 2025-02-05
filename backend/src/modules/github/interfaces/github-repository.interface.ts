export interface GithubRepository {
  name: string;
  description: string | null;
  url: string;
  starCount: number;
  forkCount: number;
  primaryLanguage: string | null;
}
