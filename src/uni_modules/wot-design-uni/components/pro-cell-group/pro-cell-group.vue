<template>
  <view :class="cn('bg-white', customClass)" :style="customStyle">
    <view v-if="title || value || useSlot"
      :class="cn('relative flex justify-between font-medium bg-white leading-[1.43] text-black/85 text-base py-[13px] px-[15px]', border ? 'hairline--bottom' : '')">
      <!--左侧标题-->
      <view class="">
        <text v-if="title">{{ title }}</text>
        <slot v-else name="title"></slot>
      </view>
      <!--右侧标题-->
      <view class="text-[#262626] text-sm">
        <text v-if="value">{{ value }}</text>
        <slot v-else name="value"></slot>
      </view>
    </view>
    <view class="bg-white">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-cell-group',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { useChildren } from '../composables/useChildren'
import { CELL_GROUP_KEY, cellGroupProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(cellGroupProps)

const { linkChildren } = useChildren(CELL_GROUP_KEY)

linkChildren({ props })
</script>