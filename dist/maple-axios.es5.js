function xhr(config) {
    var _a = config.method, method = _a === void 0 ? 'get' : _a, _b = config.data, data = _b === void 0 ? null : _b, paramas = config.paramas, url = config.url;
    var request = new XMLHttpRequest();
    request.open(method.toLowerCase(), url, true);
    request.send(data);
}

function axios(config) {
    xhr(config);
}

export default axios;
//# sourceMappingURL=maple-axios.es5.js.map
