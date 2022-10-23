import Url from 'url-parse'

type InfoResponseBodyPartial = {
    LocalAddress: string,
    LocalAddresses: string[],
    RemoteAddresses: string[],
    HttpServerPortNumber: string,
    HttpsPortNumber: string,
    WanAddress: string,
    WebSocketPortNumber: string,
}

let buf = 0;
let res = "";

export function concealPublicInfo(r: NginxHTTPRequest, data: Buffer, flags: NginxHTTPSendBufferOptions): void {
    if (data.length) buf++;
    res += data;

    if (flags.last) {
        try {
            const bodyObj: InfoResponseBodyPartial = <InfoResponseBodyPartial>JSON.parse(res)
            if(bodyObj["LocalAddress"] && bodyObj["WanAddress"]){
                const host = r.headersIn.Host;

                const referer = r.headersIn.Referer;
                const refererUrl = referer ? new Url(referer) : null
    
                const protocol = refererUrl ? refererUrl.protocol : "https:"
    
                // Port Checker
                let { port } = new Url(host ? host : '')
                if (!port) {
                    if (protocol == 'http:') { port = "80" }
                    else { port = "443" }
                }
    
                // Modify The Body
                switch (protocol) {
                    case "http://": {
                        bodyObj.HttpServerPortNumber = port
                        bodyObj.HttpsPortNumber = "443"
                        break;
                    }
                    default:{
                        bodyObj.HttpServerPortNumber = "80"
                        bodyObj.HttpsPortNumber = port
                        break;
                    }
                }
    
                bodyObj.LocalAddress = `${protocol}//${host}`
                bodyObj.LocalAddresses = [`${protocol}//${host}`]
                bodyObj.WanAddress = `${protocol}//${host}`
                bodyObj.RemoteAddresses = [`${protocol}//${host}`]
                bodyObj.WebSocketPortNumber = port
            }

            // Return
            const bodyString = JSON.stringify(bodyObj)
            r.headersOut['Content-Length'] = bodyString.length.toString();
            // r.sendHeader()
            r.sendBuffer(bodyString, flags)

        } catch (e) {
            r.error(`[NJS Emby Plugin: Concealer] Error:${e}`);
            r.sendBuffer("", flags);
        }
    }
}