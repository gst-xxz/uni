<template>
  <div
    :class="cn(`wd-floating-panel`, customClass, safeAreaInsetBottom ? 'is-safe pb-safe' : '')"
    :style="rootStyle"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div :class="`wd-floating-panel__header`">
      <div :class="`wd-floating-panel__header-bar`"></div>
    </div>

    <scroll-view
      :class="`wd-floating-panel__content`"
      data-id="content"
      :show-scrollbar="showScrollbar"
      scroll-y
      @touchmove.stop.prevent="handleTouchMove"
    >
      <slot />
    </scroll-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-floating-panel',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch, type CSSProperties } from 'vue'
import { floatingPanelProps } from './type'
import { addUnit, closest, cn, objToStyle } from '../common/util'
import { useTouch } from '../composables/useTouch'

const touch = useTouch()

const props = defineProps(floatingPanelProps)
const emit = defineEmits(['update:height', 'height-change'])

const heightValue = ref<number>(props.height)

const DAMP = 0.2 // 阻尼系数
let startY: number // 起始位置
const windowHeight = ref<number>(0)
const dragging = ref<boolean>(false) // 是否正在拖拽

const boundary = computed(() => ({
  min: props.anchors[0] ? props.anchors[0] : 100,
  max: props.anchors[props.anchors.length - 1] ? props.anchors[props.anchors.length - 1] : Math.round(windowHeight.value * 0.6)
}))

const anchors = computed(() => (props.anchors.length >= 2 ? props.anchors : [boundary.value.min, boundary.value.max]))

const rootStyle = computed(() => {
  const style: CSSProperties = {
    height: addUnit(boundary.value.max),
    transform: `translateY(calc(100% + ${addUnit(-heightValue.value)}))`,
    transition: !dragging.value ? `transform ${props.duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28)` : 'none'
  }

  return `${objToStyle(style)};${props.customStyle}`
})

const updateHeight = (value: number) => {
  heightValue.value = value
  emit('update:height', value)
}

const handleTouchStart = (event: TouchEvent) => {
  touch.touchStart(event)
  dragging.value = true
  startY = -heightValue.value
}

const handleTouchMove = (event: TouchEvent) => {
  const target = event.currentTarget as any
  if (target.dataset.id == 'content') {
    if (!props.contentDraggable) return
  }
  touch.touchMove(event)
  const moveY = touch.deltaY.value + startY
  updateHeight(-ease(moveY))
}

const handleTouchEnd = () => {
  dragging.value = false
  updateHeight(closest(anchors.value, heightValue.value))

  if (heightValue.value !== -startY) {
    emit('height-change', { height: heightValue.value })
  }
}

const ease = (y: number) => {
  const absDistance = Math.abs(y)
  const { min, max } = boundary.value

  if (absDistance > max) {
    return -(max + (absDistance - max) * DAMP)
  }

  if (absDistance < min) {
    return -(min - (min - absDistance) * DAMP)
  }

  return y
}

watch(
  () => props.height,
  (value) => {
    heightValue.value = value
  }
)

watch(
  boundary,
  () => {
    updateHeight(closest(anchors.value, heightValue.value))
  },
  { immediate: true }
)

onBeforeMount(() => {
  const { windowHeight: _windowHeight } = uni.getSystemInfoSync()
  windowHeight.value = _windowHeight
})
</script>

<style>
.wd-floating-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: var(--wot-floating-panel-z-index, 99);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100vw;
  border-top-left-radius: var(--wot-floating-panel-radius, 16px);
  border-top-right-radius: var(--wot-floating-panel-radius, 16px);
  background-color: var(--wot-floating-panel-bg, var(--wot-color-white, rgb(255, 255, 255)));
  touch-action: none;
  will-change: transform;
}

.wd-floating-panel.is-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.wd-floating-panel:after {
  position: absolute;
  bottom: -100vh;
  display: block;
  width: 100vw;
  height: 100vh;
  content: '';
  background-color: inherit;
}

.wd-floating-panel__header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--wot-floating-panel-header-height, 30px);
  cursor: grab;
  -webkit-user-select: none;
  user-select: none;
}

.wd-floating-panel__header-bar {
  width: var(--wot-floating-panel-bar-width, 20px);
  height: var(--wot-floating-panel-bar-height, 3px);
  background-color: var(--wot-floating-panel-bar-bg, var(--wot-color-gray-5, #c8c9cc));
  border-radius: var(--wot-floating-panel-bar-radius, 4px);
}

.wd-floating-panel__content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background-color: var(--wot-floating-panel-content-bg, var(--wot-color-white, rgb(255, 255, 255)));
}
</style>
