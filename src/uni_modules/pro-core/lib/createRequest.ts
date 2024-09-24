import { buildUrlWithParams } from './utils'

export interface RequestOptions {
  path: string
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
  data?: any
  header?: any

  // 请求参数
  params?: Record<string, string | number | boolean>
  // 是否是白名单，则不带 token
  isWhitelist?: boolean

  // 是否缓存
  cache?: boolean
  // 缓存时间
  expire?: number
}

export interface CreateRequestParams {
  baseURL?: string
  formatOptions: (options: RequestOptions) => RequestOptions
  handleSuccess: (res: any, resolve: (value: unknown) => void, reject: (reason?: any) => void) => void
  handleError: (err: any, resolve: (value: unknown) => void, reject: (reason?: any) => void) => void
}

const cacheMap = new Map()

const coreRequest = (requestParams: CreateRequestParams, options: RequestOptions, type = 'request') => {
  const { baseURL = '' } = requestParams

  options = requestParams.formatOptions ? requestParams.formatOptions(options) : options

  const { params, ...requestOptions } = options

  return new Promise((resolve, reject) => {
    if (options.cache) {
      const cacheKey = JSON.stringify(options)
      if (cacheMap.has(cacheKey)) {
        const cacheData = cacheMap.get(cacheKey)
        if (cacheData.expire && Date.now() - cacheData.time > cacheData.expire) {
          cacheMap.delete(cacheKey)
        } else {
          if (cacheData.type === 'resolve') {
            resolve(cacheData.data)
          } else {
            reject(cacheData.data)
          }
          return
        }
      }
    }

    const onResolve = (result: any) => {
      if (options.cache) {
        const cacheKey = JSON.stringify(options)
        cacheMap.set(cacheKey, { data: result, time: Date.now(), type: 'resolve', expire: options.expire })
      }
      resolve(result)
    }

    const onReject = (err: any) => {
      if (options.cache) {
        const cacheKey = JSON.stringify(options)
        cacheMap.set(cacheKey, { data: err, time: Date.now(), type: 'reject', expire: options.expire })
      }
      reject(err)
    }

    uni[type as 'request']({
      ...requestOptions,
      url: baseURL + options.path + (params ? `?${buildUrlWithParams(params)}` : ''),
      success: (res) => {
        requestParams.handleSuccess(res, onResolve, onReject)
      },
      fail: (err) => {
        requestParams.handleError(err, onResolve, onReject)
      }
    })
  })
}

export const createRequest = (requestParams: CreateRequestParams) => (options: RequestOptions) => coreRequest(requestParams, options)

export const createUpload = (requestParams: CreateRequestParams) => (options: RequestOptions) => coreRequest(requestParams, options, 'upload')
