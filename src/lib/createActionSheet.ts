import type { ActionSheetProps } from '@/uni_modules/wot-design-uni/components/wd-action-sheet/types'

type Instance = (props: ActionSheetProps) => void

const defaultInstance: Instance = () => {}

class CreateActionSheet {
  instance: Instance = defaultInstance

  defaultData: Partial<ActionSheetProps> & { modelValue: boolean } & { onClose: () => void } & { onSelect: () => void } = {
    modelValue: false,
    actions: [],
    panels: [],
    cancelText: '',
    onClose: () => {},
    onSelect: () => {}
  }

  bind = (newVal: Instance) => {
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
