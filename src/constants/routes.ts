export const ROUTES = {
  projects: 'projects',
  project: 'project',
  home: '',
  join: 'join',
  share: 'share',
  profile: 'profile',
};

export function route(name: string, ...params: string[]) {
  let post = '';
  for (const param of params) {
    post += '/';
    post += param;
  }

  return `/${name}${post}`;
}
