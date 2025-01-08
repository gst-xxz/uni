<template>
  <div :class="cn(`wd-calendar ${cell.border.value ? 'is-border' : ''} ${customClass}`)">
    <div class="wd-calendar__field" @click="open" v-if="withCell">
      <slot v-if="$slots.default"></slot>
      <div
        v-else
        :class="
          cn(
            'wd-calendar__cell',
            disabled ? 'is-disabled' : '',
            readonly ? 'is-readonly' : '',
            alignRight ? 'is-align-right' : '',
            error ? 'is-error' : '',
            size ? 'is-' + size : '',
            center ? 'is-center' : ''
          )
        "
      >
        <div
          v-if="label || $slots.label"
          :class="cn(`wd-calendar__label ${isRequired ? 'is-required' : ''} ${customLabelClass}`)"
          :style="labelWidth ? 'min-width:' + labelWidth + ';max-width:' + labelWidth + ';' : ''"
        >
          <slot name="label">{{ label }}</slot>
        </div>
        <div class="wd-calendar__body">
          <div class="wd-calendar__value-wraper">
            <div
              :class="cn('wd-calendar__value', ellipsis ? 'is-ellipsis' : '', customValueClass, showValue ? '' : 'wd-calendar__value--placeholder')"
            >
              {{ showValue || placeholder || translate('placeholder') }}
            </div>
            <wd-icon v-if="!disabled && !readonly" custom-class="wd-calendar__arrow" name="arrow" />
          </div>
          <div v-if="errorMessage" class="wd-calendar__error-message">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
    <wd-action-sheet
      v-model="pickerShow"
      :duration="250"
      :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :z-index="zIndex"
      @close="close"
    >
      <div class="wd-calendar__header">
        <div v-if="!showTypeSwitch && shortcuts.length === 0" class="wd-calendar__title">{{ title || translate('title') }}</div>
        <div v-if="showTypeSwitch" class="wd-calendar__tabs w-[222px] mt-2.5 mx-auto mb-3">
          <wd-tabs ref="calendarTabs" v-model="currentTab" @change="handleTypeChange">
            <wd-tab :title="translate('day')" :name="translate('day')" />
            <wd-tab :title="translate('week')" :name="translate('week')" />
            <wd-tab :title="translate('month')" :name="translate('month')" />
          </wd-tabs>
        </div>
        <div v-if="shortcuts.length > 0" class="wd-calendar__shortcuts py-5 px-0 text-center">
          <wd-tag
            v-for="(item, index) in shortcuts"
            :key="index"
            custom-class="wd-calendar__tag mr-2"
            type="primary"
            plain
            round
            @click="handleShortcutClick(index)"
          >
            {{ item.text }}
          </wd-tag>
        </div>
        <wd-icon custom-class="wd-calendar__close" name="add" @click="close" />
      </div>
      <div
        v-if="inited"
        :class="cn(`wd-calendar__view  ${currentType.indexOf('range') > -1 ? 'is-range' : ''} ${showConfirm ? 'is-show-confirm' : ''}`)"
      >
        <div
          v-if="range(type)"
          :class="
            cn(
              `wd-calendar__range-label flex justify-center items-center text-sm`,
              type === 'monthrange' ? 'is-monthrange pb-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.02)]' : ''
            )
          "
        >
          <div
            :class="
              cn(
                `wd-calendar__range-label-item flex-1 text-black/85 text-right`,
                !calendarValue || !isArray(calendarValue) || !calendarValue[0] ? 'is-placeholder text-black/25' : ''
              )
            "
          >
            {{ rangeLabel[0] }}
          </div>
          <div class="wd-calendar__range-sperator my-0 mx-auto text-black/25">/</div>
          <div :class="cn(`wd-calendar__range-label-item ${!calendarValue || !isArray(calendarValue) || !calendarValue[1] ? 'is-placeholder' : ''}`)">
            {{ rangeLabel[1] }}
          </div>
        </div>
        <wd-calendar-view
          ref="calendarView"
          v-model="calendarValue"
          :type="currentType"
          :min-date="minDate"
          :max-date="maxDate"
          :first-day-of-week="firstDayOfWeek"
          :formatter="formatter"
          :panel-height="panelHeight"
          :max-range="maxRange"
          :range-prompt="rangePrompt"
          :allow-same-day="allowSameDay"
          :default-time="defaultTime"
          :time-filter="timeFilter"
          :hide-second="hideSecond"
          :show-panel-title="!range(type)"
          :immediate-change="immediateChange"
          @change="handleChange"
        />
      </div>
      <div v-if="showConfirm" class="wd-calendar__confirm pt-3 px-[25px] pb-[14px]">
        <wd-button block :disabled="confirmBtnDisabled" @click="handleConfirm">{{ confirmText || translate('confirm') }}</wd-button>
      </div>
    </wd-action-sheet>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-calendar',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import { dayjs } from '../common/dayjs'
import { cn, deepClone, isArray, isEqual, padZero, pause } from '../common/util'
import { getWeekNumber, isRange } from '../wd-calendar-view/utils'
import { useCell } from '../composables/useCell'
import { FORM_KEY, type FormItemRule } from '../wd-form/types'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { calendarProps, type CalendarExpose } from './types'
import type { CalendarType } from '../wd-calendar-view/types'
const { translate } = useTranslate('calendar')

const defaultDisplayFormat = (value: number | number[], type: CalendarType): string => {
  switch (type) {
    case 'date':
      return dayjs(value as number).format('YYYY-MM-DD')
    case 'dates':
      return (value as number[])
        .map((item) => {
          return dayjs(item).format('YYYY-MM-DD')
        })
        .join(', ')
    case 'daterange':
      return `${(value as number[])[0] ? dayjs((value as number[])[0]).format('YYYY-MM-DD') : translate('startTime')} ${translate('to')} ${
        (value as number[])[1] ? dayjs((value as number[])[1]).format('YYYY-MM-DD') : translate('endTime')
      }`
    case 'datetime':
      return dayjs(value as number).format('YYYY-MM-DD HH:mm:ss')
    case 'datetimerange':
      return `${(value as number[])[0] ? dayjs((value as number[])[0]).format(translate('timeFormat')) : translate('startTime')} ${translate(
        'to'
      )}\n${(value as number[])[1] ? dayjs((value as number[])[1]).format(translate('timeFormat')) : translate('endTime')}`
    case 'week': {
      const year = new Date(value as number).getFullYear()
      const week = getWeekNumber(value as number)
      return translate('weekFormat', year, padZero(week))
    }
    case 'weekrange': {
      const year1 = new Date((value as number[])[0]).getFullYear()
      const week1 = getWeekNumber((value as number[])[0])
      const year2 = new Date((value as number[])[1]).getFullYear()
      const week2 = getWeekNumber((value as number[])[1])
      return `${(value as number[])[0] ? translate('weekFormat', year1, padZero(week1)) : translate('startWeek')} - ${
        (value as number[])[1] ? translate('weekFormat', year2, padZero(week2)) : translate('endWeek')
      }`
    }
    case 'month':
      return dayjs(value as number).format('YYYY / MM')
    case 'monthrange':
      return `${(value as number[])[0] ? dayjs((value as number[])[0]).format('YYYY / MM') : translate('startMonth')} ${translate('to')} ${
        (value as number[])[1] ? dayjs((value as number[])[1]).format('YYYY / MM') : translate('endMonth')
      }`
  }
}

const formatRange = (value: number, rangeType: 'start' | 'end', type: CalendarType) => {
  switch (type) {
    case 'daterange':
      if (!value) {
        return rangeType === 'end' ? translate('endTime') : translate('startTime')
      }
      return dayjs(value).format(translate('dateFormat'))
    case 'datetimerange':
      if (!value) {
        return rangeType === 'end' ? translate('endTime') : translate('startTime')
      }
      return dayjs(value).format(translate('timeFormat'))
    case 'weekrange': {
      if (!value) {
        return rangeType === 'end' ? translate('endWeek') : translate('startWeek')
      }
      const date = new Date(value)
      const year = date.getFullYear()
      const week = getWeekNumber(value)
      return translate('weekFormat', year, padZero(week))
    }
    case 'monthrange':
      if (!value) {
        return rangeType === 'end' ? translate('endMonth') : translate('startMonth')
      }
      return dayjs(value).format(translate('monthFormat'))
  }
}

const props = defineProps(calendarProps)
const emit = defineEmits(['cancel', 'change', 'update:modelValue', 'confirm', 'open'])

const pickerShow = ref<boolean>(false)
const calendarValue = ref<null | number | number[]>(null)
const lastCalendarValue = ref<null | number | number[]>(null)
const panelHeight = ref<number>(338)
const confirmBtnDisabled = ref<boolean>(true)
const currentTab = ref<number>(0)
const lastTab = ref<number>(0)
const currentType = ref<CalendarType>('date')
const lastCurrentType = ref<CalendarType>()
const inited = ref<boolean>(false)
const cell = useCell()
const calendarView = ref()
const calendarTabs = ref()

const rangeLabel = computed(() => {
  const [start, end] = deepClone(isArray(calendarValue.value) ? calendarValue.value : [])
  return [start, end].map((item, index) => {
    return (props.innerDisplayFormat || formatRange)(item, index === 0 ? 'start' : 'end', currentType.value)
  })
})

const showValue = computed(() => {
  if ((!isArray(props.modelValue) && props.modelValue) || (isArray(props.modelValue) && props.modelValue.length)) {
    return (props.displayFormat || defaultDisplayFormat)(props.modelValue, lastCurrentType.value || currentType.value)
  } else {
    return ''
  }
})

watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (isEqual(val, oldVal)) return
    calendarValue.value = deepClone(val)
    confirmBtnDisabled.value = getConfirmBtnStatus(val)
  },
  {
    immediate: true
  }
)

watch(
  () => props.type,
  (newValue, oldValue) => {
    if (props.showTypeSwitch) {
      const tabs = ['date', 'week', 'month']
      const rangeTabs = ['daterange', 'weekrange', 'monthrange']

      const index = newValue.indexOf('range') > -1 ? rangeTabs.indexOf(newValue) || 0 : tabs.indexOf(newValue)
      currentTab.value = index
    }
    panelHeight.value = props.showConfirm ? 338 : 400
    currentType.value = deepClone(newValue)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.showConfirm,
  (val) => {
    panelHeight.value = val ? 338 : 400
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

const range = computed(() => {
  return (type: CalendarType) => {
    return isRange(type)
  }
})

function scrollIntoView() {
  calendarView.value && calendarView.value && calendarView.value.$.exposed.scrollIntoView()
}
// 对外暴露方法
async function open() {
  const { disabled, readonly } = props

  if (disabled || readonly) return

  inited.value = true
  pickerShow.value = true
  lastCalendarValue.value = deepClone(calendarValue.value)
  lastTab.value = currentTab.value
  lastCurrentType.value = currentType.value
  // 等待渲染完毕
  await pause()
  scrollIntoView()
  setTimeout(() => {
    if (props.showTypeSwitch) {
      calendarTabs.value.scrollIntoView()
      calendarTabs.value.updateLineStyle(false)
    }
  }, 250)
  emit('open')
}
// 对外暴露方法
function close() {
  pickerShow.value = false
  setTimeout(() => {
    calendarValue.value = deepClone(lastCalendarValue.value)
    currentTab.value = lastTab.value
    currentType.value = lastCurrentType.value || 'date'
    confirmBtnDisabled.value = getConfirmBtnStatus(lastCalendarValue.value)
  }, 250)
  emit('cancel')
}
function handleTypeChange({ index }: { index: number }) {
  const tabs = ['date', 'week', 'month']
  const rangeTabs = ['daterange', 'weekrange', 'monthrange']
  const type = props.type.indexOf('range') > -1 ? rangeTabs[index] : tabs[index]
  currentTab.value = index
  currentType.value = type as CalendarType
}
function getConfirmBtnStatus(value: number | number[] | null) {
  let confirmBtnDisabled = false
  // 范围选择未选择满，或者多日期选择未选择日期，按钮置灰不可点击
  if (
    (props.type.indexOf('range') > -1 && (!isArray(value) || !value[0] || !value[1] || !value)) ||
    (props.type === 'dates' && (!isArray(value) || value.length === 0 || !value)) ||
    !value
  ) {
    confirmBtnDisabled = true
  }

  return confirmBtnDisabled
}
function handleChange({ value }: { value: number | number[] | null }) {
  calendarValue.value = deepClone(value)
  confirmBtnDisabled.value = getConfirmBtnStatus(value)

  emit('change', {
    value
  })

  if (!props.showConfirm && !confirmBtnDisabled.value) {
    handleConfirm()
  }
}
function handleConfirm() {
  if (props.beforeConfirm) {
    props.beforeConfirm({
      value: calendarValue.value,
      resolve: (isPass: boolean) => {
        isPass && onConfirm()
      }
    })
  } else {
    onConfirm()
  }
}
function onConfirm() {
  pickerShow.value = false
  lastCurrentType.value = currentType.value
  emit('update:modelValue', calendarValue.value)
  emit('confirm', {
    value: calendarValue.value
  })
}

function handleShortcutClick(index: number) {
  if (props.onShortcutsClick && typeof props.onShortcutsClick === 'function') {
    calendarValue.value = deepClone(
      props.onShortcutsClick({
        item: props.shortcuts[index],
        index
      })
    )
    confirmBtnDisabled.value = getConfirmBtnStatus(calendarValue.value)
  }

  if (!props.showConfirm) {
    handleConfirm()
  }
}

defineExpose<CalendarExpose>({
  close,
  open
})
</script>

<style>
.wd-calendar.is-border .wd-calendar__cell {
  position: relative;
}

.wd-calendar.is-border .wd-calendar__cell:after {
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

.wd-calendar__cell {
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

.wd-calendar__cell.is-disabled .wd-calendar__value {
  color: var(--wot-input-disabled-color, #d9d9d9);
}

.wd-calendar__cell.is-align-right .wd-calendar__value {
  text-align: right;
}

.wd-calendar__cell.is-error .wd-calendar__value,
.wd-calendar__cell.is-error .wd-calendar__arrow {
  color: var(--wot-input-error-color, var(--wot-color-danger, #fa4350));
}

.wd-calendar__cell.is-large {
  font-size: var(--wot-cell-title-fs-large, 16px);
}

.wd-calendar__cell.is-large .wd-calendar__arrow {
  font-size: var(--wot-cell-icon-size-large, 18px);
}

.wd-calendar__cell.is-center {
  align-items: center;
}

.wd-calendar__cell.is-center .wd-calendar__arrow {
  margin-top: 0;
}

.wd-calendar__error-message {
  color: var(--wot-form-item-error-message-color, var(--wot-color-danger, #fa4350));
  font-size: var(--wot-form-item-error-message-font-size, var(--wot-fs-secondary, 12px));
  line-height: var(--wot-form-item-error-message-line-height, 24px);
  text-align: left;
  vertical-align: middle;
}

.wd-calendar__label {
  position: relative;
  width: var(--wot-input-cell-label-width, 33%);
  margin-right: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  box-sizing: border-box;
}

.wd-calendar__label.is-required {
  padding-left: 12px;
}

.wd-calendar__label.is-required:after {
  position: absolute;
  left: 0;
  top: 2px;
  content: '*';
  font-size: var(--wot-cell-required-size, 18px);
  line-height: 1.1;
  color: var(--wot-cell-required-color, var(--wot-color-danger, #fa4350));
}

.wd-calendar__value-wraper {
  display: flex;
}

.wd-calendar__value {
  flex: 1;
  margin-right: 10px;
  color: var(--wot-cell-value-color, rgba(0, 0, 0, 0.85));
}

.wd-calendar__value.is-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-calendar__value--placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf);
}

.wd-calendar__body {
  flex: 1;
}

.wd-calendar__arrow {
  display: block;
  font-size: var(--wot-cell-icon-size, 16px);
  color: var(--wot-cell-arrow-color, rgba(0, 0, 0, 0.25));
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-calendar__header {
  position: relative;
  overflow: hidden;
}

.wd-calendar__title {
  color: var(--wot-action-sheet-color, rgba(0, 0, 0, 0.85));
  height: var(--wot-action-sheet-title-height, 64px);
  line-height: var(--wot-action-sheet-title-height, 64px);
  text-align: center;
  font-size: var(--wot-action-sheet-title-fs, var(--wot-fs-title, 16px));
  font-weight: var(--wot-action-sheet-weight, 500);
}

.wd-calendar__close {
  position: absolute;
  top: var(--wot-action-sheet-close-top, 25px);
  right: var(--wot-action-sheet-close-right, 15px);
  color: var(--wot-action-sheet-close-color, rgba(0, 0, 0, 0.65));
  font-size: var(--wot-action-sheet-close-fs, var(--wot-fs-title, 16px));
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  line-height: 1.1;
}

.wd-calendar__view.is-show-confirm {
  height: 394px;
}

.wd-calendar__view.is-show-confirm.is-range {
  height: 384px;
}
</style>
