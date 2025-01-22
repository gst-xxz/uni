import { baseProps, makeNumberProp, makeStringProp, makeStyleProp } from '../common/props'

export const backtopProps = {
  ...baseProps,
  /**
   * 距离顶部多少距离时显示
   */
  top: makeNumberProp(300),
  /**
   * 返回顶部滚动时间
   */
  duration: makeNumberProp(100),
  /**
   * 层级
   */
  zIndex: makeNumberProp(10),
  /**
   * icon样式
   */
  iconStyle: makeStyleProp({}),
  /**
   * 形状
   */
  shape: makeStringProp<'circle' | 'square'>('circle'),
  /**
   * 距离屏幕底部距离
   */
  bottom: makeNumberProp(100),
  /**
   * 距离屏幕右边距离
   */
  right: makeNumberProp(20)
}
