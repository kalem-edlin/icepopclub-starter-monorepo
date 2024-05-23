"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/svix-fetch";
exports.ids = ["vendor-chunks/svix-fetch"];
exports.modules = {

/***/ "(rsc)/../../node_modules/svix-fetch/fetch-npm-node.js":
/*!*******************************************************!*\
  !*** ../../node_modules/svix-fetch/fetch-npm-node.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar http = __webpack_require__(/*! http */ \"http\");\nvar https = __webpack_require__(/*! https */ \"https\");\nvar realFetch = __webpack_require__(/*! node-fetch */ \"(rsc)/../../node_modules/node-fetch/lib/index.mjs\");\n\nconst httpAgent = new http.Agent({\n\tkeepAlive: true\n});\nconst httpsAgent = new https.Agent({\n\tkeepAlive: true\n});\n\nconst agent = function(_parsedURL) {\n\tif (_parsedURL.protocol == 'http:') {\n\t\treturn httpAgent;\n\t} else {\n\t\treturn httpsAgent;\n\t}\n};\n\nmodule.exports = function(url, options) {\n\tif (/^\\/\\//.test(url)) {\n\t\turl = 'https:' + url;\n\t}\n\treturn realFetch.call(this, url, {agent, ...options});\n};\n\nif (!global.fetch) {\n\tglobal.fetch = module.exports;\n\tglobal.Response = realFetch.Response;\n\tglobal.Headers = realFetch.Headers;\n\tglobal.Request = realFetch.Request;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzL3N2aXgtZmV0Y2gvZmV0Y2gtbnBtLW5vZGUuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCLFlBQVksbUJBQU8sQ0FBQyxvQkFBTztBQUMzQixnQkFBZ0IsbUJBQU8sQ0FBQyxxRUFBWTs7QUFFcEM7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGtCQUFrQjtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbW9ub2V4cG8vbmV4dC8uLi8uLi9ub2RlX21vZHVsZXMvc3ZpeC1mZXRjaC9mZXRjaC1ucG0tbm9kZS5qcz9mODI2Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbnZhciBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG52YXIgcmVhbEZldGNoID0gcmVxdWlyZSgnbm9kZS1mZXRjaCcpO1xuXG5jb25zdCBodHRwQWdlbnQgPSBuZXcgaHR0cC5BZ2VudCh7XG5cdGtlZXBBbGl2ZTogdHJ1ZVxufSk7XG5jb25zdCBodHRwc0FnZW50ID0gbmV3IGh0dHBzLkFnZW50KHtcblx0a2VlcEFsaXZlOiB0cnVlXG59KTtcblxuY29uc3QgYWdlbnQgPSBmdW5jdGlvbihfcGFyc2VkVVJMKSB7XG5cdGlmIChfcGFyc2VkVVJMLnByb3RvY29sID09ICdodHRwOicpIHtcblx0XHRyZXR1cm4gaHR0cEFnZW50O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBodHRwc0FnZW50O1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuXHRpZiAoL15cXC9cXC8vLnRlc3QodXJsKSkge1xuXHRcdHVybCA9ICdodHRwczonICsgdXJsO1xuXHR9XG5cdHJldHVybiByZWFsRmV0Y2guY2FsbCh0aGlzLCB1cmwsIHthZ2VudCwgLi4ub3B0aW9uc30pO1xufTtcblxuaWYgKCFnbG9iYWwuZmV0Y2gpIHtcblx0Z2xvYmFsLmZldGNoID0gbW9kdWxlLmV4cG9ydHM7XG5cdGdsb2JhbC5SZXNwb25zZSA9IHJlYWxGZXRjaC5SZXNwb25zZTtcblx0Z2xvYmFsLkhlYWRlcnMgPSByZWFsRmV0Y2guSGVhZGVycztcblx0Z2xvYmFsLlJlcXVlc3QgPSByZWFsRmV0Y2guUmVxdWVzdDtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/svix-fetch/fetch-npm-node.js\n");

/***/ })

};
;