import type { Message, MessageOptions } from '@/uni_modules/wot-design-uni/components/wd-message-box/types'

const defaultMessage: Message = {
  show: () => {
    return new Promise((resolve) => {
      resolve({ action: 'confirm' })
    })
  },
  alert: () => {
    return new Promise((resolve) => {
      resolve({ action: 'confirm' })
    })
  },
  confirm: () => {
    return new Promise((resolve) => {
      resolve({ action: 'confirm' })
    })
  },
  prompt: () => {
    return new Promise((resolve) => {
      resolve({ action: 'confirm' })
    })
  },
  close: () => {}
}

class CreateMessage {
  private instance: Message = defaultMessage

  bind = (message: Message) => {
    this.instance = message
  }

  unbind = () => {
    this.instance = defaultMessage
  }

  show = (option: MessageOptions | string) => {
    return this.instance.show(option)
  }

  alert = (option: MessageOptions | string) => {
    return this.instance.alert(option)
  }

  confirm = (option: MessageOptions | string) => {
    return this.instance.confirm(option)
  }

  prompt = (option: MessageOptions | string) => {
    return this.instance.prompt(option)
  }

  close = () => {
    this.instance.close()
  }
}

export default CreateMessage
