import CreateToast from './createToast'
import CreateNotify, { type NotifyInstance } from './createNotify'
import CreateMessage from './createMessage'
import CreateActionSheet, { type ActionSheetInstance } from './createActionSheet'
import type { Toast } from '@/uni_modules/wot-design-uni/components/wd-toast/types'
import type { Message } from '@/uni_modules/wot-design-uni/components/wd-message-box/types'

class Pro {
  public toast = new CreateToast()
  public notify = new CreateNotify()
  public message = new CreateMessage()
  public actionSheet = new CreateActionSheet()

  get actionSheetDefaultData() {
    return this.actionSheet.defaultData
  }

  bindToast(toast: Toast) {
    this.toast.bind(toast)
  }

  unbindToast() {
    this.toast.unbind()
  }

  bindNotify(notify: NotifyInstance) {
    this.notify.bind(notify)
  }

  unbindNotify() {
    this.notify.unbind()
  }

  bindMessage(message: Message) {
    this.message.bind(message)
  }

  unbindMessage() {
    this.message.unbind()
  }

  bindActionSheet(actionSheet: ActionSheetInstance) {
    this.actionSheet.bind(actionSheet)
  }

  unbindActionSheet() {
    this.actionSheet.unbind()
  }
}

const pro = new Pro()

export default pro
