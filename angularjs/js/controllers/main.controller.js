/**
 * MainController — liga a tela aos serviços usando $scope.
 * Demonstra: ng-model (busca, mensagem, checklist), ng-change (refiltrar, recalcular),
 * ng-click (reservar, enviar) e callbacks das diretivas (on-change, on-select).
 */
angular.module('eltonApp.controllers').controller('MainController',
  ['$scope', '$interval', 'CruzeirosService', 'ToastService',
  function ($scope, $interval, CruzeirosService, ToastService) {

    // ---------- Menu do cabeçalho (mobile) ----------
    $scope.menuAberto = false;

    // ---------- Roteiros: busca + filtros + paginação ----------
    $scope.destinos = CruzeirosService.getDestinos();
    $scope.ordenacoes = CruzeirosService.getOrdenacoes();
    $scope.filtro = { busca: '', destino: 'todos', ordem: 'preco' };   // ng-model da busca
    $scope.tamanhoPagina = 4;
    $scope.paginaAtual = 1;
    $scope.totalPaginas = 1;
    $scope.resultados = [];     // lista completa após filtros
    $scope.pagina = [];         // só os itens da página atual

    $scope.atualizarLista = function (voltarPrimeira) {
      $scope.resultados = CruzeirosService.consultar($scope.filtro.busca, $scope.filtro.destino, $scope.filtro.ordem);
      $scope.totalPaginas = Math.max(1, Math.ceil($scope.resultados.length / $scope.tamanhoPagina));
      if (voltarPrimeira) { $scope.paginaAtual = 1; }
      $scope.paginaAtual = Math.min($scope.paginaAtual, $scope.totalPaginas);
      var inicio = ($scope.paginaAtual - 1) * $scope.tamanhoPagina;
      $scope.pagina = $scope.resultados.slice(inicio, inicio + $scope.tamanhoPagina);
    };

    // Callbacks chamados pelas diretivas (on-change / on-select)
    $scope.irParaPagina = function (page) {
      $scope.paginaAtual = page;
      $scope.atualizarLista(false);
    };
    $scope.escolherDestino = function (opt) {
      $scope.filtro.destino = opt.value;
      $scope.atualizarLista(true);
      ToastService.info('Filtro aplicado: ' + opt.label + ' (' + $scope.resultados.length + ' roteiros).');
    };
    $scope.escolherOrdem = function (opt) {
      $scope.filtro.ordem = opt.value;
      $scope.atualizarLista(true);
    };

    $scope.reservar = function (roteiro) {
      ToastService.success('Reserva iniciada: ' + roteiro.nome + '. Você tem 48 h para confirmar.');
    };

    $scope.atualizarLista(true);

    // ---------- Abas e FAQ (dados vêm do serviço) ----------
    $scope.detalhes = CruzeirosService.getDetalhes();
    $scope.faq = CruzeirosService.getFaq();

    // ---------- Barra de progresso 1: checklist de embarque (ng-model + ng-change) ----------
    $scope.checklist = CruzeirosService.getChecklist();
    $scope.progressoChecklist = 0;
    $scope.recalcularChecklist = function () {
      var feitos = $scope.checklist.filter(function (item) { return item.feito; }).length;
      $scope.progressoChecklist = Math.round(feitos / $scope.checklist.length * 100);
      if ($scope.progressoChecklist === 100) { ToastService.success('Checklist completo. Boa viagem!'); }
    };

    // ---------- Barra de progresso 2: envio simulado de documento ----------
    var timerEnvio = null;
    $scope.envio = { progresso: 0, ativo: false };

    $scope.iniciarEnvio = function () {
      if ($scope.envio.ativo) { return; }
      $scope.envio = { progresso: 0, ativo: true };
      timerEnvio = $interval(function () {
        $scope.envio.progresso = Math.min(100, $scope.envio.progresso + 5 + Math.floor(Math.random() * 10));
        if ($scope.envio.progresso >= 100) {
          pararEnvio();
          ToastService.success('Documento enviado com sucesso.');
        }
      }, 250);
    };
    $scope.cancelarEnvio = function () {
      if (!$scope.envio.ativo) { return; }
      pararEnvio();
      $scope.envio.progresso = 0;
      ToastService.error('Envio cancelado. Nenhum arquivo foi salvo.');
    };
    function pararEnvio() {
      $interval.cancel(timerEnvio);
      $scope.envio.ativo = false;
    }
    $scope.$on('$destroy', pararEnvio);

    // ---------- Toasts: demonstração dos três tipos ----------
    $scope.toastDemo = { mensagem: 'Preferências salvas.' };
    $scope.dispararToast = function (tipo) {
      ToastService[tipo]($scope.toastDemo.mensagem || 'Mensagem de exemplo.');
    };
  }]);
