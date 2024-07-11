import {
  initAuth0,
  withMiddlewareAuthRequired,
} from "@auth0/nextjs-auth0/edge";

const isAuthEnabled = process.env.IS_AUTH_ENABLED === "true";

console.log("AUTH ENABLED: ", isAuthEnabled);

const auth0 = initAuth0({
  routes: {
    login: "/api/auth/login",
    callback: "/api/auth/callback",
    postLogoutRedirect: "/api/auth/logout",
  },
});

// The empty middleware function effectively turns off this export for dev and test environments
export default isAuthEnabled
  ? auth0.withMiddlewareAuthRequired()
  : function middleware() {};
