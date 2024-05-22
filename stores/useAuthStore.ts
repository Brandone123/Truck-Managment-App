import { defineStore } from "pinia";
import { useApiFetch } from "~/composables/useApiFetch";
import type { EmployeeInfo } from "~/types/store/employee";

type User = {
  id: number;
  name: string;
  email: string;
  employee?: EmployeeInfo;
}

type Credentials = {
  email: string;
  password: string;
}

type RegistrationInfo = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const errorMessage = ref("");
  let errorTimeout: NodeJS.Timeout | null = null;

  async function logout() {
    const {error} = await useApiFetch("/api/logout", { method: "POST" });
    if(error.value){
      console.log(error.value)
    }else{
      user.value = null;
    }
    
    
    // navigateTo("/auth/login");
  }

  async function fetchUser() {
    const { data, error } = await useApiFetch("/api/auth_user");
    user.value = data.value as User;
  }

  async function login(credentials: Credentials) {
    errorMessage.value = ""
    await useApiFetch("/sanctum/csrf-cookie");
    const login = await useApiFetch("/api/login", {
      method: "POST",
      body: credentials,
    });

    if (login.error) {
      errorMessage.value = "Login failed. Please check your credentials.";
      // scheduleErrorMessageClear();
    }

    await fetchUser();
    
    return login;
  }

  async function register(info: RegistrationInfo) {
    errorMessage.value = ""
    await useApiFetch("/sanctum/csrf-cookie");
    const register = await useApiFetch("/api/register", {
      method: "POST",
      body: info,
    });

    if (register.error) {
      errorMessage.value = "Registration failed. Please try again.";
      // scheduleErrorMessageClear();
    } else {
      errorMessage.value = ""
    }

    await fetchUser();
    return register;
  }

  function clearErrorMessage() {
    errorMessage.value = "";
  }

  // function scheduleErrorMessageClear() {
  //   if (errorTimeout) {
  //     clearTimeout(errorTimeout);
  //   }

  //   errorTimeout = setTimeout(clearErrorMessage, 2000);
  // }

  return { user, login, isLoggedIn, fetchUser, logout, register, errorMessage }
})