export const ROUTES = {
  projects: 'projects',
  project: 'project',
  home: 'home',
  join: 'join',
  share: 'share',
  pofile: 'profile',
};

export function route(name: string, ...params: string[]) {
  let post = '';
  for (const param of params) {
    post += '/';
    post += param;
  }

  return `/${name}${post}`;
}
