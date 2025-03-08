class Request {
  // 基础 GET/POST 请求
  static async get(url, options = {}) {
    return this._request('GET', url, null, options);
  }

  static async post(url, data, options = {}) {
    return this._request('POST', url, data, options);
  }

  static async _request(method, url, data, options) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const config = { method, headers };

    if (data) config.body = JSON.stringify(data);
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return response.json();
  }
}

export default Request;
