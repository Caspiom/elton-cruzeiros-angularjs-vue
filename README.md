# ⚓ Elton Cruzeiros — Atividade AngularJS & Vue.js

Atividade de **Tópicos Avançados em Programação** — Engenharia de Software (UCSal), Prof. **Elton Figueiredo da Silva**.
Mesma vitrine de cruzeiros fictícia (visual *liquid glass* das atividades anteriores), feita **duas vezes**, com seis componentes cada:
acordeão, paginação, barra de progresso, abas, menu suspenso e toast.

| Pasta | Tecnologia | Papel |
|---|---|---|
| [`angularjs/`](angularjs/index.html) | **AngularJS 1.8.3** (arquivo local, sem CDN) | Solução principal |
| [`vue/`](vue/) | **Vue 3** + Vite (componentes `.vue`) | Desafio extra (+0,3) — independente da anterior |

As duas pastas não compartilham arquivos (nem imagens): cada uma roda sozinha.

---

## 🚀 Como rodar

**AngularJS** — página estática, sem `npm install`, sem build, funciona até offline:
```bash
cd angularjs && python3 -m http.server 8000     # http://localhost:8000
```
(também abre direto por `file://`, testado no Firefox: os templates das diretivas são inline.)

**Vue** — precisa de Node 20+:
```bash
cd vue && npm install && npm run dev            # http://localhost:5173
npm run build                                   # gera vue/dist (base './', serve em qualquer subpasta)
```

**GitHub Codespaces:** *Code → Codespaces → Create codespace on main*. O `.devcontainer` instala o Vue e sobe as duas portas
(**8000** = AngularJS, **5173** = Vue); abra-as na aba **Portas**.

---

## ✅ Mapa dos requisitos

### AngularJS (`angularjs/`)
| Requisito | Onde está |
|---|---|
| Módulo principal `app.js` que orquestra os demais | [`js/app.js`](angularjs/js/app.js): `eltonApp` depende de `.services`, `.filters`, `.directives`, `.controllers` |
| Estrutura modular | `js/services/`, `js/filters/`, `js/directives/`, `js/controllers/` (1 arquivo por diretiva) |
| **Acordeão** — 1 aberto por vez, transição suave, itens via binding | `<ec-accordion items="faq" single-open="true">` · estado `abertos` no `$scope` · transição CSS (`grid-template-rows 0fr→1fr`) |
| **Paginação** — anterior/próxima/páginas, atual, desabilita nas pontas, callback | `<ec-pagination total-pages current-page on-change="irParaPagina(page)">` (`<` e `&`) |
| **Barra de progresso** — 0-100 por binding | `<ec-progress-bar value label variant>` · valor limitado a 0-100 · `role="progressbar"` |
| **Abas** — aba ativa no `$scope`, conteúdo por binding | `<ec-tabs tabs="detalhes">` · setas ← → / Home / End |
| **Menu suspenso** — opções por binding, callback, fecha ao escolher/clicar fora | `<ec-dropdown options selected on-select>` · callback por opção (`opt.callback`) + `on-select` · fecha com clique fora e Esc |
| **Toast** — serviço, tipos, some sozinho ou no × | `ToastService` (factory) + `<ec-toast-container>` · `success/error/info` · 4 s · várias ao mesmo tempo |
| Controladores, `$scope`, `ng-model` | [`MainController`](angularjs/js/controllers/main.controller.js): busca, checklist e mensagem do toast ligados por `ng-model` |
| Serviços/factories | `CruzeirosService` (dados + consulta), `ToastService` |
| Filtros | nativos `currency`, `date`, `uppercase`, `orderBy`, `filter` + próprios `noites` e `startFrom` |
| Eventos | `ng-click` (reservar, enviar, abas…), `ng-change` (refiltrar busca, recalcular checklist) |
| Sem dependências desnecessárias | só AngularJS (+ o pacote de idioma pt-BR do próprio AngularJS, para `currency`/`date`) |

### Vue (`vue/`)
| Requisito | Onde está |
|---|---|
| `App.vue` orquestrando | [`src/App.vue`](vue/src/App.vue) |
| **Acordeão** | [`AccordionList.vue`](vue/src/components/AccordionList.vue) · props `items`, `singleOpen` · estado em `data` |
| **Paginação** | [`PaginationNav.vue`](vue/src/components/PaginationNav.vue) · props `totalPages`, `currentPage` · `$emit('change', página)` |
| **Barra de progresso** | [`ProgressBar.vue`](vue/src/components/ProgressBar.vue) · prop `value` (0-100) · `computed percent` |
| **Abas** | [`TabsPanel.vue`](vue/src/components/TabsPanel.vue) · aba ativa em `data` |
| **Menu suspenso** | [`DropdownMenu.vue`](vue/src/components/DropdownMenu.vue) · visibilidade em `data` · `$emit('select', opção)` |
| **Toast** | serviço global [`services/toast.js`](vue/src/services/toast.js) (`this.$toast.success(...)`) + [`ToastContainer.vue`](vue/src/components/ToastContainer.vue) |
| `props`, `data`, `computed`, `$emit`, `v-on` | em todos os componentes (Options API, para espelhar o enunciado) |
| *Lifecycle hooks* | `created` (monta o checklist), `mounted` (log; ouvintes no `DropdownMenu`), `beforeUnmount` (limpa timers e ouvintes) |
| Dependências | só Vue + Vite; **nenhuma** biblioteca de UI |

### Comum às duas versões
- **Responsivo:** grade de cards 4 → 2 → 1 coluna, barra de filtros em 1 → 3 colunas, menu hambúrguer abaixo de 760 px, abas que quebram linha, toasts ancorados no canto e limitados à largura da tela.
- **Acessibilidade:** landmarks e *skip link*; `aria-expanded/controls` (acordeão, dropdown, menu), `role="tablist/tab/tabpanel"` com setas, `aria-current="page"` na paginação, `role="progressbar"` com `aria-valuenow`, toasts em região `aria-live` (`role="alert"` no erro), foco visível, alvos de toque ≥ 44 px, `prefers-reduced-motion`.
- **Conteúdo** fictício, mas coerente com o tema (FAQ de reserva, roteiros paginados, upload de documento de embarque…).

---

## 🧪 Como foi testado

**Firefox headless** (WebDriver BiDi) nas larguras **375 / 768 / 1366 px**, nas duas versões com o mesmo roteiro:
- Sem rolagem horizontal; 1 → 2 → 4 colunas; hambúrguer só no celular; 0 imagens quebradas.
- Paginação: anterior desabilitada na página 1, próxima desabilitada na 3, "Página N de 3", página some quando há só 1.
- Menu suspenso: abre, escolher fecha, clique fora fecha, Esc fecha; filtro e ordenação mudam a lista.
- Acordeão: abrir outro fecha o anterior; fechar o aberto deixa todos fechados.
- Abas: clique e setas (o foco acompanha); barras: checklist 2/5 = 40 %, envio simulado vai a 100 % e dispara toast.
- Toast: três tipos, fechar no ×, sumiço automático em 4 s.
- Vue em modo dev: **0 avisos** de console.

**Não testado:** Chrome, Edge e Safari; toque real em celular (simulei só a largura e cliques programáticos).

## 📏 Tamanhos (medidos)
| | AngularJS | Vue (build de produção) |
|---|---|---|
| Código escrito | ~860 linhas (HTML+CSS+JS) | ~890 linhas (SFC+JS+CSS) |
| Framework | `angular.min.js` 173 KB (+2 KB de locale) | JS total 88,8 KB (34,3 KB gzip), CSS 11,4 KB |
| Build | nenhum | Vite (`npm run build`) |

## 🗂️ Estrutura
```
angularjs/   index.html · css/ · js/{app.js,services,filters,directives,controllers} · vendor/ · img/
vue/         index.html · vite.config.js · public/img · src/{App.vue,main.js,components,services,data,assets}
.devcontainer/  Codespaces (portas 8000 e 5173)
```

## 📝 Créditos
Trabalho acadêmico individual — UCSal, Escola de Tecnologias, Engenharia de Software. Fotos (Unsplash) reaproveitadas do projeto `elton-cruzeiros`.
Autor: Lucas Gaspari (Gappy).
