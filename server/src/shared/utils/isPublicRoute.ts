import { PUBLIC_ROUTES } from "../routes/publicRoutes";

export const isPublicRoute = (routeURL: string) => {
    return PUBLIC_ROUTES.includes(routeURL);
};
