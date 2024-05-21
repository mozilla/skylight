import { initAuth0, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

const isDevEnvironment = process.env.NODE_ENV === 'development';

const auth0 = initAuth0({
  routes: {
    login: '/api/auth/login',
    callback: '/api/auth/callback'
  }
});

// The empty middleware function effectively turns off this export for dev environments
export default isDevEnvironment ? function middleware() {} : auth0.withMiddlewareAuthRequired();
