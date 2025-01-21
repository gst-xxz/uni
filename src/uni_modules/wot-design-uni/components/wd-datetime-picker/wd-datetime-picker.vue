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
    <!--文案-->
    <div class="wd-picker__field" @click="showPopup">
      <slot v-if="useDefaultSlot"></slot>
      <div v-else :class="cn(['wd-picker__cell', customCellClass])">
        <div
          v-if="label || useLabelSlot"
          :class="cn(`wd-picker__label ${customLabelClass} ${isRequired ? 'is-required' : ''}`)"
          :style="labelWidth ? 'min-width:' + labelWidth + ';max-width:' + labelWidth + ';' : ''"
        >
          <block v-if="label">{{ label }}</block>
          <slot v-else name="label"></slot>
        </div>
        <div class="wd-picker__body">
          <div class="wd-picker__value-wraper">
            <div :class="cn(`wd-picker__value ${customValueClass}`)">
              <template v-if="region">
                <div v-if="isArray(showValue)">
                  <span :class="showValue[0] ? '' : 'wd-picker__placeholder'">
                    {{ showValue[0] ? showValue[0] : placeholder || translate('placeholder') }}
                  </span>
                  {{ translate('to') }}
                  <span :class="showValue[1] ? '' : 'wd-picker__placeholder'">
                    {{ showValue[1] ? showValue[1] : placeholder || translate('placeholder') }}
                  </span>
                </div>
                <div v-else class="wd-picker__placeholder">
                  {{ placeholder || translate('placeholder') }}
                </div>
              </template>
              <div v-else :class="showValue ? '' : 'wd-picker__placeholder'">
                {{ showValue ? showValue : placeholder || translate('placeholder') }}
              </div>
            </div>
            <wd-icon v-if="!disabled && !readonly" custom-class="wd-picker__arrow" name="arrow" />
          </div>
          <div v-if="errorMessage" class="wd-picker__error-message">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
    <!--弹出层，picker-view 在隐藏时修改值，会触发多次change事件，从而导致所有列选中第一项，因此picker在关闭时不隐藏 -->
    <wd-popup
      v-model="popupShow"
      position="bottom"
      :hide-when-close="false"
      :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :z-index="zIndex"
      @close="onCancel"
      custom-class="wd-picker__popup"
    >
      <div class="wd-picker__wraper">
        <!--toolBar-->
        <div class="wd-picker__toolbar" @touchmove="noop">
          <!--取消按钮-->
          <div class="wd-picker__action wd-picker__action--cancel" @click="onCancel">
            {{ cancelButtonText || translate('cancel') }}
          </div>
          <!--标题-->
          <div v-if="title" class="wd-picker__title">{{ title }}</div>
          <!--确定按钮-->
          <div :class="cn(`wd-picker__action ${loading || isLoading ? 'is-loading' : ''}`)" @click="onConfirm">
            {{ confirmButtonText || translate('confirm') }}
          </div>
        </div>
        <!-- 区域选择tab展示 -->
        <div v-if="region" class="wd-picker__region-tabs">
          <div :class="cn(`wd-picker__region ${showStart ? 'is-active' : ''} `)" @click="tabChange">
            <div>{{ translate('start') }}</div>
            <div class="wd-picker__region-time">{{ showTabLabel[0] }}</div>
          </div>
          <div :class="cn(`wd-picker__region ${showStart ? '' : 'is-active'}`)" @click="tabChange">
            <div>{{ translate('end') }}</div>
            <div class="wd-picker__region-time">{{ showTabLabel[1] }}</div>
          </div>
        </div>
        <!--datetimePickerView-->
        <div :class="showStart ? 'wd-picker__show' : 'wd-picker__hidden'">
          <wd-datetime-picker-view
            :custom-class="customViewClass"
            ref="datetimePickerView"
            :type="type"
            v-model="innerValue"
            :loading="loading || isLoading"
            :loading-color="loadingColor"
            :columns-height="columnsHeight"
            :value-key="valueKey"
            :label-key="labelKey"
            :formatter="formatter"
            :filter="filter"
            :column-formatter="isArray(modelValue) ? customColumnFormatter : undefined"
            :max-hour="maxHour"
            :min-hour="minHour"
            :max-date="maxDate"
            :min-date="minDate"
            :max-minute="maxMinute"
            :min-minute="minMinute"
            :start-symbol="true"
            :immediate-change="immediateChange"
            @change="onChangeStart"
            @pickstart="onPickStart"
            @pickend="onPickEnd"
          />
        </div>
        <div :class="showStart ? 'wd-picker__hidden' : 'wd-picker__show'">
          <wd-datetime-picker-view
            :custom-class="customViewClass"
            ref="datetimePickerView1"
            :type="type"
            v-model="endInnerValue"
            :loading="loading || isLoading"
            :loading-color="loadingColor"
            :columns-height="columnsHeight"
            :value-key="valueKey"
            :label-key="labelKey"
            :formatter="formatter"
            :filter="filter"
            :column-formatter="isArray(modelValue) ? customColumnFormatter : undefined"
            :max-hour="maxHour"
            :min-hour="minHour"
            :max-date="maxDate"
            :min-date="minDate"
            :max-minute="maxMinute"
            :min-minute="minMinute"
            :start-symbol="false"
            :immediate-change="immediateChange"
            @change="onChangeEnd"
            @pickstart="onPickStart"
            @pickend="onPickEnd"
          />
        </div>
      </div>
    </wd-popup>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-datetime-picker',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import wdDatetimePickerView from '../wd-datetime-picker-view/wd-datetime-picker-view.vue'
import { computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'
import { cn, deepClone, isArray, isDef, isEqual, isFunction, padZero } from '../common/util'
import { useCell } from '../composables/useCell'
import {
  getPickerValue,
  type DatetimePickerViewInstance,
  type DatetimePickerViewColumnFormatter,
  type DatetimePickerViewColumnType
} from '../wd-datetime-picker-view/types'
import { FORM_KEY, type FormItemRule } from '../wd-form/types'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { datetimePickerProps, type DatetimePickerExpose } from './types'
import { dayjs } from '../common/dayjs'

const props = defineProps(datetimePickerProps)
const emit = defineEmits(['change', 'open', 'toggle', 'cancel', 'confirm', 'update:modelValue'])

const { translate } = useTranslate('datetime-picker')

const datetimePickerView = ref<DatetimePickerViewInstance>()
const datetimePickerView1 = ref<DatetimePickerViewInstance>()

const showValue = ref<string | Date | Array<string | Date>>('')
const popupShow = ref<boolean>(false)
const showStart = ref<boolean>(true)
const region = ref<boolean>(false)
const showTabLabel = ref<string[]>([])
const innerValue = ref<string | number>('')
const endInnerValue = ref<string | number>('')

const isPicking = ref<boolean>(false) // 判断pickview是否还在滑动中
const hasConfirmed = ref<boolean>(false) // 判断用户是否点击了确认按钮

const isLoading = ref<boolean>(false) // 加载
const { proxy } = getCurrentInstance() as any

const cell = useCell()

watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (isEqual(val, oldVal)) return

    if (isArray(val)) {
      region.value = true
      innerValue.value = deepClone(getDefaultInnerValue(true))
      endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
    } else {
      // 每次value更新时都需要刷新整个列表
      innerValue.value = deepClone(getDefaultInnerValue())
    }
    nextTick(() => {
      setShowValue(false, false, true)
    })
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.defaultValue,
  (val) => {
    if (isArray(val) || region.value) {
      innerValue.value = deepClone(getDefaultInnerValue(true))
      endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
    } else {
      innerValue.value = deepClone(getDefaultInnerValue())
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

/**
 * @description 自定义列项筛选规则，对每列单项进行禁用校验，最终返回传入PickerView的columns数组
 * @param {Component} picker datetimePickerView对象
 * @return {Array} columns
 */
const customColumnFormatter: DatetimePickerViewColumnFormatter = (picker) => {
  if (!picker) {
    return []
  }
  const { type } = props
  const { startSymbol, formatter } = picker
  // 校准上下方picker的value值，与内部innerValue对应
  const start = picker.correctValue(innerValue.value)
  const end = picker.correctValue(endInnerValue.value)

  /**
   * 如果是上方picekr 那么将下方picker的值作为下边界
   * 如果是下方picekr 那么将上方picker的值作为上边界
   */
  const currentValue = startSymbol ? picker.getPickerValue(start, type) : picker.getPickerValue(end, type)
  const boundary = startSymbol ? picker.getPickerValue(end, type) : picker.getPickerValue(start, type)
  // 获取当前picekr中的源列数组
  const columns = picker.getOriginColumns()

  // 此时index是最外层知道当前的索引即可得到当前是哪个时间段
  return columns.map((column, cIndex) => {
    return column.values.map((value) => {
      const disabled = columnDisabledRules(startSymbol, columns, cIndex, value, currentValue, boundary)
      return {
        label: formatter ? formatter(column.type, padZero(value)) : padZero(value),
        value,
        disabled
      }
    })
  })
}

onBeforeMount(() => {
  const { modelValue: value } = props
  if (isArray(value)) {
    region.value = true
    innerValue.value = deepClone(getDefaultInnerValue(true))
    endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
  } else {
    innerValue.value = deepClone(getDefaultInnerValue())
  }
})

onMounted(() => {
  setShowValue(false, false, true)
})

/**
 * @description 根据传入的picker，picker组件获取当前cell展示值。
 */
function getSelects(picker: 'before' | 'after') {
  let value = picker === 'before' ? innerValue.value : endInnerValue.value
  let selected: number[] = []
  if (value) {
    selected = getPickerValue(value, props.type)
  }

  let selects = selected.map((value) => {
    return {
      [props.labelKey]: padZero(value),
      [props.valueKey]: value
    }
  })
  return selects
}

function noop() {}

function getDefaultInnerValue(isRegion?: boolean, isEnd?: boolean): string | number {
  const { modelValue: value, defaultValue, maxDate, minDate, type } = props
  if (isRegion) {
    const index = isEnd ? 1 : 0
    const targetValue = isArray(value) ? (value[index] as string) : ''
    const targetDefault = isArray(defaultValue) ? (defaultValue[index] as string) : ''
    const maxValue = type === 'time' ? dayjs(maxDate).format('HH:mm') : maxDate
    const minValue = type === 'time' ? dayjs(minDate).format('HH:mm') : minDate
    return targetValue || targetDefault || (isEnd ? maxValue : minValue)
  } else {
    return value || defaultValue ? (value as string) || (defaultValue as string) : ''
  }
}

// 对外暴露接口，打开弹框
function open() {
  showPopup()
}

// 对外暴露接口，关闭弹框
function close() {
  onCancel()
}

/**
 * @description 展示popup，小程序有个bug，在picker-view弹出时设置value，会触发change事件，而且会将picker-view的value多次触发change重置为第一项
 */
function showPopup() {
  if (props.disabled || props.readonly) return

  emit('open')
  if (region.value) {
    popupShow.value = true
    showStart.value = true
    innerValue.value = deepClone(getDefaultInnerValue(true, false))
    endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
  } else {
    popupShow.value = true
    innerValue.value = deepClone(getDefaultInnerValue())
  }
  setShowValue(true, false, true)
}

/**
 * @description 区域选择时tab标签切换时触发
 */
function tabChange() {
  showStart.value = !showStart.value
  // 列项刷新多级联动挂载到datetimepickerView
  const picker = showStart.value ? datetimePickerView.value : datetimePickerView1.value
  picker!.setColumns(picker!.updateColumns())

  emit('toggle', showStart.value ? innerValue.value : endInnerValue.value)
}

/**
 * @description datetimePickerView change 事件
 */
function onChangeStart({ value }: { value: number | string }) {
  innerValue.value = deepClone(value)
  if (region.value) {
    showTabLabel.value = [setTabLabel(), deepClone(showTabLabel.value[1])]
    emit('change', {
      value: [value, endInnerValue.value]
    })
    datetimePickerView.value && datetimePickerView.value.setColumns(datetimePickerView.value.updateColumns())
    datetimePickerView1.value && datetimePickerView1.value.setColumns(datetimePickerView1.value.updateColumns())
  } else {
    emit('change', {
      value: innerValue.value
    })
  }
}

/**
 * @description 区域选择 下方 datetimePickerView change 事件
 */
function onChangeEnd({ value }: { value: number | string }) {
  endInnerValue.value = deepClone(value)
  showTabLabel.value = [deepClone(showTabLabel.value[0]), setTabLabel(1)]
  emit('change', {
    value: [innerValue.value, value]
  })
  datetimePickerView.value && datetimePickerView.value.setColumns(datetimePickerView.value.updateColumns())
  datetimePickerView1.value && datetimePickerView1.value.setColumns(datetimePickerView1.value.updateColumns())
}

/**
 * @description 点击取消按钮触发。关闭popup，触发cancel事件。
 */
function onCancel() {
  popupShow.value = false
  setTimeout(() => {
    if (region.value) {
      innerValue.value = deepClone(getDefaultInnerValue(true))
      endInnerValue.value = deepClone(getDefaultInnerValue(true, true))
    } else {
      innerValue.value = deepClone(getDefaultInnerValue())
    }
  }, 200)

  emit('cancel')
}

/** picker触发confirm事件，同步触发confirm事件 */
function onConfirm() {
  if (props.loading || isLoading.value) return

  // 如果当前还在滑动且未停止下来，则锁住先不确认，等滑完再自动确认，避免pickview值未更新
  if (isPicking.value) {
    hasConfirmed.value = true
    return
  }

  const { beforeConfirm } = props
  if (beforeConfirm) {
    beforeConfirm(
      region.value ? [innerValue.value, endInnerValue.value] : innerValue.value,
      (isPass: boolean) => {
        isPass && handleConfirm()
      },
      proxy.$.exposed
    )
  } else {
    handleConfirm()
  }
}

function onPickStart() {
  isPicking.value = true
}

function onPickEnd() {
  isPicking.value = false

  // 延迟一会，因为组件层级嵌套过多，日期的计算时间也较长
  setTimeout(() => {
    if (hasConfirmed.value) {
      hasConfirmed.value = false
      onConfirm()
    }
  }, 50)
}

function handleConfirm() {
  if (props.loading || isLoading.value || props.disabled) {
    popupShow.value = false
    return
  }
  const value = region.value ? [innerValue.value, endInnerValue.value] : innerValue.value
  popupShow.value = false
  emit('update:modelValue', value)
  emit('confirm', {
    value
  })
  setShowValue(false, true)
}

/**
 * @description 设置区域选择 tab 标签展示值
 * @param {Number} index 索引标志位，有三个有效值; 0(默认):上方picker索引; 1:下方picker索引;
 * @return {String} showTabLabel
 */
function setTabLabel(index: number = 0) {
  if (region.value) {
    let items: Record<string, any>[] = []
    if (index === 0) {
      items = ((datetimePickerView.value ? datetimePickerView.value!.getSelects() : undefined) ||
        (innerValue.value && getSelects('before'))) as Record<string, any>[]
    } else {
      items = ((datetimePickerView1.value ? datetimePickerView1.value!.getSelects() : undefined) ||
        (endInnerValue.value && getSelects('after'))) as Record<string, any>[]
    }
    return defaultDisplayFormat(items, true)
  } else {
    return ''
  }
}

/**
 * @description 设置展示值
 * @param {Boolean} tab 是否修改tab展示值（尽在区域选择情况下生效）
 * @param {Boolean} isConfirm 是否提交当前修改
 */
function setShowValue(tab: boolean = false, isConfirm: boolean = false, beforeMount: boolean = false) {
  if (region.value) {
    const items = beforeMount
      ? (innerValue.value && getSelects('before')) || []
      : (datetimePickerView.value && datetimePickerView.value.getSelects && datetimePickerView.value.getSelects()) || []

    const endItems = beforeMount
      ? (endInnerValue.value && getSelects('after')) || []
      : (datetimePickerView1.value && datetimePickerView1.value.getSelects && datetimePickerView1.value.getSelects()) || []

    showValue.value = tab
      ? showValue.value
      : [
          (props.modelValue as (string | number)[])[0] || isConfirm ? defaultDisplayFormat(items as Record<string, any>[]) : '',
          (props.modelValue as (string | number)[])[1] || isConfirm ? defaultDisplayFormat(endItems as Record<string, any>[]) : ''
        ]
    showTabLabel.value = [defaultDisplayFormat(items as Record<string, any>[], true), defaultDisplayFormat(endItems as Record<string, any>[], true)]
  } else {
    const items = beforeMount
      ? (innerValue.value && getSelects('before')) || []
      : (datetimePickerView.value && datetimePickerView.value.getSelects && datetimePickerView.value.getSelects()) || []

    showValue.value = deepClone(props.modelValue || isConfirm ? defaultDisplayFormat(items as Record<string, any>[]) : '')
  }
}

/**
 * @description 设置展示值
 * @param {Object} items 获取到的选中项 包含 { value, label }
 * @param {Boolean} tabLabel 当前返回的是否是展示tab上的标签
 * @return {String} showValue / showTabLabel
 */
function defaultDisplayFormat(items: Record<string, any>[], tabLabel: boolean = false) {
  if (items.length === 0) return ''

  if (tabLabel && props.displayFormatTabLabel) {
    return props.displayFormatTabLabel(items)
  }

  if (props.displayFormat) {
    return props.displayFormat(items)
  }

  // 如果使用了自定义的的formatter，defaultDisplayFormat无效
  if (props.formatter) {
    /**
     * 不建议使用 this.picker.picker.getLabels() 拉取
     * 在初始展示时，需要使用模拟 nextTick 来等待内部 pickerView 渲染后labels才可得到format后的labels
     * 但使用模拟nextTick会造成页面延迟展示问题，对用户感知来讲不友好，因此不适用该方法
     */
    const typeMaps = {
      year: ['year'],
      datetime: ['year', 'month', 'date', 'hour', 'minute'],
      date: ['year', 'month', 'date'],
      time: ['hour', 'minute'],
      'year-month': ['year', 'month']
    }
    return items
      .map((item, index) => {
        return props.formatter!(typeMaps[props.type][index], item.value)
      })
      .join('')
  }

  switch (props.type) {
    case 'year':
      return items[0].label
    case 'date':
      return `${items[0].label}-${items[1].label}-${items[2].label}`
    case 'year-month':
      return `${items[0].label}-${items[1].label}`
    case 'time':
      return `${items[0].label}:${items[1].label}`
    case 'datetime':
      return `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}`
  }
}

/**
 * @description 区域选择time禁用规则，根据传入的位置标志以及日期类型 返回该节点是否禁用
 * @param {Boolean} isStart 时间段类型 true：start | false：end
 * @param {Array} column 当前遍历到的列数组
 * @param {Number} cindex 外层column的索引（对应每一个类型）
 * @param {Number / String} value 遍历到的当前值
 * @param {Array} currentValue 当前选中的值 this.pickerValue
 * @param {Array} boundary 当前变量的限制值，决定禁用的边界值
 * @return {Boolean} disabled
 */
function columnDisabledRules(
  isStart: boolean,
  columns: {
    type: DatetimePickerViewColumnType
    values: number[]
  }[],
  cIndex: number,
  value: number,
  currentValue: number[],
  boundary: number[]
) {
  const { type } = props
  // 0年 1月 2日 3時 4分
  // startPicker 除最小值外 还需要有一个时间限制, endPicker 时间选择后, startPicker 的 添加一个时间限制boundary min->boundary
  // endPicker 除最小值外 还需要有一个时间限制, startPicker 时间选择后, endPicker 的 添加一个时间限制boundary boundary->max
  const column = columns[cIndex]
  // 根据当前选择年确认 ranges[0][0] minYear ranges[0][1] maxYear 以此类推
  if (type === 'datetime') {
    const year = boundary[0]
    const month = boundary[1]
    const date = boundary[2]
    const hour = boundary[3]
    const minute = boundary[4]

    if (column.type === 'year') {
      return isStart ? value > year : value < year
    }
    if (column.type === 'month' && currentValue[0] === year) {
      return isStart ? value > month : value < month
    }
    if (column.type === 'date' && currentValue[0] === year && currentValue[1] === month) {
      return isStart ? value > date : value < date
    }
    if (column.type === 'hour' && currentValue[0] === year && currentValue[1] === month && currentValue[2] === date) {
      return isStart ? value > hour : value < hour
    }
    if (column.type === 'minute' && currentValue[0] === year && currentValue[1] === month && currentValue[2] === date && currentValue[3] === hour) {
      return isStart ? value > minute : value < minute
    }
  } else if (type === 'year-month') {
    const year = boundary[0]
    const month = boundary[1]

    if (column.type === 'year') {
      return isStart ? value > year : value < year
    }
    if (column.type === 'month' && currentValue[0] === year) {
      return isStart ? value > month : value < month
    }
  } else if (type === 'year') {
    const year = boundary[0]

    if (column.type === 'year') {
      return isStart ? value > year : value < year
    }
  } else if (type === 'date') {
    const year = boundary[0]
    const month = boundary[1]
    const date = boundary[2]

    if (column.type === 'year') {
      return isStart ? value > year : value < year
    }
    if (column.type === 'month' && currentValue[0] === year) {
      return isStart ? value > month : value < month
    }
    if (column.type === 'date' && currentValue[0] === year && currentValue[1] === month) {
      return isStart ? value > date : value < date
    }
  } else if (type === 'time') {
    const hour = boundary[0]
    const minute = boundary[1]

    if (column.type === 'hour') {
      return isStart ? value > hour : value < hour
    }
    if (column.type === 'minute' && currentValue[0] === hour) {
      return isStart ? value > minute : value < minute
    }
  }

  return false
}

function setLoading(loading: boolean) {
  isLoading.value = loading
}

defineExpose<DatetimePickerExpose>({
  open,
  close,
  setLoading
})
</script>

<style>
.wd-picker__popup {
  border-radius: 16px 16px 0 0;
}

.wd-picker__wraper {
  padding-bottom: var(--window-bottom);
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

.wd-picker.is-large .wd-picker__arrow {
  font-size: var(--wot-cell-icon-size-large, 18px);
}

.wd-picker.is-error .wd-picker__value,
.wd-picker.is-error .wd-picker__placeholder,
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

.wd-picker__arrow {
  display: block;
  font-size: var(--wot-cell-icon-size, 16px);
  color: var(--wot-cell-arrow-color, rgba(0, 0, 0, 0.25));
  line-height: var(--wot-cell-line-height, 24px);
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
  float: 1;
  color: var(--wot-picker-toolbar-title-color, rgba(0, 0, 0, 0.85));
}

.wd-picker__region-tabs {
  display: flex;
}

.wd-picker__region {
  width: 50%;
  display: inline-block;
  color: var(--wot-picker-region-color, rgba(0, 0, 0, 0.45));
  text-align: center;
  padding: 14px 0;
  font-size: var(--wot-picker-region-fs, 14px);
  line-height: 16px;
  transition: all 0.15s ease-out;
}

.wd-picker__region.is-active {
  background: var(--wot-picker-region-bg-active-color, var(--wot-color-theme, #4d80f0));
  color: var(--wot-color-white, rgb(255, 255, 255));
}

.wd-picker__region-time {
  font-size: 16px;
  margin-top: 2px;
}

.wd-picker__hidden {
  visibility: hidden;
  overflow: hidden;
  height: 0;
}

.wd-picker__show {
  visibility: visible;
  height: auto;
}
</style>
