<template>
  <view :class="rootClass" :style="customStyle">
    <view :class="lineClass" :style="lineStyle"></view>
    <view class="pt-0 px-3" :style="contentStyle">
      <slot></slot>
    </view>
    <view :class="lineClass" :style="lineStyle"></view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'wd-divider',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { dividerProps } from './types'

const props = defineProps(dividerProps)

const rootClass = computed(() => {
  return {
    'relative flex pt-0 px-4 items-center text-black/45 text-sm leading-[1] dark:text-slate-400': true,
    [props.customClass]: !!props.customClass,
  }
})

const lineClass = computed(() => {
  return {
    'block flex-1 h-[1px] -translate-y-0.5 bg-black/15 dark:bg-slate-400': true,
  }
})

const lineStyle = computed(() => {
  if (props.color) {
    return {
      background: props.color,
    }
  }
  return {
  }
})

const contentStyle = computed(() => {
  if (props.color) {
    return {
      color: props.color,
    }
  }
  return {
  }
})
</script>
