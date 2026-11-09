/**
 * <ec-tabs tabs="lista"></ec-tabs>
 *
 * Bindings:  tabs  -> [{ title, content }]
 * A aba ativa vive no $scope da diretiva. Setas ← → e Home/End trocam de aba.
 */
angular.module('eltonApp.directives').directive('ecTabs', function () {
  return {
    restrict: 'E',
    scope: { tabs: '<' },
    template:
      '<div class="ec-tabs">' +
        '<div class="ec-tablist" role="tablist" ng-keydown="onKey($event)">' +
          '<button type="button" role="tab" class="ec-tab" ng-repeat="tab in tabs"' +
                 ' id="{{ uid }}-t{{ $index }}" aria-controls="{{ uid }}-p{{ $index }}"' +
                 ' aria-selected="{{ active === $index }}" tabindex="{{ active === $index ? 0 : -1 }}"' +
                 ' ng-class="{ \'is-active\': active === $index }" ng-click="select($index)">{{ tab.title }}</button>' +
        '</div>' +
        '<div class="ec-tabpanel" role="tabpanel" ng-repeat="tab in tabs" ng-show="active === $index"' +
             ' id="{{ uid }}-p{{ $index }}" aria-labelledby="{{ uid }}-t{{ $index }}" tabindex="0">' +
          '<p>{{ tab.content }}</p>' +
        '</div>' +
      '</div>',
    controller: ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
      $scope.active = 0;
      $scope.uid = 'tabs' + $scope.$id;

      $scope.select = function (i) { $scope.active = i; };

      $scope.onKey = function (ev) {
        var n = $scope.tabs.length, destino = null;
        if (ev.key === 'ArrowRight') { destino = ($scope.active + 1) % n; }
        else if (ev.key === 'ArrowLeft') { destino = ($scope.active - 1 + n) % n; }
        else if (ev.key === 'Home') { destino = 0; }
        else if (ev.key === 'End') { destino = n - 1; }
        if (destino === null) { return; }
        ev.preventDefault();
        $scope.select(destino);
        // espera o AngularJS atualizar o tabindex e move o foco para a nova aba
        $timeout(function () { $element[0].querySelectorAll('[role=tab]')[destino].focus(); });
      };
    }]
  };
});
