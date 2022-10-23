// import { hello } from './hello'
import { addExtLinkFilter } from './body-filter/extlink'
import { concealPublicInfo } from './body-filter/concealer'
import { handleExtPlay } from './content/extplay'
import { contentTypeJson } from './header-filter/content-type-json'
import { x_emby_token } from './parser/x_emby_token'

// NOTE: This module must contain only the default export, no named exports!

export default {
  addExtLinkFilter,
  concealPublicInfo,
  handleExtPlay,
  contentTypeJson,
  x_emby_token,
}
