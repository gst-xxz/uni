import { provide, ref } from 'vue'
import type { Toast, ToastOptions } from './types'
import { deepMerge } from '../common/util'

/**
 * useToast 用到的key
 *
 * @internal
 */
export const toastDefaultOptionKey = '__TOAST_OPTION__'

// 默认模板
export const defaultOptions: ToastOptions = {
  msg: '',
  duration: 2000,
  loadingType: 'circular',
  loadingColor: '#4D80F0',
  iconColor: '#4D80F0',
  position: 'middle',
  show: false,
  zIndex: 100,
  iconSize: 24
}

export function useToast(selector: string = ''): Toast {
  let timer: ReturnType<typeof setTimeout> | null = null
  const toastOption = ref<ToastOptions>(defaultOptions) // Toast选项
  const toastOptionKey = selector ? toastDefaultOptionKey + selector : toastDefaultOptionKey
  provide(toastOptionKey, toastOption)

  const createMethod = (toastOptions: ToastOptions) => {
    // 优先级：options->toastOptions->defaultOptions
    return (options: ToastOptions | string) => {
      return show(deepMerge(toastOptions, typeof options === 'string' ? { msg: options } : options) as ToastOptions)
    }
  }

  const show = (option: ToastOptions | string) => {
    const options = deepMerge(defaultOptions, typeof option === 'string' ? { msg: option } : option) as ToastOptions
    toastOption.value = deepMerge(options, {
      show: true
    }) as ToastOptions
    // 开始渲染，并在 duration ms之后执行清除
    timer && clearTimeout(timer)
    if (toastOption.value.duration && toastOption.value.duration > 0) {
      timer = setTimeout(() => {
        timer && clearTimeout(timer)
        close()
      }, options.duration)
    }
  }

  const loading = createMethod({
    iconName: 'loading',
    duration: 0,
    cover: true
  })
  const success = createMethod({
    iconName: 'success',
    duration: 1500
  })
  const error = createMethod({ iconName: 'fail' })
  const warning = createMethod({ iconName: 'warning' })
  const info = createMethod({ iconName: 'info' })

  const close = () => {
    toastOption.value = { show: false }
  }
  return {
    show,
    loading,
    success,
    error,
    warning,
    info,
    close
  }
}
