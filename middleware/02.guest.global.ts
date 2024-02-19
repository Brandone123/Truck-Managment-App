import {useAuthStore} from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  if (auth.isLoggedIn && to.fullPath.includes('/auth/')) {
    return navigateTo("/", {replace: true});
  }
})