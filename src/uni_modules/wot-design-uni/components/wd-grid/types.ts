import { type ExtractPropTypes, type InjectionKey } from 'vue'
import { baseProps, makeBooleanProp, makeStringProp } from '../common/props'

export type GridProvide = {
  props: { clickable?: boolean; square?: boolean; column?: number; border?: boolean; bgColor?: string; gutter?: number }
}

export const GRID_KEY: InjectionKey<GridProvide> = Symbol('wd-grid')

export const gridProps = {
  ...baseProps,
  /**
   * 是否开启格子点击反馈
   */
  clickable: makeBooleanProp(false),
  /**
   * 是否将格子固定为正方形
   */
  square: makeBooleanProp(false),
  /**
   * 列数
   */
  column: Number,
  /**
   * 是否显示边框
   */
  border: makeBooleanProp(false),
  /**
   * 背景颜色
   */
  bgColor: makeStringProp(''),
  /**
   * 格子之间的间距，默认单位为px
   */
  gutter: Number
}

export type GridProps = ExtractPropTypes<typeof gridProps>
