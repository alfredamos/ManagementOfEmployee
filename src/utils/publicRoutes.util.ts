const publicRoutes = [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/refresh",
];

export const isPublicRoute = (route: string) => publicRoutes.includes(route);