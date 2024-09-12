import { baseProps, makeBooleanProp, makeNumberProp, makeNumericProp, makeStringProp } from '../common/props'

export const passwordInputProps = {
  ...baseProps,
  /**
   * 绑定的值
   */
  modelValue: makeStringProp(''),
  /**
   * 是否隐藏密码内容
   */
  mask: makeBooleanProp(true),
  /**
   * 输入框下方文字提示
   */
  info: makeStringProp(''),
  /**
   * 输入框下方错误提示
   */
  errorInfo: makeStringProp(''),
  /**
   * 输入框格子之间的间距，如 20px 2em，默认单位为 px
   */
  gutter: makeNumericProp(0),
  /**
   * 密码最大长度
   */
  length: makeNumberProp(6),
  /**
   * 是否已聚焦，聚焦时会显示光标
   */
  focused: makeBooleanProp(true)
}
