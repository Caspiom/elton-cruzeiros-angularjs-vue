<script>
/**
 * <TabsPanel :tabs="[{ title, content }]" />
 * A aba ativa vive em `data`. Setas ← → e Home/End trocam de aba.
 */
export default {
  name: 'TabsPanel',
  props: {
    tabs: { type: Array, required: true }
  },
  data() {
    return {
      active: 0,
      uid: `tabs${Math.random().toString(36).slice(2, 8)}`
    }
  },
  methods: {
    select(i) {
      this.active = i
    },
    onKey(ev) {
      const n = this.tabs.length
      const destinos = {
        ArrowRight: (this.active + 1) % n,
        ArrowLeft: (this.active - 1 + n) % n,
        Home: 0,
        End: n - 1
      }
      if (!(ev.key in destinos)) return
      ev.preventDefault()
      this.select(destinos[ev.key])
      // depois que o Vue atualiza o tabindex, move o foco para a nova aba
      this.$nextTick(() => this.$refs.abas[this.active].focus())
    }
  }
}
</script>

<template>
  <div class="ec-tabs">
    <div class="ec-tablist" role="tablist" @keydown="onKey">
      <button
        v-for="(tab, i) in tabs"
        :key="tab.title"
        ref="abas"
        type="button"
        role="tab"
        class="ec-tab"
        :class="{ 'is-active': active === i }"
        :id="`${uid}-t${i}`"
        :aria-controls="`${uid}-p${i}`"
        :aria-selected="active === i"
        :tabindex="active === i ? 0 : -1"
        @click="select(i)"
      >{{ tab.title }}</button>
    </div>
    <div
      v-for="(tab, i) in tabs"
      v-show="active === i"
      :key="tab.title"
      class="ec-tabpanel"
      role="tabpanel"
      :id="`${uid}-p${i}`"
      :aria-labelledby="`${uid}-t${i}`"
      tabindex="0"
    >
      <p>{{ tab.content }}</p>
    </div>
  </div>
</template>
