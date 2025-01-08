<template>
  <div :class="cn(`wd-col-picker ${cell.border.value ? 'is-border' : ''} ${customClass}`)" :style="customStyle">
    <div class="wd-col-picker__field" @click="showPicker">
      <slot v-if="useDefaultSlot"></slot>
      <div
        v-else
        :class="
          cn(
            `wd-col-picker__cell ${disabled && 'is-disabled'} ${readonly && 'is-readonly'} ${alignRight && 'is-align-right'} ${
              error && 'is-error'
            }  ${size && 'is-' + size}`
          )
        "
      >
        <div
          v-if="label || useLabelSlot"
          :class="cn(`wd-col-picker__label ${isRequired && 'is-required'} ${customLabelClass}`)"
          :style="labelWidth ? 'min-width:' + labelWidth + ';max-width:' + labelWidth + ';' : ''"
        >
          <block v-if="label">{{ label }}</block>
          <slot v-else name="label"></slot>
        </div>
        <div class="wd-col-picker__body">
          <div class="wd-col-picker__value-wraper">
            <div
              :class="
                cn(`wd-col-picker__value ${ellipsis && 'is-ellipsis'} ${customValueClass} ${showValue ? '' : 'wd-col-picker__value--placeholder'}`)
              "
            >
              {{ showValue || placeholder || translate('placeholder') }}
            </div>
            <wd-icon v-if="!disabled && !readonly" custom-class="wd-col-picker__arrow" name="arrow" />
          </div>
          <div v-if="errorMessage" class="wd-col-picker__error-message">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
    <wd-action-sheet
      v-model="pickerShow"
      :duration="250"
      :title="title || translate('title')"
      :close-on-click-modal="closeOnClickModal"
      :z-index="zIndex"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      @open="handlePickerOpend"
      @close="handlePickerClose"
      @closed="handlePickerClosed"
    >
      <div class="wd-col-picker__selected">
        <scroll-view :scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
          <div class="wd-col-picker__selected-container">
            <div
              v-for="(_, colIndex) in selectList"
              :key="colIndex"
              :class="cn(`wd-col-picker__selected-item  ${colIndex === currentCol && 'is-selected'}`)"
              @click="handleColClick(colIndex)"
            >
              {{ selectShowList[colIndex] || translate('select') }}
            </div>
            <div class="wd-col-picker__selected-line" :style="state.lineStyle"></div>
          </div>
        </scroll-view>
      </div>
      <div class="wd-col-picker__list-container">
        <div
          v-for="(col, colIndex) in selectList"
          :key="colIndex"
          class="wd-col-picker__list"
          :style="colIndex === currentCol ? 'display: block;' : 'display: none;'"
        >
          <div
            v-for="(item, index) in col"
            :key="index"
            :class="
              cn(
                `wd-col-picker__list-item ${pickerColSelected[colIndex] && item[valueKey] === pickerColSelected[colIndex] && 'is-selected'} ${
                  item.disabled && 'is-disabled'
                }`
              )
            "
            @click="chooseItem(colIndex, index)"
          >
            <div>
              <div class="wd-col-picker__list-item-label">{{ item[labelKey] }}</div>
              <div v-if="item[tipKey]" class="wd-col-picker__list-item-tip">{{ item[tipKey] }}</div>
            </div>
            <wd-icon custom-class="wd-col-picker__checked" name="check"></wd-icon>
          </div>
          <div v-if="loading" class="wd-col-picker__loading">
            <wd-loading :color="loadingColor" />
          </div>
        </div>
      </div>
    </wd-action-sheet>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-col-picker',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, watch, type CSSProperties, reactive, nextTick } from 'vue'
import { addUnit, cn, debounce, getRect, isArray, isBoolean, isDef, isFunction, objToStyle } from '../common/util'
import { useCell } from '../composables/useCell'
import { FORM_KEY, type FormItemRule } from '../wd-form/types'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { colPickerProps, type ColPickerExpose } from './types'

const { translate } = useTranslate('col-picker')

const $container = '.wd-col-picker__selected-container'
const $item = '.wd-col-picker__selected-item'

const props = defineProps(colPickerProps)
const emit = defineEmits(['close', 'update:modelValue', 'confirm'])

const pickerShow = ref<boolean>(false)
const currentCol = ref<number>(0)
const selectList = ref<Record<string, any>[][]>([])
const pickerColSelected = ref<(string | number)[]>([])
const selectShowList = ref<Record<string, any>[]>([])
const loading = ref<boolean>(false)
const isChange = ref<boolean>(false)
const lastSelectList = ref<Record<string, any>[][]>([])
const lastPickerColSelected = ref<(string | number)[]>([])
const scrollLeft = ref<number>(0)
const inited = ref<boolean>(false)
const isCompleting = ref<boolean>(false)

const state = reactive({
  lineStyle: 'display:none;' // 激活项边框线样式
})

const { proxy } = getCurrentInstance() as any

const cell = useCell()

const updateLineAndScroll = debounce(function (animation = true) {
  setLineStyle(animation)
  lineScrollIntoView()
}, 50)

const showValue = computed(() => {
  const selectedItems = (props.modelValue || []).map((item, colIndex) => {
    return getSelectedItem(item, colIndex, selectList.value)
  })

  if (props.displayFormat) {
    return props.displayFormat(selectedItems)
  } else {
    return selectedItems
      .map((item) => {
        return item[props.labelKey]
      })
      .join('')
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === pickerColSelected.value) return
    pickerColSelected.value = newValue
    newValue.map((item, colIndex) => {
      return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
    })
    handleAutoComplete()
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.columns,
  (newValue, oldValue) => {
    if (newValue.length && !isArray(newValue[0])) {
      console.error('[wot design] error(wd-col-picker): the columns props of wd-col-picker should be a two-dimensional array')
      return
    }
    if (newValue.length === 0 && !oldValue) return

    const newSelectedList = newValue.slice(0)

    selectList.value = newSelectedList

    selectShowList.value = pickerColSelected.value.map((item, colIndex) => {
      return getSelectedItem(item, colIndex, newSelectedList)[props.labelKey]
    })
    lastSelectList.value = newSelectedList

    if (newSelectedList.length > 0) {
      currentCol.value = newSelectedList.length - 1
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.columnChange,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of columnChange must be Function')
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.displayFormat,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of displayFormat must be Function')
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.beforeConfirm,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforeConfirm must be Function')
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

onMounted(() => {
  inited.value = true
})

// 打开弹框
function open() {
  showPicker()
}
// 关闭弹框
function close() {
  handlePickerClose()
}
function handlePickerOpend() {
  updateLineAndScroll(false)
}

function handlePickerClose() {
  pickerShow.value = false
  emit('close')
}

function handlePickerClosed() {
  if (isChange.value) {
    setTimeout(() => {
      selectList.value = lastSelectList.value.slice(0)
      pickerColSelected.value = lastPickerColSelected.value.slice(0)
      selectShowList.value = lastPickerColSelected.value.map((item, colIndex) => {
        return getSelectedItem(item, colIndex, lastSelectList.value)[props.labelKey]
      })
      currentCol.value = lastSelectList.value.length - 1
      isChange.value = false
    }, 250)
  }
}

function showPicker() {
  const { disabled, readonly } = props

  if (disabled || readonly) return
  pickerShow.value = true
  lastPickerColSelected.value = pickerColSelected.value.slice(0)
  lastSelectList.value = selectList.value.slice(0)
}

function getSelectedItem(value: string | number, colIndex: number, selectList: Record<string, any>[][]) {
  const { valueKey, labelKey } = props
  if (selectList[colIndex]) {
    const selecteds = selectList[colIndex].filter((item) => {
      return item[valueKey] === value
    })

    if (selecteds.length > 0) {
      return selecteds[0]
    }
  }

  return {
    [valueKey]: value,
    [labelKey]: ''
  }
}

function chooseItem(colIndex: number, index: number) {
  const item = selectList.value[colIndex][index]
  if (item.disabled) return

  const newPickerColSelected = pickerColSelected.value.slice(0, colIndex)
  newPickerColSelected.push(item[props.valueKey])
  isChange.value = true
  pickerColSelected.value = newPickerColSelected
  selectList.value = selectList.value.slice(0, colIndex + 1)
  selectShowList.value = newPickerColSelected.map((item, colIndex) => {
    return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
  })

  if (selectShowList.value[colIndex] && colIndex === currentCol.value) {
    updateLineAndScroll(true)
  }

  handleColChange(colIndex, item, index)
}

function handleColChange(colIndex: number, item: Record<string, any>, index: number, callback?: () => void) {
  loading.value = true
  const { columnChange, beforeConfirm } = props
  columnChange &&
    columnChange({
      selectedItem: item,
      index: colIndex,
      rowIndex: index,
      resolve: (nextColumn: Record<string, any>[]) => {
        if (!isArray(nextColumn)) {
          console.error('[wot design] error(wd-col-picker): the data of each column of wd-col-picker should be an array')
          return
        }

        const newSelectList = selectList.value.slice(0)
        newSelectList[colIndex + 1] = nextColumn

        selectList.value = newSelectList
        loading.value = false
        currentCol.value = colIndex + 1

        updateLineAndScroll(true)
        if (typeof callback === 'function') {
          isCompleting.value = false
          selectShowList.value = pickerColSelected.value.map((item, colIndex) => {
            return getSelectedItem(item, colIndex, selectList.value)[props.labelKey]
          })
          callback()
        }
      },
      finish: (isOk?: boolean) => {
        // 每设置展示数据回显
        if (typeof callback === 'function') {
          loading.value = false
          isCompleting.value = false
          return
        }
        if (isBoolean(isOk) && !isOk) {
          loading.value = false
          return
        }

        if (beforeConfirm) {
          beforeConfirm(
            pickerColSelected.value,
            pickerColSelected.value.map((item, colIndex) => {
              return getSelectedItem(item, colIndex, selectList.value)
            }),
            (isPass: boolean) => {
              if (isPass) {
                onConfirm()
              } else {
                loading.value = false
              }
            }
          )
        } else {
          onConfirm()
        }
      }
    })
}
function onConfirm() {
  isChange.value = false
  loading.value = false
  pickerShow.value = false

  emit('update:modelValue', pickerColSelected.value)
  emit('confirm', {
    value: pickerColSelected.value,
    selectedItems: pickerColSelected.value.map((item, colIndex) => {
      return getSelectedItem(item, colIndex, selectList.value)
    })
  })
}
function handleColClick(index: number) {
  isChange.value = true
  currentCol.value = index
  updateLineAndScroll(true)
}
/**
 * @description 更新navBar underline的偏移量
 * @param {Boolean} animation 是否伴随动画
 */
function setLineStyle(animation: boolean = true) {
  if (!inited.value) return
  const { lineWidth, lineHeight } = props
  getRect($item, true, proxy)
    .then((rects) => {
      const lineStyle: CSSProperties = {}
      if (isDef(lineWidth)) {
        lineStyle.width = addUnit(lineWidth)
      }
      if (isDef(lineHeight)) {
        lineStyle.height = addUnit(lineHeight)
        lineStyle.borderRadius = `calc(${addUnit(lineHeight)} / 2)`
      }
      const rect = rects[currentCol.value]
      let left = rects.slice(0, currentCol.value).reduce((prev, curr) => prev + Number(curr.width), 0) + Number(rect.width) / 2
      lineStyle.transform = `translateX(${left}px) translateX(-50%)`

      if (animation) {
        lineStyle.transition = 'width 300ms ease, transform 300ms ease'
      }

      state.lineStyle = objToStyle(lineStyle)
    })
    .catch(() => {})
}
/**
 * @description scroll-view滑动到active的tab_nav
 */
function lineScrollIntoView() {
  if (!inited.value) return
  Promise.all([getRect($item, true, proxy), getRect($container, false, proxy)])
    .then(([navItemsRects, navRect]) => {
      if (!isArray(navItemsRects) || navItemsRects.length === 0) return
      // 选中元素
      const selectItem = navItemsRects[currentCol.value]
      // 选中元素之前的节点的宽度总和
      const offsetLeft = navItemsRects.slice(0, currentCol.value).reduce((prev, curr) => prev + Number(curr.width), 0)
      // scroll-view滑动到selectItem的偏移量
      scrollLeft.value = offsetLeft - ((navRect as any).width - Number(selectItem.width)) / 2
    })
    .catch(() => {})
}

// 递归列数据补齐
function diffColumns(colIndex: number) {
  // colIndex 为 -1 时，item 为空对象，>=0 时则具有 value 属性
  const item = colIndex === -1 ? {} : { [props.valueKey]: props.modelValue[colIndex] }
  handleColChange(colIndex, item, -1, () => {
    // 如果 columns 长度还小于 value 长度，colIndex + 1，继续递归补齐
    if (selectList.value.length < props.modelValue.length) {
      diffColumns(colIndex + 1)
    }
  })
}
function handleAutoComplete() {
  if (props.autoComplete) {
    // 如果 columns 数组长度为空，或者长度小于 value 的长度，自动触发 columnChange 来补齐数据
    if (selectList.value.length < props.modelValue.length || selectList.value.length === 0) {
      // isCompleting 是否在自动补全，锁操作
      if (!isCompleting.value) {
        // 如果 columns 长度为空，则传入的 colIndex 为 -1
        const colIndex = selectList.value.length === 0 ? -1 : selectList.value.length - 1
        diffColumns(colIndex)
      }
      isCompleting.value = true
    }
  }
}

defineExpose<ColPickerExpose>({
  close,
  open
})
</script>

<style>
.wd-col-picker.is-border .wd-col-picker__cell {
  position: relative;
}

.wd-col-picker.is-border .wd-col-picker__cell:after {
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

.wd-col-picker__cell {
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

.wd-col-picker__cell.is-disabled .wd-col-picker__value {
  color: var(--wot-input-disabled-color, #d9d9d9);
}

.wd-col-picker__cell.is-align-right .wd-col-picker__value {
  text-align: right;
}

.wd-col-picker__cell.is-error .wd-col-picker__value,
.wd-col-picker__cell.is-error .wd-col-picker__arrow {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-col-picker__cell.is-large {
  font-size: var(--wot-cell-title-fs-large, 16px);
}

.wd-col-picker__cell.is-large .wd-col-picker__arrow {
  font-size: var(--wot-cell-icon-size-large, 18px);
}

.wd-col-picker__error-message {
  color: var(--wot-form-item-error-message-color, var(--wot-color-danger, #fa4350));
  font-size: var(--wot-form-item-error-message-font-size, var(--wot-fs-secondary, 12px));
  line-height: var(--wot-form-item-error-message-line-height, 24px);
  text-align: left;
  vertical-align: middle;
}

.wd-col-picker__label {
  position: relative;
  width: var(--wot-input-cell-label-width, 33%);
  margin-right: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  box-sizing: border-box;
}

.wd-col-picker__label.is-required {
  padding-left: 12px;
}

.wd-col-picker__label.is-required:after {
  position: absolute;
  left: 0;
  top: 2px;
  content: '*';
  font-size: var(--wot-cell-required-size, 18px);
  line-height: 1.1;
  color: var(--wot-cell-required-color, var(--wot-color-danger, #fa4350));
}

.wd-col-picker__value-wraper {
  display: flex;
}

.wd-col-picker__value {
  flex: 1;
  margin-right: 10px;
  color: var(--wot-cell-value-color, rgba(0, 0, 0, 0.85));
}

.wd-col-picker__value.is-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-col-picker__value--placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-col-picker__body {
  flex: 1;
}

.wd-col-picker__arrow {
  display: block;
  font-size: var(--wot-cell-icon-size, 16px);
  color: var(--wot-cell-arrow-color, rgba(0, 0, 0, 0.25));
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-col-picker__selected {
  height: var(--wot-col-picker-selected-height, 44px);
  font-size: var(--wot-col-picker-selected-fs, 14px);
  color: var(--wot-col-picker-selected-color, rgba(0, 0, 0, 0.85));
  overflow: hidden;
}

.wd-col-picker__selected-container {
  position: relative;
  display: flex;
  -webkit-user-select: none;
  user-select: none;
}

.wd-col-picker__selected-item {
  flex: 0 0 auto;
  height: var(--wot-col-picker-selected-height, 44px);
  line-height: var(--wot-col-picker-selected-height, 44px);
  padding: var(--wot-col-picker-selected-padding, 0 16px);
}

.wd-col-picker__selected-item.is-selected {
  font-weight: var(--wot-col-picker-selected-fw, 700);
}

.wd-col-picker__selected-line {
  position: absolute;
  bottom: 5px;
  width: var(--wot-col-picker-line-width, 16px);
  left: 0;
  height: var(--wot-col-picker-line-height, 3px);
  background: var(--wot-col-picker-line-color, linear-gradient(315deg, rgb(81, 124, 240), rgb(118, 158, 245)));
  z-index: 1;
  border-radius: calc(var(--wot-col-picker-line-height, 3px) / 2);
  box-shadow: var(--wot-col-picker-line-box-shadow, 0px 1px 2px 0px rgba(1, 87, 255, 0.2));
}

.wd-col-picker__list-container {
  position: relative;
}

.wd-col-picker__list {
  height: var(--wot-col-picker-list-height, 53vh);
  padding-bottom: var(--wot-col-picker-list-padding-bottom, 30px);
  box-sizing: border-box;
  overflow: auto;
  color: var(--wot-col-picker-list-color, rgba(0, 0, 0, 0.85));
  font-size: var(--wot-col-picker-list-fs, 14px);
  -webkit-overflow-scrolling: touch;
}

.wd-col-picker__list-item {
  display: flex;
  padding: var(--wot-col-picker-list-item-padding, 12px 15px);
  align-items: flex-start;
}

.wd-col-picker__list-item.is-selected {
  color: var(--wot-col-picker-list-color-checked, var(--wot-color-theme, #4d80f0));
}

.wd-col-picker__list-item.is-selected .wd-col-picker__checked {
  opacity: 1;
}

.wd-col-picker__list-item.is-disabled {
  color: var(--wot-col-picker-list-color-disabled, rgba(0, 0, 0, 0.15));
}

.wd-col-picker__list-item-label {
  line-height: 1.285;
}

.wd-col-picker__list-item-tip {
  margin-top: 2px;
  font-size: var(--wot-col-picker-list-fs-tip, 12px);
  color: var(--wot-col-picker-list-color-tip, rgba(0, 0, 0, 0.45));
}

.wd-col-picker__checked {
  display: block;
  margin-left: 4px;
  font-size: var(--wot-col-picker-list-checked-icon-size, 18px);
  color: var(--wot-col-picker-list-color-checked, var(--wot-color-theme, #4d80f0));
  opacity: 0;
}

.wd-col-picker__loading {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
}
</style>
