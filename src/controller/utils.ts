function cleanPath(path: string): string {
    // 앞뒤 공백 제거
    path = path.trim();
    if (path.length > 1 && path.startsWith('/')) {
        path = path.substring(1);
    }
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    return path;
}

export function joinPaths(...paths: string[]): string {
    return '/' + paths.map(path => cleanPath(path)).filter(path => path.length > 0).join('/');
}