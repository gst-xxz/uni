<template>
  <view
    :class="['wd-card mb-3 my-0 mx-[15px]', type == 'rectangle' ? 'is-rectangle mx-0 rounded-none shadow-none' : '', customClass]"
    :style="customStyle">
    <view :class="['wd-card__title-content', customTitleClass]">
      <view class="wd-card__title">
        <text v-if="title">{{ title }}</text>
        <slot v-else name="title"></slot>
      </view>
    </view>
    <view :class="`wd-card__content ${customContentClass}`">
      <slot></slot>
    </view>
    <view :class="`wd-card__footer text-right ${customFooterClass}`">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'wd-card',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { cardProps } from './types'

defineProps(cardProps)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
