import Http, { httpConfig, HTTP_ERROR_MAP, HttpError } from 'venus-fetch' // eslint-disable-line


export default (Vue, opt = {}) => {
  const CUSTOM_HTTP_ERROR_STATUS = 602
  const http = Http({
    conf: {
      credentials: 'include',
      baseUrl: '/api',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    timeout: 5000,
    ...opt,
  })


  http.injectAfter(rsp => {
    try {
      const { success, code, msg, UTF8Encoding } = rsp
      if (UTF8Encoding) { return } // 地图数据脏处理
      if (!success || code === 40101) {
        if (code === 40101) {
          return new HttpError({
            code,
            httpStatus: HttpError.TOKEN_EXPIRE, // 服务器返回的错误
            message: msg || HTTP_ERROR_MAP[HttpError.TOKEN_EXPIRE],
          })
        } else if (code !== 0) {
          return new HttpError({
            code,
            httpStatus: CUSTOM_HTTP_ERROR_STATUS, // 服务器返回的错误
            message: msg || '后台返回未知错误',
          })
        }
      }
    } catch (error) {
      return new HttpError({
        code: CUSTOM_HTTP_ERROR_STATUS,
        httpStatus: HttpError.RESPONSE_PARSING_FAILED, // 服务器返回的错误
        message: HTTP_ERROR_MAP[HttpError.RESPONSE_PARSING_FAILED],
      })
    }
  })

  Vue.prototype.http = http
}