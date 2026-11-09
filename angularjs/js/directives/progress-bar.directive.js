/**
 * <ec-progress-bar value="0..100" label="Texto" variant="success"></ec-progress-bar>
 *
 * Bindings:  value    -> progresso (0-100); valores fora da faixa são limitados
 *            label    -> descrição lida por leitores de tela e mostrada acima da barra
 *            variant  -> 'success' | 'info' (cor do preenchimento)
 */
angular.module('eltonApp.directives').directive('ecProgressBar', function () {
  return {
    restrict: 'E',
    scope: { value: '<', label: '@', variant: '@' },
    template:
      '<div class="ec-progress">' +
        '<div class="ec-progress-head"><span>{{ label }}</span><strong>{{ percent }}%</strong></div>' +
        '<div class="ec-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100"' +
             ' aria-valuenow="{{ percent }}" aria-label="{{ label }}">' +
          '<div class="ec-progress-fill" ng-class="\'is-\' + (variant || \'info\')" ng-style="{ width: percent + \'%\' }"></div>' +
        '</div>' +
      '</div>',
    controller: ['$scope', function ($scope) {
      $scope.percent = 0;
      $scope.$watch('value', function (v) {
        var n = Math.round(Number(v));
        $scope.percent = isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
      });
    }]
  };
});
