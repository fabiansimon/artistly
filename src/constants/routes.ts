export const ROUTES = {
  projects: 'projects',
  project: 'project',
  home: 'home',
  join: 'join',
  listen: 'listen',
  profile: 'profile',
  invites: 'invites',
  landing: '',
};

export const openRoutes = new Set([ROUTES.listen, ROUTES.landing]);

export function route(name: string, ...params: string[]) {
  let post = '';
  for (const param of params) {
    post += '/';
    post += param;
  }

  return `/${name}${post}`;
}
