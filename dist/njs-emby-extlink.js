
/*!
* ${njs-emby-extlink} ${09c24587c42f35338b2787580ce2835d196e54e6}
* 
* Date: 2022-10-23
* */
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var pathParse = createCommonjsModule(function (module) {

var isWindows = process.platform === 'win32'; // Regex to split a windows path into into [dir, root, basename, name, ext]

var splitWindowsRe = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;
var win32 = {};

function win32SplitPath(filename) {
  return splitWindowsRe.exec(filename).slice(1);
}

win32.parse = function (pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
  }

  var allParts = win32SplitPath(pathString);

  if (!allParts || allParts.length !== 5) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }

  return {
    root: allParts[1],
    dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
    base: allParts[2],
    ext: allParts[4],
    name: allParts[3]
  };
}; // Split a filename into [dir, root, basename, name, ext], unix version
// 'root' is just a slash, or nothing.


var splitPathRe = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
var posix = {};

function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}

posix.parse = function (pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
  }

  var allParts = posixSplitPath(pathString);

  if (!allParts || allParts.length !== 5) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }

  return {
    root: allParts[1],
    dir: allParts[0].slice(0, -1),
    base: allParts[2],
    ext: allParts[4],
    name: allParts[3]
  };
};

if (isWindows) module.exports = win32.parse;else
  /* posix */
  module.exports = posix.parse;
module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;
});

var uaParser = createCommonjsModule(function (module, exports) {
/////////////////////////////////////////////////////////////////////////////////

/* UAParser.js v1.0.2
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License */

/*
Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
Supports browser & node.js environment. 
Demo   : https://faisalman.github.io/ua-parser-js
Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////
(function (window, undefined$1) {
  // Constants
  /////////////

  var LIBVERSION = '1.0.2',
      EMPTY = '',
      UNKNOWN = '?',
      FUNC_TYPE = 'function',
      UNDEF_TYPE = 'undefined',
      OBJ_TYPE = 'object',
      STR_TYPE = 'string',
      MAJOR = 'major',
      MODEL = 'model',
      NAME = 'name',
      TYPE = 'type',
      VENDOR = 'vendor',
      VERSION = 'version',
      ARCHITECTURE = 'architecture',
      CONSOLE = 'console',
      MOBILE = 'mobile',
      TABLET = 'tablet',
      SMARTTV = 'smarttv',
      WEARABLE = 'wearable',
      EMBEDDED = 'embedded',
      UA_MAX_LENGTH = 255;
  var AMAZON = 'Amazon',
      APPLE = 'Apple',
      ASUS = 'ASUS',
      BLACKBERRY = 'BlackBerry',
      BROWSER = 'Browser',
      CHROME = 'Chrome',
      EDGE = 'Edge',
      FIREFOX = 'Firefox',
      GOOGLE = 'Google',
      HUAWEI = 'Huawei',
      LG = 'LG',
      MICROSOFT = 'Microsoft',
      MOTOROLA = 'Motorola',
      OPERA = 'Opera',
      SAMSUNG = 'Samsung',
      SONY = 'Sony',
      XIAOMI = 'Xiaomi',
      ZEBRA = 'Zebra',
      FACEBOOK = 'Facebook'; ///////////
  // Helper
  //////////

  var extend = function (regexes, extensions) {
    var mergedRegexes = {};

    for (var i in regexes) {
      if (extensions[i] && extensions[i].length % 2 === 0) {
        mergedRegexes[i] = extensions[i].concat(regexes[i]);
      } else {
        mergedRegexes[i] = regexes[i];
      }
    }

    return mergedRegexes;
  },
      enumerize = function (arr) {
    var enums = {};

    for (var i = 0; i < arr.length; i++) {
      enums[arr[i].toUpperCase()] = arr[i];
    }

    return enums;
  },
      has = function (str1, str2) {
    return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
  },
      lowerize = function (str) {
    return str.toLowerCase();
  },
      majorize = function (version) {
    return typeof version === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined$1;
  },
      trim = function (str, len) {
    if (typeof str === STR_TYPE) {
      str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, EMPTY);
      return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
    }
  }; ///////////////
  // Map helper
  //////////////


  var rgxMapper = function (ua, arrays) {
    var i = 0,
        j,
        k,
        p,
        q,
        matches,
        match; // loop through all regexes maps

    while (i < arrays.length && !matches) {
      var regex = arrays[i],
          // even sequence (0,2,4,..)
      props = arrays[i + 1]; // odd sequence (1,3,5,..)

      j = k = 0; // try matching uastring with regexes

      while (j < regex.length && !matches) {
        matches = regex[j++].exec(ua);

        if (!!matches) {
          for (p = 0; p < props.length; p++) {
            match = matches[++k];
            q = props[p]; // check if given property is actually array

            if (typeof q === OBJ_TYPE && q.length > 0) {
              if (q.length === 2) {
                if (typeof q[1] == FUNC_TYPE) {
                  // assign modified match
                  this[q[0]] = q[1].call(this, match);
                } else {
                  // assign given value, ignore regex match
                  this[q[0]] = q[1];
                }
              } else if (q.length === 3) {
                // check whether function or regex
                if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                  // call function (usually string mapper)
                  this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined$1;
                } else {
                  // sanitize match using given regex
                  this[q[0]] = match ? match.replace(q[1], q[2]) : undefined$1;
                }
              } else if (q.length === 4) {
                this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined$1;
              }
            } else {
              this[q] = match ? match : undefined$1;
            }
          }
        }
      }

      i += 2;
    }
  },
      strMapper = function (str, map) {
    for (var i in map) {
      // check if current value is array
      if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
        for (var j = 0; j < map[i].length; j++) {
          if (has(map[i][j], str)) {
            return i === UNKNOWN ? undefined$1 : i;
          }
        }
      } else if (has(map[i], str)) {
        return i === UNKNOWN ? undefined$1 : i;
      }
    }

    return str;
  }; ///////////////
  // String map
  //////////////
  // Safari < 3.0


  var oldSafariMap = {
    '1.0': '/8',
    '1.2': '/1',
    '1.3': '/3',
    '2.0': '/412',
    '2.0.2': '/416',
    '2.0.3': '/417',
    '2.0.4': '/419',
    '?': '/'
  },
      windowsVersionMap = {
    'ME': '4.90',
    'NT 3.11': 'NT3.51',
    'NT 4.0': 'NT4.0',
    '2000': 'NT 5.0',
    'XP': ['NT 5.1', 'NT 5.2'],
    'Vista': 'NT 6.0',
    '7': 'NT 6.1',
    '8': 'NT 6.2',
    '8.1': 'NT 6.3',
    '10': ['NT 6.4', 'NT 10.0'],
    'RT': 'ARM'
  }; //////////////
  // Regex map
  /////////////

  var regexes = {
    browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i // Chrome for Android/iOS
    ], [VERSION, [NAME, 'Chrome']], [/edg(?:e|ios|a)?\/([\w\.]+)/i // Microsoft Edge
    ], [VERSION, [NAME, 'Edge']], [// Presto based
    /(opera mini)\/([-\w\.]+)/i, // Opera Mini
    /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, // Opera Mobi/Tablet
    /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i // Opera
    ], [NAME, VERSION], [/opios[\/ ]+([\w\.]+)/i // Opera mini on iphone >= 8.0
    ], [VERSION, [NAME, OPERA + ' Mini']], [/\bopr\/([\w\.]+)/i // Opera Webkit
    ], [VERSION, [NAME, OPERA]], [// Mixed
    /(kindle)\/([\w\.]+)/i, // Kindle
    /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, // Lunascape/Maxthon/Netfront/Jasmine/Blazer
    // Trident based
    /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, // Avant/IEMobile/SlimBrowser
    /(ba?idubrowser)[\/ ]?([\w\.]+)/i, // Baidu Browser
    /(?:ms|\()(ie) ([\w\.]+)/i, // Internet Explorer
    // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
    /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i, // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
    /(weibo)__([\d\.]+)/i // Weibo
    ], [NAME, VERSION], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i // UCBrowser
    ], [VERSION, [NAME, 'UC' + BROWSER]], [/\bqbcore\/([\w\.]+)/i // WeChat Desktop for Windows Built-in Browser
    ], [VERSION, [NAME, 'WeChat(Win) Desktop']], [/micromessenger\/([\w\.]+)/i // WeChat
    ], [VERSION, [NAME, 'WeChat']], [/konqueror\/([\w\.]+)/i // Konqueror
    ], [VERSION, [NAME, 'Konqueror']], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i // IE11
    ], [VERSION, [NAME, 'IE']], [/yabrowser\/([\w\.]+)/i // Yandex
    ], [VERSION, [NAME, 'Yandex']], [/(avast|avg)\/([\w\.]+)/i // Avast/AVG Secure Browser
    ], [[NAME, /(.+)/, '$1 Secure ' + BROWSER], VERSION], [/\bfocus\/([\w\.]+)/i // Firefox Focus
    ], [VERSION, [NAME, FIREFOX + ' Focus']], [/\bopt\/([\w\.]+)/i // Opera Touch
    ], [VERSION, [NAME, OPERA + ' Touch']], [/coc_coc\w+\/([\w\.]+)/i // Coc Coc Browser
    ], [VERSION, [NAME, 'Coc Coc']], [/dolfin\/([\w\.]+)/i // Dolphin
    ], [VERSION, [NAME, 'Dolphin']], [/coast\/([\w\.]+)/i // Opera Coast
    ], [VERSION, [NAME, OPERA + ' Coast']], [/miuibrowser\/([\w\.]+)/i // MIUI Browser
    ], [VERSION, [NAME, 'MIUI ' + BROWSER]], [/fxios\/([-\w\.]+)/i // Firefox for iOS
    ], [VERSION, [NAME, FIREFOX]], [/\bqihu|(qi?ho?o?|360)browser/i // 360
    ], [[NAME, '360 ' + BROWSER]], [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i], [[NAME, /(.+)/, '$1 ' + BROWSER], VERSION], [// Oculus/Samsung/Sailfish Browser
    /(comodo_dragon)\/([\w\.]+)/i // Comodo Dragon
    ], [[NAME, /_/g, ' '], VERSION], [/(electron)\/([\w\.]+) safari/i, // Electron-based App
    /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, // Tesla
    /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i // QQBrowser/Baidu App/2345 Browser
    ], [NAME, VERSION], [/(metasr)[\/ ]?([\w\.]+)/i, // SouGouBrowser
    /(lbbrowser)/i // LieBao Browser
    ], [NAME], [// WebView
    /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i // Facebook App for iOS & Android
    ], [[NAME, FACEBOOK], VERSION], [/safari (line)\/([\w\.]+)/i, // Line App for iOS
    /\b(line)\/([\w\.]+)\/iab/i, // Line App for Android
    /(chromium|instagram)[\/ ]([-\w\.]+)/i // Chromium/Instagram
    ], [NAME, VERSION], [/\bgsa\/([\w\.]+) .*safari\//i // Google Search Appliance on iOS
    ], [VERSION, [NAME, 'GSA']], [/headlesschrome(?:\/([\w\.]+)| )/i // Chrome Headless
    ], [VERSION, [NAME, CHROME + ' Headless']], [/ wv\).+(chrome)\/([\w\.]+)/i // Chrome WebView
    ], [[NAME, CHROME + ' WebView'], VERSION], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i // Android Browser
    ], [VERSION, [NAME, 'Android ' + BROWSER]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i // Chrome/OmniWeb/Arora/Tizen/Nokia
    ], [NAME, VERSION], [/version\/([\w\.]+) .*mobile\/\w+ (safari)/i // Mobile Safari
    ], [VERSION, [NAME, 'Mobile Safari']], [/version\/([\w\.]+) .*(mobile ?safari|safari)/i // Safari & Safari Mobile
    ], [VERSION, NAME], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i // Safari < 3.0
    ], [NAME, [VERSION, strMapper, oldSafariMap]], [/(webkit|khtml)\/([\w\.]+)/i], [NAME, VERSION], [// Gecko based
    /(navigator|netscape\d?)\/([-\w\.]+)/i // Netscape
    ], [[NAME, 'Netscape'], VERSION], [/mobile vr; rv:([\w\.]+)\).+firefox/i // Firefox Reality
    ], [VERSION, [NAME, FIREFOX + ' Reality']], [/ekiohf.+(flow)\/([\w\.]+)/i, // Flow
    /(swiftfox)/i, // Swiftfox
    /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
    /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
    /(firefox)\/([\w\.]+)/i, // Other Firefox-based
    /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, // Mozilla
    // Other
    /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
    /(links) \(([\w\.]+)/i // Links
    ], [NAME, VERSION]],
    cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i // AMD64 (x64)
    ], [[ARCHITECTURE, 'amd64']], [/(ia32(?=;))/i // IA32 (quicktime)
    ], [[ARCHITECTURE, lowerize]], [/((?:i[346]|x)86)[;\)]/i // IA32 (x86)
    ], [[ARCHITECTURE, 'ia32']], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i // ARM64
    ], [[ARCHITECTURE, 'arm64']], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i // ARMHF
    ], [[ARCHITECTURE, 'armhf']], [// PocketPC mistakenly identified as PowerPC
    /windows (ce|mobile); ppc;/i], [[ARCHITECTURE, 'arm']], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i // PowerPC
    ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [/(sun4\w)[;\)]/i // SPARC
    ], [[ARCHITECTURE, 'sparc']], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ], [[ARCHITECTURE, lowerize]]],
    device: [[//////////////////////////
    // MOBILES & TABLETS
    // Ordered by popularity
    /////////////////////////
    // Samsung
    /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [// Apple
    /\((ip(?:hone|od)[\w ]*);/i // iPod/iPhone
    ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [/\((ipad);[-\w\),; ]+apple/i, // iPad
    /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [// Huawei
    /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [// Xiaomi
    /\b(poco[\w ]+)(?: bui|\))/i, // Xiaomi POCO
    /\b; (\w+) build\/hm\1/i, // Xiaomi Hongmi 'numeric' models
    /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, // Xiaomi Hongmi
    /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, // Xiaomi Redmi
    /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
    ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i // Mi Pad tablets
    ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [// OPPO
    /; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [// Vivo
    /vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [// Realme
    /\b(rmx[12]\d{3})(?: bui|;|\))/i], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [// Motorola
    /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [// LG
    /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [// Lenovo
    /(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [// Nokia
    /(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [// Google
    /(pixel c)\b/i // Google Pixel C
    ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i // Google Pixel
    ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [// Sony
    /droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [// OnePlus
    / (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [// Amazon
    /(alexa)webm/i, /(kf[a-z]{2}wi)( bui|\))/i, // Kindle Fire without Silk
    /(kf[a-z]+)( bui|\)).+silk\//i // Kindle Fire HD
    ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i // Fire Phone
    ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [// BlackBerry
    /(playbook);[-\w\),; ]+(rim)/i // BlackBerry PlayBook
    ], [MODEL, VENDOR, [TYPE, TABLET]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i // BlackBerry 10
    ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [// Asus
    /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [// HTC
    /(nexus 9)/i // HTC Nexus 9
    ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, // HTC
    // ZTE
    /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [// Acer
    /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [// Meizu
    /droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [// Sharp
    /\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [MODEL, [VENDOR, 'Sharp'], [TYPE, MOBILE]], [// MIXED
    /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
    /(hp) ([\w ]+\w)/i, // HP iPAQ
    /(asus)-?(\w+)/i, // Asus
    /(microsoft); (lumia[\w ]+)/i, // Microsoft Lumia
    /(lenovo)[-_ ]?([-\w]+)/i, // Lenovo
    /(jolla)/i, // Jolla
    /(oppo) ?([\w ]+) bui/i // OPPO
    ], [VENDOR, MODEL, [TYPE, MOBILE]], [/(archos) (gamepad2?)/i, // Archos
    /(hp).+(touchpad(?!.+tablet)|tablet)/i, // HP TouchPad
    /(kindle)\/([\w\.]+)/i, // Kindle
    /(nook)[\w ]+build\/(\w+)/i, // Nook
    /(dell) (strea[kpr\d ]*[\dko])/i, // Dell Streak
    /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, // Le Pan Tablets
    /(trinity)[- ]*(t\d{3}) bui/i, // Trinity Tablets
    /(gigaset)[- ]+(q\w{1,9}) bui/i, // Gigaset Tablets
    /(vodafone) ([\w ]+)(?:\)| bui)/i // Vodafone
    ], [VENDOR, MODEL, [TYPE, TABLET]], [/(surface duo)/i // Surface Duo
    ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i // Fairphone
    ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [/(u304aa)/i // AT&T
    ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [/\bsie-(\w*)/i // Siemens
    ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [/\b(rct\w+) b/i // RCA Tablets
    ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [/\b(venue[\d ]{2,7}) b/i // Dell Venue Tablets
    ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [/\b(q(?:mv|ta)\w+) b/i // Verizon Tablet
    ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i // Barnes & Noble Tablet
    ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [/\b(tm\d{3}\w+) b/i], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [/\b(k88) b/i // ZTE K Series Tablet
    ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [/\b(nx\d{3}j) b/i // ZTE Nubia
    ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [/\b(gen\d{3}) b.+49h/i // Swiss GEN Mobile
    ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [/\b(zur\d{3}) b/i // Swiss ZUR Tablet
    ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [/\b((zeki)?tb.*\b) b/i // Zeki Tablets
    ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i // Dragon Touch Tablet
    ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [/\b(ns-?\w{0,9}) b/i // Insignia Tablets
    ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [/\b((nxa|next)-?\w{0,9}) b/i // NextBook Tablets
    ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i // Voice Xtreme Phones
    ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [/\b(lvtel\-)?(v1[12]) b/i // LvTel Phones
    ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [/\b(ph-1) /i // Essential PH-1
    ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [/\b(v(100md|700na|7011|917g).*\b) b/i // Envizen Tablets
    ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [/\b(trio[-\w\. ]+) b/i // MachSpeed Tablets
    ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [/\btu_(1491) b/i // Rotor Tablets
    ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [/(shield[\w ]+) b/i // Nvidia Shield Tablets
    ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [/(sprint) (\w+)/i // Sprint Phones
    ], [VENDOR, MODEL, [TYPE, MOBILE]], [/(kin\.[onetw]{3})/i // Microsoft Kin
    ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i // Zebra
    ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [///////////////////
    // CONSOLES
    ///////////////////
    /(ouya)/i, // Ouya
    /(nintendo) ([wids3utch]+)/i // Nintendo
    ], [VENDOR, MODEL, [TYPE, CONSOLE]], [/droid.+; (shield) bui/i // Nvidia
    ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [/(playstation [345portablevi]+)/i // Playstation
    ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i // Microsoft Xbox
    ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [///////////////////
    // SMARTTVS
    ///////////////////
    /smart-tv.+(samsung)/i // Samsung
    ], [VENDOR, [TYPE, SMARTTV]], [/hbbtv.+maple;(\d+)/i], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i // LG SmartTV
    ], [[VENDOR, LG], [TYPE, SMARTTV]], [/(apple) ?tv/i // Apple TV
    ], [VENDOR, [MODEL, APPLE + ' TV'], [TYPE, SMARTTV]], [/crkey/i // Google Chromecast
    ], [[MODEL, CHROME + 'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [/droid.+aft(\w)( bui|\))/i // Fire TV
    ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [/\(dtv[\);].+(aquos)/i // Sharp
    ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, // Roku
    /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i // HbbTV devices
    ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i // SmartTV from Unidentified Vendors
    ], [[TYPE, SMARTTV]], [///////////////////
    // WEARABLES
    ///////////////////
    /((pebble))app/i // Pebble
    ], [VENDOR, MODEL, [TYPE, WEARABLE]], [/droid.+; (glass) \d/i // Google Glass
    ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [/droid.+; (wt63?0{2,3})\)/i], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [/(quest( 2)?)/i // Oculus Quest
    ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [///////////////////
    // EMBEDDED
    ///////////////////
    /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i // Tesla
    ], [VENDOR, [TYPE, EMBEDDED]], [////////////////////
    // MIXED (GENERIC)
    ///////////////////
    /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i // Android Phones from Unidentified Vendors
    ], [MODEL, [TYPE, MOBILE]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i // Android Tablets from Unidentified Vendors
    ], [MODEL, [TYPE, TABLET]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i // Unidentifiable Tablet
    ], [[TYPE, TABLET]], [/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i // Unidentifiable Mobile
    ], [[TYPE, MOBILE]], [/(android[-\w\. ]{0,9});.+buil/i // Generic Android Device
    ], [MODEL, [VENDOR, 'Generic']]],
    engine: [[/windows.+ edge\/([\w\.]+)/i // EdgeHTML
    ], [VERSION, [NAME, EDGE + 'HTML']], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i // Blink
    ], [VERSION, [NAME, 'Blink']], [/(presto)\/([\w\.]+)/i, // Presto
    /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
    /ekioh(flow)\/([\w\.]+)/i, // Flow
    /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, // KHTML/Tasman/Links
    /(icab)[\/ ]([23]\.[\d\.]+)/i // iCab
    ], [NAME, VERSION], [/rv\:([\w\.]{1,9})\b.+(gecko)/i // Gecko
    ], [VERSION, NAME]],
    os: [[// Windows
    /microsoft (windows) (vista|xp)/i // Windows (iTunes)
    ], [NAME, VERSION], [/(windows) nt 6\.2; (arm)/i, // Windows RT
    /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, // Windows Phone
    /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [NAME, [VERSION, strMapper, windowsVersionMap]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[NAME, 'Windows'], [VERSION, strMapper, windowsVersionMap]], [// iOS/macOS
    /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, // iOS
    /cfnetwork\/.+darwin/i], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i // Mac OS
    ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [// Mobile OSes
    /droid ([\w\.]+)\b.+(android[- ]x86)/i // Android-x86
    ], [VERSION, NAME], [// Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
    /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, // Blackberry
    /(tizen|kaios)[\/ ]([\w\.]+)/i, // Tizen/KaiOS
    /\((series40);/i // Series 40
    ], [NAME, VERSION], [/\(bb(10);/i // BlackBerry 10
    ], [VERSION, [NAME, BLACKBERRY]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i // Symbian
    ], [VERSION, [NAME, 'Symbian']], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
    ], [VERSION, [NAME, FIREFOX + ' OS']], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i // WebOS
    ], [VERSION, [NAME, 'webOS']], [// Google Chromecast
    /crkey\/([\d\.]+)/i // Google Chromecast
    ], [VERSION, [NAME, CHROME + 'cast']], [/(cros) [\w]+ ([\w\.]+\w)/i // Chromium OS
    ], [[NAME, 'Chromium OS'], VERSION], [// Console
    /(nintendo|playstation) ([wids345portablevuch]+)/i, // Nintendo/Playstation
    /(xbox); +xbox ([^\);]+)/i, // Microsoft Xbox (360, One, X, S, Series X, Series S)
    // Other
    /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, // Joli/Palm
    /(mint)[\/\(\) ]?(\w*)/i, // Mint
    /(mageia|vectorlinux)[; ]/i, // Mageia/VectorLinux
    /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
    /(hurd|linux) ?([\w\.]*)/i, // Hurd/Linux
    /(gnu) ?([\w\.]*)/i, // GNU
    /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
    /(haiku) (\w+)/i // Haiku
    ], [NAME, VERSION], [/(sunos) ?([\w\.\d]*)/i // Solaris
    ], [[NAME, 'Solaris'], VERSION], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, // Solaris
    /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, // AIX
    /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX
    /(unix) ?([\w\.]*)/i // UNIX
    ], [NAME, VERSION]]
  }; /////////////////
  // Constructor
  ////////////////

  var UAParser = function (ua, extensions) {
    if (typeof ua === OBJ_TYPE) {
      extensions = ua;
      ua = undefined$1;
    }

    if (!(this instanceof UAParser)) {
      return new UAParser(ua, extensions).getResult();
    }

    var _ua = ua || (typeof window !== UNDEF_TYPE && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);

    var _rgxmap = extensions ? extend(regexes, extensions) : regexes;

    this.getBrowser = function () {
      var _browser = {};
      _browser[NAME] = undefined$1;
      _browser[VERSION] = undefined$1;
      rgxMapper.call(_browser, _ua, _rgxmap.browser);
      _browser.major = majorize(_browser.version);
      return _browser;
    };

    this.getCPU = function () {
      var _cpu = {};
      _cpu[ARCHITECTURE] = undefined$1;
      rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
      return _cpu;
    };

    this.getDevice = function () {
      var _device = {};
      _device[VENDOR] = undefined$1;
      _device[MODEL] = undefined$1;
      _device[TYPE] = undefined$1;
      rgxMapper.call(_device, _ua, _rgxmap.device);
      return _device;
    };

    this.getEngine = function () {
      var _engine = {};
      _engine[NAME] = undefined$1;
      _engine[VERSION] = undefined$1;
      rgxMapper.call(_engine, _ua, _rgxmap.engine);
      return _engine;
    };

    this.getOS = function () {
      var _os = {};
      _os[NAME] = undefined$1;
      _os[VERSION] = undefined$1;
      rgxMapper.call(_os, _ua, _rgxmap.os);
      return _os;
    };

    this.getResult = function () {
      return {
        ua: this.getUA(),
        browser: this.getBrowser(),
        engine: this.getEngine(),
        os: this.getOS(),
        device: this.getDevice(),
        cpu: this.getCPU()
      };
    };

    this.getUA = function () {
      return _ua;
    };

    this.setUA = function (ua) {
      _ua = typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua;
      return this;
    };

    this.setUA(_ua);
    return this;
  };

  UAParser.VERSION = LIBVERSION;
  UAParser.BROWSER = enumerize([NAME, VERSION, MAJOR]);
  UAParser.CPU = enumerize([ARCHITECTURE]);
  UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
  UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]); ///////////
  // Export
  //////////
  // check js environment

  {
    // nodejs env
    if (module.exports) {
      exports = module.exports = UAParser;
    }

    exports.UAParser = UAParser;
  } // jQuery/Zepto specific (optional)
  // Note:
  //   In AMD env the global scope should be kept clean, but jQuery is an exception.
  //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
  //   and we should catch that.


  var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);

  if ($ && !$.ua) {
    var parser = new UAParser();
    $.ua = parser.getResult();

    $.ua.get = function () {
      return parser.getUA();
    };

    $.ua.set = function (ua) {
      parser.setUA(ua);
      var result = parser.getResult();

      for (var prop in result) {
        $.ua[prop] = result[prop];
      }
    };
  }
})(typeof window === 'object' ? window : commonjsGlobal);
});

// import { parse, stringify } from 'flatted';
// import { parse, stringfy } from 'secure-json-parse'

// Plugin Slug
var PLUGIN_PATH_SLUG = "/Emby/Addons/ExtPlay";
var res$1 = "";

var AddVersionSelector = function (arr) {
  var extMap = [];
  var posMap = [];
  var filteredArr = [];

  var _loop = function (i) {
    var info = arr[i]; // r.warn(`Item ${i}: ${info.Name}`)

    var extMapIndex = extMap.findIndex(x => x.key == info.Name);
    var posMapIndex = posMap.findIndex(x => x.key == info.Name); // r.warn(`extMapIndex:  + ${extMapIndex}`)
    // r.warn(`posMapIndex:  + ${posMapIndex}`)

    if (extMapIndex > -1) {
      var _extMap$find, _posMap$find;

      // r.warn('Hit!')
      // Prev exist
      var prevCount = (_extMap$find = extMap.find(x => x.key == info.Name)) == null ? void 0 : _extMap$find.value;
      var prevPos = (_posMap$find = posMap.find(x => x.key == info.Name)) == null ? void 0 : _posMap$find.value; // r.warn(`prevCount:  + ${prevCount}`)
      // r.warn(`prevPos:  + ${prevPos}`)

      if (prevCount > -1 && prevPos > -1) {
        var nowCount = prevCount + 1; // Split Version

        var nameParts = info.Name.split('-'); // r.warn(JSON.stringify(nameParts))

        var prevVersion = `${nameParts[0].trim()}(${prevCount})`;
        var currVersion = `${nameParts[0].trim()}(${nowCount})`;
        var prevNextPart = nameParts[1] ? nameParts[1] : '';
        filteredArr[prevPos].Name = `${prevVersion} -${prevNextPart}`; // Change Old Name
        // r.warn(`Prev Name Changed ${prevPos}: ${filteredArr[<number>prevPos].Name}`)
        // r.warn(`New Name: ${currVersion} -${prevNextPart}`)
        // Push New Name

        filteredArr.push({
          Name: `${currVersion} -${prevNextPart}`,
          Url: info.Url
        }); // Reset Pos

        extMap[extMapIndex] = {
          key: info.Name,
          value: nowCount
        };
        posMap[posMapIndex] = {
          key: info.Name,
          value: i
        };
        extMap[i] = {
          key: info.Name,
          value: nowCount
        };
        posMap[i] = {
          key: info.Name,
          value: i
        };
      } else {
        extMap[i] = {
          key: info.Name,
          value: 1
        };
        posMap[i] = {
          key: info.Name,
          value: i
        };
        filteredArr.push(info);
      }
    } else {
      extMap[i] = {
        key: info.Name,
        value: 1
      };
      posMap[i] = {
        key: info.Name,
        value: i
      };
      filteredArr.push(info);
    }
  };

  for (var i = 0; i < arr.length; i++) {
    _loop(i);
  } // r.warn(JSON.stringify(filteredArr))


  return filteredArr;
};

function addExtLinkFilter(r, data, flags) {
  if (data.length) ;
  res$1 += data;

  if (flags.last) {
    try {
      // const resHeader = r.headersOut
      var host = r.headersIn.Host;
      var ua = r.headersIn['User-Agent'];
      var uaParsed = uaParser(ua);
      var hostparts = host == null ? void 0 : host.split(':'); // r.error(host ?? 'Host not defined');
      // const hostURL = host ? new Url(host) : null
      // const referer = r.headersIn.Referer;
      // const refererUrl = referer ? new Url(referer) : null
      // const origin = r.headersIn.Origin
      // const originUrl = origin ? new Url(origin) : null
      // const xProtocol = r.headersIn['X-Forwarded-Proto']
      // r.warn(`host: ${host}, referer: ${referer}, origin: ${origin}`)
      // r.warn(`${JSON.stringify(r.headersIn)}`)
      // Detect Protocol

      var protocol = "https:";

      if (hostparts && hostparts.length == 2) {
        // With ports
        var port = hostparts[1];

        if (parseInt(port) != 443) {
          protocol = 'http:';
        }
      }

      var params = r.args; // const uri = r.uri
      // const responseBody = <NjsByteString>r.responseText
      // r.warn(res)

      var bodyObj = JSON.parse(res$1); // Init External Play Link List
      // const infusePlay: ExternalURL[] = [];
      // const nplayerPlay: ExternalURL[] = [];
      // const vlcPlay: ExternalURL[] = [];
      // const iinaPlay: ExternalURL[] = [];

      var extPlayList = []; // const movistproPlay: ExternalURL[] = [];

      if (bodyObj["MediaSources"]) {
        var mediaSources = bodyObj["MediaSources"];

        for (var i = 0; i < mediaSources.length; i++) {
          var mediaSource = mediaSources[i];
          var path = mediaSource.Path; // const videoFileName = pathParse(path).base

          var subMediaStreams = mediaSource.MediaStreams; // Get every media stream
          // let prefix = '';

          for (var j = 0; j < subMediaStreams.length; j++) {
            // Grab Video Info
            // TODO: multi video channel?
            var subMediaStream = subMediaStreams[j];

            if (subMediaStream.Type === 'Video') {
              var _uaParsed$os$name, _uaParsed$os$name2, _uaParsed$os$name3;

              var videoFileExt = pathParse(path).ext;
              var videoFileName = `${bodyObj.Name} (${bodyObj.ProductionYear})`;
              var videoUrl = `${protocol}//${host}/Videos/${bodyObj['Id']}/ExtPlay/${encodeURIComponent(videoFileName)}?MediaSourceId=${mediaSource.Id}&Static=true&api_key=${params['X-Emby-Token']}`;
              var videoUrlWithExt = `${protocol}//${host}/Videos/${bodyObj['Id']}/ExtPlay/${encodeURIComponent(videoFileName + videoFileExt)}?MediaSourceId=${mediaSource.Id}&Static=true&api_key=${params['X-Emby-Token']}`;
              /*
              if (bodyObj.Name && subMediaStream.DisplayTitle) {
                  prefix = ' - ' + bodyObj.Name + ' (' + subMediaStream.DisplayTitle + ')'
              } else if (bodyObj.Name) {
                  prefix = ' - ' + bodyObj.Name
              } else if (subMediaStream.DisplayTitle) {
                  prefix = subMediaStream.DisplayTitle
              }*/

              if (uaParsed.os.name == 'iOS') {
                extPlayList.push({
                  //Url: host + embyPlguin + 'infuse://x-callback-url/play?url=' + encodeURIComponent(videoUrl),
                  Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=Infuse&Stream=${encodeURIComponent(videoUrl)}`,
                  Name: mediaSources.length > 1 ? `${subMediaStream.DisplayTitle} - Infuse` : 'Infuse'
                });
              }

              if (uaParsed.os.name == 'iOS' || (_uaParsed$os$name = uaParsed.os.name) != null && _uaParsed$os$name.startsWith('Android')) {
                extPlayList.push({
                  Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=nPlayer&Stream=${encodeURIComponent(videoUrl)}`,
                  Name: mediaSources.length > 1 ? `${subMediaStream.DisplayTitle} - nPlayer` : 'nPlayer'
                });
                extPlayList.push({
                  Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=VLC&Stream=${encodeURIComponent(videoUrlWithExt)}&Title=${encodeURIComponent(videoFileName)}`,
                  Name: mediaSources.length > 1 ? `${subMediaStream.DisplayTitle} - VLC` : 'VLC'
                });
              }

              if (uaParsed.os.name == 'Mac OS') {
                extPlayList.push({
                  Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=IINA&Stream=${encodeURIComponent(videoUrl)}`,
                  Name: mediaSources.length > 1 ? `${subMediaStream.DisplayTitle} - IINA` : 'IINA'
                });
              }

              if ((_uaParsed$os$name2 = uaParsed.os.name) != null && _uaParsed$os$name2.startsWith('Windows')) {
                extPlayList.push({
                  Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=PotPlayer&Stream=${encodeURIComponent(videoUrl)}`,
                  Name: mediaSources.length > 1 ? `${subMediaStream.DisplayTitle} - PotPlayer` : 'PotPlayer'
                });
              }

              if ((_uaParsed$os$name3 = uaParsed.os.name) != null && _uaParsed$os$name3.startsWith('Android')) {
                extPlayList.push({
                  Url: `${protocol}//${host}${PLUGIN_PATH_SLUG}?Player=MXPlayerFree&Stream=${encodeURIComponent(videoUrlWithExt)}&Title=${encodeURIComponent(videoFileName)}`,
                  Name: mediaSources.length > 1 ? `${subMediaStream.DisplayTitle} - MXPlayer` : 'MXPlayer'
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

            } // Subtitle
            // Ignore: No Shu Support

            /*
            if(subMediaStream.Type === 'Subtitle' && subMediaStream.IsExternal && subMediaStream.Path){
                let subTitleFileName = pathParse(subMediaStream.Path).base
            }
            */

          }
        } // Merge To ExternalURL


        var newExternalURL = [].concat(extPlayList, bodyObj.ExternalUrls); // Sort

        var filteredURLs = AddVersionSelector(newExternalURL);
        bodyObj.ExternalUrls = filteredURLs;
      } // Return


      var bodyString = JSON.stringify(bodyObj);
      r.headersOut['Content-Length'] = bodyString.length.toString(); // r.sendHeader()

      r.sendBuffer(bodyString, flags); // r.warn(`FILTERED ${res.length} bytes in ${buf} buffers`);
    } catch (e) {
      r.error(`[NJS Emby Plugin: ExtLink] Error:${e}`);
      r.sendBuffer("", flags);
    }
  }
}

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */

var requiresPort = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;
  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
      return port !== 80;

    case 'https':
    case 'wss':
      return port !== 443;

    case 'ftp':
      return port !== 21;

    case 'gopher':
      return port !== 70;

    case 'file':
      return false;
  }

  return port !== 0;
};

var has = Object.prototype.hasOwnProperty,
    undef;
/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */

function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}
/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */


function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}
/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */


function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g,
      result = {},
      part;

  while (part = parser.exec(query)) {
    var key = decode(part[1]),
        value = decode(part[2]); //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //

    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}
/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */


function querystringify(obj, prefix) {
  prefix = prefix || '';
  var pairs = [],
      value,
      key; //
  // Optionally prefix with a '?' if needed
  //

  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key]; //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //

      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value); //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //

      if (key === null || value === null) continue;
      pairs.push(key + '=' + value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
} //
// Expose the module.
//


var stringify = querystringify;
var parse = querystring;

var querystringify_1 = {
	stringify: stringify,
	parse: parse
};

var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/,
    CRHTLF = /[\n\r\t]/g,
    slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
    port = /:\d+$/,
    protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
    windowsDriveLetter = /^[a-zA-Z]:/;
/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */


function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
}
/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */


var rules = [['#', 'hash'], // Extract from the back.
['?', 'query'], // Extract from the back.
function sanitize(address, url) {
  // Sanitize what is left of the address
  return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
}, ['/', 'pathname'], // Extract from the back.
['@', 'auth', 1], // Extract from the front.
[NaN, 'host', undefined, 1, 1], // Set left over value.
[/:(\d*)$/, 'port', undefined, 1], // RegExp the back.
[NaN, 'hostname', undefined, 1, 1] // Set left over.
];
/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */

var ignore = {
  hash: 1,
  query: 1
};
/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */

function lolcation(loc) {
  var globalVar;
  if (typeof window !== 'undefined') globalVar = window;else if (typeof commonjsGlobal !== 'undefined') globalVar = commonjsGlobal;else if (typeof self !== 'undefined') globalVar = self;else globalVar = {};
  var location = globalVar.location || {};
  loc = loc || location;
  var finaldestination = {},
      type = typeof loc,
      key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});

    for (key in ignore) {
      delete finaldestination[key];
    }
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}
/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */


function isSpecial(scheme) {
  return scheme === 'file:' || scheme === 'ftp:' || scheme === 'http:' || scheme === 'https:' || scheme === 'ws:' || scheme === 'wss:';
}
/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */


function extractProtocol(address, location) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');
  location = location || {};
  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4];
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}
/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */


function resolve(relative, base) {
  if (relative === '') return base;
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
      i = path.length,
      last = path[i - 1],
      unshift = false,
      up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');
  return path.join('/');
}
/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */


function Url(address, location, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative,
      extracted,
      parse,
      instruction,
      index,
      key,
      instructions = rules.slice(),
      type = typeof location,
      url = this,
      i = 0; //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //

  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = querystringify_1.parse;
  location = lolcation(location); //
  // Extract protocol information before running the instructions.
  //

  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest; //
  // When the authority component is absent the URL starts with a path
  // component.
  //

  if (extracted.protocol === 'file:' && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      index = parse === '@' ? address.lastIndexOf(parse) : address.indexOf(parse);

      if (~index) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : ''); //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //

    if (instruction[4]) url[key] = url[key].toLowerCase();
  } //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //


  if (parser) url.query = parser(url.query); //
  // If the URL is relative, resolve the pathname against the base URL.
  //

  if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
    url.pathname = resolve(url.pathname, location.pathname);
  } //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //


  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  } //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //


  if (!requiresPort(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  } //
  // Parse down the `auth` for the username and password.
  //


  url.username = url.password = '';

  if (url.auth) {
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));
      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password));
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username + ':' + url.password : url.username;
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host ? url.protocol + '//' + url.host : 'null'; //
  // The href is just the compiled result.
  //

  url.href = url.toString();
}
/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */


function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || querystringify_1.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!requiresPort(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname + ':' + value;
      }

      break;

    case 'hostname':
      url[part] = value;
      if (url.port) value += ':' + url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (port.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }

      break;

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));
        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }

  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];
    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username + ':' + url.password : url.username;
  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host ? url.protocol + '//' + url.host : 'null';
  url.href = url.toString();
  return url;
}
/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */


function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = querystringify_1.stringify;
  var query,
      url = this,
      host = url.host,
      protocol = url.protocol;
  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';
  var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':' + url.password;
    result += '@';
  } else if (url.password) {
    result += ':' + url.password;
    result += '@';
  } else if (url.protocol !== 'file:' && isSpecial(url.protocol) && !host && url.pathname !== '/') {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  } //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //


  if (host[host.length - 1] === ':' || port.test(url.hostname) && !url.port) {
    host += ':';
  }

  result += host + url.pathname;
  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?' + query : query;
  if (url.hash) result += url.hash;
  return result;
}

Url.prototype = {
  set: set,
  toString: toString
}; //
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//

Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = querystringify_1;
var urlParse = Url;

var res = "";
function concealPublicInfo(r, data, flags) {
  if (data.length) ;
  res += data;

  if (flags.last) {
    try {
      var bodyObj = JSON.parse(res);

      if (bodyObj["LocalAddress"] && bodyObj["WanAddress"]) {
        var host = r.headersIn.Host;
        var referer = r.headersIn.Referer;
        var refererUrl = referer ? new urlParse(referer) : null;
        var protocol = refererUrl ? refererUrl.protocol : "https:"; // Port Checker

        var _Url = new urlParse(host ? host : ''),
            port = _Url.port;

        if (!port) {
          if (protocol == 'http:') {
            port = "80";
          } else {
            port = "443";
          }
        } // Modify The Body


        switch (protocol) {
          case "http://":
            {
              bodyObj.HttpServerPortNumber = port;
              bodyObj.HttpsPortNumber = "443";
              break;
            }

          default:
            {
              bodyObj.HttpServerPortNumber = "80";
              bodyObj.HttpsPortNumber = port;
              break;
            }
        }

        bodyObj.LocalAddress = `${protocol}//${host}`;
        bodyObj.LocalAddresses = [`${protocol}//${host}`];
        bodyObj.WanAddress = `${protocol}//${host}`;
        bodyObj.RemoteAddresses = [`${protocol}//${host}`];
        bodyObj.WebSocketPortNumber = port;
      } // Return


      var bodyString = JSON.stringify(bodyObj);
      r.headersOut['Content-Length'] = bodyString.length.toString(); // r.sendHeader()

      r.sendBuffer(bodyString, flags);
    } catch (e) {
      r.error(`[NJS Emby Plugin: Concealer] Error:${e}`);
      r.sendBuffer("", flags);
    }
  }
}

function handleExtPlay(r) {
  var param = r.args;
  var player = param['Player'];
  var encodedStreamURL = param['Stream'];
  var decodedStreamURL = decodeURIComponent(encodedStreamURL);
  var encodedTitle = param['Title'];
  var title = decodeURIComponent(encodedTitle);

  switch (player) {
    case 'Infuse':
      {
        var urlScheme = `infuse://x-callback-url/play?url=${encodedStreamURL}`;
        r.return(301, urlScheme);
        break;
      }

    case 'nPlayer':
      {
        var _urlScheme = `nplayer-${decodedStreamURL}`;
        r.return(301, _urlScheme);
        break;
      }

    case 'PotPlayer':
      {
        var _urlScheme2 = `potplayer://${decodedStreamURL}`;
        r.return(302, _urlScheme2);
        break;
      }

    case 'MXPlayer':
      {
        var _urlScheme3 = `intent:${decodedStreamURL}#Intent;package=com.mxtech.videoplayer.pro;S.title=${title};end`;
        r.return(302, _urlScheme3);
        break;
      }

    case 'MXPlayerFree':
      {
        var _urlScheme4 = `intent:${decodedStreamURL}#Intent;package=com.mxtech.videoplayer.ad;S.title=${title};end`; // const urlScheme = `intent:https://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8#Intent;package=com.mxtech.videoplayer.ad;S.title=${title};end`;

        r.return(302, _urlScheme4);
        break;
      }

    case 'VLC':
      {
        // const urlScheme = `vlc-x-callback://x-callback-url/stream?url=${encodedStreamURL}&filename=${encodedTitle}`
        // const urlScheme = `vlc-x-callback://x-callback-url/stream?url=${encodedStreamURL}&filename=${title}`
        var _urlScheme5 = `vlc://${decodedStreamURL}`;
        r.return(302, _urlScheme5);
        break;
      }

    case 'IINA':
      {
        var _urlScheme6 = `iina://weblink?url=${encodedStreamURL}`;
        r.return(302, _urlScheme6);
        break;
      }

    case 'MovistPro':
      {
        var movistInfo = {
          "url": decodeURIComponent,
          "title": title
        };
        var _urlScheme7 = `movistpro:${encodeURIComponent(JSON.stringify(movistInfo))}`;
        r.return(302, _urlScheme7);
        break;
      }

    default:
      {
        var exceptionError = {
          code: 500,
          msg: 'Unexpected operation :-('
        };
        r.return(500, JSON.stringify(exceptionError));
        break;
      }
  }
}

function contentTypeJson(r) {
  delete r.headersOut["Content-Length"]; // delete r.headersOut["Content-Type"];
  // r.headersOut["Content-Type"] = "application/json";
}

// import { hello } from './hello'

var index = {
  addExtLinkFilter,
  concealPublicInfo,
  handleExtPlay,
  contentTypeJson
};

export default index;
