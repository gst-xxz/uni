<template>
  <view :class="cn(
    'my-0 mx-[15px] bg-white text-sm leading-[1.1] rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.02)]',
    type == 'rectangle' ? 'mx-0 rounded-none shadow-none' : '',
    customClass
  )" :style="customStyle">
    <view :class="cn('py-4 px-0 text-black/85 text-base', { 'text-sm': type === 'rectangle' }, customTitleClass)">
      <view class="">
        <text v-if="title">{{ title }}</text>
        <slot v-else name="title"></slot>
      </view>
    </view>
    <view
      :class="cn('text-sm leading-[1.1]', { 'relative py-4 px-0 hairline--top after:!border-[rgba(0,0,0,0.09)]': type === 'rectangle' }, customContentClass)">
      <slot></slot>
    </view>
    <view :class="cn('text-right pt-3 px-0 pb-4', {
      'relative py-3 px-0 hairline--top after:!border-[rgba(0,0,0,0.09)]': type === 'rectangle'
    }, customFooterClass)">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-card',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { cardProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils'

defineProps(cardProps)
</script>
