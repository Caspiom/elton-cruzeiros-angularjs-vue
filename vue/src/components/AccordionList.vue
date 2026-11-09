<script>
/**
 * <AccordionList :items="[{ title, content }]" :single-open="true" />
 * O estado de qual painel está aberto fica em `data`. A transição é feita em CSS.
 */
export default {
  name: 'AccordionList',
  props: {
    items: { type: Array, required: true },
    singleOpen: { type: Boolean, default: true }
  },
  data() {
    return {
      abertos: [],                          // índices dos painéis abertos
      uid: `acc${Math.random().toString(36).slice(2, 8)}`
    }
  },
  methods: {
    isOpen(i) {
      return this.abertos.includes(i)
    },
    toggle(i) {
      if (this.isOpen(i)) {
        this.abertos = this.abertos.filter((n) => n !== i)
      } else {
        this.abertos = this.singleOpen ? [i] : [...this.abertos, i]
      }
    }
  }
}
</script>

<template>
  <div class="ec-accordion">
    <div v-for="(item, i) in items" :key="item.title" class="ec-acc-item" :class="{ 'is-open': isOpen(i) }">
      <h3 class="ec-acc-heading">
        <button
          type="button"
          class="ec-acc-trigger"
          :id="`${uid}-t${i}`"
          :aria-controls="`${uid}-p${i}`"
          :aria-expanded="isOpen(i)"
          @click="toggle(i)"
        >
          <span>{{ item.title }}</span>
          <span class="ec-acc-icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="ec-acc-panel" :id="`${uid}-p${i}`" role="region" :aria-labelledby="`${uid}-t${i}`">
        <div class="ec-acc-inner"><p>{{ item.content }}</p></div>
      </div>
    </div>
  </div>
</template>
