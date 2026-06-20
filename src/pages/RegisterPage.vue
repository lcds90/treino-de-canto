<template>
  <q-page class="auth-page flex flex-center">
    <div class="background-gradients">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
    </div>

    <q-card class="auth-card shadow-24 q-pa-lg text-center" style="border-radius: 20px;">
      <q-card-section>
        <div class="brand-container q-mb-md">
          <q-avatar size="72px" font-size="44px" color="secondary" text-color="white" icon="person_add" class="brand-logo shadow-5" />
        </div>
        <h2 class="text-h4 text-weight-bolder text-secondary q-my-none">Nova Conta</h2>
        <p class="text-subtitle2 text-grey-6 q-mt-xs q-mb-md">Cadastre-se para iniciar seus treinos personalizados</p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="handleRegister" class="q-gutter-md">
          <q-input
            v-model="email"
            label="E-mail"
            type="email"
            outlined
            rounded
            lazy-rules
            :rules="[
              val => !!val || 'O e-mail é obrigatório',
              val => isValidEmail(val) || 'Digite um e-mail válido'
            ]"
            color="secondary"
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="secondary" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            outlined
            rounded
            lazy-rules
            :rules="[
              val => !!val || 'A senha é obrigatória',
              val => val.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
            ]"
            color="secondary"
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="secondary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            label="Confirmar Senha"
            :type="showConfirmPassword ? 'text' : 'password'"
            outlined
            rounded
            lazy-rules
            :rules="[
              val => !!val || 'Confirme sua senha',
              val => val === password || 'As senhas não coincidem'
            ]"
            color="secondary"
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_reset" color="secondary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <div class="q-mt-lg">
            <q-btn
              label="Cadastrar"
              type="submit"
              color="secondary"
              text-color="white"
              size="lg"
              rounded
              unelevated
              class="full-width register-btn"
              :loading="authStore.isLoading"
            >
              <template v-slot:loading>
                <q-spinner-oval color="white" />
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-md">
        <div class="text-grey-7 text-body2">
          Já possui uma conta?
          <router-link :to="{ name: 'login' }" class="auth-link text-weight-bold text-primary">
            Entre aqui
          </router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function isValidEmail(val: string): boolean {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(val);
}

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    $q.notify({
      type: 'warning',
      message: 'As senhas não coincidem.',
      position: 'top-right',
    });
    return;
  }

  try {
    await authStore.register(email.value, password.value);
    $q.notify({
      type: 'positive',
      message: 'Conta criada com sucesso! Seja bem-vindo(a)! 🎤',
      position: 'top-right',
    });
    void router.push({ name: 'index' });
  } catch (error: any) {
    let errorMessage = 'Erro ao criar conta. Tente novamente.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este e-mail já está cadastrado.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Formato de e-mail inválido.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha digitada é considerada fraca pela segurança.';
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right',
    });
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.body--dark .auth-page {
  background: linear-gradient(135deg, #1e1e24 0%, #0c0d10 100%);
}

.background-gradients {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float-bubbles 10s ease-in-out infinite alternate;
}

.bubble-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--q-primary) 0%, transparent 70%);
  top: -50px;
  left: -50px;
}

.bubble-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--q-secondary) 0%, transparent 70%);
  bottom: -100px;
  right: -50px;
}

@keyframes float-bubbles {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(30px) scale(1.1);
  }
}

.auth-card {
  width: 100%;
  max-width: 420px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.body--dark .auth-card {
  background: rgba(30, 30, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.brand-logo {
  animation: pulse-avatar 2s infinite ease-in-out;
}

@keyframes pulse-avatar {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.register-btn {
  background: linear-gradient(135deg, var(--q-secondary) 0%, #1e857b 100%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.auth-link {
  text-decoration: none;
  transition: color 0.2s ease;
}

.auth-link:hover {
  text-decoration: underline;
  color: var(--q-secondary);
}
</style>
