<template>
  <div :class="rootClass" :style="customStyle">
    <div v-if="label || useLabelSlot" :class="cn(`wd-textarea__label`, customLabelClass, isRequired ? 'is-required' : '')" :style="labelStyle">
      <div v-if="prefixIcon || usePrefixSlot" class="wd-textarea__prefix">
        <wd-icon v-if="prefixIcon && !usePrefixSlot" custom-class="wd-textarea__icon" :name="prefixIcon" @click="onClickPrefixIcon" />
        <slot v-else name="prefix"></slot>
      </div>
      <div class="wd-textarea__label-inner">
        <span v-if="label">{{ label }}</span>
        <slot v-else name="label"></slot>
      </div>
    </div>

    <!-- 文本域 -->
    <div :class="cn(`wd-textarea__value ${showClear ? 'is-suffix' : ''} ${customTextareaContainerClass} ${showWordCount ? 'is-show-limit' : ''}`)">
      <textarea
        :class="cn(`wd-textarea__inner ${customTextareaClass}`)"
        v-model="inputValue"
        :show-count="false"
        :placeholder="placeholderValue"
        :disabled="disabled || readonly"
        :maxlength="maxlength"
        :focus="focused"
        :auto-focus="autoFocus"
        :placeholder-style="placeholderStyle"
        :placeholder-class="cn(`wd-textarea__placeholder`, placeholderClass)"
        :auto-height="autoHeight"
        :cursor-spacing="cursorSpacing"
        :fixed="fixed"
        :cursor="cursor"
        :show-confirm-bar="showConfirmBar"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        :disable-default-padding="disableDefaultPadding"
        :ignoreCompositionEvent="ignoreCompositionEvent"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
        @linechange="handleLineChange"
        @keyboardheightchange="handleKeyboardheightchange"
      />
      <div v-if="errorMessage" class="wd-textarea__error-message">{{ errorMessage }}</div>

      <div v-if="readonly" class="wd-textarea__readonly-mask" />
      <div class="wd-textarea__suffix">
        <wd-icon v-if="showClear" custom-class="wd-textarea__clear" name="error-fill" @click="handleClear" />
        <div v-if="showWordCount" class="wd-textarea__count">
          <span :class="countClass">
            {{ currentLength }}
          </span>
          /{{ maxlength }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-textarea',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { isDef, pause, cn } from '../common/util'
import { useCell } from '../composables/useCell'
import { FORM_KEY, type FormItemRule } from '../wd-form/types'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { textareaProps } from './types'

const { translate } = useTranslate('textarea')

const props = defineProps(textareaProps)
const emit = defineEmits([
  'update:modelValue',
  'clear',
  'change',
  'blur',
  'focus',
  'input',
  'keyboardheightchange',
  'confirm',
  'linechange',
  'clickprefixicon',
  'click'
])

const placeholderValue = computed(() => {
  return isDef(props.placeholder) ? props.placeholder : translate('placeholder')
})

const clearing = ref<boolean>(false)
const focused = ref<boolean>(false) // 控制聚焦
const focusing = ref<boolean>(false) // 当前是否激活状态
const inputValue = ref<string>('') // 输入框的值
const cell = useCell()

watch(
  () => props.focus,
  (newValue) => {
    focused.value = newValue
  },
  { immediate: true, deep: true }
)

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = isDef(newValue) ? String(newValue) : ''
  },
  { immediate: true, deep: true }
)

const { parent: form } = useParent(FORM_KEY)

/**
 * 展示清空按钮
 */
const showClear = computed(() => {
  const { disabled, readonly, clearable, clearTrigger } = props
  if (clearable && !readonly && !disabled && inputValue.value && (clearTrigger === 'always' || (props.clearTrigger === 'focus' && focusing.value))) {
    return true
  } else {
    return false
  }
})

/**
 * 展示字数统计
 */
const showWordCount = computed(() => {
  const { disabled, readonly, maxlength, showWordLimit } = props
  return Boolean(!disabled && !readonly && isDef(maxlength) && maxlength > -1 && showWordLimit)
})

// 表单校验错误信息
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

// 是否展示必填
const isRequired = computed(() => {
  let formRequired = false
  if (form && form.props.rules) {
    const rules = form.props.rules
    for (const key in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
        formRequired = rules[key].some((rule: FormItemRule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

// 当前文本域文字长度
const currentLength = computed(() => {
  return String(formatValue(props.modelValue) || '').length
})

const rootClass = computed(() => {
  return `wd-textarea   ${props.label || props.useLabelSlot ? 'is-cell' : ''} ${props.center ? 'is-center' : ''} ${
    cell.border.value ? 'is-border' : ''
  } ${props.size ? 'is-' + props.size : ''} ${props.error ? 'is-error' : ''} ${props.disabled ? 'is-disabled' : ''} ${
    props.autoHeight ? 'is-auto-height' : ''
  } ${currentLength.value > 0 ? 'is-not-empty' : ''}  ${props.noBorder ? 'is-no-border' : ''} ${props.customClass}`
})

const countClass = computed(() => {
  return `${currentLength.value > 0 ? 'wd-textarea__count-current' : ''} ${currentLength.value > props.maxlength ? 'is-error' : ''}`
})

const labelStyle = computed(() => {
  return props.labelWidth
    ? {
        'min-width': props.labelWidth,
        'max-width': props.labelWidth
      }
    : {}
})

onBeforeMount(() => {
  initState()
})

// 状态初始化
function initState() {
  inputValue.value = formatValue(inputValue.value)
  emit('update:modelValue', inputValue.value)
}

function formatValue(value: string | number) {
  const { maxlength, showWordLimit } = props
  if (showWordLimit && maxlength !== -1 && String(value).length > maxlength) {
    return value.toString().substring(0, maxlength)
  }
  return `${value}`
}

async function handleClear() {
  clearing.value = true
  focusing.value = false
  inputValue.value = ''
  if (props.focusWhenClear) {
    focused.value = false
  }
  await pause()
  if (props.focusWhenClear) {
    focused.value = true
    focusing.value = true
  }
  emit('change', {
    value: ''
  })
  emit('update:modelValue', inputValue.value)
  emit('clear')
}
async function handleBlur({ detail }: any) {
  // 等待150毫秒，clear执行完毕
  await pause(150)

  if (clearing.value) {
    clearing.value = false
    return
  }

  focusing.value = false
  emit('blur', {
    value: inputValue.value,
    cursor: detail.cursor ? detail.cursor : null
  })
}
function handleFocus({ detail }: any) {
  focusing.value = true
  emit('focus', detail)
}
function handleInput({ detail }: any) {
  inputValue.value = formatValue(inputValue.value as string)
  emit('update:modelValue', inputValue.value)
  emit('input', detail)
}
function handleKeyboardheightchange({ detail }: any) {
  emit('keyboardheightchange', detail)
}
function handleConfirm({ detail }: any) {
  emit('confirm', detail)
}
function handleLineChange({ detail }: any) {
  emit('linechange', detail)
}
function onClickPrefixIcon() {
  emit('clickprefixicon')
}
</script>

<style>
.wd-textarea {
  position: relative;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  background: var(--wot-textarea-bg, var(--wot-color-white, rgb(255, 255, 255)));
  padding: var(--wot-textarea-cell-padding, 10px) var(--wot-textarea-padding, var(--wot-size-side-padding, 15px));
}

.wd-textarea:after {
  position: absolute;
  display: none;
  content: '';
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--wot-textarea-border-color, #dadada);
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  transition: background-color 0.2s ease-in-out;
}

.wd-textarea__label {
  position: relative;
  display: flex;
  width: var(--wot-input-cell-label-width, 33%);
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  margin-right: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  box-sizing: border-box;
  font-size: var(--wot-textarea-fs, var(--wot-cell-title-fs, 14px));
  flex-shrink: 0;
}

.wd-textarea__label.is-required {
  padding-left: 12px;
}

.wd-textarea__label.is-required:after {
  position: absolute;
  left: 0;
  top: 2px;
  content: '*';
  font-size: var(--wot-cell-required-size, 18px);
  line-height: 1.1;
  color: var(--wot-cell-required-color, var(--wot-color-danger, #fa4350));
}

.wd-textarea__label-inner {
  display: inline-block;
  line-height: var(--wot-cell-line-height, 24px);
  font-size: var(--wot-textarea-fs, var(--wot-cell-title-fs, 14px));
}

.wd-textarea__prefix {
  margin-right: var(--wot-textarea-icon-margin, 8px);
  font-size: var(--wot-textarea-fs, var(--wot-cell-title-fs, 14px));
  line-height: initial;
}

.wd-textarea__prefix .wd-textarea__icon {
  margin-left: 0;
}

.wd-textarea__suffix {
  flex-shrink: 0;
  line-height: initial;
}

.wd-textarea__value {
  position: relative;
  padding: 0;
  font-size: 0;
  background: var(--wot-textarea-bg, var(--wot-color-white, rgb(255, 255, 255)));
  box-sizing: border-box;
}

.wd-textarea__value.is-show-limit {
  padding-bottom: 36px;
}

.wd-textarea__value.is-suffix {
  padding-right: calc(var(--wot-textarea-icon-size, 16px) + 8px);
}

.wd-textarea__inner {
  padding: 0;
  width: 100%;
  font-size: var(--wot-textarea-fs, var(--wot-cell-title-fs, 14px));
  line-height: var(--wot-cell-line-height, 24px);
  color: var(--wot-textarea-color, #262626);
  outline: none;
  background: none;
  border: none;
  box-sizing: border-box;
  word-break: break-word;
  min-height: 24px;
}

.wd-textarea__inner::-webkit-input-placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-textarea__suffix {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  bottom: 0;
}

.wd-textarea__icon {
  margin-left: var(--wot-textarea-icon-margin, 8px);
  font-size: var(--wot-textarea-icon-size, 16px);
  color: var(--wot-textarea-icon-color, #bfbfbf);
  background: var(--wot-textarea-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-textarea__clear {
  margin-left: var(--wot-textarea-icon-margin, 8px);
  font-size: var(--wot-textarea-icon-size, 16px);
  color: var(--wot-textarea-clear-color, #585858);
  vertical-align: middle;
  background: var(--wot-textarea-bg, var(--wot-color-white, rgb(255, 255, 255)));
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-textarea__count {
  position: absolute;
  bottom: 8px;
  right: 0;
  font-size: var(--wot-textarea-count-fs, 14px);
  color: var(--wot-textarea-count-color, #bfbfbf);
  background: var(--wot-textarea-bg, var(--wot-color-white, rgb(255, 255, 255)));
  line-height: 20px;
  display: inline-flex;
}

.wd-textarea__count-current {
  color: var(--wot-textarea-count-current-color, #262626);
}

.wd-textarea__count-current.is-error {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-textarea__placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-textarea__placeholder.is-error {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-textarea__readonly-mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.wd-textarea__error-message {
  color: var(--wot-form-item-error-message-color, var(--wot-color-danger, #fa4350));
  font-size: var(--wot-form-item-error-message-font-size, var(--wot-fs-secondary, 12px));
  line-height: var(--wot-form-item-error-message-line-height, 24px);
  text-align: left;
  vertical-align: middle;
}

.wd-textarea.is-not-empty:not(.is-disabled):after {
  background-color: var(--wot-textarea-not-empty-border-color, #262626);
}

.wd-textarea.is-disabled .wd-textarea__inner {
  color: var(--wot-input-disabled-color, #d9d9d9);
  background: transparent;
}

.wd-textarea.is-error .wd-textarea__inner {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
  background: transparent;
}

.wd-textarea.is-auto-height:not(.is-cell) {
  padding: 5px 0;
}

.wd-textarea.is-auto-height:after {
  display: block;
}

.wd-textarea.is-no-border:after {
  display: none;
}

.wd-textarea.is-cell {
  display: flex;
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-textarea.is-cell.is-error:after {
  background: var(--wot-textarea-cell-border-color, var(--wot-color-border-light, #e8e8e8));
}

.wd-textarea.is-cell .wd-textarea__value {
  flex: 1;
}

.wd-textarea.is-cell .wd-textarea__icon {
  display: inline-flex;
  align-items: center;
  height: var(--wot-textarea-cell-height, 24px);
  line-height: var(--wot-textarea-cell-height, 24px);
}

.wd-textarea.is-cell .wd-textarea__prefix {
  display: inline-block;
  margin-right: var(--wot-cell-icon-right, 4px);
}

.wd-textarea.is-cell.wd-textarea:after {
  display: none;
}

.wd-textarea.is-cell .wd-textarea__suffix {
  right: 0;
}

.wd-textarea.is-cell.is-center {
  align-items: center;
}

.wd-textarea.is-cell.is-border {
  position: relative;
}

.wd-textarea.is-cell.is-border:after {
  position: absolute;
  display: block;
  content: '';
  width: calc(100% - var(--wot-textarea-cell-padding, 10px));
  height: 1px;
  left: var(--wot-textarea-cell-padding, 10px);
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-color-border-light, #e8e8e8);
}

.wd-textarea.is-large {
  padding: var(--wot-textarea-cell-padding-large, 12px);
}

.wd-textarea.is-large .wd-textarea__prefix,
.wd-textarea.is-large .wd-textarea__label-inner,
.wd-textarea.is-large .wd-textarea__inner {
  font-size: var(--wot-textarea-fs-large, var(--wot-cell-title-fs-large, 16px));
}

.wd-textarea.is-large .wd-textarea__count {
  font-size: var(--wot-textarea-count-fs-large, 14px);
}

.wd-textarea.is-large .wd-textarea__icon,
.wd-textarea.is-large .wd-textarea__clear {
  font-size: var(--wot-textarea-icon-size-large, 18px);
}
</style>
