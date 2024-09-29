<template>
  <view :class="cn('inline-block h-12 leading-[1]', customClass)" :style="customStyle" @click="handleClick">
    <view class="break-all whitespace-nowrap text-sm text-[#262626]">
      <view
        :class="cn('relative inline-block align-middle', modelValue !== 0 ? 'font-medium after:!opacity-100' : '', line ? 'line after:bg-primary' : '')">
        {{ title }}
      </view>
      <view
        :class="cn('inline-block align-middle min-w-[14px] ml-[2px] leading-[1.1]', modelValue !== 0 ? 'is-active' : '')">
        <pro-icon v-if="modelValue !== 1" name="arrow-up"
          :custom-class="cn('block leading-[1.1] transform-[scale(calc((10/14))_translate(0,7px))]', modelValue !== 0 ? 'transform-[scale(calc((10/14))_translate(0,7px))]' : '')" />
        <pro-icon v-if="modelValue !== -1" name="arrow-down"
          :custom-class="cn('block leading-[1.1] transform-[scale(calc((10/14))_translate(0,-7px))]', modelValue !== 0 ? 'transform-[scale(calc((10/14))_translate(0,-7px))]' : '')" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-sort-button',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { sortButtonProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(sortButtonProps)

const emit = defineEmits(['change', 'update:modelValue'])

function handleClick() {
  let { modelValue: value, allowReset, descFirst } = props
  if (descFirst) {
    if (value === 0) {
      value = -1
    } else if (value === -1) {
      value = 1
    } else if (value === 1) {
      if (allowReset) {
        value = 0
      } else {
        value = -1
      }
    }
  } else {
    if (value === 0) {
      value = 1
    } else if (value === 1) {
      value = -1
    } else if (value === -1) {
      if (allowReset) {
        value = 0
      } else {
        value = 1
      }
    }
  }
  emit('update:modelValue', value)
  emit('change', {
    value
  })
}
</script>
<style lang="scss">
.line {
  position: absolute;
  content: '';
  width: 19px;
  height: 3px;
  bottom: 6px;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 1.5px;
  transition: opacity .15s;
  opacity: 0;
}
</style>
