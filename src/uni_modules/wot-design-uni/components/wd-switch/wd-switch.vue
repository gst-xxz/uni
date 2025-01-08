<template>
  <div
    :class="cn(`wd-switch`, customClass, disabled ? 'is-disabled' : '', modelValue === activeValue ? 'is-checked' : '')"
    :style="rootStyle"
    @click="switchValue"
  >
    <div class="wd-switch__circle" :style="circleStyle"></div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-switch',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, type CSSProperties, onBeforeMount } from 'vue'
import { addUnit, cn, isFunction, objToStyle } from '../common/util'
import { switchProps } from './types'

const props = defineProps(switchProps)
const emit = defineEmits(['change', 'update:modelValue'])

const rootStyle = computed(() => {
  const rootStyle: CSSProperties = {
    background: props.modelValue === props.activeValue ? props.activeColor : props.inactiveColor,
    'border-color': props.modelValue === props.activeValue ? props.activeColor : props.inactiveColor
  }
  if (props.size) {
    rootStyle['font-size'] = addUnit(props.size)
  }
  return `${objToStyle(rootStyle)};${props.customStyle}`
})

const circleStyle = computed(() => {
  const circleStyle: string =
    (props.modelValue === props.activeValue && props.activeColor) || (props.modelValue !== props.activeValue && props.inactiveColor)
      ? 'box-shadow: none;'
      : ''
  return circleStyle
})

function switchValue() {
  if (props.disabled) return
  const newVal = props.modelValue === props.activeValue ? props.inactiveValue : props.activeValue

  if (props.beforeChange && isFunction(props.beforeChange)) {
    props.beforeChange({
      value: newVal,
      resolve: (pass: boolean) => {
        if (pass) {
          emit('update:modelValue', newVal)
          emit('change', {
            value: newVal
          })
        }
      }
    })
  } else {
    emit('update:modelValue', newVal)
    emit('change', {
      value: newVal
    })
  }
}

onBeforeMount(() => {
  if ([props.activeValue, props.inactiveValue].indexOf(props.modelValue) === -1) {
    emit('update:modelValue', props.inactiveValue)
    emit('change', {
      value: props.inactiveValue
    })
  }
})
</script>
<style>
.wd-switch {
  display: inline-block;
  position: relative;
  width: var(--wot-switch-width, calc(1.8em + 4px));
  height: var(--wot-switch-height, calc(1em + 4px));
  border-radius: var(--wot-switch-circle-size, 1em);
  background: var(--wot-switch-inactive-color, #eaeaea);
  font-size: var(--wot-switch-size, 28px);
  transition: all 0.3s;
}

.wd-switch__checkbox {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}

.wd-switch__circle {
  box-sizing: border-box;
  position: absolute;
  display: inline-block;
  width: var(--wot-switch-circle-size, 1em);
  height: var(--wot-switch-circle-size, 1em);
  top: 2px;
  left: 2px;
  background: #fff;
  border-radius: 50%;
  transition: left 0.3s ease-out;
  box-shadow: 0 2px 4px 0 var(--wot-switch-inactive-shadow-color, rgba(155, 155, 155, 0.5));
}

.wd-switch__circle:after {
  position: absolute;
  content: '';
  width: calc(200% - 2px);
  height: calc(200% - 2px);
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) scale(0.5);
  transform: translate(-50%, -50%) scale(0.5);
  border: 1px solid var(--wot-switch-border-color, #e5e5e5);
  border-radius: 50%;
}

.wd-switch.is-checked {
  background: var(--wot-switch-active-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-switch-active-color, var(--wot-color-theme, #4d80f0));
}

.wd-switch.is-checked .wd-switch__circle {
  left: calc(var(--wot-switch-width, calc(1.8em + 4px)) - var(--wot-switch-circle-size, 1em) - 2px);
  box-shadow: 0 2px 4px 0 var(--wot-switch-active-shadow-color, rgba(0, 83, 162, 0.5));
}

.wd-switch.is-disabled {
  opacity: 0.5;
}
</style>
