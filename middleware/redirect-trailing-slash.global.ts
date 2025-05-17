import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

// necessary so /music don't become /music/ until theres a nuxt configuration in nuxt 3: https://github.com/nuxt/nuxt/issues/15462
export default defineNuxtRouteMiddleware((to, _from) => {
  if (to.path !== '/' && to.path.endsWith('/')) {
    const { path, query, hash } = to;
    const nextPath = path.replace(/\/+$/, '') || '/';
    const nextRoute = { path: nextPath, query, hash };
    return navigateTo(nextRoute, { redirectCode: 301 });
  }
});
