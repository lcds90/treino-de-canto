import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from 'src/boot/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(true);
  const authReady = ref(false);

  // Promise resolver to let router guard await Firebase initialization
  let resolveReady: (value: boolean) => void;
  const isReadyPromise = new Promise<boolean>((resolve) => {
    resolveReady = resolve;
  });

  // Start listening to auth state changes
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    isLoading.value = false;
    authReady.value = true;
    if (resolveReady) {
      resolveReady(true);
    }
  });

  const isAuthenticated = computed(() => !!user.value);

  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(email: string, password: string) {
    isLoading.value = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await signOut(auth);
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isLoading,
    authReady,
    isReady: isReadyPromise,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
