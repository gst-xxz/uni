<template>
  <wd-transition :show="show" name="fade">
    <view
      :class="[`wd-backtop bg-backtop-bg text-gray-8 ${customClass} w-10 h-10 flex justify-center items-center fixed`, { 'rounded-full': shape === 'circle', 'rounded': shape === 'square' }]"
      :style="`z-index: ${zIndex}; bottom: ${bottom}px; right: ${right}px; ${customStyle}`" @click="handleBacktop">
      <slot v-if="$slots.default"></slot>
      <wd-icon v-else custom-class="text-xl" name="arrow-up" :custom-style="iconStyle" />
    </view>
  </wd-transition>
</template>

<script lang="ts">
export default {
  name: 'wd-backtop',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import wdTransition from '../wd-transition/wd-transition.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import { computed } from 'vue'
import { backtopProps } from './types'

const props = defineProps(backtopProps)

const show = computed(() => props.scrollTop > props.top)

function handleBacktop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: props.duration
  })
}
</script>
