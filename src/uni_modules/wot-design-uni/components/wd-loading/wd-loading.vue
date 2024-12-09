<template>
  <div :class="cn(`wd-loading wd-loading-${type}`, customClass)">
    <div :class="cn(`wd-loading__spinner wd-loading__spinner--${type}`)" :style="{
      color: color,
      width: size,
      height: size
    }">
      <div v-if="type === 'spinner'" v-for="(item, index) in array12" :key="index" class="wd-loading__dot" />
    </div>
    <div class="wd-loading__text" :style="{
      fontSize: size
    }">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-loading',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { computed } from 'vue';
import { cn } from '../common/util';
import { loadingProps } from './types';

const props = defineProps(loadingProps)

const size = computed(() => {
  return typeof props.size === 'string' ? props.size : `${props.size}px`
})

const array12 = computed(() => {
  return new Array(12).fill(0)
})


</script>
<style>
@keyframes wd-rotate {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.wd-loading {
  align-items: center;
  color: var(--loading-spinner-color, #c8c9cc);
  display: inline-flex;
  justify-content: center
}

.wd-loading__spinner {
  animation: wd-rotate var(--loading-spinner-animation-duration, .8s) linear infinite;
  box-sizing: border-box;
  height: var(--loading-spinner-size, 30px);
  max-height: 100%;
  max-width: 100%;
  position: relative;
  width: var(--loading-spinner-size, 30px)
}

.wd-loading__spinner--spinner {
  animation-timing-function: steps(12)
}

.wd-loading__spinner--circular {
  border: 1px solid transparent;
  border-radius: 100%;
  border-top-color: initial
}

.wd-loading__text {
  color: var(--loading-text-color, #969799);
  font-size: var(--loading-text-font-size, 14px);
  line-height: var(--loading-text-line-height, 20px);
  margin-left: var(--padding-xs, 8px)
}

.wd-loading__text:empty {
  display: none
}

.wd-loading--vertical {
  flex-direction: column
}

.wd-loading--vertical .wd-loading__text {
  margin: var(--padding-xs, 8px) 0 0
}

.wd-loading__dot {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%
}

.wd-loading__dot:before {
  background-color: currentColor;
  border-radius: 40%;
  content: " ";
  display: block;
  height: 25%;
  margin: 0 auto;
  width: 2px
}

.wd-loading__dot:first-of-type {
  opacity: 1;
  transform: rotate(30deg)
}

.wd-loading__dot:nth-of-type(2) {
  opacity: .9375;
  transform: rotate(60deg)
}

.wd-loading__dot:nth-of-type(3) {
  opacity: .875;
  transform: rotate(90deg)
}

.wd-loading__dot:nth-of-type(4) {
  opacity: .8125;
  transform: rotate(120deg)
}

.wd-loading__dot:nth-of-type(5) {
  opacity: .75;
  transform: rotate(150deg)
}

.wd-loading__dot:nth-of-type(6) {
  opacity: .6875;
  transform: rotate(180deg)
}

.wd-loading__dot:nth-of-type(7) {
  opacity: .625;
  transform: rotate(210deg)
}

.wd-loading__dot:nth-of-type(8) {
  opacity: .5625;
  transform: rotate(240deg)
}

.wd-loading__dot:nth-of-type(9) {
  opacity: .5;
  transform: rotate(270deg)
}

.wd-loading__dot:nth-of-type(10) {
  opacity: .4375;
  transform: rotate(300deg)
}

.wd-loading__dot:nth-of-type(11) {
  opacity: .375;
  transform: rotate(330deg)
}

.wd-loading__dot:nth-of-type(12) {
  opacity: .3125;
  transform: rotate(1turn)
}
</style>