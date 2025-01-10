<template>
  <div
    v-if="!lazyRender || inited"
    :class="cn(`wd-transition`, customClass, classes)"
    :style="style"
    @transitionend="onTransitionEnd"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-transition',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch, type CSSProperties } from 'vue'
import { cn, isObj, isPromise, pause } from '../common/util'
import { transitionProps, type TransitionName } from './types'
import { AbortablePromise } from '../common/AbortablePromise'

const getClassNames = (name?: TransitionName | TransitionName[]) => {
  let enter: string = `${props.enterClass} ${props.enterActiveClass}`
  let enterTo: string = `${props.enterToClass} ${props.enterActiveClass}`
  let leave: string = `${props.leaveClass} ${props.leaveActiveClass}`
  let leaveTo: string = `${props.leaveToClass} ${props.leaveActiveClass}`

  if (Array.isArray(name)) {
    for (let index = 0; index < name.length; index++) {
      enter = `wd-${name[index]}-enter wd-${name[index]}-enter-active ${enter}`
      enterTo = `wd-${name[index]}-enter-to wd-${name[index]}-enter-active ${enterTo}`
      leave = `wd-${name[index]}-leave wd-${name[index]}-leave-active ${leave}`
      leaveTo = `wd-${name[index]}-leave-to wd-${name[index]}-leave-active ${leaveTo}`
    }
  } else if (name) {
    enter = `wd-${name}-enter wd-${name}-enter-active ${enter}`
    enterTo = `wd-${name}-enter-to wd-${name}-enter-active ${enterTo}`
    leave = `wd-${name}-leave wd-${name}-leave-active ${leave}`
    leaveTo = `wd-${name}-leave-to wd-${name}-leave-active ${leaveTo}`
  }
  return {
    enter: enter,
    'enter-to': enterTo,
    leave: leave,
    'leave-to': leaveTo
  }
}

const props = defineProps(transitionProps)
const emit = defineEmits(['click', 'before-enter', 'enter', 'before-leave', 'leave', 'after-leave', 'after-enter'])

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
// 用于控制enter和leave的顺序执行
const enterPromise = ref<AbortablePromise<void> | null>(null)

// 动画进入的生命周期
const enterLifeCyclePromises = ref<AbortablePromise<unknown> | null>(null)

// 动画离开的生命周期
const leaveLifeCyclePromises = ref<AbortablePromise<unknown> | null>(null)

const style = computed<CSSProperties>(() => {
  return {
    ...props.customStyle,
    '-webkit-transition-duration': `${currentDuration.value}ms`,
    'transition-duration': `${currentDuration.value}ms`,
    ...(display.value || !props.destroy ? {} : { display: 'none' })
  }
})

onBeforeMount(() => {
  if (props.show) {
    enter()
  }
})

watch(
  () => props.show,
  (newVal) => {
    handleShow(newVal)
  },
  { deep: true }
)

function handleClick() {
  emit('click')
}

function handleShow(value: boolean) {
  if (value) {
    handleAbortPromise()
    enter()
  } else {
    leave()
  }
}
/**
 * 取消所有的promise
 */
function handleAbortPromise() {
  isPromise(enterPromise.value) && enterPromise.value.abort()
  isPromise(enterLifeCyclePromises.value) && enterLifeCyclePromises.value.abort()
  isPromise(leaveLifeCyclePromises.value) && leaveLifeCyclePromises.value.abort()
  enterPromise.value = null
  enterLifeCyclePromises.value = null
  leaveLifeCyclePromises.value = null
}

function enter() {
  enterPromise.value = new AbortablePromise(async (resolve) => {
    try {
      const classNames = getClassNames(props.name)
      const duration = isObj(props.duration) ? (props.duration as any).enter : props.duration
      status.value = 'enter'
      emit('before-enter')
      enterLifeCyclePromises.value = pause()
      await enterLifeCyclePromises.value
      emit('enter')
      classes.value = classNames.enter
      currentDuration.value = duration
      enterLifeCyclePromises.value = pause()
      await enterLifeCyclePromises.value
      inited.value = true
      display.value = true
      enterLifeCyclePromises.value = pause()
      await enterLifeCyclePromises.value
      enterLifeCyclePromises.value = null
      transitionEnded.value = false
      classes.value = classNames['enter-to']
      resolve()
    } catch (error) {
      /**
       *
       */
    }
  })
}
async function leave() {
  if (!enterPromise.value) {
    transitionEnded.value = false
    return onTransitionEnd()
  }
  try {
    await enterPromise.value
    if (!display.value) return
    const classNames = getClassNames(props.name)
    const duration = isObj(props.duration) ? (props.duration as any).leave : props.duration
    status.value = 'leave'
    emit('before-leave')
    currentDuration.value = duration
    leaveLifeCyclePromises.value = pause()
    await leaveLifeCyclePromises.value
    emit('leave')
    classes.value = classNames.leave
    leaveLifeCyclePromises.value = pause()
    await leaveLifeCyclePromises.value
    transitionEnded.value = false
    classes.value = classNames['leave-to']
    leaveLifeCyclePromises.value = setPromise(currentDuration.value)
    await leaveLifeCyclePromises.value
    leaveLifeCyclePromises.value = null
    onTransitionEnd()
    enterPromise.value = null
  } catch (error) {
    /**
     *
     */
  }
}

/**
 * 定时器promise化
 * @param duration 持续时间ms
 */
function setPromise(duration: number) {
  return new AbortablePromise<void>((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, duration)
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

  if (!props.show && display.value) {
    display.value = false
  }
}
</script>
<style>
.wd-transition {
  transition-timing-function: ease;
}

.wd-fade-enter,
.wd-fade-leave-to {
  opacity: 0;
}

.wd-fade-enter-active,
.wd-fade-leave-active {
  transition-property: opacity;
}

.wd-fade-up-enter,
.wd-fade-up-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}

.wd-fade-down-enter,
.wd-fade-down-leave-to {
  transform: translate3d(0, -100%, 0);
  opacity: 0;
}

.wd-fade-left-enter,
.wd-fade-left-leave-to {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}

.wd-fade-right-enter,
.wd-fade-right-leave-to {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}

.wd-slide-up-enter,
.wd-slide-up-leave-to {
  transform: translate3d(0, 100%, 0);
}

.wd-slide-down-enter,
.wd-slide-down-leave-to {
  transform: translate3d(0, -100%, 0);
}

.wd-slide-left-enter,
.wd-slide-left-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.wd-slide-right-enter,
.wd-slide-right-leave-to {
  transform: translate3d(100%, 0, 0);
}

.wd-zoom-in-enter,
.wd-zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.wd-zoom-out-enter,
.wd-zoom-out-leave-to {
  transform: scale(1.2);
  opacity: 0;
}

.wd-zoom-in-enter-active,
.wd-zoom-in-leave-active,
.wd-zoom-out-enter-active,
.wd-zoom-out-leave-active,
.wd-fade-up-enter-active,
.wd-fade-up-leave-active,
.wd-fade-down-enter-active,
.wd-fade-down-leave-active,
.wd-fade-left-enter-active,
.wd-fade-left-leave-active,
.wd-fade-right-enter-active,
.wd-fade-right-leave-active {
  transition-property: opacity, transform;
}

.wd-slide-up-enter-active,
.wd-slide-up-leave-active,
.wd-slide-down-enter-active,
.wd-slide-down-leave-active,
.wd-slide-left-enter-active,
.wd-slide-left-leave-active,
.wd-slide-right-enter-active,
.wd-slide-right-leave-active {
  transition-property: transform;
}
</style>
