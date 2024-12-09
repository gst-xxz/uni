import type { ExtractPropTypes } from 'vue'
import { baseProps, makeNumericProp, makeStringProp } from '../common/props'

export type LoadingType = 'spinner' | 'circular' // 提示信息加载状态类型

export const loadingProps = {
  ...baseProps,
  /**
   * 加载指示器类型，可选值：'spinner' | 'ring'
   */
  type: makeStringProp<LoadingType>('circular'),
  /**
   * 设置加载指示器颜色
   */
  color: makeStringProp('#c9c9c9'),
  /**
   * 设置加载指示器大小
   */
  size: makeNumericProp('30px')
}

export type LoadingProps = ExtractPropTypes<typeof loadingProps>
