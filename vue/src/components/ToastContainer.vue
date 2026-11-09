<script>
import { state } from '../services/toast.js'

/**
 * <ToastContainer /> — desenha as notificações do serviço global `$toast`.
 * Cada toast some sozinho (o serviço agenda) ou ao clicar no ×.
 */
export default {
  name: 'ToastContainer',
  data() {
    return { icones: { success: '✓', error: '!', info: 'i' } }
  },
  computed: {
    toasts() {
      return state.toasts
    }
  }
}
</script>

<template>
  <div class="ec-toast-stack" role="region" aria-label="Notificações" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="ec-toast" :class="`is-${t.tipo}`" :role="t.tipo === 'error' ? 'alert' : 'status'">
      <span class="ec-toast-icon" aria-hidden="true">{{ icones[t.tipo] }}</span>
      <p class="ec-toast-msg">{{ t.mensagem }}</p>
      <button type="button" class="ec-toast-close" aria-label="Fechar notificação" @click="$toast.dismiss(t.id)">×</button>
    </div>
  </div>
</template>
