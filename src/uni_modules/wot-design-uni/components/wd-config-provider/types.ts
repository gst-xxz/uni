import type { ExtractPropTypes } from 'vue'
import { makeStringProp, baseProps } from '../common/props'

export type ConfigProviderTheme = 'light' | 'dark' | 'auto'

export const configProviderProps = {
  ...baseProps,
  /**
   * 主题风格，设置为 dark 来开启深色模式，全局生效
   */
  theme: makeStringProp<ConfigProviderTheme>('auto')
}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
