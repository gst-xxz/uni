<template>
  <view :class="cn('relative user-select-none my-0 mx-4', customClass)" :style="customStyle">
    <view @touchstart="onTouchStart" class="flex w-full cursor-pointer h-[50px]">
      <view v-for="(_, index) in length" :key="index"
        :class="cn('not-last-child relative flex flex-1 items-center justify-center h-full leading-[1.2] bg-white text-xl text-gray-8', { 'is-border border border-solid border-[#ebedf0] first:rounded-l-md last:rounded-r-md': !gutter })">
        <view v-if="focused && index === modelValue.length"
          class="absolute top-1/2 left-1/2 w-[1px] h-[40%] bg-gray-8 -translate-x-1/2 -translate-y-1/2 animate-[1s_cursor-flicker_infinite]">
        </view>
        <view v-else>
          <view :style="{ visibility: mask && modelValue[index] ? 'visible' : 'hidden' }"
            class="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gray-8 -translate-x-1/2 -translate-y-1/2 visibility-hidden rounded-full">
          </view>
          <text v-if="!mask && modelValue[index]">{{ modelValue[index] }}</text>
        </view>
      </view>
    </view>
    <view v-if="info || errorInfo"
      :class="cn('text-center mt-4 text-sm text-[#909399]', errorInfo ? 'text-danger' : '')">
      {{ errorInfo || info }}
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-password-input',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { passwordInputProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

defineProps(passwordInputProps)

const emit = defineEmits(['focus'])

function onTouchStart(event: Event) {
  emit('focus', event)
}
</script>

<style lang="scss">
.not-last-child {
  &:not(:last-child) {
    border-right: none;
  }
}
</style>