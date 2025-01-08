<template>
  <wd-toast selector="wd-year" />

  <div class="wd-year year">
    <div class="wd-year__title" v-if="showTitle">{{ yearTitle(date) }}</div>
    <div class="wd-year__months">
      <div
        v-for="(item, index) in months"
        :key="index"
        :class="
          cn(
            `wd-year__month ${item.disabled ? 'is-disabled' : ''} ${item.isLastRow ? 'is-last-row' : ''} ${
              item.type ? monthTypeClass(item.type) : ''
            }`
          )
        "
        @click="handleDateClick(index)"
      >
        <div class="wd-year__month-top">{{ item.topInfo }}</div>
        <div class="wd-year__month-text">{{ getMonthLabel(item.date) }}</div>
        <div class="wd-year__month-bottom">{{ item.bottomInfo }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import wdToast from '../../wd-toast/wd-toast.vue'
import { computed, ref, watch } from 'vue'
import { cn, deepClone, isArray, isFunction } from '../../common/util'
import { compareMonth, formatYearTitle, getDateByDefaultTime, getItemClass, getMonthByOffset, getMonthOffset } from '../utils'
import { useToast } from '../../wd-toast'
import { useTranslate } from '../../composables/useTranslate'
import { dayjs } from '../../common/dayjs'
import { yearProps } from './types'
import type { CalendarDayItem, CalendarDayType } from '../types'

const props = defineProps(yearProps)
const emit = defineEmits(['change'])

const toast = useToast('wd-year')
const { translate } = useTranslate('calendar-view')

const months = ref<CalendarDayItem[]>([])

const monthTypeClass = computed(() => {
  return (monthType: CalendarDayType) => {
    return getItemClass(monthType, props.value, props.type)
  }
})

const yearTitle = computed(() => {
  return (date: number) => {
    return formatYearTitle(date)
  }
})

watch(
  [() => props.type, () => props.date, () => props.value, () => props.minDate, () => props.maxDate, () => props.formatter],
  () => {
    setMonths()
  },
  {
    deep: true,
    immediate: true
  }
)

function getMonthLabel(date: number) {
  return dayjs(date).format(translate('month', date))
}

function setMonths() {
  const monthList: CalendarDayItem[] = []
  const date = new Date(props.date)
  const year = date.getFullYear()
  const value = props.value

  if (props.type.indexOf('range') > -1 && value && !isArray(value)) {
    console.error('[wot-design] value should be array when type is range')
    return
  }

  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 1).getTime()
    let type: CalendarDayType = getMonthType(date)
    if (!type && compareMonth(date, Date.now()) === 0) {
      type = 'current'
    }
    const monthObj = getFormatterDate(date, month, type)
    monthList.push(monthObj)
  }

  months.value = deepClone(monthList)
}
function getMonthType(date: number) {
  if (props.type === 'monthrange' && isArray(props.value)) {
    const [startDate, endDate] = props.value || []

    if (startDate && compareMonth(date, startDate) === 0) {
      if (endDate && compareMonth(startDate, endDate) === 0) {
        return 'same'
      }
      return 'start'
    } else if (endDate && compareMonth(date, endDate) === 0) {
      return 'end'
    } else if (startDate && endDate && compareMonth(date, startDate) === 1 && compareMonth(date, endDate) === -1) {
      return 'middle'
    } else {
      return ''
    }
  } else {
    if (props.value && compareMonth(date, props.value as number) === 0) {
      return 'selected'
    } else {
      return ''
    }
  }
}
function handleDateClick(index: number) {
  const date = months.value[index]

  if (date.disabled) return

  switch (props.type) {
    case 'month':
      handleMonthChange(date)
      break
    case 'monthrange':
      handleMonthRangeChange(date)
      break
    default:
      handleMonthChange(date)
  }
}
function getDate(date: number) {
  return props.defaultTime && props.defaultTime.length > 0 ? getDateByDefaultTime(date, props.defaultTime[0]) : date
}
function handleMonthChange(date: CalendarDayItem) {
  if (date.type !== 'selected') {
    emit('change', {
      value: getDate(date.date)
    })
  }
}
function handleMonthRangeChange(date: CalendarDayItem) {
  let value: (number | null)[] = []
  const [startDate, endDate] = isArray(props.value) ? props.value || [] : []
  const compare = compareMonth(date.date, startDate!)

  // 禁止选择同个日期
  if (!props.allowSameDay && !endDate && compare === 0) return

  if (startDate && !endDate && compare > -1) {
    if (props.maxRange && getMonthOffset(date.date, startDate) > props.maxRange) {
      const maxEndDate = getMonthByOffset(startDate, props.maxRange - 1)
      value = [startDate, getDate(maxEndDate)]
      toast.show({
        msg: props.rangePrompt || translate('rangePromptMonth', props.maxRange)
      })
    } else {
      value = [startDate, getDate(date.date)]
    }
  } else {
    value = [getDate(date.date), null]
  }
  emit('change', {
    value
  })
}

function getFormatterDate(date: number, month: number, type?: CalendarDayType) {
  let monthObj: CalendarDayItem = {
    date: date,
    text: month + 1,
    topInfo: '',
    bottomInfo: '',
    type,
    disabled: compareMonth(date, props.minDate) === -1 || compareMonth(date, props.maxDate) === 1,
    isLastRow: month >= 8
  }

  if (props.formatter) {
    if (isFunction(props.formatter)) {
      monthObj = props.formatter(monthObj)
    } else {
      console.error('[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function')
    }
  }

  return monthObj
}
</script>

<style>
.wd-year__title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  font-size: var(--wot-calendar-panel-title-fs, 14px);
  color: var(--wot-calendar-panel-title-color, rgba(0, 0, 0, 0.85));
}

.wd-year__months {
  display: flex;
  flex-wrap: wrap;
  font-size: var(--wot-calendar-day-fs, 16px);
  color: var(--wot-calendar-day-color, rgba(0, 0, 0, 0.85));
}

.wd-year__month {
  position: relative;
  width: 25%;
  height: var(--wot-calendar-day-height, 64px);
  line-height: var(--wot-calendar-day-height, 64px);
  text-align: center;
  margin-bottom: var(--wot-calendar-item-margin-bottom, 4px);
}

.wd-year__month.is-disabled .wd-year__month-text {
  color: var(--wot-calendar-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-year__month.is-current {
  color: var(--wot-calendar-active-color, var(--wot-color-theme, #4d80f0));
}

.wd-year__month.is-selected {
  color: #fff;
}

.wd-year__month.is-selected .wd-year__month-text {
  border-radius: var(--wot-calendar-active-border, 8px);
  background: var(--wot-calendar-active-color, var(--wot-color-theme, #4d80f0));
}

.wd-year__month.is-middle {
  background: var(--wot-calendar-range-color, rgba(77, 128, 240, 0.09));
}

.wd-year__month.is-start {
  color: var(--wot-calendar-selected-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-year__month.is-start:after {
  position: absolute;
  top: 0;
  right: 0;
  left: 50%;
  bottom: 0;
  content: '';
  background: var(--wot-calendar-range-color, rgba(77, 128, 240, 0.09));
}

.wd-year__month.is-start .wd-year__month-text {
  background: var(--wot-calendar-active-color, var(--wot-color-theme, #4d80f0));
  border-radius: var(--wot-calendar-active-border, 8px) 0 0 var(--wot-calendar-active-border, 8px);
}

.wd-year__month.is-start.is-without-end:after {
  display: none;
}

.wd-year__month.is-end {
  color: var(--wot-calendar-selected-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-year__month.is-end:after {
  position: absolute;
  top: 0;
  left: 0;
  right: 50%;
  bottom: 0;
  content: '';
  background: var(--wot-calendar-range-color, rgba(77, 128, 240, 0.09));
}

.wd-year__month.is-end .wd-year__month-text {
  background: var(--wot-calendar-active-color, var(--wot-color-theme, #4d80f0));
  border-radius: 0 var(--wot-calendar-active-border, 8px) var(--wot-calendar-active-border, 8px) 0;
}

.wd-year__month.is-same {
  color: var(--wot-calendar-selected-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-year__month.is-same .wd-year__month-text {
  background: var(--wot-calendar-active-color, var(--wot-color-theme, #4d80f0));
  border-radius: var(--wot-calendar-active-border, 8px);
}

.wd-year__month.is-last-row {
  margin-bottom: 0;
}

.wd-year__month-text {
  width: var(--wot-calendar-month-width, 50px);
  margin: 0 auto;
  text-align: center;
}

.wd-year__month-top {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  line-height: 1.1;
  font-size: var(--wot-calendar-info-fs, 10px);
  text-align: center;
}

.wd-year__month-bottom {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  line-height: 1.1;
  font-size: var(--wot-calendar-info-fs, 10px);
  text-align: center;
}
</style>
