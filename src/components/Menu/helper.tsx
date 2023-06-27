export const resolvePath: (basePath: string, path: string | undefined) => string = (basePath, path) => {
  if (!path) return basePath
  if (path.startsWith('/')) {
    return path
  }
  return basePath + (basePath.endsWith('/') ? '' : '/') + path
}

export const resolvePaths: (paths: string[]) => string = (paths) => {
  let path = paths[0]
  if (path.startsWith('/')) return path
  for (let i = 1; i < paths.length; i++) {
    if (path.startsWith('/')) return path
    path = resolvePath(paths[i], path)
  }
  return (path.startsWith('/') ? '' : '/') + path
}
