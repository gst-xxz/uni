import { type ExtractPropTypes, type InjectionKey } from 'vue'
import { baseProps, makeNumericProp } from '../common/props'

export type SidebarProvide = {
  props: Partial<SidebarProps>
  setChange: (value: number | string, label: string) => void
}

export const SIDEBAR_KEY: InjectionKey<SidebarProvide> = Symbol('wd-sidebar')

export const sidebarProps = {
  ...baseProps,
  /**
   * 当前导航项的索引
   */
  modelValue: makeNumericProp(0)
}

export type SidebarProps = ExtractPropTypes<typeof sidebarProps>
