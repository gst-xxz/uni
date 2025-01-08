<template>
  <div class="wd-popup-wrapper">
    <wd-overlay
      v-if="modal"
      :show="modelValue"
      :z-index="zIndex"
      :lock-scroll="lockScroll"
      :duration="duration"
      :custom-style="modalStyle"
      @click="handleClickModal"
      @touchmove="noop"
    />
    <wd-transition
      :lazy-render="lazyRender"
      :custom-class="rootClass"
      :custom-style="style"
      :duration="duration"
      :show="modelValue"
      :name="transitionName"
      :destroy="hideWhenClose"
      @before-enter="emit('before-enter')"
      @enter="emit('enter')"
      @after-enter="emit('after-enter')"
      @before-leave="emit('before-leave')"
      @leave="emit('leave')"
      @after-leave="emit('after-leave')"
    >
      <slot />
      <wd-icon v-if="closable" custom-class="wd-popup__close" name="add" @click="close" />
    </wd-transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-popup',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import { popupProps } from './types'
import type { TransitionName } from '../wd-transition/types'

const props = defineProps(popupProps)
const emit = defineEmits([
  'update:modelValue',
  'before-enter',
  'enter',
  'before-leave',
  'leave',
  'after-leave',
  'after-enter',
  'click-modal',
  'close'
])

/**
 * 弹出位置
 */
const transitionName = computed<TransitionName | TransitionName[]>(() => {
  if (props.transition) {
    return props.transition
  }
  if (props.position === 'center') {
    return ['zoom-in', 'fade']
  }
  if (props.position === 'left') {
    return 'slide-left'
  }
  if (props.position === 'right') {
    return 'slide-right'
  }
  if (props.position === 'bottom') {
    return 'slide-up'
  }
  if (props.position === 'top') {
    return 'slide-down'
  }
  return 'slide-up'
})

const safeBottom = ref<number>(0)

const style = computed(() => {
  return `z-index:${props.zIndex}; padding-bottom: ${safeBottom.value}px;${props.customStyle}`
})

const rootClass = computed(() => {
  return `wd-popup wd-popup--${props.position} ${!props.transition && props.position === 'center' ? 'is-deep' : ''} ${props.customClass || ''}`
})

onBeforeMount(() => {
  if (props.safeAreaInsetBottom) {
    const { safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync()

    if (safeArea) {
      // #ifdef MP-WEIXIN
      safeBottom.value = screenHeight - (safeArea!.bottom || 0)
      // #endif
      // #ifndef MP-WEIXIN
      safeBottom.value = safeAreaInsets ? safeAreaInsets.bottom : 0
      // #endif
    } else {
      safeBottom.value = 0
    }
  }
})

function handleClickModal() {
  emit('click-modal')
  if (props.closeOnClickModal) {
    close()
  }
}

function close() {
  emit('close')
  emit('update:modelValue', false)
}
function noop() {}
</script>
<style>
.wd-popup-wrapper .wd-popup {
  position: fixed;
  max-height: 100%;
  overflow-y: auto;
  background: #fff;
}

.wd-popup__close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--wot-popup-close-color, #666);
  font-size: var(--wot-popup-close-size, 24px);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.wd-popup--center {
  left: 50%;
  top: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  -webkit-transform-origin: 0% 0%;
  transform-origin: 0% 0%;
}

.wd-popup--center.wd-zoom-in-enter,
.wd-popup--center.wd-zoom-in-leave-to {
  -webkit-transform: scale(0.8) translate3d(-50%, -50%, 0) !important;
  transform: scale(0.8) translate3d(-50%, -50%, 0) !important;
}

.wd-popup--center.is-deep.wd-zoom-in-enter,
.wd-popup--center.is-deep.wd-zoom-in-leave-to {
  -webkit-transform: scale(0.1) translate3d(-50%, -50%, 0) !important;
  transform: scale(0.1) translate3d(-50%, -50%, 0) !important;
}

.wd-popup--left {
  top: 0;
  bottom: 0;
  left: 0;
}

.wd-popup--right {
  top: 0;
  right: 0;
  bottom: 0;
}

.wd-popup--top {
  top: 0;
  left: 0;
  right: 0;
}

.wd-popup--bottom {
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
