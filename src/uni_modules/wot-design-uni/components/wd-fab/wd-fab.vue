<template>
  <div
    @touchmove.stop.prevent="handleTouchMove"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    :class="cn(`wd-fab fixed z-[99]`, customClass)"
    :style="rootStyle"
    @click.stop=""
  >
    <div @click.stop="" :class="inited ? 'visible' : 'invisible'" id="trigger">
      <slot name="trigger" v-if="$slots.trigger"></slot>
      <wd-button
        v-else
        @click="handleClick"
        custom-class="wd-fab__trigger min-w-[auto] box-border w-14 h-14 rounded-full"
        round
        :type="type"
        :disabled="disabled"
      >
        <wd-icon custom-class="wd-fab__icon text-xl" :name="isActive ? activeIcon : inactiveIcon"></wd-icon>
      </wd-button>
    </div>
    <wd-transition
      v-if="expandable"
      :enter-class="`wd-fab__transition-enter--${fabDirection}`"
      enter-active-class="wd-fab__transition-enter-active !transition-[0.3s_cubic-bezier(.4,0,.2,1)]"
      :leave-to-class="`wd-fab__transition-leave-to--${fabDirection}`"
      leave-active-class="wd-fab__transition-leave-active !transition-[0.3s_cubic-bezier(.4,0,.2,1)]"
      :custom-class="`wd-fab__actions absolute z-0 flex justify-center items-center py-3 px-0 wd-fab__actions--${fabDirection}`"
      :show="isActive"
      :duration="300"
    >
      <slot></slot>
    </wd-transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-fab',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { reactive } from 'vue'
import { type CSSProperties, computed, ref, watch, inject, getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'
import { cn, getRect, isDef, isH5, objToStyle } from '../common/util'
import { type Queue, queueKey } from '../composables/useQueue'
import { closeOther, pushToQueue, removeFromQueue } from '../common/clickoutside'
import { fabProps, type FabExpose } from './types'
import { useRaf } from '../composables/useRaf'

const props = defineProps(fabProps)
const emit = defineEmits(['update:active', 'click'])
const inited = ref<boolean>(false) // 是否初始化完成
const isActive = ref<boolean>(false) // 是否激活状态
const queue = inject<Queue | null>(queueKey, null)
const { proxy } = getCurrentInstance() as any

watch(
  () => props.active,
  (newValue) => {
    isActive.value = newValue
  },
  { immediate: true, deep: true }
)

watch(
  () => isActive.value,
  (newValue) => {
    if (newValue) {
      if (queue && queue.closeOther) {
        queue.closeOther(proxy)
      } else {
        closeOther(proxy)
      }
    }
  }
)

const fabDirection = ref(props.direction)

watch(
  () => props.direction,
  (direction) => (fabDirection.value = direction)
)

watch(
  () => props.position,
  () => initPosition()
)

const top = ref<number>(0)
const left = ref<number>(0)
const screen = reactive({ width: 0, height: 0 })
const fabSize = reactive({ width: 56, height: 56 })
const bounding = reactive({
  minTop: 0,
  minLeft: 0,
  maxTop: 0,
  maxLeft: 0
})

async function getBounding() {
  const sysInfo = uni.getSystemInfoSync()
  try {
    const trigerInfo = await getRect('#trigger', false, proxy)
    fabSize.width = trigerInfo.width || 56
    fabSize.height = trigerInfo.height || 56
  } catch (error) {
    console.log(error)
  }

  const { top = 16, left = 16, right = 16, bottom = 16 } = props.gap
  screen.width = sysInfo.windowWidth
  screen.height = isH5 ? sysInfo.windowTop + sysInfo.windowHeight : sysInfo.windowHeight
  bounding.minTop = isH5 ? sysInfo.windowTop + top : top
  bounding.minLeft = left
  bounding.maxLeft = screen.width - fabSize.width - right
  bounding.maxTop = screen.height - fabSize.height - bottom
}

function initPosition() {
  const pos = props.position
  const { minLeft, minTop, maxLeft, maxTop } = bounding
  if (pos === 'left-top') {
    top.value = minTop
    left.value = minLeft
  } else if (pos === 'right-top') {
    top.value = minTop
    left.value = maxLeft
  } else if (pos === 'left-bottom') {
    top.value = maxTop
    left.value = minLeft
  } else if (pos === 'right-bottom') {
    top.value = maxTop
    left.value = maxLeft
  }
}

// 按下时坐标相对于元素的偏移量
const touchOffset = reactive({ x: 0, y: 0 })
const attractTransition = ref<boolean>(false)
function handleTouchStart(e: TouchEvent) {
  if (props.draggable === false) return

  const touch = e.touches[0]
  touchOffset.x = touch.clientX - left.value
  touchOffset.y = touch.clientY - top.value
  attractTransition.value = false
}

function handleTouchMove(e: TouchEvent) {
  if (props.draggable === false) return

  const touch = e.touches[0]
  const { minLeft, minTop, maxLeft, maxTop } = bounding
  let x = touch.clientX - touchOffset.x
  let y = touch.clientY - touchOffset.y

  if (x < minLeft) x = minLeft
  else if (x > maxLeft) x = maxLeft

  if (y < minTop) y = minTop
  else if (y > maxTop) y = maxTop

  top.value = y
  left.value = x
}

function handleTouchEnd() {
  if (props.draggable === false) return

  const screenCenterX = screen.width / 2
  const fabCenterX = left.value + fabSize.width / 2
  attractTransition.value = true
  if (fabCenterX < screenCenterX) {
    left.value = bounding.minLeft
    fabDirection.value = 'right'
  } else {
    left.value = bounding.maxLeft
    fabDirection.value = 'left'
  }
}

const rootStyle = computed(() => {
  const style: CSSProperties = {
    top: top.value + 'px',
    left: left.value + 'px',
    transition: attractTransition.value ? 'all ease 0.3s' : 'none'
  }
  if (isDef(props.zIndex)) {
    style['z-index'] = props.zIndex
  }
  return `${objToStyle(style)};${props.customStyle}`
})

onMounted(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }

  const { start } = useRaf(async () => {
    await getBounding()
    initPosition()
    inited.value = true
  })
  start()
})

onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

function handleClick() {
  if (props.disabled) {
    return
  }
  if (!props.expandable) {
    emit('click')
    return
  }
  isActive.value = !isActive.value
  emit('update:active', isActive.value)
}

function open() {
  isActive.value = true
  emit('update:active', true)
}

function close() {
  isActive.value = false
  emit('update:active', false)
}

defineExpose<FabExpose>({
  open,
  close
})
</script>

<style>
.wd-fab {
  position: fixed;
  z-index: 99;
}

.wd-fab__trigger {
  min-width: auto !important;
  box-sizing: border-box;
  width: var(--wot-fab-trigger-width, 56px) !important;
  height: var(--wot-fab-trigger-height, 56px) !important;
  border-radius: calc(var(--wot-fab-trigger-height, 56px) / 2) !important;
}

.wd-fab .wd-fab__actions {
  position: absolute;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--wot-actions-padding, 12px) 0;
}

.wd-fab .wd-fab__actions--left,
.wd-fab .wd-fab__actions--right {
  height: 100%;
  top: 0;
  padding: 0 var(--wot-actions-padding, 12px);
}

.wd-fab .wd-fab__actions--left {
  flex-direction: row-reverse;
  right: 100%;
}

.wd-fab .wd-fab__actions--right {
  flex-direction: row;
  left: 100%;
}

.wd-fab .wd-fab__actions--top,
.wd-fab .wd-fab__actions--bottom {
  width: 100%;
  left: 0;
}

.wd-fab .wd-fab__actions--top {
  flex-direction: column-reverse;
  bottom: 100%;
}

.wd-fab .wd-fab__actions--bottom {
  flex-direction: column;
  top: 100%;
}

.wd-fab .wd-fab__transition-enter-active,
.wd-fab .wd-fab__transition-leave-active {
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.wd-fab .wd-fab__transition-enter--top {
  opacity: 0;
  -webkit-transform: translateY(40px);
  transform: translateY(40px);
}

.wd-fab .wd-fab__transition-enter--bottom {
  opacity: 0;
  -webkit-transform: translateY(-40px);
  transform: translateY(-40px);
}

.wd-fab .wd-fab__transition-enter--left {
  opacity: 0;
  -webkit-transform: translateX(40px);
  transform: translate(40px);
}

.wd-fab .wd-fab__transition-enter--right {
  opacity: 0;
  -webkit-transform: translateX(-40px);
  transform: translate(-40px);
}

.wd-fab .wd-fab__transition-leave-to--top {
  opacity: 0;
  -webkit-transform: translateY(40px);
  transform: translateY(40px);
}

.wd-fab .wd-fab__transition-leave-to--bottom {
  opacity: 0;
  -webkit-transform: translateY(-40px);
  transform: translateY(-40px);
}

.wd-fab .wd-fab__transition-leave-to--left {
  opacity: 0;
  -webkit-transform: translateX(40px);
  transform: translate(40px);
}

.wd-fab .wd-fab__transition-leave-to--right {
  opacity: 0;
  -webkit-transform: translateX(-40px);
  transform: translate(-40px);
}

.wd-fab__icon {
  font-size: var(--wot-fab-icon-fs, 20px);
}

.fab[data-v-e32de168] {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 2.75rem;
}

.fab[data-v-e32de168] .custom-button {
  min-width: auto !important;
  box-sizing: border-box;
  width: 32px !important;
  height: 32px !important;
  border-radius: 16px !important;
  margin: 0.25rem;
}

.fab[data-v-e32de168] .custom-radio {
  height: 32px !important;
  line-height: 32px !important;
}
</style>
