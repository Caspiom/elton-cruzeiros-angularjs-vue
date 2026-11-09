/**
 * ToastService (factory) — gerencia várias notificações ao mesmo tempo.
 * Qualquer controlador ou diretiva injeta o serviço e chama success/error/info.
 * A diretiva <ec-toast-container> só desenha a lista `toasts`.
 */
angular.module('eltonApp.services').factory('ToastService', ['$timeout', function ($timeout) {
  var DURACAO_PADRAO = 4000;   // ms
  var proximoId = 1;
  var toasts = [];

  function remover(id) {
    for (var i = 0; i < toasts.length; i++) {
      if (toasts[i].id === id) {
        $timeout.cancel(toasts[i].timer);
        toasts.splice(i, 1);
        return;
      }
    }
  }

  function mostrar(tipo, mensagem, duracao) {
    var toast = { id: proximoId++, tipo: tipo, mensagem: mensagem };
    toast.timer = $timeout(function () { remover(toast.id); }, duracao || DURACAO_PADRAO);
    toasts.push(toast);
    return toast.id;
  }

  return {
    toasts: toasts,
    dismiss: remover,
    success: function (msg, ms) { return mostrar('success', msg, ms); },
    error:   function (msg, ms) { return mostrar('error',   msg, ms); },
    info:    function (msg, ms) { return mostrar('info',    msg, ms); }
  };
}]);
