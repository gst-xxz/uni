<template>
  <div :class="cn('wd-badge relative align-middle inline-block', customClass)" :style="customStyle">
    <slot></slot>
    <div
      v-if="shouldShowBadge"
      :class="
        cn(
          'wd-badge__content inline-block h-4 text-xs py-0 px-[5px] bg-danger rounded-[10px] text-white text-center whitespace-nowrap font-medium border-[2px] border-solid border-white',
          'is-fixed absolute top-0 right-0 -translate-y-1/2 translate-x-1/2',
          {
            'bg-primary': type === 'primary',
            'bg-success': type === 'success',
            'bg-warning': type === 'warning',
            'bg-info': type === 'info',
            'bg-danger': type === 'danger'
          },
          isDot ? 'is-dot h-1.5 w-1.5 p-0 rounded-full' : ''
        )
      "
      :style="contentStyle"
    >
      {{ content }}
    </div>
  </div>
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
import { computed, type CSSProperties } from 'vue'
import { badgeProps } from './types'
import { addUnit, cn, isNumber } from '../common/util'

const props = defineProps(badgeProps)
const content = computed(() => {
  const { modelValue, max, isDot } = props
  if (isDot) return ''
  let value = modelValue
  if (value && max && isNumber(value) && !Number.isNaN(value) && !Number.isNaN(max)) {
    value = max < value ? `${max}+` : value
  }
  return value
})

const contentStyle = computed(() => {
  const style: CSSProperties = {
    backgroundColor: props.bgColor,
    top: props.top ? addUnit(props.top) : undefined,
    right: props.right ? addUnit(props.right) : undefined
  }

  return style
})

// 是否展示徽标数字
const shouldShowBadge = computed(() => !props.hidden && (content.value || (content.value === 0 && props.showZero) || props.isDot))
</script>
