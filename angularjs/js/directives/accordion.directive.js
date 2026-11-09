/**
 * <ec-accordion items="lista" single-open="true"></ec-accordion>
 *
 * Bindings:  items       -> [{ title, content }]
 *            singleOpen  -> true: só um painel aberto por vez (padrão)
 * A transição suave é feita em CSS (grid-template-rows 0fr -> 1fr).
 */
angular.module('eltonApp.directives').directive('ecAccordion', function () {
  return {
    restrict: 'E',
    scope: { items: '<', singleOpen: '<?' },
    template:
      '<div class="ec-accordion">' +
        '<div class="ec-acc-item" ng-repeat="item in items" ng-class="{ \'is-open\': isOpen($index) }">' +
          '<h3 class="ec-acc-heading">' +
            '<button type="button" class="ec-acc-trigger" id="{{ uid }}-t{{ $index }}"' +
                    ' aria-controls="{{ uid }}-p{{ $index }}" aria-expanded="{{ isOpen($index) }}"' +
                    ' ng-click="toggle($index)">' +
              '<span>{{ item.title }}</span><span class="ec-acc-icon" aria-hidden="true"></span>' +
            '</button>' +
          '</h3>' +
          '<div class="ec-acc-panel" id="{{ uid }}-p{{ $index }}" role="region" aria-labelledby="{{ uid }}-t{{ $index }}">' +
            '<div class="ec-acc-inner"><p>{{ item.content }}</p></div>' +
          '</div>' +
        '</div>' +
      '</div>',
    controller: ['$scope', function ($scope) {
      var abertos = {};                       // índice -> true (estado local da diretiva)
      $scope.uid = 'acc' + $scope.$id;

      $scope.isOpen = function (i) { return !!abertos[i]; };

      $scope.toggle = function (i) {
        var estavaAberto = abertos[i];
        if ($scope.singleOpen !== false) { abertos = {}; }   // modo "um por vez"
        abertos[i] = !estavaAberto;
      };
    }]
  };
});
