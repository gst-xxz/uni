import { type ComponentPublicInstance, type ExtractPropTypes, type InjectionKey, type PropType } from 'vue'
import { baseProps, makeBooleanProp, makeRequiredProp } from '../common/props'

export type FormProvide = {
  props: {
    model: Record<string, any>
    rules?: FormRules
    border?: boolean
  }
  errorMessages?: Record<string, string>
}

export const FORM_KEY: InjectionKey<FormProvide> = Symbol('wd-form')

export type FormRules = {
  [key: string]: FormItemRule[]
}

export type ErrorMessage = {
  prop: string
  message: string
}

export interface FormItemRule {
  [key: string]: any
  required: boolean
  message: string
  pattern?: RegExp
  validator?: (value: any, rule: FormItemRuleWithoutValidator) => boolean | Promise<string> | Promise<boolean> | Promise<void> | Promise<unknown>
}

export type FormItemRuleWithoutValidator = Omit<FormItemRule, 'validator'>

export const formProps = {
  ...baseProps,
  /**
   * 表单数据对象
   */
  model: makeRequiredProp(Object as PropType<Record<string, any>>),
  /**
   * 表单验证规则
   */
  rules: {
    type: Object as PropType<FormRules>,
    default: () => ({})
  },
  /**
   * 是否在输入时重置表单校验信息
   */
  resetOnChange: makeBooleanProp(false),
  /**
   * 错误提示类型
   */
  errorType: {
    type: String as PropType<'toast' | 'message' | 'none'>,
    default: 'message'
  }
}
export type FormProps = ExtractPropTypes<typeof formProps>

export type FormExpose = {
  /**
   * 表单校验
   * @param prop 指定校验字段
   */
  validate: (prop?: string) => Promise<{
    valid: boolean
    errors: ErrorMessage[]
  }>
  /**
   * 重置表单项的验证提示
   */
  reset: () => void
}

export type FormInstance = ComponentPublicInstance<FormProps, FormExpose>
