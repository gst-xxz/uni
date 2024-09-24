<template>
  <pro-overlay v-if="modal" :show="modelValue" :z-index="zIndex" :lock-scroll="lockScroll" :duration="duration"
    :custom-style="modalStyle" @click="handleClickModal" @touchmove="noop" />
  <view v-if="!lazyRender || inited" :class="[
    `pro-popup`, 'fixed max-h-full overflow-auto bg-white',
    {
      '-left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2': props.position === 'center',
      'top-0 left-0 bottom-0': props.position === 'left',
      'top-0 right-0 bottom-0': props.position === 'right',
      'top-0 left-0 right-0': props.position === 'top',
      'right-0 bottom-0 left-0': props.position === 'bottom',
    },
    customClass,
    classes
  ]" :style="style" @transitionend="onTransitionEnd">
    <slot />
    <pro-icon v-if="closable" custom-class="pro-popup__close absolute top-2.5 right-2.5 -rotate-45 text-[#666] text-xl"
      name="add" @click="close" />
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-popup',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { computed, onBeforeMount, ref, watch } from 'vue'
import { isObj, requestAnimationFrame } from '../common/util'
import { popupProps } from './types'

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

const getClassNames = (name?: string) => {
  if (!name) {
    return {
      enter: 'enter-class enter-active-class',
      'enter-to': 'enter-to-class enter-active-class',
      leave: 'leave-class leave-active-class',
      'leave-to': 'leave-to-class leave-active-class'
    }
  }

  return {
    enter: `pro-${name}-enter pro-${name}-enter-active`,
    'enter-to': `pro-${name}-enter-to pro-${name}-enter-active`,
    leave: `pro-${name}-leave pro-${name}-leave-active`,
    'leave-to': `pro-${name}-leave-to pro-${name}-leave-active`
  }
}

// 初始化是否完成
const inited = ref<boolean>(false)
// 是否显示
const display = ref<boolean>(false)
// 当前动画状态
const status = ref<string>('')
// 动画是否结束
const transitionEnded = ref<boolean>(false)
// 动画持续时间
const currentDuration = ref<number>(300)
// 类名
const classes = ref<string>('')

const safeBottom = ref<number>(0)

const name = ref<string>('') // 动画名

const style = computed(() => {
  return `z-index: ${props.zIndex}; padding-bottom: ${safeBottom.value}px; -webkit-transition-duration: ${currentDuration.value
    }ms; transition-duration: ${currentDuration.value}ms; ${display.value || !props.hideWhenClose ? '' : 'display: none;'} ${props.customStyle}`
})

onBeforeMount(() => {
  observerTransition()
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
  if (props.modelValue) {
    enter()
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    observermodelValue(newVal)
  },
  { deep: true, immediate: true }
)

watch(
  [() => props.position, () => props.transition],
  () => {
    observerTransition()
  },
  { deep: true, immediate: true }
)

function observermodelValue(value: boolean) {
  value ? enter() : leave()
}

function enter() {
  const classNames = getClassNames(props.transition || props.position)
  const duration = props.transition === 'none' ? 0 : isObj(props.duration) ? (props.duration as any).enter : props.duration
  status.value = 'enter'
  emit('before-enter')

  requestAnimationFrame(() => {
    emit('enter')
    classes.value = classNames.enter
    currentDuration.value = duration
    requestAnimationFrame(() => {
      inited.value = true
      display.value = true
      requestAnimationFrame(() => {
        transitionEnded.value = false
        classes.value = classNames['enter-to']
      })
    })
  })
}
function leave() {
  if (!display.value) return
  const classNames = getClassNames(props.transition || props.position)
  const duration = props.transition === 'none' ? 0 : isObj(props.duration) ? (props.duration as any).leave : props.duration
  status.value = 'leave'
  emit('before-leave')

  requestAnimationFrame(() => {
    emit('leave')
    classes.value = classNames.leave
    currentDuration.value = duration

    requestAnimationFrame(() => {
      transitionEnded.value = false
      const timer = setTimeout(() => {
        onTransitionEnd()
        clearTimeout(timer)
      }, currentDuration.value)
      classes.value = classNames['leave-to']
    })
  })
}

function onTransitionEnd() {
  if (transitionEnded.value) return

  transitionEnded.value = true
  if (status.value === 'leave') {
    // 离开后触发
    emit('after-leave')
  } else if (status.value === 'enter') {
    // 进入后触发
    emit('after-enter')
  }
  if (!props.modelValue && display.value) {
    display.value = false
  }
}

function observerTransition() {
  const { transition, position } = props
  name.value = transition || position
}

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
function noop() { }
</script>
<style lang="scss">
.pro-center-enter-active,
.pro-center-leave-active {
  transition-property: opacity;
}

.pro-center-enter,
.pro-center-leave-to {
  opacity: 0;
}

.pro-top-enter-active,
.pro-top-leave-active,
.pro-bottom-enter-active,
.pro-bottom-leave-active,
.pro-left-enter-active,
.pro-left-leave-active,
.pro-right-enter-active,
.pro-right-enter-active {
  transition-property: transform;
}

.pro-top-enter,
.pro-top-leave-to {
  transform: translate3d(0, -100%, 0);
}

.pro-bottom-enter,
.pro-bottom-leave-to {
  transform: translate3d(0, 100%, 0);
}

.pro-left-enter,
.pro-left-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.pro-right-enter,
.pro-right-leave-to {
  transform: translate3d(100%, 0, 0);
}

.pro-zoom-in-enter-active,
.pro-zoom-in-leave-active {
  transition-property: opacity, transform;
  transform-origin: center center;
}

.pro-zoom-in-enter,
.pro-zoom-in-leave-to {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.7);
}
</style>
