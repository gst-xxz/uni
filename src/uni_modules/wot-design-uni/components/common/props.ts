import type { CSSProperties, Prop, PropType } from 'vue'

export const unknownProp = null as unknown as PropType<unknown>

export const numericProp = [Number, String]

export const truthProp = {
  type: Boolean,
  default: true as const
}

export const makeRequiredProp = <T>(type: T) => ({
  type,
  required: true as const
})

export const makeArrayProp = <T>() => ({
  type: Array as PropType<T[]>,
  default: () => []
})

export const makeBooleanProp = <T>(defaultVal: T) => ({
  type: Boolean,
  default: defaultVal
})

export const makeNumberProp = (defaultVal: number, options?: { max?: number; min?: number }): Prop<number> => ({
  type: Number,
  default: defaultVal,
  ...(options && Object.keys(options).length > 0
    ? {
        validator(value: number) {
          if (options.max) {
            // return true
            if (value >= options.max) {
              return false
            }
          }
          if (options.min) {
            if (value <= options.min) {
              return false
            }
          }
          return true
        }
      }
    : {})
})

export const makeNumericProp = <T>(defaultVal: T) => ({
  type: numericProp,
  default: defaultVal
})

export const makeStringProp = <T>(defaultVal: T) => ({
  type: String as unknown as PropType<T>,
  default: defaultVal
})

export const makeObjectProp = <T extends object = object>(defaultVal: T): Prop<T> => ({
  type: Object as PropType<T>,
  default: defaultVal
  // validator(){}
})

export const makeStyleProp = (defaultVal: CSSProperties): Prop<CSSProperties> => ({
  type: Object as PropType<CSSProperties>,
  default: defaultVal
})

export const baseProps = {
  /**
   * 自定义根节点样式
   */
  customStyle: makeStyleProp({}),
  /**
   * 自定义根节点样式类
   */
  customClass: makeStringProp('')
}
