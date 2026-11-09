/** Filtros próprios (além dos nativos currency, date, orderBy, filter e uppercase). */
angular.module('eltonApp.filters')

  // 7 -> "7 noites", 1 -> "1 noite"
  .filter('noites', function () {
    return function (n) {
      return n + (n === 1 ? ' noite' : ' noites');
    };
  })

  // Fatia o array a partir do índice `inicio` (usado com limitTo na paginação).
  .filter('startFrom', function () {
    return function (lista, inicio) {
      return (lista || []).slice(inicio);
    };
  });
