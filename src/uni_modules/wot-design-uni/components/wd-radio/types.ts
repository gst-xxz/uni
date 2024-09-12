import type { PropType } from 'vue'
import { baseProps, makeRequiredProp } from '../common/props'

export type RadioShape = 'dot' | 'button' | 'check'

export const radioProps = {
  ...baseProps,
  /** 选中时的值 */
  value: makeRequiredProp([String, Number, Boolean]),
  /** 单选框的形状 */
  shape: String as PropType<RadioShape>,
  /** 选中的颜色 */
  checkedColor: String,
  /** 禁用 */
  disabled: {
    type: [Boolean, null] as PropType<boolean | null>,
    default: null
  },
  /** 单元格 */
  cell: {
    type: [Boolean, null] as PropType<boolean | null>,
    default: null
  },
  /** 大小 */
  size: String,
  /** 内联 */
  inline: {
    type: [Boolean, null] as PropType<boolean | null>,
    default: null
  },
  /** 最大宽度 */
  maxWidth: String
}
