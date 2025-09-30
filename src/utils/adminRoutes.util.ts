const adminRoutes = [
    "/api/employees",
    "/api/users",
];

function routerMatches(routeArray: string[], pattern: string){
    const regex = new RegExp(`^${pattern.replace(/:[a-zA-Z0-9_]+/g, "[^/]+")}$`);
    return routeArray.some(route => regex.test(route));
}
export const isAdminRoute = (pattern: string) => routerMatches(adminRoutes, pattern);