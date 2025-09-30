const adminRoutes = [
    "/api/employees",
    "/api/employees/:id/delete",
    "/api/users",
    "/api/users/:id/delete",

];

export const isAdminRoute = (route: string) => adminRoutes.includes(route);