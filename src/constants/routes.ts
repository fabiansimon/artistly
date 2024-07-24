export const ROUTES = {
  projects: 'projects',
  project: 'project',
  home: 'home',
  join: 'join',
  share: 'share',
  profile: 'profile',
  landing: '',
};

export const openRoutes = new Set([ROUTES.share, ROUTES.landing]);

export function route(name: string, ...params: string[]) {
  let post = '';
  for (const param of params) {
    post += '/';
    post += param;
  }

  return `/${name}${post}`;
}
