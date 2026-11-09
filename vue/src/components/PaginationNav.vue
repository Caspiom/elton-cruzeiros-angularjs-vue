<script>
/**
 * <PaginationNav :total-pages="n" :current-page="p" @change="irPara" />
 * Não muda a página sozinho: emite `change` com a nova página e o pai decide.
 */
export default {
  name: 'PaginationNav',
  props: {
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true }
  },
  emits: ['change'],
  data() {
    return { vizinhas: 1 }                 // páginas mostradas ao redor da atual
  },
  computed: {
    // Lista de botões; `null` representa um "…" entre blocos.
    pages() {
      const lista = []
      for (let p = 1; p <= this.totalPages; p++) {
        const perto = Math.abs(p - this.currentPage) <= this.vizinhas
        if (p === 1 || p === this.totalPages || perto) lista.push(p)
        else if (lista[lista.length - 1] !== null) lista.push(null)
      }
      return lista
    }
  },
  methods: {
    go(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return
      this.$emit('change', page)
    }
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="ec-pagination" aria-label="Paginação">
    <button type="button" class="ec-page-btn" :disabled="currentPage <= 1" aria-label="Página anterior" @click="go(currentPage - 1)">‹</button>
    <template v-for="(p, i) in pages" :key="i">
      <span v-if="p === null" class="ec-page-gap" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        class="ec-page-btn"
        :class="{ 'is-current': p === currentPage }"
        :aria-label="`Página ${p}`"
        :aria-current="p === currentPage ? 'page' : undefined"
        @click="go(p)"
      >{{ p }}</button>
    </template>
    <button type="button" class="ec-page-btn" :disabled="currentPage >= totalPages" aria-label="Próxima página" @click="go(currentPage + 1)">›</button>
    <span class="ec-page-status" aria-live="polite">Página {{ currentPage }} de {{ totalPages }}</span>
  </nav>
</template>
