(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mapleAxios = factory());
}(this, (function () { 'use strict';

  function xhr(config) {
      var _a = config.method, method = _a === void 0 ? 'get' : _a, _b = config.data, data = _b === void 0 ? null : _b, paramas = config.paramas, url = config.url;
      var request = new XMLHttpRequest();
      request.open(method.toLowerCase(), url, true);
      request.send(data);
  }

  function axios(config) {
      xhr(config);
  }

  return axios;

})));
//# sourceMappingURL=maple-axios.umd.js.map
