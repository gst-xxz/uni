<template>
  <view :class="cn(
    `relative inline-block text-[28px] bg-[#eaeaea] w-[calc(1.8em+4px)] h-[calc(1em+4px)] rounded-[1em] transition-[all_0.3s]`,
    customClass,
    disabled ? 'opacity-50' : '',
    modelValue === activeValue ? 'is-checked bg-primary border-primary' : ''
  )" :style="rootStyle" @click="switchValue">
    <view :class="cn(
      'switch__circle absolute left-0.5 top-0.5 inline-block box-border bg-white rounded-[50%] transition-[left_0.3s_ease-out] w-[1em] h-[1em]',
      modelValue === activeValue ? 'left-[calc(1.8em+4px-1em-2px)] shadow-[0_2px_4px_0_rgba(0,83,162,0.5)]' : ''
    )" :style="circleStyle">
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-switch',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'
import { addUnit, isFunction, objToStyle } from '../common/util'
import { switchProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(switchProps)
const emit = defineEmits(['change', 'update:modelValue'])

const rootStyle = computed(() => {
  const rootStyle: Record<string, any> = {
    'font-size': addUnit(props.size),
    background: props.modelValue === props.activeValue ? props.activeColor : props.inactiveColor,
    'border-color': props.modelValue === props.activeValue ? props.activeColor : props.inactiveColor
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
<style lang="scss">
.switch__circle {
  &::after {
    position: absolute;
    content: '';
    width: calc(200% - 2px);
    height: calc(200% - 2px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    border: 1px solid #e5e5e5;
    border-radius: 50%;
  }
}
</style>
