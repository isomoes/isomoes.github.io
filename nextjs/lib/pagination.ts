export function getPaginationBasePath(pathname: string) {
  return pathname
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/^\//, '')
    .replace(/\/+$/, '')
}
