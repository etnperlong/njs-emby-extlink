export function x_emby_token(r: NginxHTTPRequest): string | void {
  const param: NginxHTTPArgs = r.args;
  const headers = r.headersIn;
  // r.error(`${JSON.stringify(param)}`);
  const realIpStrs = r.headersIn['X-Forwarded-For'] || r.remoteAddress;
  const realIp = realIpStrs.split(',')[0];
  // Token
  const xEmbyToken = param['X-Emby-Token'] ? param['X-Emby-Token'] : '';
  const apiKey = param['api_key'] ? param['api_key'] : '';
  const headerToken = headers['X-Emby-Token'] ? headers['X-Emby-Token'] : '';
  if(xEmbyToken || apiKey) {
    r.log(`[NJS] X-Emby-Token: ${apiKey ? apiKey : xEmbyToken} (IP: ${realIp})`);
  }
  if(apiKey) {
    return apiKey;
  }
  if(xEmbyToken) {
    return xEmbyToken;
  }
}
