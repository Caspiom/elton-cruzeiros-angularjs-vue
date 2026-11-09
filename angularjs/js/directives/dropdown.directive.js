/**
 * <ec-dropdown label="Destino" options="lista" selected="valor" on-select="escolher(option)"></ec-dropdown>
 *
 * Bindings:  label     -> texto acessível do botão
 *            options   -> [{ value, label, callback? }]  (callback opcional por opção)
 *            selected  -> `value` da opção marcada
 *            onSelect  -> callback geral; recebe a opção escolhida como `option`
 * Fecha ao escolher uma opção, ao clicar fora ou ao apertar Esc.
 */
angular.module('eltonApp.directives').directive('ecDropdown', ['$document', function ($document) {
  return {
    restrict: 'E',
    scope: { label: '@', options: '<', selected: '<', onSelect: '&' },
    template:
      '<div class="ec-dropdown" ng-class="{ \'is-open\': open }">' +
        '<button type="button" class="ec-dropdown-btn" aria-haspopup="listbox" aria-expanded="{{ open }}"' +
               ' aria-label="{{ label }}: {{ current().label }}" ng-click="toggle()">' +
          '<span class="ec-dropdown-label">{{ label }}</span>' +
          '<span class="ec-dropdown-value">{{ current().label }}</span>' +
          '<span class="ec-dropdown-caret" aria-hidden="true"></span>' +
        '</button>' +
        '<ul class="ec-dropdown-menu" role="listbox" ng-show="open" aria-label="{{ label }}">' +
          '<li role="presentation" ng-repeat="opt in options track by opt.value">' +
            '<button type="button" role="option" class="ec-dropdown-opt" aria-selected="{{ opt.value === selected }}"' +
                   ' ng-class="{ \'is-selected\': opt.value === selected }" ng-click="choose(opt)">{{ opt.label }}</button>' +
          '</li>' +
        '</ul>' +
      '</div>',
    link: function (scope, element) {
      scope.open = false;

      scope.current = function () {
        for (var i = 0; i < scope.options.length; i++) {
          if (scope.options[i].value === scope.selected) { return scope.options[i]; }
        }
        return scope.options[0];
      };

      scope.toggle = function () { scope.open = !scope.open; };

      scope.choose = function (opt) {
        scope.open = false;
        if (angular.isFunction(opt.callback)) { opt.callback(opt); }   // ação própria da opção
        scope.onSelect({ option: opt });                               // aviso geral ao pai
        element[0].querySelector('.ec-dropdown-btn').focus();
      };

      // Clique fora / Esc: ouvintes no document, removidos quando a diretiva é destruída.
      function fecharSeFora(ev) {
        if (scope.open && !element[0].contains(ev.target)) { scope.$apply(function () { scope.open = false; }); }
      }
      function fecharComEsc(ev) {
        if (scope.open && ev.key === 'Escape') {
          scope.$apply(function () { scope.open = false; });
          element[0].querySelector('.ec-dropdown-btn').focus();
        }
      }
      $document.on('click', fecharSeFora);
      $document.on('keydown', fecharComEsc);
      scope.$on('$destroy', function () {
        $document.off('click', fecharSeFora);
        $document.off('keydown', fecharComEsc);
      });
    }
  };
}]);
