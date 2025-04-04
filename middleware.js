import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      return Response.redirect(loginUrl);
    }

    if (auth.userId) {
      const path = req.nextUrl.pathname;
      if (['/login', '/register', '/'].includes(path)) {
        const dashboardUrl = new URL('/dashboard', req.url);
        return Response.redirect(dashboardUrl);
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
