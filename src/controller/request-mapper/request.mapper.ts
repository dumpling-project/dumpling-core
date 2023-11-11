export class RequestMapper{
    public static extractPathVariables(pathTemplate: string, actualPath: string): Record<string, string> {
        const vars: Record<string, string> = {};
        const templateParts = pathTemplate.split('/');
        const actualParts = actualPath.split('/');

        templateParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const varName = part.substring(1);
                vars[varName] = actualParts[index];
            }
        });

        return vars;
    }
}