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
}

export interface CreateRequestParams {
  baseUrl?: string
  formatOptions: (options: RequestOptions) => RequestOptions
  handleSuccess: (res: any, resolve: (value: unknown) => void, reject: (reason?: any) => void) => void
  handleError: (err: any, resolve: (value: unknown) => void, reject: (reason?: any) => void) => void
}

export const createRequest = (requestParams: CreateRequestParams) => (options: RequestOptions) => {
  options = requestParams.formatOptions ? requestParams.formatOptions(options) : options

  const { params, ...requestOptions } = options

  return new Promise((resolve, reject) => {
    uni.request({
      ...requestOptions,
      url: requestParams.baseUrl + options.path + (params ? `?${buildUrlWithParams(params)}` : ''),
      success: (res) => {
        requestParams.handleSuccess(res, resolve, reject)
      },
      fail: (err) => {
        requestParams.handleError(err, resolve, reject)
      }
    })
  })
}

export const createUpload = (requestParams: CreateRequestParams) => (options: RequestOptions) => {
  const { baseUrl = '' } = requestParams
  options = requestParams.formatOptions ? requestParams.formatOptions(options) : options
  const { params, ...requestOptions } = options

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      ...requestOptions,
      url: baseUrl + options.path + (params ? `?${buildUrlWithParams(params)}` : ''),
      success: (res) => {
        requestParams.handleSuccess(res, resolve, reject)
      },
      fail: (err) => {
        requestParams.handleError(err, resolve, reject)
      }
    })
  })
}
