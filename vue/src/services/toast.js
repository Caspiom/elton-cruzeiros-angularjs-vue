/**
 * Serviço de toast (globalmente acessível via this.$toast).
 * Guarda a lista de notificações em um objeto reativo; <ToastContainer> só a desenha.
 * Várias notificações podem existir ao mesmo tempo.
 */
import { reactive } from 'vue'

const DURACAO_PADRAO = 4000 // ms
let proximoId = 1

export const state = reactive({ toasts: [] })

function dismiss(id) {
  const i = state.toasts.findIndex((t) => t.id === id)
  if (i !== -1) state.toasts.splice(i, 1)
}

function show(tipo, mensagem, duracao = DURACAO_PADRAO) {
  const id = proximoId++
  state.toasts.push({ id, tipo, mensagem })
  setTimeout(() => dismiss(id), duracao)
  return id
}

export const toast = {
  dismiss,
  success: (msg, ms) => show('success', msg, ms),
  error: (msg, ms) => show('error', msg, ms),
  info: (msg, ms) => show('info', msg, ms)
}

export default {
  install(app) {
    app.config.globalProperties.$toast = toast
  }
}
