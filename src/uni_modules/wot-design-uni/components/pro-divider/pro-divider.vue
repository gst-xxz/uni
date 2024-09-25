<template>
  <view :class="cn('pro-divider relative flex pt-0 px-4 items-center text-black/45 text-sm leading-[1]', customClass)"
    :style="customStyle">
    <view class="block flex-1 h-[1px] -translate-y-0.5 bg-black/15" :style="color ? { background: color } : {}">
    </view>
    <view class="pt-0 px-3" :style="color ? { color } : {}">
      <slot></slot>
    </view>
    <view class="block flex-1 h-[1px] -translate-y-0.5 bg-black/15" :style="color ? { background: color } : {}">
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-divider',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { dividerProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils'

defineProps(dividerProps)
</script>
