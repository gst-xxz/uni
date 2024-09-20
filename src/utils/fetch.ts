import { createRequest, createUpload, type CreateRequestParams } from '@/lib/createRequest'
import { tokenStorage } from './storage'

const createRequestOptions: CreateRequestParams = {
  baseUrl: 'https://api.example.com',

  formatOptions: (options) => {
    if (options.isWhitelist) {
      return options
    }
    const token = tokenStorage.get()
    if (token) {
      options.header = {
        ...options.header,
        Authorization: token
      }
    }
    return options
  },

  handleSuccess: (res, resolve, reject) => {
    // token 过期
    if (res.statusCode === 401) {
      reject(res)
      return
    }

    // handle if error
    if (res.statusCode !== 200) {
      reject(res)
      return
    }

    resolve(res)
  },

  handleError: (err, _, reject) => {
    reject(err)
  }
}

export const request = createRequest(createRequestOptions)

export const upload = createUpload(createRequestOptions)
