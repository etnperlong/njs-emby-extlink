export function handleExtPlay(r: NginxHTTPRequest): void {
    const param: NginxHTTPArgs = r.args
    const player = param['Player']
    const encodedStreamURL = param['Stream']
    const decodedStreamURL = decodeURIComponent(encodedStreamURL)
    const encodedTitle = param['Title']
    const title = decodeURIComponent(encodedTitle)

    switch (player) {
        case 'Infuse': {
            const urlScheme = `infuse://x-callback-url/play?url=${encodedStreamURL}`
            r.return(301, urlScheme)
            break;
        }


        case 'nPlayer': {
            const urlScheme = `nplayer-${decodedStreamURL}`
            r.return(301, urlScheme)
            break;
        }

        case 'PotPlayer': {
            const urlScheme = `potplayer://${decodedStreamURL}`
            r.return(302, urlScheme)
            break;
        }

        case 'MXPlayer': {
            const urlScheme = `intent:${decodedStreamURL}#Intent;package=com.mxtech.videoplayer.pro;S.title=${title};end`
            r.return(302, urlScheme)
            break;
        }

        case 'MXPlayerFree': {
            const urlScheme = `intent:${decodedStreamURL}#Intent;package=com.mxtech.videoplayer.ad;S.title=${title};end`;
            // const urlScheme = `intent:https://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8#Intent;package=com.mxtech.videoplayer.ad;S.title=${title};end`;
            r.return(302, urlScheme)
            break;
        }


        case 'VLC': {
            // const urlScheme = `vlc-x-callback://x-callback-url/stream?url=${encodedStreamURL}&filename=${encodedTitle}`
            // const urlScheme = `vlc-x-callback://x-callback-url/stream?url=${encodedStreamURL}&filename=${title}`
            const urlScheme = `vlc://${decodedStreamURL}`
            r.return(302, urlScheme)
            break;
        }

        case 'IINA': {
            const urlScheme = `iina://weblink?url=${encodedStreamURL}`
            r.return(302, urlScheme)
            break;
        }



        case 'MovistPro': {
            const movistInfo = {
                "url": decodeURIComponent,
                "title": title
            }
            const urlScheme = `movistpro:${encodeURIComponent(JSON.stringify(movistInfo))}`
            r.return(302, urlScheme)
            break;
        }

        default: {
            const exceptionError = {
                code: 500,
                msg: 'Unexpected operation :-('
            }
            r.return(500,JSON.stringify(exceptionError))
            break;
        }

    }
}