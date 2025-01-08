<template>
  <div :class="rootClass" :style="customStyle" @click="handleClick">
    <div v-if="label || useLabelSlot" :class="labelClass" :style="labelStyle">
      <div v-if="prefixIcon || usePrefixSlot" class="wd-input__prefix">
        <wd-icon v-if="prefixIcon && !usePrefixSlot" custom-class="wd-input__icon" :name="prefixIcon" @click="onClickPrefixIcon" />
        <slot v-else name="prefix"></slot>
      </div>
      <div class="wd-input__label-inner">
        <template v-if="label">{{ label }}</template>
        <slot v-else name="label"></slot>
      </div>
    </div>
    <div class="wd-input__body">
      <div class="wd-input__value">
        <div v-if="(prefixIcon || usePrefixSlot) && !label" class="wd-input__prefix">
          <wd-icon v-if="prefixIcon" custom-class="wd-input__icon" :name="prefixIcon" @click="onClickPrefixIcon" />
          <slot name="prefix"></slot>
        </div>
        <input
          :class="
            cn([
              'wd-input__inner',
              prefixIcon ? 'wd-input__inner--prefix' : '',
              showWordCount ? 'wd-input__inner--count' : '',
              alignRight ? 'is-align-right' : '',
              customInputClass
            ])
          "
          :type="type"
          :password="showPassword && !isPwdVisible"
          v-model="inputValue"
          :placeholder="placeholderValue"
          :disabled="disabled || readonly"
          :maxlength="maxlength"
          :focus="focused"
          :confirm-type="confirmType"
          :confirm-hold="confirmHold"
          :cursor="cursor"
          :cursor-spacing="cursorSpacing"
          :placeholder-style="placeholderStyle"
          :selection-start="selectionStart"
          :selection-end="selectionEnd"
          :adjust-position="adjustPosition"
          :hold-keyboard="holdKeyboard"
          :always-embed="alwaysEmbed"
          :placeholder-class="inputPlaceholderClass"
          :ignoreCompositionEvent="ignoreCompositionEvent"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @confirm="handleConfirm"
          @keyboardheightchange="handleKeyboardheightchange"
        />
        <div v-if="readonly" class="wd-input__readonly-mask" />
        <div v-if="showClear || showPassword || suffixIcon || showWordCount || $slots.suffix" class="wd-input__suffix">
          <wd-icon v-if="showClear" custom-class="wd-input__clear" name="error-fill" @click="handleClear" />
          <wd-icon v-if="showPassword" custom-class="wd-input__icon" :name="isPwdVisible ? 'view' : 'eye-close'" @click="togglePwdVisible" />
          <div v-if="showWordCount" class="wd-input__count">
            <span
              :class="cn([
              inputValue && String(inputValue).length > 0 ? 'wd-input__count-current' : '',
              String(inputValue).length > maxlength! ? 'is-error' : ''
            ])"
            >
              {{ String(inputValue).length }}
            </span>
            /{{ maxlength }}
          </div>
          <wd-icon v-if="suffixIcon" custom-class="wd-input__icon" :name="suffixIcon" @click="onClickSuffixIcon" />
          <slot name="suffix"></slot>
        </div>
      </div>
      <div v-if="errorMessage" class="wd-input__error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-input',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { cn, isDef, objToStyle, pause } from '../common/util'
import { useCell } from '../composables/useCell'
import { FORM_KEY, type FormItemRule } from '../wd-form/types'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { inputProps } from './types'

const props = defineProps(inputProps)
const emit = defineEmits([
  'update:modelValue',
  'clear',
  'change',
  'blur',
  'focus',
  'input',
  'keyboardheightchange',
  'confirm',
  'clicksuffixicon',
  'clickprefixicon',
  'click'
])
const { translate } = useTranslate('input')

const isPwdVisible = ref<boolean>(false)
const clearing = ref<boolean>(false) // 是否正在清空操作，避免重复触发失焦
const focused = ref<boolean>(false) // 控制聚焦
const focusing = ref<boolean>(false) // 当前是否激活状态
const inputValue = ref<string | number>('') // 输入框的值
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

const placeholderValue = computed(() => {
  return isDef(props.placeholder) ? props.placeholder : translate('placeholder')
})

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

/**
 * 表单错误提示信息
 */
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

const rootClass = computed(() => {
  return `wd-input  ${props.label || props.useLabelSlot ? 'is-cell' : ''} ${props.center ? 'is-center' : ''} ${
    cell.border.value ? 'is-border' : ''
  } ${props.size ? 'is-' + props.size : ''} ${props.error ? 'is-error' : ''} ${props.disabled ? 'is-disabled' : ''}  ${
    inputValue.value && String(inputValue.value).length > 0 ? 'is-not-empty' : ''
  }  ${props.noBorder ? 'is-no-border' : ''} ${props.customClass}`
})

const labelClass = computed(() => {
  return `wd-input__label ${props.customLabelClass} ${isRequired.value ? 'is-required' : ''}`
})

const inputPlaceholderClass = computed(() => {
  return `wd-input__placeholder  ${props.placeholderClass}`
})

const labelStyle = computed(() => {
  return props.labelWidth
    ? objToStyle({
        'min-width': props.labelWidth,
        'max-width': props.labelWidth
      })
    : ''
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
  const { maxlength } = props
  if (isDef(maxlength) && maxlength !== -1 && String(value).length > maxlength) {
    return value.toString().slice(0, maxlength)
  }
  return value
}

function togglePwdVisible() {
  isPwdVisible.value = !isPwdVisible.value
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
async function handleBlur() {
  // 等待150毫秒，clear执行完毕
  await pause(150)
  if (clearing.value) {
    clearing.value = false
    return
  }
  focusing.value = false
  emit('blur', {
    value: inputValue.value
  })
}
function handleFocus({ detail }: any) {
  focusing.value = true
  emit('focus', detail)
}
function handleInput({ detail }: any) {
  emit('update:modelValue', inputValue.value)
  emit('input', detail)
}
function handleKeyboardheightchange({ detail }: any) {
  emit('keyboardheightchange', detail)
}
function handleConfirm({ detail }: any) {
  emit('confirm', detail)
}
function onClickSuffixIcon() {
  emit('clicksuffixicon')
}
function onClickPrefixIcon() {
  emit('clickprefixicon')
}
function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<style>
.wd-input {
  position: relative;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  background: var(--wot-input-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-input:after {
  position: absolute;
  content: '';
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--wot-input-border-color, #dadada);
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  transition: background-color 0.2s ease-in-out;
}

.wd-input.is-not-empty:not(.is-disabled):after {
  background-color: var(--wot-input-not-empty-border-color, #262626);
}

.wd-input__label {
  position: relative;
  display: flex;
  width: var(--wot-input-cell-label-width, 33%);
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  margin-right: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  box-sizing: border-box;
  font-size: var(--wot-input-fs, var(--wot-cell-title-fs, 14px));
  flex-shrink: 0;
}

.wd-input__label.is-required {
  padding-left: 12px;
}

.wd-input__label.is-required:after {
  position: absolute;
  left: 0;
  top: 2px;
  content: '*';
  font-size: var(--wot-cell-required-size, 18px);
  line-height: 1.1;
  color: var(--wot-cell-required-color, var(--wot-color-danger, #fa4350));
}

.wd-input__label-inner {
  display: inline-block;
  font-size: var(--wot-input-fs, var(--wot-cell-title-fs, 14px));
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-input__body {
  flex: 1;
}

.wd-input__value {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.wd-input__prefix {
  margin-right: var(--wot-input-icon-margin, 8px);
  font-size: var(--wot-input-fs, var(--wot-cell-title-fs, 14px));
  line-height: initial;
}

.wd-input__prefix .wd-input__icon,
.wd-input__prefix .wd-input__clear {
  margin-left: 0;
}

.wd-input__suffix {
  flex-shrink: 0;
  margin-left: var(--wot-input-icon-margin, 8px);
  line-height: initial;
}

.wd-input__error-message {
  color: var(--wot-form-item-error-message-color, var(--wot-color-danger, #fa4350));
  font-size: var(--wot-form-item-error-message-font-size, var(--wot-fs-secondary, 12px));
  line-height: var(--wot-form-item-error-message-line-height, 24px);
  text-align: left;
  vertical-align: middle;
}

.wd-input.is-disabled .wd-input__inner {
  color: var(--wot-input-disabled-color, #d9d9d9);
  background: transparent;
}

.wd-input.is-error .wd-input__inner {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
  background: transparent;
}

.wd-input.is-no-border:after {
  display: none;
}

.wd-input.is-no-border .wd-input__inner {
  height: var(--wot-input-inner-height-no-border, 24px);
  padding-top: 0;
  padding-bottom: 0;
}

.wd-input.is-cell {
  display: flex;
  align-items: flex-start;
  padding: var(--wot-input-cell-padding, 10px) var(--wot-input-padding, var(--wot-size-side-padding, 15px));
  background-color: var(--wot-input-cell-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-input.is-cell.is-error:after {
  background: var(--wot-input-cell-border-color, var(--wot-color-border-light, #e8e8e8));
}

.wd-input.is-cell .wd-input__icon,
.wd-input.is-cell .wd-input__clear {
  display: inline-flex;
  align-items: center;
  height: var(--wot-input-cell-height, 24px);
  line-height: var(--wot-input-cell-height, 24px);
}

.wd-input.is-cell .wd-input__prefix {
  display: inline-block;
  margin-right: var(--wot-cell-icon-right, 4px);
}

.wd-input.is-cell .wd-input__inner {
  height: var(--wot-input-cell-height, 24px);
}

.wd-input.is-cell.wd-input:after {
  display: none;
}

.wd-input.is-cell.is-center {
  align-items: center;
}

.wd-input.is-cell.is-border {
  position: relative;
}

.wd-input.is-cell.is-border:after {
  position: absolute;
  display: block;
  content: '';
  width: calc(100% - var(--wot-input-cell-padding, 10px));
  height: 1px;
  left: var(--wot-input-cell-padding, 10px);
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-color-border-light, #e8e8e8);
}

.wd-input.is-large {
  padding: var(--wot-input-cell-padding-large, 12px);
}

.wd-input.is-large .wd-input__prefix,
.wd-input.is-large .wd-input__label-inner,
.wd-input.is-large .wd-input__inner {
  font-size: var(--wot-input-fs-large, var(--wot-cell-title-fs-large, 16px));
}

.wd-input.is-large .wd-input__count {
  font-size: var(--wot-input-count-fs-large, 14px);
}

.wd-input.is-large .wd-input__icon,
.wd-input.is-large .wd-input__clear {
  font-size: var(--wot-input-icon-size-large, 18px);
}

.wd-input__inner {
  flex: 1;
  height: var(--wot-input-inner-height, 34px);
  font-size: var(--wot-input-fs, var(--wot-cell-title-fs, 14px));
  color: var(--wot-input-color, #262626);
  outline: none;
  border: none;
  background: none;
  padding: 0;
  box-sizing: border-box;
}

.wd-input__inner::-webkit-input-placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-input__inner.is-align-right {
  text-align: right;
}

.wd-input__readonly-mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.wd-input__icon {
  margin-left: var(--wot-input-icon-margin, 8px);
  font-size: var(--wot-input-icon-size, 16px);
  color: var(--wot-input-icon-color, #bfbfbf);
  vertical-align: middle;
  background: var(--wot-input-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-input__clear {
  margin-left: var(--wot-input-icon-margin, 8px);
  font-size: var(--wot-input-icon-size, 16px);
  color: var(--wot-input-clear-color, #585858);
  vertical-align: middle;
  background: var(--wot-input-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-input__count {
  margin-left: 15px;
  font-size: var(--wot-input-count-fs, 14px);
  color: var(--wot-input-count-color, #bfbfbf);
  vertical-align: middle;
  background: var(--wot-input-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-input__count-current {
  color: var(--wot-input-count-current-color, #262626);
}

.wd-input__count-current.is-error {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-input__placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-input__placeholder.is-error {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-input .wd-input__count,
.wd-input .wd-input__count-current {
  display: inline-flex;
}
</style>
