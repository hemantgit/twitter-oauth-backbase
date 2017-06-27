/*----------------------------------------------------------------*/
/* Webpack main entry point
/*----------------------------------------------------------------*/

var mock = require('mock');
//window.gadgets = mock.gadgets;
window.b$ = { portal: mock.Portal() };

var testsContext = require.context('./', true, /^\.\/.*\.spec$/);
testsContext.keys().forEach(testsContext);

var testsContext = require.context('../../scripts/', true, /^\.\/.*\.spec$/);
testsContext.keys().forEach(testsContext);
