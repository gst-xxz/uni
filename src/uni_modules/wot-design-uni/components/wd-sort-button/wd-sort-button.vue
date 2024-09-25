<template>
  <view :class="`wd-sort-button inline-block ${line ? 'wd-sort-button--line' : ''} ${customClass}`" :style="customStyle"
    @click="handleClick">
    <view class="wd-sort-button__wrapper break-all whitespace-nowrap text-sm text-[#262626]">
      <view
        :class="`wd-sort-button__left relative inline-block align-middle ${modelValue !== 0 ? 'is-active font-medium' : ''}`">
        {{ title }}
      </view>
      <view
        :class="`wd-sort-button__right inline-block align-middle min-w-[14px] ml-[2px] leading-[1.1] ${modelValue !== 0 ? 'is-active' : ''}`">
        <pro-icon v-if="modelValue !== 1" name="arrow-up"
          custom-class="wd-sort-button__icon-up block leading-[1.1] transform-[scale(calc((10 / 14))_translate(0,7px))]" />
        <pro-icon v-if="modelValue !== -1" name="arrow-down"
          custom-class="wd-sort-button__icon-down block leading-[1.1] transform-[scale(calc((10 / 14))_translate(0,-7px))]" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'wd-sort-button',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { sortButtonProps } from './types'

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
<style lang="scss" scoped>
@import './index.scss';
</style>
