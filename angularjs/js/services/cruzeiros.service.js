/**
 * CruzeirosService (factory) — "banco de dados" fictício da aplicação.
 * Concentra os dados e as regras de consulta; os controladores só chamam.
 */
angular.module('eltonApp.services').factory('CruzeirosService', ['$filter', function ($filter) {
  var roteiros = [
    { id: 1,  nome: 'Fiordes Noruegueses',   destino: 'europa',   noites: 9,  preco: 14890, partida: '2027-06-14', imagem: 'img/hero-fjord.jpg', alt: 'Picos nevados acima de um mar de nuvens',          descricao: 'Fiordes, cachoeiras e vilarejos de pescadores.' },
    { id: 2,  nome: 'Caribe Essencial',      destino: 'caribe',   noites: 7,  preco: 8390,  partida: '2027-01-10', imagem: 'img/island.jpg',     alt: 'Praia tropical com coqueiros e ilha ao fundo',      descricao: 'Águas mornas, recifes e ilhas de areia branca.' },
    { id: 3,  nome: 'Costa do Sol',          destino: 'brasil',   noites: 5,  preco: 4290,  partida: '2027-02-05', imagem: 'img/coast.jpg',      alt: 'Mar turquesa com o sol baixo no horizonte',         descricao: 'Do litoral baiano às praias de Alagoas.' },
    { id: 4,  nome: 'Alpes do Pacífico',     destino: 'americas', noites: 10, preco: 16750, partida: '2027-08-22', imagem: 'img/mountains.jpg',  alt: 'Pinheiros e montanhas nevadas sob céu azul',        descricao: 'Glaciares e florestas ao longo do Alasca.' },
    { id: 5,  nome: 'Atol das Maldivas',     destino: 'asia',     noites: 8,  preco: 19990, partida: '2027-03-18', imagem: 'img/sunset.jpg',     alt: 'Bangalôs sobre a água turquesa',                    descricao: 'Bangalôs sobre a água e mergulho em atóis.' },
    { id: 6,  nome: 'Mediterrâneo Clássico', destino: 'europa',   noites: 11, preco: 13450, partida: '2027-05-03', imagem: 'img/ship.jpg',       alt: 'Navio de cruzeiro ao entardecer',                   descricao: 'Barcelona, Nápoles, Santorini e Dubrovnik.' },
    { id: 7,  nome: 'Ilhas Gregas',          destino: 'europa',   noites: 7,  preco: 9980,  partida: '2027-09-12', imagem: 'img/island.jpg',     alt: 'Praia de areia branca e ilha verde',                descricao: 'Mykonos, Paros e pôr do sol em Santorini.' },
    { id: 8,  nome: 'Rota do Descobrimento', destino: 'brasil',   noites: 4,  preco: 3190,  partida: '2027-04-09', imagem: 'img/coast.jpg',      alt: 'Ondas calmas e sol baixo sobre o mar',              descricao: 'Porto Seguro, Trancoso e Abrolhos.' },
    { id: 9,  nome: 'Baía de Fundy',         destino: 'americas', noites: 8,  preco: 11260, partida: '2027-09-30', imagem: 'img/mountains.jpg',  alt: 'Floresta de pinheiros e montanhas',                 descricao: 'Outono canadense e as maiores marés do mundo.' },
    { id: 10, nome: 'Tailândia Azul',        destino: 'asia',     noites: 9,  preco: 12740, partida: '2027-11-05', imagem: 'img/sunset.jpg',     alt: 'Águas turquesa e bangalôs sobre o mar',             descricao: 'Phuket, Phi Phi e Koh Samui.' },
    { id: 11, nome: 'Antilhas do Sul',       destino: 'caribe',   noites: 10, preco: 10890, partida: '2027-02-21', imagem: 'img/ship.jpg',       alt: 'Navio de cruzeiro ao entardecer',                   descricao: 'Barbados, Granada e Santa Lúcia.' },
    { id: 12, nome: 'Noronha e Atol das Rocas', destino: 'brasil', noites: 6, preco: 6120,  partida: '2027-10-17', imagem: 'img/island.jpg',     alt: 'Praia com coqueiros e ilha ao fundo',               descricao: 'Mergulho, tartarugas e águas cristalinas.' }
  ].map(function (r) {
    r.partida = new Date(r.partida + 'T12:00:00');   // string -> Date, para o filtro date
    return r;
  });

  var destinos = [
    { value: 'todos',    label: 'Todos os destinos' },
    { value: 'brasil',   label: 'Brasil' },
    { value: 'caribe',   label: 'Caribe' },
    { value: 'europa',   label: 'Europa' },
    { value: 'americas', label: 'Américas' },
    { value: 'asia',     label: 'Ásia' }
  ];

  var ordenacoes = [
    { value: 'preco',    label: 'Menor preço' },
    { value: '-preco',   label: 'Maior preço' },
    { value: 'partida',  label: 'Próxima partida' },
    { value: '-noites',  label: 'Mais noites' }
  ];

  var faq = [
    { title: 'Como faço para reservar uma cabine?',          content: 'Escolha o roteiro na lista, clique em "Reservar" e confirme seus dados. A reserva fica garantida por 48 horas até o pagamento do sinal.' },
    { title: 'Quais documentos preciso levar?',              content: 'Documento oficial com foto para roteiros nacionais; passaporte válido por pelo menos seis meses para roteiros internacionais. Alguns destinos exigem visto.' },
    { title: 'Posso cancelar ou remarcar a viagem?',         content: 'Cancelamentos até 90 dias antes da partida têm reembolso integral. Entre 89 e 30 dias, a multa é de 30%. A remarcação é gratuita uma única vez.' },
    { title: 'Crianças pagam o mesmo valor?',                content: 'Crianças de até 11 anos na cabine dos responsáveis pagam 50% da tarifa. Bebês de até 2 anos não pagam, só as taxas portuárias.' },
    { title: 'O que está incluído na tarifa?',               content: 'Hospedagem, todas as refeições, atividades a bordo e shows. Bebidas especiais, excursões em terra e spa são cobrados à parte.' }
  ];

  var detalhes = [
    { title: 'Visão geral', content: 'O Aurora Boreal tem 14 conveses, capacidade para 2.400 hóspedes e itinerários que combinam grandes cidades com ilhas de difícil acesso. Todos os jantares têm opção vegetariana.' },
    { title: 'Cabines',     content: 'Quatro categorias: interna, externa com janela, varanda e suíte panorâmica. Todas têm cama queen ou duas camas de solteiro, ar-condicionado individual e cofre.' },
    { title: 'Incluso',     content: 'Pensão completa, piscinas e academia, teatro com dois espetáculos por noite, clube infantil, internet básica e traslados entre o porto e o aeroporto.' },
    { title: 'Avaliações',  content: 'Nota média 4,8 de 5 em 1.320 avaliações. Pontos mais elogiados: atendimento da tripulação, qualidade do jantar e vistas das cabines com varanda.' }
  ];

  var checklist = [
    { texto: 'Passaporte ou documento com foto válido',  feito: false },
    { texto: 'Seguro-viagem contratado',                 feito: false },
    { texto: 'Cartão de embarque impresso',              feito: false },
    { texto: 'Roteiro de excursões escolhido',           feito: false },
    { texto: 'Bagagem conferida (limite de 23 kg)',      feito: false }
  ];

  return {
    getRoteiros: function ()  { return roteiros; },
    getDestinos: function ()  { return destinos; },
    getOrdenacoes: function () { return ordenacoes; },
    getFaq: function ()       { return faq; },
    getDetalhes: function ()  { return detalhes; },
    getChecklist: function () { return angular.copy(checklist); },

    /** Aplica busca por texto + destino + ordenação e devolve a lista completa (sem paginar). */
    consultar: function (busca, destino, ordem) {
      var lista = $filter('filter')(roteiros, function (r) {
        return destino === 'todos' || r.destino === destino;
      });
      lista = $filter('filter')(lista, { nome: busca || '' });
      return $filter('orderBy')(lista, ordem);
    }
  };
}]);
