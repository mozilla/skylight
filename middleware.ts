import { initAuth0, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

const auth0 = initAuth0({
  routes: {
    login: '/api/auth/login',
    callback: '/api/auth/callback'
  }
});

export default auth0.withMiddlewareAuthRequired();
