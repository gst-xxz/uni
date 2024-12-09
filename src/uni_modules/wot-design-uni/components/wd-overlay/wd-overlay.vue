<template>
  <wd-transition :show="show" name="fade" custom-class="wd-overlay fixed left-0 right-0 top-0 bottom-0"
    :duration="duration" :custom-style="`z-index: ${zIndex}; ${customStyle}`" @click="handleClick"
    @touchmove.stop.prevent="lockScroll ? noop : ''">
    <slot></slot>
  </wd-transition>
</template>
<script lang="ts">
export default {
  name: 'wd-overlay',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { overlayProps } from './types'
// #ifdef H5
import useLockScroll from '../composables/useLockScroll'
// #endif

const props = defineProps(overlayProps)

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}

function noop() { }

// #ifdef H5
useLockScroll(() => props.show && props.lockScroll)
// #endif
</script>

<style>
.wot-theme-dark .wd-overlay {
  background: var(--wot-overlay-bg-dark, rgba(0, 0, 0, .75))
}

.wd-overlay {
  background: var(--wot-overlay-bg, rgba(0, 0, 0, .65))
}
</style>
