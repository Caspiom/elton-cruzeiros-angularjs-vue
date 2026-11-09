/**
 * <ec-toast-container></ec-toast-container>
 * Desenha as notificações gerenciadas pelo ToastService (várias ao mesmo tempo).
 * Cada toast some sozinho (o serviço agenda) ou ao clicar no ×.
 */
angular.module('eltonApp.directives').directive('ecToastContainer', ['ToastService', function (ToastService) {
  return {
    restrict: 'E',
    scope: {},
    template:
      '<div class="ec-toast-stack" role="region" aria-label="Notificações" aria-live="polite">' +
        '<div class="ec-toast" ng-repeat="t in toasts track by t.id" ng-class="\'is-\' + t.tipo"' +
             ' role="{{ t.tipo === \'error\' ? \'alert\' : \'status\' }}">' +
          '<span class="ec-toast-icon" aria-hidden="true">{{ icones[t.tipo] }}</span>' +
          '<p class="ec-toast-msg">{{ t.mensagem }}</p>' +
          '<button type="button" class="ec-toast-close" aria-label="Fechar notificação" ng-click="fechar(t.id)">×</button>' +
        '</div>' +
      '</div>',
    controller: ['$scope', function ($scope) {
      $scope.toasts = ToastService.toasts;
      $scope.icones = { success: '✓', error: '!', info: 'i' };
      $scope.fechar = ToastService.dismiss;
    }]
  };
}]);
