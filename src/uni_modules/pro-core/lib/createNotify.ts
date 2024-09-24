import type { NotifyProps } from '@/uni_modules/wot-design-uni/components/pro-notify/types'

export interface NotifyInstance {
  showNotify: (option: NotifyProps | string) => void
  closeNotify: () => void
}

const defaultNotify: NotifyInstance = {
  showNotify: () => {},
  closeNotify: () => {}
}

class CreateNotify {
  private instance: NotifyInstance = defaultNotify

  bind = (notify: NotifyInstance) => {
    this.instance = notify
  }

  unbind = () => {
    this.instance = defaultNotify
  }

  showNotify = (option: NotifyProps | string) => {
    this.instance.showNotify(option)
  }

  closeNotify = () => {
    this.instance.closeNotify()
  }
}

export default CreateNotify
