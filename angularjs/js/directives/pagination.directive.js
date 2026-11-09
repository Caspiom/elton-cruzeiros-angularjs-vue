/**
 * <ec-pagination total-pages="n" current-page="p" on-change="irPara(page)"></ec-pagination>
 *
 * Bindings:  totalPages   -> número total de páginas
 *            currentPage  -> página atual (1..totalPages)
 *            onChange     -> callback; recebe a nova página como `page`
 * A diretiva não altera a página sozinha: avisa o pai, que decide (fluxo de dados claro).
 */
angular.module('eltonApp.directives').directive('ecPagination', function () {
  var VIZINHAS = 1;   // páginas mostradas ao redor da atual

  return {
    restrict: 'E',
    scope: { totalPages: '<', currentPage: '<', onChange: '&' },
    template:
      '<nav class="ec-pagination" aria-label="Paginação" ng-if="totalPages > 1">' +
        '<button type="button" class="ec-page-btn" ng-click="ir(currentPage - 1)" ng-disabled="currentPage <= 1" aria-label="Página anterior">‹</button>' +
        '<span ng-repeat="p in pages track by $index">' +
          '<span class="ec-page-gap" ng-if="p === null" aria-hidden="true">…</span>' +
          '<button type="button" class="ec-page-btn" ng-if="p !== null" ng-click="ir(p)"' +
                 ' ng-class="{ \'is-current\': p === currentPage }"' +
                 ' aria-label="Página {{ p }}" ng-attr-aria-current="{{ p === currentPage ? \'page\' : undefined }}">{{ p }}</button>' +
        '</span>' +
        '<button type="button" class="ec-page-btn" ng-click="ir(currentPage + 1)" ng-disabled="currentPage >= totalPages" aria-label="Próxima página">›</button>' +
        '<span class="ec-page-status" aria-live="polite">Página {{ currentPage }} de {{ totalPages }}</span>' +
      '</nav>',
    controller: ['$scope', function ($scope) {
      // Recalcula a lista de botões sempre que total ou página atual mudam.
      // `null` representa um "…" entre blocos.
      $scope.$watchGroup(['totalPages', 'currentPage'], function () {
        var total = $scope.totalPages, atual = $scope.currentPage, lista = [];
        for (var p = 1; p <= total; p++) {
          var perto = Math.abs(p - atual) <= VIZINHAS;
          if (p === 1 || p === total || perto) { lista.push(p); }
          else if (lista[lista.length - 1] !== null) { lista.push(null); }
        }
        $scope.pages = lista;
      });

      $scope.ir = function (page) {
        if (page < 1 || page > $scope.totalPages || page === $scope.currentPage) { return; }
        $scope.onChange({ page: page });
      };
    }]
  };
});
