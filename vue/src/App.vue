<script>
import AccordionList from './components/AccordionList.vue'
import PaginationNav from './components/PaginationNav.vue'
import ProgressBar from './components/ProgressBar.vue'
import TabsPanel from './components/TabsPanel.vue'
import DropdownMenu from './components/DropdownMenu.vue'
import ToastContainer from './components/ToastContainer.vue'
import { roteiros, destinos, ordenacoes, faq, detalhes, checklistInicial } from './data/cruzeiros.js'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const data = new Intl.DateTimeFormat('pt-BR')

// Comparadores usados pelo menu "Ordenar por"
const ordenadores = {
  'preco-asc': (a, b) => a.preco - b.preco,
  'preco-desc': (a, b) => b.preco - a.preco,
  partida: (a, b) => a.partida - b.partida,
  'noites-desc': (a, b) => b.noites - a.noites
}

/** Componente raiz: guarda o estado da tela e orquestra os seis componentes. */
export default {
  name: 'App',
  components: { AccordionList, PaginationNav, ProgressBar, TabsPanel, DropdownMenu, ToastContainer },
  data() {
    return {
      menuAberto: false,
      destinos,
      ordenacoes,
      faq,
      detalhes,
      filtro: { busca: '', destino: 'todos', ordem: 'preco-asc' },
      tamanhoPagina: 4,
      paginaAtual: 1,
      checklist: [],
      envio: { progresso: 0, ativo: false },
      timerEnvio: null,
      toastDemo: { mensagem: 'Preferências salvas.' }
    }
  },
  computed: {
    // A foto do hero fica no style inline para respeitar o `base` do Vite (qualquer subpasta).
    heroStyle() {
      const escurecer = 'linear-gradient(180deg, rgba(4,19,27,.55), rgba(4,19,27,.92))'
      return { backgroundImage: `${escurecer}, url(${import.meta.env.BASE_URL}img/hero-fjord.jpg)` }
    },
    resultados() {
      const termo = this.filtro.busca.trim().toLowerCase()
      return roteiros
        .filter((r) => this.filtro.destino === 'todos' || r.destino === this.filtro.destino)
        .filter((r) => r.nome.toLowerCase().includes(termo))
        .sort(ordenadores[this.filtro.ordem])
    },
    totalPaginas() {
      return Math.max(1, Math.ceil(this.resultados.length / this.tamanhoPagina))
    },
    pagina() {
      const inicio = (this.paginaAtual - 1) * this.tamanhoPagina
      return this.resultados.slice(inicio, inicio + this.tamanhoPagina)
    },
    progressoChecklist() {
      const feitos = this.checklist.filter((item) => item.feito).length
      return Math.round((feitos / this.checklist.length) * 100)
    }
  },
  watch: {
    // Qualquer mudança de busca/filtro/ordem volta para a página 1.
    filtro: { deep: true, handler() { this.paginaAtual = 1 } },
    progressoChecklist(novo) {
      if (novo === 100) this.$toast.success('Checklist completo. Boa viagem!')
    }
  },
  created() {
    // monta o estado inicial do checklist a partir dos dados
    this.checklist = checklistInicial.map((texto) => ({ texto, feito: false }))
  },
  mounted() {
    console.info(`Elton Cruzeiros (Vue): ${roteiros.length} roteiros carregados.`)
  },
  beforeUnmount() {
    clearInterval(this.timerEnvio)
  },
  methods: {
    formatarMoeda: (valor) => moeda.format(valor),
    formatarData: (d) => data.format(d),
    rotuloNoites: (n) => `${n} ${n === 1 ? 'noite' : 'noites'}`,

    // Eventos emitidos pelos componentes filhos
    irParaPagina(page) {
      this.paginaAtual = page
    },
    escolherDestino(opt) {
      this.filtro.destino = opt.value
      this.$toast.info(`Filtro aplicado: ${opt.label}.`)
    },
    escolherOrdem(opt) {
      this.filtro.ordem = opt.value
    },
    reservar(roteiro) {
      this.$toast.success(`Reserva iniciada: ${roteiro.nome}. Você tem 48 h para confirmar.`)
    },

    iniciarEnvio() {
      if (this.envio.ativo) return
      this.envio = { progresso: 0, ativo: true }
      this.timerEnvio = setInterval(() => {
        this.envio.progresso = Math.min(100, this.envio.progresso + 5 + Math.floor(Math.random() * 10))
        if (this.envio.progresso >= 100) {
          this.pararEnvio()
          this.$toast.success('Documento enviado com sucesso.')
        }
      }, 250)
    },
    cancelarEnvio() {
      if (!this.envio.ativo) return
      this.pararEnvio()
      this.envio.progresso = 0
      this.$toast.error('Envio cancelado. Nenhum arquivo foi salvo.')
    },
    pararEnvio() {
      clearInterval(this.timerEnvio)
      this.envio.ativo = false
    },

    dispararToast(tipo) {
      this.$toast[tipo](this.toastDemo.mensagem || 'Mensagem de exemplo.')
    }
  }
}
</script>

<template>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

  <!-- ===== Cabeçalho ===== -->
  <header class="site-header">
    <div class="container header-row">
      <a class="brand" href="#topo"><span class="brand-logo" aria-hidden="true">⚓</span> Elton Cruzeiros</a>
      <button type="button" class="menu-toggle" aria-controls="menu-principal" :aria-expanded="menuAberto" aria-label="Abrir menu" @click="menuAberto = !menuAberto">☰</button>
      <nav id="menu-principal" class="main-nav" :class="{ 'is-open': menuAberto }" aria-label="Principal">
        <a href="#roteiros" @click="menuAberto = false">Roteiros</a>
        <a href="#detalhes" @click="menuAberto = false">Navio</a>
        <a href="#preparacao" @click="menuAberto = false">Preparação</a>
        <a href="#faq" @click="menuAberto = false">FAQ</a>
        <a href="#avisos" @click="menuAberto = false">Avisos</a>
      </nav>
    </div>
  </header>

  <main id="conteudo">
    <!-- ===== Hero ===== -->
    <section id="topo" class="hero" :style="heroStyle" aria-labelledby="titulo-hero">
      <div class="container">
        <p class="eyebrow">Desafio extra Vue.js · UCSal</p>
        <h1 id="titulo-hero">Navegue por roteiros com seis componentes Vue</h1>
        <p class="lead">Acordeão, paginação, barra de progresso, abas, menu suspenso e notificações toast —
          cada um é um componente independente (props para entrar, eventos para sair), reunidos numa vitrine de cruzeiros fictícia.</p>
        <a class="btn btn-primary" href="#roteiros">Ver roteiros</a>
      </div>
    </section>

    <!-- ===== Roteiros: Dropdown + Paginação ===== -->
    <section id="roteiros" class="section" aria-labelledby="titulo-roteiros">
      <div class="container">
        <h2 id="titulo-roteiros">Roteiros 2027</h2>
        <p class="section-sub">Menu suspenso para filtrar e ordenar; paginação para percorrer os resultados.</p>

        <div class="toolbar">
          <div class="field">
            <label for="busca">Buscar roteiro</label>
            <input id="busca" v-model="filtro.busca" type="search" placeholder="Ex.: Fiordes" autocomplete="off">
          </div>
          <DropdownMenu label="Destino" :options="destinos" :selected="filtro.destino" @select="escolherDestino" />
          <DropdownMenu label="Ordenar por" :options="ordenacoes" :selected="filtro.ordem" @select="escolherOrdem" />
        </div>

        <p class="result-count" role="status" aria-live="polite">
          {{ resultados.length }} {{ resultados.length === 1 ? 'roteiro encontrado' : 'roteiros encontrados' }}
        </p>

        <div class="card-grid">
          <article v-for="r in pagina" :key="r.id" class="card">
            <img class="card-photo" :src="r.imagem" :alt="r.alt">
            <div class="card-body">
              <span class="badge">{{ r.destino.toUpperCase() }}</span>
              <h3>{{ r.nome }}</h3>
              <p>{{ r.descricao }}</p>
              <dl class="card-meta">
                <div><dt>Duração</dt><dd>{{ rotuloNoites(r.noites) }}</dd></div>
                <div><dt>Partida</dt><dd>{{ formatarData(r.partida) }}</dd></div>
              </dl>
              <p class="price">{{ formatarMoeda(r.preco) }} <small>por pessoa</small></p>
              <button type="button" class="btn btn-primary btn-block" @click="reservar(r)">Reservar</button>
            </div>
          </article>
        </div>
        <p v-if="resultados.length === 0" class="empty">Nenhum roteiro encontrado. Tente outro termo ou destino.</p>

        <PaginationNav :total-pages="totalPaginas" :current-page="paginaAtual" @change="irParaPagina" />
      </div>
    </section>

    <!-- ===== Abas ===== -->
    <section id="detalhes" class="section" aria-labelledby="titulo-detalhes">
      <div class="container">
        <h2 id="titulo-detalhes">Conheça o navio Aurora Boreal</h2>
        <p class="section-sub">Abas: use o mouse ou as setas ← → do teclado.</p>
        <div class="panel"><TabsPanel :tabs="detalhes" /></div>
      </div>
    </section>

    <!-- ===== Barras de progresso ===== -->
    <section id="preparacao" class="section" aria-labelledby="titulo-preparacao">
      <div class="container">
        <h2 id="titulo-preparacao">Prepare sua viagem</h2>
        <p class="section-sub">Duas barras de progresso: uma segue o checklist, a outra acompanha um envio de arquivo.</p>
        <div class="two-col">
          <div class="panel">
            <h3>Checklist de embarque</h3>
            <ProgressBar :value="progressoChecklist" label="Checklist concluído" variant="info" />
            <ul class="checklist">
              <li v-for="item in checklist" :key="item.texto">
                <label><input v-model="item.feito" type="checkbox"> {{ item.texto }}</label>
              </li>
            </ul>
          </div>
          <div class="panel">
            <h3>Documento de embarque</h3>
            <p>Simule o envio do passaporte digitalizado.</p>
            <ProgressBar :value="envio.progresso" label="Envio do documento" variant="success" />
            <div class="btn-row">
              <button type="button" class="btn btn-primary" :disabled="envio.ativo" @click="iniciarEnvio">Enviar documento</button>
              <button type="button" class="btn btn-ghost" :disabled="!envio.ativo" @click="cancelarEnvio">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Acordeão ===== -->
    <section id="faq" class="section" aria-labelledby="titulo-faq">
      <div class="container narrow">
        <h2 id="titulo-faq">Perguntas frequentes</h2>
        <p class="section-sub">Acordeão: um painel aberto por vez, com transição suave.</p>
        <AccordionList :items="faq" :single-open="true" />
      </div>
    </section>

    <!-- ===== Toast ===== -->
    <section id="avisos" class="section" aria-labelledby="titulo-avisos">
      <div class="container narrow">
        <h2 id="titulo-avisos">Notificações toast</h2>
        <p class="section-sub">Escreva uma mensagem (v-model) e dispare um toast de cada tipo. Eles somem sozinhos em 4 s ou ao clicar no ×.</p>
        <div class="panel">
          <div class="field">
            <label for="msg-toast">Mensagem</label>
            <input id="msg-toast" v-model="toastDemo.mensagem" type="text" maxlength="90">
          </div>
          <div class="btn-row">
            <button type="button" class="btn btn-success" @click="dispararToast('success')">Sucesso</button>
            <button type="button" class="btn btn-danger" @click="dispararToast('error')">Erro</button>
            <button type="button" class="btn btn-info" @click="dispararToast('info')">Informação</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>Elton Cruzeiros — trabalho acadêmico (UCSal, Engenharia de Software · Prof. Elton Figueiredo da Silva). Conteúdo fictício.</p>
    </div>
  </footer>

  <ToastContainer />
</template>
