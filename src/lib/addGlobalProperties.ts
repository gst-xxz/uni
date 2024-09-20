import type { App } from 'vue'
import CreateToast from './createToast'
import CreateNotify from './createNotify'
import CreateMessage from './createMessage'
import CreateActionSheet from './createActionSheet'
import { request, upload } from '@/utils/fetch'
import type { RequestOptions } from './createRequest'

export const addGlobalProperties = (app: App<Element>) => {
  app.config.globalProperties.$toast = new CreateToast()
  app.config.globalProperties.$notify = new CreateNotify()
  app.config.globalProperties.$message = new CreateMessage()
  app.config.globalProperties.$actionSheet = new CreateActionSheet()

  // 请求
  app.config.globalProperties.$request = request
  app.config.globalProperties.$upload = upload
  app.config.globalProperties.$advanceRequest = function (
    options: RequestOptions,
    advanceOptions: {
      showSuccess?: boolean
      // 成功文案
      successText?: string
      showError?: boolean
      // 失败文案
      errorText?: string
      // 是否显示 loading
      showLoading?: boolean
      // loading 文字
      loadingText?: string
      // loading 是否显示遮罩
      loadingMask?: boolean
      // 是否是上传
      isUpload?: boolean
    }
  ) {
    const {
      showLoading = true,
      loadingText = '加载中...',
      loadingMask = true,
      successText,
      errorText,
      showSuccess = false,
      showError = true,
      isUpload = false
    } = advanceOptions

    const that = this
    return new Promise((resolve, reject) => {
      if (showLoading) {
        that.$showLoading({
          title: loadingText,
          mask: loadingMask
        })
      }

      that[isUpload ? '$upload' : '$request'](options)
        .then((res: any) => {
          if (showLoading) {
            that.$hideLoading()
          }
          if (showSuccess) {
            that.$notify.success(res?.message || res?.msg || successText)
          }
          resolve(res)
        })
        .catch((err: any) => {
          if (showLoading) {
            that.$hideLoading()
          }
          if (showError) {
            that.$notify.error(err?.message || err?.msg || errorText)
          }
          reject(err)
        })
    })
  }

  app.config.globalProperties.$showLoading = (options: UniNamespace.ShowLoadingOptions) => {
    uni.showLoading(options)
  }
  app.config.globalProperties.$hideLoading = () => {
    uni.hideLoading()
  }
}
