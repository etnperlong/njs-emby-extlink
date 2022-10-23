/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { parse, stringify } from 'flatted';
import pathParse from 'path-parse';
import UAParser from "ua-parser-js";
// import Url from 'url-parse'
// import { parse, stringfy } from 'secure-json-parse'

type ExternalURL = {
    Name: string,
    Url: string,
}

type BodyPartial = {
    Name: string,
    ExternalUrls: ExternalURL[],
    MediaSources: MediaSourcePartial[],
    Id: string,
    ProductionYear: string
}

type MediaStreamPartial = {
    Type: string,
    DisplayTitle: string,
    VideoRange: string,
    IsExternal: boolean,
    Path: string,
}

type MediaSourcePartial = {
    Path: string,
    Name: string,
    MediaStreams: MediaStreamPartial[],
    Id: string,
}

// Plugin Slug
const PLUGIN_PATH_SLUG = "/Emby/Addons/ExtPlay"

let buf = 0;
let res = "";

type FilMaps = {
    key: string,
    value: number
}


const AddVersionSelector = function (arr: ExternalURL[]) {
    const extMap: FilMaps[] = [];
    const posMap: FilMaps[] = [];
    const filteredArr: ExternalURL[] = []
    for (let i = 0; i < arr.length; i++) {
        const info = arr[i];
        // r.warn(`Item ${i}: ${info.Name}`)
        const extMapIndex = extMap.findIndex(x => x.key == info.Name)
        const posMapIndex = posMap.findIndex(x => x.key == info.Name)
        // r.warn(`extMapIndex:  + ${extMapIndex}`)
        // r.warn(`posMapIndex:  + ${posMapIndex}`)
        if (extMapIndex > -1) {
            // r.warn('Hit!')
            // Prev exist
            const prevCount = extMap.find(x => x.key == info.Name)?.value
            const prevPos = posMap.find(x => x.key == info.Name)?.value
            // r.warn(`prevCount:  + ${prevCount}`)
            // r.warn(`prevPos:  + ${prevPos}`)
            if ((<number>prevCount > -1) && (<number>prevPos > -1)) {
                const nowCount = <number>prevCount + 1
                // Split Version
                const nameParts = info.Name.split('-')
                // r.warn(JSON.stringify(nameParts))
                const prevVersion = `${nameParts[0].trim()}(${prevCount})`
                const currVersion = `${nameParts[0].trim()}(${nowCount})`
                const prevNextPart = nameParts[1] ? nameParts[1] : ''
                filteredArr[<number>prevPos].Name = `${prevVersion} -${prevNextPart}`  // Change Old Name
                // r.warn(`Prev Name Changed ${prevPos}: ${filteredArr[<number>prevPos].Name}`)
                // r.warn(`New Name: ${currVersion} -${prevNextPart}`)
                // Push New Name
                filteredArr.push({
                    Name: `${currVersion} -${prevNextPart}`,
                    Url: info.Url
                })
                // Reset Pos
                extMap[extMapIndex] = { key: info.Name, value: nowCount }
                posMap[posMapIndex] = { key: info.Name, value: i }
                extMap[i] = { key: info.Name, value: nowCount }
                posMap[i] = { key: info.Name, value: i }
            } else {
                extMap[i] = { key: info.Name, value: 1 }
                posMap[i] = { key: info.Name, value: i }
                filteredArr.push(info)
            }
        } else {
            extMap[i] = { key: info.Name, value: 1 }
            posMap[i] = { key: info.Name, value: i }
            filteredArr.push(info)
        }
    }
    // r.warn(JSON.stringify(filteredArr))
    return filteredArr
}

export function addExtLinkFilter(r: NginxHTTPRequest, data: Buffer, flags: NginxHTTPSendBufferOptions): void {

    if (data.length) buf++;
    res += data;

    if (flags.last) {
        try {
            // const resHeader = r.headersOut

            const host = r.headersIn.Host;
            const ua = r.headersIn['User-Agent'];
            const uaParsed = UAParser(ua);
            const hostparts = host?.split(':');
            // r.error(host ?? 'Host not defined');
            // const hostURL = host ? new Url(host) : null
            // const referer = r.headersIn.Referer;
            // const refererUrl = referer ? new Url(referer) : null
            // const origin = r.headersIn.Origin
            // const originUrl = origin ? new Url(origin) : null

            // const xProtocol = r.headersIn['X-Forwarded-Proto']

            // r.warn(`host: ${host}, referer: ${referer}, origin: ${origin}`)
            // r.warn(`${JSON.stringify(r.headersIn)}`)
            // Detect Protocol
            let protocol = "https:"
            if (hostparts && hostparts.length == 2) {
                // With ports
                const port = hostparts[1];
                if (parseInt(port) != 443) {
                    protocol = 'http:'
                }
            }

            const params = r.args
            // const uri = r.uri
            // const responseBody = <NjsByteString>r.responseText
            // r.warn(res)

            const bodyObj: BodyPartial = <BodyPartial>JSON.parse(res)

            // Init External Play Link List
            // const infusePlay: ExternalURL[] = [];
            // const nplayerPlay: ExternalURL[] = [];
            // const vlcPlay: ExternalURL[] = [];
            // const iinaPlay: ExternalURL[] = [];

            const extPlayList: ExternalURL[] = [];
            // const movistproPlay: ExternalURL[] = [];

            if (bodyObj["MediaSources"]) {
                const mediaSources = bodyObj["MediaSources"];
                for (let i = 0; i < mediaSources.length; i++) {
                    const mediaSource = mediaSources[i];
                    const path = mediaSource.Path
                    // const videoFileName = pathParse(path).base

                    const subMediaStreams = mediaSource.MediaStreams
                    // Get every media stream
                    // let prefix = '';
                    for (let j = 0; j < subMediaStreams.length; j++) {
                        // Grab Video Info
                        // TODO: multi video channel?
                        const subMediaStream = subMediaStreams[j];
                        if (subMediaStream.Type === 'Video') {
                            const videoFileExt = pathParse(path).ext
                            const videoFileName = `${bodyObj.Name} (${bodyObj.ProductionYear})`
                            const videoUrl = `${protocol}//${host}/Videos/${bodyObj['Id']}/ExtPlay/${encodeURIComponent(videoFileName)}?MediaSourceId=${mediaSource.Id}&Static=true&api_key=${params['X-Emby-Token']}`;
                            const videoUrlWithExt = `${protocol}//${host}/Videos/${bodyObj['Id']}/ExtPlay/${encodeURIComponent(videoFileName + videoFileExt)}?MediaSourceId=${mediaSource.Id}&Static=true&api_key=${params['X-Emby-Token']}`;
                            /*
                            if (bodyObj.Name && subMediaStream.DisplayTitle) {
                                prefix = ' - ' + bodyObj.Name + ' (' + subMediaStream.DisplayTitle + ')'
                            } else if (bodyObj.Name) {
                                prefix = ' - ' + bodyObj.Name
                            } else if (subMediaStream.DisplayTitle) {
                                prefix = subMediaStream.DisplayTitle
                            }*/

                            if (uaParsed.os.name == 'iOS' || params['X-Emby-Client']?.includes('iOS') || uaParsed.os.name == 'Mac OS') {
                                extPlayList.push({
                                    //Url: host + embyPlguin + 'infuse://x-callback-url/play?url=' + encodeURIComponent(videoUrl),
                                    Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=Infuse&Stream=${encodeURIComponent(videoUrl)}`,
                                    Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - Infuse` : 'Infuse'
                                });
                            }

                            if (uaParsed.os.name == 'iOS' || uaParsed.os.name?.startsWith('Android') || params['X-Emby-Client']?.includes('iOS') || params['X-Emby-Client']?.includes('Android')) {
                                extPlayList.push({
                                    Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=nPlayer&Stream=${encodeURIComponent(videoUrl)}`,
                                    Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - nPlayer` : 'nPlayer'
                                });

                                extPlayList.push({
                                    Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=VLC&Stream=${encodeURIComponent(videoUrlWithExt)}&Title=${encodeURIComponent(videoFileName)}`,
                                    Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - VLC` : 'VLC'
                                });
                            }

                            if (uaParsed.os.name == 'Mac OS' && !params['X-Emby-Client']?.includes('iOS') && !params['X-Emby-Client']?.includes('tvOS')) {
                                extPlayList.push({
                                    Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=IINA&Stream=${encodeURIComponent(videoUrl)}`,
                                    Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - IINA` : 'IINA'
                                });
                            }

                            if (uaParsed.os.name?.startsWith('Windows')) {
                                extPlayList.push({
                                    Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=PotPlayer&Stream=${encodeURIComponent(videoUrl)}`,
                                    Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - PotPlayer` : 'PotPlayer'
                                });
                            }

                            if (uaParsed.os.name?.startsWith('Android')) {
                                extPlayList.push({
                                    Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=MXPlayerFree&Stream=${encodeURIComponent(videoUrlWithExt)}&Title=${encodeURIComponent(videoFileName)}`,
                                    Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - MXPlayer` : 'MXPlayer'
                                });
                            }

                            /*
                            extPlayList.push({
                                Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=MXPlayer&Stream=${encodeURIComponent(videoUrlWithExt)}&Title=${encodeURIComponent(videoFileName)}`,
                                Name: (mediaSources.length > 1) ? `${subMediaStream.DisplayTitle} - MXPlayer Pro` : 'MXPlayer Pro'
                            });
                            */
                            /*
                            movistproPlay.push({
                                Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=MovistPro&Stream=${encodeURIComponent(videoUrl)}&Title=${encodeURIComponent(videoFileName)}`,
                                Name: `${subMediaStream.DisplayTitle} - Infuse`
                            });
                            */

                        }

                        // Subtitle
                        // Ignore: No Shu Support
                        /*
                        if(subMediaStream.Type === 'Subtitle' && subMediaStream.IsExternal && subMediaStream.Path){
                            let subTitleFileName = pathParse(subMediaStream.Path).base
                        }
                        */

                    }
                }

                // Merge To ExternalURL
                const newExternalURL: ExternalURL[] = [...extPlayList, ...bodyObj.ExternalUrls]
                // Sort
                const filteredURLs = AddVersionSelector(newExternalURL)
                bodyObj.ExternalUrls = filteredURLs
            }

            // Return
            const bodyString = JSON.stringify(bodyObj)
            r.headersOut['Content-Length'] = bodyString.length.toString();
            // r.sendHeader()
            r.sendBuffer(bodyString, flags)
            // r.warn(`FILTERED ${res.length} bytes in ${buf} buffers`);
        } catch (e) {
            r.error(`[NJS Emby Plugin: ExtLink] Error:${e}`);
            r.sendBuffer("", flags);
        }
    }
}
