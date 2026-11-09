/**
 * app.js — módulo principal.
 * Só orquestra: declara a aplicação e reúne os módulos de serviços, filtros,
 * diretivas e controladores. Cada módulo vive em sua própria pasta.
 */
angular.module('eltonApp', [
  'eltonApp.services',
  'eltonApp.filters',
  'eltonApp.directives',
  'eltonApp.controllers'
]);

// Declaração dos módulos filhos (os arquivos de cada pasta se registram neles).
angular.module('eltonApp.services', []);
angular.module('eltonApp.filters', []);
angular.module('eltonApp.directives', ['eltonApp.services']);
angular.module('eltonApp.controllers', ['eltonApp.services']);
