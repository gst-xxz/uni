<template>
  <div
    :class="
      cn(
        `wd-floating-panel fixed bottom-0 left-0 z-50 flex flex-col box-border w-screen rounded-t-2xl bg-white touch-none will-change-transform`,
        'after:absolute after:bottom-[-100vh] after:block after:w-screen after:h-screen after:bg-inherit',
        customClass,
        safeAreaInsetBottom ? 'is-safe pb-safe' : ''
      )
    "
    :style="rootStyle"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div :class="cn(`wd-floating-panel__header flex justify-center items-center h-[30px] cursor-grab select-none`)">
      <div :class="cn(`wd-floating-panel__header-bar w-5 h-[3px] bg-[#c8c9cc] rounded`)"></div>
    </div>

    <scroll-view
      :class="cn(`wd-floating-panel__content flex-1 min-w-0 min-h-0 bg-white`)"
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
import { addUnit, closest, cn } from '../common/util'
import { useTouch } from '../composables/useTouch'
import { ease } from './utils'

const touch = useTouch()

const props = defineProps(floatingPanelProps)
const emit = defineEmits(['update:height', 'height-change'])

const heightValue = ref<number>(props.height)

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
    ...props.customStyle,
    height: addUnit(boundary.value.max),
    transform: `translateY(calc(100% + ${addUnit(-heightValue.value)}))`,
    transition: !dragging.value ? `transform ${props.duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28)` : 'none'
  }

  return style
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
  updateHeight(-ease(moveY, boundary.value.min, boundary.value.max))
}

const handleTouchEnd = () => {
  dragging.value = false
  updateHeight(closest(anchors.value, heightValue.value))

  if (heightValue.value !== -startY) {
    emit('height-change', { height: heightValue.value })
  }
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
