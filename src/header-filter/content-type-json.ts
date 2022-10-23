export function contentTypeJson(r: NginxHTTPRequest):void {
    delete r.headersOut["Content-Length"];
    // delete r.headersOut["Content-Type"];
    // r.headersOut["Content-Type"] = "application/json";
}