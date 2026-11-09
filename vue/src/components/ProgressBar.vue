<script>
/**
 * <ProgressBar :value="0-100" label="Texto" variant="success" />
 * `value` fora da faixa 0-100 é limitado; a largura do preenchimento acompanha o valor.
 */
export default {
  name: 'ProgressBar',
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, required: true },
    variant: { type: String, default: 'info' }   // 'info' | 'success'
  },
  computed: {
    percent() {
      const n = Math.round(this.value)
      return Number.isNaN(n) ? 0 : Math.min(100, Math.max(0, n))
    }
  }
}
</script>

<template>
  <div class="ec-progress">
    <div class="ec-progress-head"><span>{{ label }}</span><strong>{{ percent }}%</strong></div>
    <div class="ec-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent" :aria-label="label">
      <div class="ec-progress-fill" :class="`is-${variant}`" :style="{ width: `${percent}%` }"></div>
    </div>
  </div>
</template>
