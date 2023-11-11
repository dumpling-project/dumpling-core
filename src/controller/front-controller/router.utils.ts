export class RouterUtils{
    private static cleanPath(path: string): string {
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

    public static joinPaths(...paths: string[]): string {
        return '/' + paths.map(path => RouterUtils.cleanPath(path)).filter(path => path.length > 0).join('/');
    }

    public static isDynamicPath(path: string): boolean {
        return path.includes(':');
    }
}