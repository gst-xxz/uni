import type { Toast, ToastOptions } from '@/uni_modules/wot-design-uni/components/pro-toast/typess'

const defaultToast: Toast = {
  show(toastOptions: ToastOptions | string) {},
  success(toastOptions: ToastOptions | string) {},
  error(toastOptions: ToastOptions | string) {},
  info(toastOptions: ToastOptions | string) {},
  warning(toastOptions: ToastOptions | string) {},
  loading(toastOptions: ToastOptions | string) {},
  close() {}
}

class CreateToast {
  private instance: Toast = defaultToast

  bind = (toast: Toast) => {
    this.instance = toast
  }
  unbind = () => {
    this.instance = defaultToast
  }

  show = (toastOptions: ToastOptions | string) => {
    return this.instance.show(toastOptions)
  }
  success = (toastOptions: ToastOptions | string) => {
    return this.instance.success(toastOptions)
  }
  error(toastOptions: ToastOptions | string) {
    return this.instance.error(toastOptions)
  }
  info = (toastOptions: ToastOptions | string) => {
    return this.instance.info(toastOptions)
  }
  warning = (toastOptions: ToastOptions | string) => {
    return this.instance.warning(toastOptions)
  }
  loading = (toastOptions: ToastOptions | string) => {
    return this.instance.loading(toastOptions)
  }
  close = () => {
    return this.instance.close()
  }
}

export default CreateToast
