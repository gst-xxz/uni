<template>
  <div
    :class="
      cn(
        `wd-radio ${cellValue ? 'is-cell-radio' : ''} ${cellValue && shapeValue == 'button' ? 'is-button-radio' : ''} ${
          sizeValue ? 'is-' + sizeValue : ''
        } ${inlineValue ? 'is-inline' : ''} ${isChecked ? 'is-checked' : ''} ${shapeValue !== 'check' ? 'is-' + shapeValue : ''} ${
          disabledValue ? 'is-disabled' : ''
        } icon-placement-${iconPlacement} ${customClass}`
      )
    "
    :style="customStyle"
    @click="handleClick"
  >
    <div
      class="wd-radio__label"
      :style="`${maxWidth ? 'max-width:' + maxWidth : ''};  ${
        isChecked && shapeValue === 'button' && !disabledValue ? 'color :' + checkedColorValue : ''
      }`"
    >
      <slot></slot>
    </div>
    <div class="wd-radio__shape" :style="isChecked && !disabledValue ? 'color: ' + checkedColorValue : ''">
      <wd-icon v-if="shapeValue === 'check'" :style="isChecked && !disabledValue ? 'color: ' + checkedColorValue : ''" name="check"></wd-icon>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-radio',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useParent } from '../composables/useParent'
import { RADIO_GROUP_KEY } from '../wd-radio-group/types'
import { radioProps, type RadioIconPlacement } from './types'
import { cn, getPropByPath, isDef } from '../common/util'

const props = defineProps(radioProps)

const { parent: radioGroup } = useParent(RADIO_GROUP_KEY)

const isChecked = computed(() => {
  if (radioGroup) {
    return props.value === radioGroup.props.modelValue
  } else {
    return false
  }
})

const shapeValue = computed(() => {
  return props.shape || getPropByPath(radioGroup, 'props.shape')
})

const checkedColorValue = computed(() => {
  return props.checkedColor || getPropByPath(radioGroup, 'props.checkedColor')
})

const disabledValue = computed(() => {
  if (isDef(props.disabled)) {
    return props.disabled
  } else {
    return getPropByPath(radioGroup, 'props.disabled')
  }
})

const inlineValue = computed(() => {
  if (isDef(props.inline)) {
    return props.inline
  } else {
    return getPropByPath(radioGroup, 'props.inline')
  }
})

const sizeValue = computed(() => {
  return props.size || getPropByPath(radioGroup, 'props.size')
})

const cellValue = computed(() => {
  if (isDef(props.cell)) {
    return props.cell
  } else {
    return getPropByPath(radioGroup, 'props.cell')
  }
})

const iconPlacement = computed<RadioIconPlacement>(() => {
  if (isDef(props.iconPlacement)) {
    return props.iconPlacement
  } else {
    return getPropByPath(radioGroup, 'props.iconPlacement')
  }
})

watch(
  () => props.shape,
  (newValue) => {
    const type = ['check', 'dot', 'button']
    if (!newValue || type.indexOf(newValue) === -1) console.error(`shape must be one of ${type.toString()}`)
  }
)

/**
 * 点击子元素，通知父元素触发change事件
 */
function handleClick() {
  const { value } = props
  if (!disabledValue.value && radioGroup && isDef(value)) {
    radioGroup.updateValue(value)
  }
}
</script>
<style>
.wd-radio {
  display: flex;
  margin-top: var(--wot-radio-margin, var(--wot-checkbox-margin, 10px));
  justify-content: space-between;
  align-items: center;
  text-align: center;
  line-height: 1.2;
}

.wd-radio.is-first {
  margin-top: 0;
}

.wd-radio__shape {
  position: relative;
  display: inline-block;
  width: var(--wot-radio-size, 16px);
  height: var(--wot-radio-size, 16px);
  font-size: var(--wot-radio-size, 16px);
  color: transparent;
  display: none;
  vertical-align: middle;
  transition: background 0.2s;
}

.wd-radio__input {
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  opacity: 0;
}

.wd-radio__label {
  display: inline-block;
  vertical-align: top;
  font-size: var(--wot-radio-label-fs, var(--wot-checkbox-label-fs, 14px));
  color: var(--wot-radio-label-color, var(--wot-checkbox-label-color, rgba(0, 0, 0, 0.85)));
  line-height: 20px;
}

.wd-radio.is-checked .wd-radio__shape {
  color: var(--wot-radio-checked-color, var(--wot-checkbox-checked-color, var(--wot-color-theme, #4d80f0)));
  border-color: currentColor;
  display: inline-block;
}

.wd-radio.is-checked .wd-radio__check {
  color: var(--wot-radio-checked-color, var(--wot-checkbox-checked-color, var(--wot-color-theme, #4d80f0)));
  opacity: 1;
}

.wd-radio.is-dot .wd-radio__shape {
  border: 2px solid var(--wot-radio-dot-border-color, #dcdcdc);
  border-radius: 50%;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  transition: none;
}

.wd-radio.is-dot .wd-radio__shape:before {
  content: '';
  position: absolute;
  width: var(--wot-radio-dot-size, 8px);
  height: var(--wot-radio-dot-size, 8px);
  left: calc(50% - var(--wot-radio-dot-size, 8px) / 2);
  top: calc(50% - var(--wot-radio-dot-size, 8px) / 2);
  border-radius: 50%;
  background-color: #fff;
  -webkit-transform: scale(0);
  transform: scale(0);
  transition: -webkit-transform 0.2s ease-in;
  transition: transform 0.2s ease-in;
  transition: transform 0.2s ease-in, -webkit-transform 0.2s ease-in;
}

.wd-radio.is-dot.is-checked .wd-radio__shape {
  background-color: currentColor;
  border-color: currentColor;
}

.wd-radio.is-dot.is-checked .wd-radio__shape:before {
  -webkit-transform: scale(1);
  transform: scale(1);
}

.wd-radio.is-button {
  display: inline-block;
  margin-top: 0;
  margin-right: 10px;
}

.wd-radio.is-button .wd-radio__shape {
  display: none;
}

.wd-radio.is-button .wd-radio__label {
  height: var(--wot-radio-button-height, var(--wot-checkbox-button-height, 32px));
  min-width: var(--wot-radio-button-min-width, 60px);
  max-width: var(--wot-radio-button-max-width, 144px);
  padding: 5px 15px;
  margin-right: 0;
  border-radius: var(--wot-radio-button-radius, var(--wot-checkbox-button-radius, 16px));
  background-color: var(--wot-radio-button-bg, var(--wot-checkbox-button-bg, rgba(0, 0, 0, 0.04)));
  font-size: var(--wot-radio-button-fs, var(--wot-checkbox-button-font-size, 14px));
  box-sizing: border-box;
  border: 1px solid var(--wot-radio-button-border, var(--wot-checkbox-button-border, #f5f5f5));
  transition: all 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-radio.is-button.is-checked .wd-radio__label {
  color: var(--wot-radio-checked-color, var(--wot-checkbox-checked-color, var(--wot-color-theme, #4d80f0)));
  border-color: currentColor;
  background-color: var(--wot-radio-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-radio.icon-placement-left {
  flex-direction: row-reverse;
}

.wd-radio.is-inline {
  display: inline-block;
  margin-top: 0;
  margin-right: var(--wot-radio-margin, var(--wot-checkbox-margin, 10px));
}

.wd-radio.is-inline.is-first {
  margin-left: 0;
}

.wd-radio.is-inline .wd-radio__shape {
  display: block;
  margin-right: 4px;
  float: left;
}

.wd-radio.is-inline .wd-radio__shape:after {
  content: '';
  display: table;
  clear: both;
}

.wd-radio.is-inline.is-dot .wd-radio__shape {
  margin-top: 2px;
}

.wd-radio.is-inline.is-dot.is-large .wd-radio__shape {
  margin-top: 0;
}

.wd-radio.is-inline.icon-placement-right .wd-radio__shape {
  margin-right: 0;
  margin-left: 4px;
  float: right;
}

.wd-radio.is-disabled .wd-radio__label,
.wd-radio.is-disabled.is-checked .wd-radio__shape,
.wd-radio.is-disabled.is-checked .wd-radio__check,
.wd-radio.is-disabled.is-checked .wd-radio__label {
  color: var(--wot-radio-disabled-label-color, var(--wot-checkbox-disabled-label-color, rgba(0, 0, 0, 0.25)));
}

.wd-radio.is-disabled.is-button .wd-radio__label {
  border-color: var(--wot-radio-disabled-color, var(--wot-checkbox-disabled-color, rgba(0, 0, 0, 0.04)));
  background: var(--wot-radio-disabled-color, var(--wot-checkbox-disabled-color, rgba(0, 0, 0, 0.04)));
  border-color: var(--wot-radio-button-border, var(--wot-checkbox-button-border, #f5f5f5));
  color: var(--wot-radio-disabled-label-color, var(--wot-checkbox-disabled-label-color, rgba(0, 0, 0, 0.25)));
}

.wd-radio.is-disabled.is-button.is-checked .wd-radio__label {
  border-color: var(--wot-radio-button-disabled-border, var(--wot-checkbox-button-disabled-border, rgba(0, 0, 0, 0.15)));
  background: var(--wot-radio-disabled-color, var(--wot-checkbox-disabled-color, rgba(0, 0, 0, 0.04)));
}

.wd-radio.is-disabled.is-dot .wd-radio__shape {
  background: var(--wot-radio-dot-disabled-bg, #d9d9d9);
  border-color: var(--wot-radio-dot-disabled-border, #d9d9d9);
}

.wd-radio.is-cell-radio {
  padding: 13px 15px;
  margin: 0;
}

.wd-radio.is-cell-radio.is-large {
  padding: 14px 15px;
}

.wd-radio.is-button-radio {
  display: inline-flex;
  width: 33.3333%;
  padding: 12px 12px 0 0;
  box-sizing: border-box;
}

.wd-radio.is-button-radio .wd-radio__label {
  width: 100%;
  max-width: inherit;
}

.wd-radio.is-large .wd-radio__shape {
  width: var(--wot-radio-large-size, var(--wot-checkbox-large-size, 18px));
  height: var(--wot-radio-large-size, var(--wot-checkbox-large-size, 18px));
  font-size: var(--wot-radio-large-size, var(--wot-checkbox-large-size, 18px));
}

.wd-radio.is-large .wd-radio__label {
  font-size: var(--wot-radio-large-label-fs, var(--wot-checkbox-large-label-fs, 16px));
}

.wd-radio.is-large.is-dot .wd-radio__shape:before {
  width: var(--wot-radio-dot-large-size, 10px);
  height: var(--wot-radio-dot-large-size, 10px);
  left: calc(50% - var(--wot-radio-dot-large-size, 10px) / 2);
  top: calc(50% - var(--wot-radio-dot-large-size, 10px) / 2);
}
</style>
