<script>
/**
 * <DropdownMenu label="Destino" :options="[{ value, label }]" :selected="valor" @select="escolher" />
 * Visibilidade em `data`. Cada opção escolhida dispara `select` com a opção inteira.
 * Fecha ao escolher, ao clicar fora e com Esc (ouvintes no document: mounted/beforeUnmount).
 */
export default {
  name: 'DropdownMenu',
  props: {
    label: { type: String, required: true },
    options: { type: Array, required: true },
    selected: { type: String, default: '' }
  },
  emits: ['select'],
  data() {
    return { open: false }
  },
  computed: {
    current() {
      return this.options.find((o) => o.value === this.selected) ?? this.options[0]
    }
  },
  mounted() {
    document.addEventListener('click', this.fecharSeFora)
    document.addEventListener('keydown', this.fecharComEsc)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.fecharSeFora)
    document.removeEventListener('keydown', this.fecharComEsc)
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    choose(opt) {
      this.open = false
      this.$emit('select', opt)
      this.$refs.botao.focus()
    },
    fecharSeFora(ev) {
      if (this.open && !this.$el.contains(ev.target)) this.open = false
    },
    fecharComEsc(ev) {
      if (this.open && ev.key === 'Escape') {
        this.open = false
        this.$refs.botao.focus()
      }
    }
  }
}
</script>

<template>
  <div class="ec-dropdown" :class="{ 'is-open': open }">
    <button ref="botao" type="button" class="ec-dropdown-btn" aria-haspopup="listbox" :aria-expanded="open" :aria-label="`${label}: ${current.label}`" @click="toggle">
      <span class="ec-dropdown-label">{{ label }}</span>
      <span class="ec-dropdown-value">{{ current.label }}</span>
      <span class="ec-dropdown-caret" aria-hidden="true"></span>
    </button>
    <ul v-show="open" class="ec-dropdown-menu" role="listbox" :aria-label="label">
      <li v-for="opt in options" :key="opt.value" role="presentation">
        <button
          type="button"
          role="option"
          class="ec-dropdown-opt"
          :class="{ 'is-selected': opt.value === selected }"
          :aria-selected="opt.value === selected"
          @click="choose(opt)"
        >{{ opt.label }}</button>
      </li>
    </ul>
  </div>
</template>
