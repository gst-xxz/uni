<template>
  <div
    :class="
      cn(
        `wd-picker ${disabled ? 'is-disabled' : ''} ${size ? 'is-' + size : ''}  ${cell.border.value ? 'is-border' : ''} ${
          alignRight ? 'is-align-right' : ''
        } ${error ? 'is-error' : ''} ${customClass}`
      )
    "
    :style="customStyle"
  >
    <div class="wd-picker__field" @click="showPopup">
      <slot v-if="useDefaultSlot"></slot>
      <div v-else class="wd-picker__cell">
        <div
          v-if="label || useLabelSlot"
          :class="cn(`wd-picker__label ${customLabelClass}  ${isRequired ? 'is-required' : ''}`)"
          :style="labelWidth ? 'min-width:' + labelWidth + ';max-width:' + labelWidth + ';' : ''"
        >
          <template v-if="label">{{ label }}</template>
          <slot v-else name="label"></slot>
        </div>
        <div class="wd-picker__body">
          <div class="wd-picker__value-wraper">
            <div :class="cn(`wd-picker__value ${ellipsis && 'is-ellipsis'} ${customValueClass} ${showValue ? '' : 'wd-picker__placeholder'}`)">
              {{ showValue ? showValue : placeholder || translate('placeholder') }}
            </div>
            <wd-icon v-if="showArrow" custom-class="wd-picker__arrow" name="arrow" />
            <div v-else-if="showClear" @click.stop="handleClear">
              <wd-icon custom-class="wd-picker__clear" name="error-fill" />
            </div>
          </div>
          <div v-if="errorMessage" class="wd-picker__error-message">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
    <wd-popup
      v-model="popupShow"
      position="bottom"
      :hide-when-close="false"
      :close-on-click-modal="closeOnClickModal"
      :z-index="zIndex"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      @close="onCancel"
      custom-class="wd-picker__popup"
    >
      <div class="wd-picker__wraper">
        <div class="wd-picker__toolbar" @touchmove="noop">
          <div class="wd-picker__action wd-picker__action--cancel" @click="onCancel">
            {{ cancelButtonText || translate('cancel') }}
          </div>
          <div v-if="title" class="wd-picker__title">{{ title }}</div>
          <div :class="cn(`wd-picker__action ${isLoading ? 'is-loading' : ''}`)" @click="onConfirm">
            {{ confirmButtonText || translate('done') }}
          </div>
        </div>
        <wd-picker-view
          ref="pickerViewWd"
          :custom-class="customViewClass"
          v-model="pickerValue"
          :columns="displayColumns"
          :loading="isLoading"
          :loading-color="loadingColor"
          :columns-height="columnsHeight"
          :value-key="valueKey"
          :label-key="labelKey"
          :immediate-change="immediateChange"
          @change="pickerViewChange"
          @pickstart="onPickStart"
          @pickend="onPickEnd"
          :column-change="columnChange"
        />
      </div>
    </wd-popup>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-picker',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, onBeforeMount, ref, watch, computed, onMounted, nextTick } from 'vue'
import { cn, deepClone, defaultDisplayFormat, getType, isArray, isDef, isFunction } from '../common/util'
import { useCell } from '../composables/useCell'
import { type ColumnItem, formatArray, type PickerViewInstance } from '../wd-picker-view/types'
import { FORM_KEY, type FormItemRule } from '../wd-form/types'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { pickerProps, type PickerExpose } from './types'
const { translate } = useTranslate('picker')

const props = defineProps(pickerProps)
const emit = defineEmits(['confirm', 'open', 'cancel', 'clear', 'update:modelValue'])

const pickerViewWd = ref<PickerViewInstance | null>(null)
const cell = useCell()

const innerLoading = ref<boolean>(false) // 内部控制是否loading

// 弹出层是否显示
const popupShow = ref<boolean>(false)
// 选定后展示的选中项
const showValue = ref<string>('')
const pickerValue = ref<string | number | boolean | string[] | number[] | boolean[]>('')
const displayColumns = ref<Array<string | number | ColumnItem | Array<string | number | ColumnItem>>>([]) // 传入 pickerView 的columns
const resetColumns = ref<Array<string | number | ColumnItem | Array<string | number | ColumnItem>>>([]) // 保存之前的 columns，当取消时，将数据源回滚，避免多级联动数据源不正确的情况
const isPicking = ref<boolean>(false) // 判断pickview是否还在滑动中
const hasConfirmed = ref<boolean>(false) // 判断用户是否点击了确认按钮

const isLoading = computed(() => {
  return props.loading || innerLoading.value
})

watch(
  () => props.displayFormat,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of displayFormat must be Function')
    }
    if (pickerViewWd.value && pickerViewWd.value.getSelectedIndex().length !== 0) {
      handleShowValueUpdate(props.modelValue)
    }
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => props.modelValue,
  (newValue) => {
    pickerValue.value = newValue
    // 获取初始选中项,并展示初始选中文案
    handleShowValueUpdate(newValue)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.columns,
  (newValue) => {
    displayColumns.value = deepClone(newValue)
    resetColumns.value = deepClone(newValue)
    // 获取初始选中项,并展示初始选中文案
    handleShowValueUpdate(props.modelValue)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.columnChange,
  (newValue) => {
    if (newValue && !isFunction(newValue)) {
      console.error('The type of columnChange must be Function')
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const { parent: form } = useParent(FORM_KEY)

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

const { proxy } = getCurrentInstance() as any

onMounted(() => {
  handleShowValueUpdate(props.modelValue)
})

onBeforeMount(() => {
  displayColumns.value = deepClone(props.columns)
  resetColumns.value = deepClone(props.columns)
})

/**
 * 值变更时更新显示内容
 * @param value
 */
function handleShowValueUpdate(value: string | number | Array<string | number>) {
  // 获取初始选中项,并展示初始选中文案
  if ((isArray(value) && value.length > 0) || (isDef(value) && !isArray(value) && value !== '')) {
    if (pickerViewWd.value) {
      nextTick(() => {
        setShowValue(pickerViewWd.value!.getSelects())
      })
    } else {
      setShowValue(getSelects(value)!)
    }
  } else {
    showValue.value = ''
  }
}

/**
 * @description 根据传入的value，picker组件获取当前cell展示值。
 * @param {String|Number|Array<String|Number|Array<any>>}value
 */
function getSelects(value: string | number | Array<string | number | Array<any>>) {
  const formatColumns = formatArray(props.columns, props.valueKey, props.labelKey)
  if (props.columns.length === 0) return

  // 使其默认选中首项
  if (value === '' || !isDef(value) || (isArray(value) && value.length === 0)) {
    return
  }
  const valueType = getType(value)
  const type = ['string', 'number', 'boolean', 'array']
  if (type.indexOf(valueType) === -1) return []
  /**
   * 1.单key转为Array<key>
   * 2.根据formatColumns的长度截取Array<String>，保证下面的遍历不溢出
   * 3.根据每列的key值找到选项中value为此key的下标并记录
   */
  value = isArray(value) ? value : [value]
  value = value.slice(0, formatColumns.length)

  if (value.length === 0) {
    value = formatColumns.map(() => 0)
  }
  let selected: number[] = []
  value.forEach((target, col) => {
    let row = formatColumns[col].findIndex((row) => {
      return row[props.valueKey].toString() === target.toString()
    })
    row = row === -1 ? 0 : row
    selected.push(row)
  })

  const selects = selected.map((row, col) => formatColumns[col][row])
  // 单列选择器，则返回单项
  if (selects.length === 1) {
    return selects[0]
  }
  return selects
}

// 对外暴露方法，打开弹框
function open() {
  showPopup()
}
// 对外暴露方法，关闭弹框
function close() {
  onCancel()
}
/**
 * 展示popup
 */
function showPopup() {
  if (props.disabled || props.readonly) return

  emit('open')
  popupShow.value = true
  pickerValue.value = props.modelValue
  displayColumns.value = resetColumns.value
}

/**
 * 点击取消按钮触发。关闭popup，触发cancel事件。
 */
function onCancel() {
  popupShow.value = false
  emit('cancel')
  let timmer = setTimeout(() => {
    clearTimeout(timmer)
    isDef(pickerViewWd.value) && pickerViewWd.value.resetColumns(resetColumns.value)
  }, 300)
}
/**
 * 点击确定按钮触发。展示选中值，触发cancel事件。
 */
function onConfirm() {
  if (isLoading.value) return

  // 如果当前还在滑动且未停止下来，则锁住先不确认，等滑完再自动确认，避免pickview值未更新
  if (isPicking.value) {
    hasConfirmed.value = true
    return
  }

  const { beforeConfirm } = props
  if (beforeConfirm && isFunction(beforeConfirm)) {
    beforeConfirm(
      pickerValue.value,
      (isPass: boolean) => {
        isPass && handleConfirm()
      },
      proxy.$.exposed
    )
  } else {
    handleConfirm()
  }
}
function handleConfirm() {
  if (isLoading.value || props.disabled) {
    popupShow.value = false
    return
  }

  const selects = pickerViewWd.value!.getSelects()
  const values = pickerViewWd.value!.getValues()
  // 获取当前的数据源，并设置给 resetColumns，用于取消时可以回退数据源
  const columns = pickerViewWd.value!.getColumnsData()
  popupShow.value = false
  resetColumns.value = deepClone(columns)
  emit('update:modelValue', values)

  setShowValue(selects)
  emit('confirm', {
    value: values,
    selectedItems: selects
  })
}
/**
 * 初始change事件
 * @param event
 */
function pickerViewChange({ value }: any) {
  pickerValue.value = value
}
/**
 * 设置展示值
 * @param  items
 */
function setShowValue(items: ColumnItem | ColumnItem[]) {
  // 避免值为空时调用自定义展示函数
  if ((isArray(items) && !items.length) || !items) return

  const { valueKey, labelKey } = props
  showValue.value = (props.displayFormat || defaultDisplayFormat)(items, { valueKey, labelKey })
}
function noop() {}
function onPickStart() {
  isPicking.value = true
}
function onPickEnd() {
  isPicking.value = false

  if (hasConfirmed.value) {
    hasConfirmed.value = false
    onConfirm()
  }
}

/**
 * 外部设置是否loading
 * @param loading 是否loading
 */
function setLoading(loading: boolean) {
  innerLoading.value = loading
}

// 是否展示清除按钮
const showClear = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && showValue.value.length
})

function handleClear() {
  const clearValue = isArray(pickerValue.value) ? [] : ''
  emit('update:modelValue', clearValue)
  emit('clear')
}

// 是否展示箭头
const showArrow = computed(() => {
  return !props.disabled && !props.readonly && !showClear.value
})

defineExpose<PickerExpose>({
  close,
  open,
  setLoading
})
</script>
<style>
.wot-theme-dark .wd-picker.is-border .wd-picker__cell {
  position: relative;
}

.wot-theme-dark .wd-picker.is-border .wd-picker__cell:after {
  position: absolute;
  display: block;
  content: '';
  width: calc(100% - var(--wot-cell-padding, var(--wot-size-side-padding, 15px)));
  height: 1px;
  left: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-dark-border-color, #3a3a3c);
}

.wot-theme-dark .wd-picker__title,
.wot-theme-dark .wd-picker__label,
.wot-theme-dark .wd-picker__value {
  color: #fff;
}

.wot-theme-dark .wd-picker__placeholder {
  color: #595959;
}

.wot-theme-dark .wd-picker .wd-picker__arrow,
.wot-theme-dark .wd-picker .wd-picker__clear {
  color: #fff;
}

.wot-theme-dark .wd-picker__cell {
  background-color: #1b1b1b;
  color: #fff;
}

.wot-theme-dark .wd-picker__cell.is-disabled .wd-picker__value {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-picker__cell.is-disabled .wd-picker__placeholder {
  color: #595959;
}

.wot-theme-dark .wd-picker.is-disabled .wd-picker__value {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-picker.is-disabled .wd-picker__placeholder {
  color: #595959;
}

.wot-theme-dark .wd-picker__action--cancel {
  color: #fff;
}

.wot-theme-dark .wd-picker__action.is-loading {
  color: rgba(232, 230, 227, 0.8);
}

.wd-picker__popup {
  border-radius: 16px 16px 0 0;
}

.wd-picker.is-border .wd-picker__cell {
  position: relative;
}

.wd-picker.is-border .wd-picker__cell:after {
  position: absolute;
  display: block;
  content: '';
  width: calc(100% - var(--wot-cell-padding, var(--wot-size-side-padding, 15px)));
  height: 1px;
  left: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-color-border-light, #e8e8e8);
}

.wd-picker.is-large .wd-picker__cell {
  font-size: var(--wot-cell-title-fs-large, 16px);
}

.wd-picker.is-large .wd-picker__arrow,
.wd-picker.is-large .wd-picker__clear {
  font-size: var(--wot-cell-icon-size-large, 18px);
}

.wd-picker.is-error .wd-picker__value,
.wd-picker.is-error .wd-picker__arrow {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-picker.is-align-right .wd-picker__value {
  text-align: right;
}

.wd-picker__cell {
  position: relative;
  display: flex;
  padding: var(--wot-cell-wrapper-padding, 10px) var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  align-items: flex-start;
  background-color: var(--wot-color-white, rgb(255, 255, 255));
  text-decoration: none;
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  font-size: var(--wot-cell-title-fs, 14px);
  overflow: hidden;
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-picker__cell.is-disabled .wd-picker__value {
  color: var(--wot-input-disabled-color, #d9d9d9);
}

.wd-picker.is-disabled .wd-picker__value {
  color: var(--wot-picker-column-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-picker__error-message {
  color: var(--wot-form-item-error-message-color, var(--wot-color-danger, #fa4350));
  font-size: var(--wot-form-item-error-message-font-size, var(--wot-fs-secondary, 12px));
  line-height: var(--wot-form-item-error-message-line-height, 24px);
  text-align: left;
  vertical-align: middle;
}

.wd-picker__label {
  position: relative;
  width: var(--wot-input-cell-label-width, 33%);
  margin-right: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  box-sizing: border-box;
}

.wd-picker__label.is-required {
  padding-left: 12px;
}

.wd-picker__label.is-required:after {
  position: absolute;
  left: 0;
  top: 2px;
  content: '*';
  font-size: var(--wot-cell-required-size, 18px);
  line-height: 1.1;
  color: var(--wot-cell-required-color, var(--wot-color-danger, #fa4350));
}

.wd-picker__value-wraper {
  display: flex;
}

.wd-picker__value {
  flex: 1;
  margin-right: 10px;
  color: var(--wot-cell-value-color, rgba(0, 0, 0, 0.85));
}

.wd-picker__value.is-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-picker__body {
  flex: 1;
}

.wd-picker__placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-picker__arrow,
.wd-picker__clear {
  display: block;
  font-size: var(--wot-cell-icon-size, 16px);
  color: var(--wot-cell-arrow-color, rgba(0, 0, 0, 0.25));
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-picker__clear {
  color: var(--wot-cell-clear-color, #585858);
}

.wd-picker__wraper {
  padding-bottom: var(--window-bottom);
}

.wd-picker__toolbar {
  position: relative;
  display: flex;
  font-size: var(--wot-picker-toolbar-fs, var(--wot-fs-title, 16px));
  height: var(--wot-picker-toolbar-height, 54px);
  line-height: var(--wot-picker-action-height, 16px);
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.wd-picker__action {
  display: block;
  border: none;
  outline: none;
  font-size: var(--wot-picker-toolbar-fs, var(--wot-fs-title, 16px));
  color: var(--wot-picker-toolbar-finish-color, var(--wot-color-theme, #4d80f0));
  background: transparent;
  padding: 24px 15px 14px;
}

.wd-picker__action--cancel {
  color: var(--wot-picker-toolbar-cancel-color, #666666);
}

.wd-picker__action.is-loading {
  color: var(--wot-picker-loading-button-color, rgba(0, 0, 0, 0.25));
}

.wd-picker__title {
  display: block;
  padding-top: 10px;
  color: var(--wot-picker-toolbar-title-color, rgba(0, 0, 0, 0.85));
  font-weight: var(--wot-action-sheet-weight, 500);
}
</style>
