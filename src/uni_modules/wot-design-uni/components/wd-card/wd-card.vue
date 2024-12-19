<template>
  <div :class="cn(['wd-card', type == 'rectangle' ? 'is-rectangle' : '', customClass])" :style="customStyle">
    <div :class="cn(['wd-card__title-content', customTitleClass])">
      <div class="wd-card__title">
        <span v-if="title">{{ title }}</span>
        <slot v-else name="title"></slot>
      </div>
    </div>
    <div :class="cn(`wd-card__content`, customContentClass)">
      <slot></slot>
    </div>
    <div :class="cn(`wd-card__footer`, customFooterClass)">
      <slot name="footer"></slot>
    </div>
  </div>
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
import { cn } from '../common/util'
import { cardProps } from './types'

defineProps(cardProps)
</script>

<style lang="scss">
@import './index.scss';
</style>
