<template>
  <div :class="cn(`wd-input-number ${customClass} ${disabled ? 'is-disabled' : ''} ${withoutInput ? 'is-without-input' : ''}`)" :style="customStyle">
    <div :class="cn(`wd-input-number__action ${minDisabled || disableMinus ? 'is-disabled' : ''}`)" @click="sub">
      <wd-icon name="minus" custom-class="wd-input-number__action-icon"></wd-icon>
    </div>
    <div v-if="!withoutInput" class="wd-input-number__inner" @click.stop="">
      <input
        class="wd-input-number__input"
        :style="`${inputWidth ? 'width: ' + inputWidth : ''}`"
        type="digit"
        :disabled="disabled || disableInput"
        v-model="inputValue"
        :placeholder="placeholder"
        :adjust-position="adjustPosition"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="wd-input-number__input-border"></div>
    </div>
    <div :class="cn(`wd-input-number__action ${maxDisabled || disablePlus ? 'is-disabled' : ''}`)" @click="add">
      <wd-icon name="plus" custom-class="wd-input-number__action-icon"></wd-icon>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-input-number',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { cn, debounce, isDef, isEqual } from '../common/util'
import { inputNumberProps } from './types'

const props = defineProps(inputNumberProps)
const emit = defineEmits(['focus', 'blur', 'change', 'update:modelValue'])

const minDisabled = ref<boolean>(false)
const maxDisabled = ref<boolean>(false)
const inputValue = ref<string | number>('') // 输入框的值

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
    splitDisabled(newValue)
  },
  { immediate: true, deep: true }
)

watch(
  [() => props.max, () => props.min],
  () => {
    updateBoundary()
  },
  { immediate: true, deep: true }
)

watch(
  () => props.disabled,
  (newValue) => {
    minDisabled.value = newValue
    maxDisabled.value = newValue
  },
  { immediate: true, deep: true }
)

function updateBoundary() {
  debounce(() => {
    const value = formatValue(inputValue.value)
    if (!isEqual(inputValue.value, value)) {
      setValue(value)
    }
    splitDisabled(value)
  }, 30)()
}

function splitDisabled(value: number | string) {
  const { disabled, min, max, step } = props
  minDisabled.value = disabled || Number(value) <= min || changeStep(value, -step) < min
  maxDisabled.value = disabled || Number(value) >= max || changeStep(value, step) > max
}

function toPrecision(value: number) {
  return Number(parseFloat(`${Math.round(value * Math.pow(10, props.precision)) / Math.pow(10, props.precision)}`).toFixed(props.precision))
}

function getPrecision(value?: number) {
  if (value === undefined) return 0
  const valueString = value.toString()
  const dotPosition = valueString.indexOf('.')
  let precision = 0
  if (dotPosition !== -1) {
    precision = valueString.length - dotPosition - 1
  }
  return precision
}

function toStrictlyStep(value: number | string) {
  const stepPrecision = getPrecision(props.step)
  const precisionFactory = Math.pow(10, stepPrecision)
  return (Math.round(Number(value) / props.step) * precisionFactory * props.step) / precisionFactory
}

function setValue(value: string | number, change: boolean = true) {
  if (props.allowNull && (!isDef(value) || value === '')) {
    dispatchChangeEvent(value, change)
    return
  }

  if (props.stepStrictly) {
    value = toStrictlyStep(value)
  }
  if ((value || value === 0) && props.precision !== undefined) {
    value = toPrecision(Number(value))
  }
  if (Number(value) > props.max) value = toPrecision(props.max)
  if (Number(value) < props.min) value = toPrecision(props.min)

  dispatchChangeEvent(value, change)
}

function changeStep(val: string | number, step: number) {
  val = Number(val)

  if (isNaN(val)) {
    return props.min
  }

  const precisionFactory = Math.pow(10, props.precision)
  return toPrecision((val * precisionFactory + step * precisionFactory) / precisionFactory)
}

function sub() {
  if (minDisabled.value || props.disableMinus) return

  const newValue = changeStep(inputValue.value, -props.step)
  dispatchChangeEvent(newValue)
}

function add() {
  if (maxDisabled.value || props.disablePlus) return

  const newValue = changeStep(inputValue.value, props.step)
  dispatchChangeEvent(newValue)
}

function handleInput(event: any) {
  const value = event.detail.value || ''
  dispatchChangeEvent(value)
}

function handleFocus(event: any) {
  emit('focus', event.detail)
}

function handleBlur() {
  const value = formatValue(inputValue.value)
  if (!isEqual(inputValue.value, value)) {
    setValue(value)
  }
  emit('blur', {
    value
  })
}

function dispatchChangeEvent(value: string | number, change: boolean = true) {
  if (isEqual(inputValue.value, value)) {
    return
  }
  inputValue.value = value
  change && emit('update:modelValue', inputValue.value)
  change && emit('change', { value })
}

function formatValue(value: string | number) {
  if (props.allowNull && (!isDef(value) || value === '')) {
    return ''
  }

  let formatValue = Number(value)

  if (isNaN(formatValue)) {
    value = props.min
  }

  if (props.stepStrictly) {
    formatValue = toStrictlyStep(value)
  }

  if (props.precision !== undefined) {
    formatValue = Number(formatValue.toFixed(props.precision))
  }
  if (formatValue > props.max) {
    formatValue = props.max
  }
  if (formatValue < props.min) {
    formatValue = props.min
  }

  return formatValue
}
</script>

<style>
.wd-input-number {
  display: inline-block;
  -webkit-user-select: none;
  user-select: none;
  line-height: 1.15;
}

.wd-input-number__action {
  position: relative;
  display: inline-block;
  width: var(--wot-input-number-btn-width, 26px);
  height: var(--wot-input-number-height, 24px);
  vertical-align: middle;
  color: var(--wot-input-number-icon-color, rgba(0, 0, 0, 0.65));
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.wd-input-number__action:after {
  position: absolute;
  content: '';
  width: calc(200% - 2px);
  height: calc(200% - 2px);
  left: 0;
  top: 0;
  border: 1px solid var(--wot-input-number-border-color, #e8e8e8);
  border-top-left-radius: calc(var(--wot-input-number-radius, 4px) * 2);
  border-bottom-left-radius: calc(var(--wot-input-number-radius, 4px) * 2);
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}

.wd-input-number__action:last-child:after {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: calc(var(--wot-input-number-radius, 4px) * 2);
  border-bottom-right-radius: calc(var(--wot-input-number-radius, 4px) * 2);
}

.wd-input-number__action.is-disabled {
  color: var(--wot-input-number-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-input-number__inner {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.wd-input-number__input {
  position: relative;
  display: block;
  width: var(--wot-input-number-input-width, 36px);
  height: var(--wot-input-number-height, 24px);
  padding: 0 2px;
  box-sizing: border-box;
  z-index: 1;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  color: var(--wot-input-number-color, #262626);
  font-size: var(--wot-input-number-fs, 12px);
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.wd-input-number__input-border {
  position: absolute;
  width: 100%;
  height: calc(200% - 2px);
  left: 0;
  top: 0;
  border-top: 1px solid var(--wot-input-number-border-color, #e8e8e8);
  border-bottom: 1px solid var(--wot-input-number-border-color, #e8e8e8);
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
  z-index: 0;
}

.wd-input-number__action-icon {
  position: absolute;
  display: inline-block;
  font-size: var(--wot-input-number-icon-size, 14px);
  width: var(--wot-input-number-icon-size, 14px);
  height: var(--wot-input-number-icon-size, 14px);
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.wd-input-number.is-disabled .wd-input-number__input {
  color: var(--wot-input-number-disabled-color, rgba(0, 0, 0, 0.25));
  z-index: inherit;
}

.wd-input-number.is-disabled .wd-input-number__sub,
.wd-input-number.is-disabled .wd-input-number__add {
  color: var(--wot-input-number-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-input-number.is-without-input .wd-input-number__action:last-child:after {
  border-left: none;
}
</style>
