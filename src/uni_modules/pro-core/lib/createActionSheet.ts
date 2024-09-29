import type { ActionSheetProps } from '@/uni_modules/wot-design-uni/components/pro-action-sheet/types'

export type ActionSheetInstance = (props: ActionSheetProps) => void

const defaultInstance: ActionSheetInstance = () => {}

class CreateActionSheet {
  instance: ActionSheetInstance = defaultInstance

  defaultData: Partial<ActionSheetProps> & { modelValue: boolean } & { onClose: () => void } & { onSelect: () => void } = {
    modelValue: false,
    actions: [],
    panels: [],
    cancelText: '',
    onClose: () => {},
    onSelect: () => {}
  }

  bind = (newVal: ActionSheetInstance) => {
    this.instance = newVal
  }

  unbind = () => {
    this.instance = defaultInstance
  }

  show = (props: ActionSheetProps) => {
    this.instance({
      ...props,
      modelValue: true
    })
  }
}
export default CreateActionSheet
