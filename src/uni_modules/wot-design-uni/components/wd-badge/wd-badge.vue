<template>
  <view
    :class="['wd-badge relative align-middle inline-block text-xs leading-3 whitespace-nowrap border-[2px] border-solid border-white', customClass]"
    :style="customStyle">
    <slot></slot>
    <view v-if="isBadgeShow" :class="contentClass" :style="contentStyle">
      {{ content }}
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'wd-badge',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { badgeProps } from './types'
import classNames from 'classnames'

const props = defineProps(badgeProps)
const content = ref<number | string | null>(null)

watch(
  [() => props.modelValue, () => props.max, () => props.isDot],
  () => {
    notice()
  },
  { immediate: true, deep: true }
)

const contentStyle = computed(() => {
  return `background-color: ${props.bgColor};top:${props.top || 0}px;right:${props.right || 0}px`
})

// 是否展示徽标数字
const isBadgeShow = computed(() => {
  let isBadgeShow: boolean = false
  if (!props.hidden && (content.value || (content.value === 0 && props.showZero) || props.isDot)) {
    isBadgeShow = true
  }
  return isBadgeShow
})

function notice() {
  if (props.isDot) return
  let value = props.modelValue
  const max = props.max
  if (value && max && typeof value === 'number' && !Number.isNaN(value) && !Number.isNaN(max)) {
    value = max < value ? `${max}+` : value
  }
  content.value = value
}

const contentClass = computed(() => {
  return classNames(
    'wd-badge__content inline-block leading-[1] text-center font-medium rounded-full h-4 px-[5px] py-0 text-white',
    'absolute translate-x-1/2 -translate-y-1/2',
    // props.type ? 'wd-badge__content--' + props.type : '',
    props.type === 'primary' ? 'bg-primary' : '',
    props.type === 'success' ? 'bg-success' : '',
    props.type === 'warning' ? 'bg-warning' : '',
    props.type === 'info' ? 'bg-info' : '',
    props.type === 'danger' ? 'bg-danger' : '',
    {
      '!w-2.5 !h-2.5 !p-0 !rounded-full': props.isDot
    }
  )
})
</script>
