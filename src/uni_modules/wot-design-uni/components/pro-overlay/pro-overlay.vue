<template>
  <pro-transition :show="show" name="fade" custom-class="fixed left-0 right-0 top-0 bottom-0 bg-overlay-bg"
    :duration="duration" :custom-style="`z-index: ${zIndex}; ${customStyle}`" @click="handleClick"
    @touchmove.stop.prevent="lockScroll ? noop : ''">
    <slot></slot>
  </pro-transition>
</template>
<script lang="ts">
export default {
  name: 'pro-overlay',
  options: {
    virtualHost: true,
    addGlobalClass: true,
  }
}
</script>

<script lang="ts" setup>
import useLockScroll from '../composables/useLockScroll'
import { overlayProps } from './types'

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
