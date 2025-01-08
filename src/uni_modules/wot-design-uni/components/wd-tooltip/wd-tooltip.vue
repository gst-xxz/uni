<template>
  <div :class="cn(`wd-tooltip ${customClass}`)" :style="customStyle" id="tooltip" @click.stop="popover.noop">
    <!-- 用于为渲染获取宽高的元素 -->
    <div class="wd-tooltip__pos wd-tooltip__hidden" id="pos">
      <div class="wd-tooltip__container custom-pop">
        <div v-if="!useContentSlot" class="wd-tooltip__inner">{{ content }}</div>
      </div>
    </div>
    <wd-transition custom-class="wd-tooltip__pos" :custom-style="popover.popStyle.value" :show="showTooltip" name="fade" :duration="200">
      <div class="wd-tooltip__container custom-pop">
        <div v-if="visibleArrow" :class="cn(`wd-tooltip__arrow ${popover.arrowClass.value} ${customArrow}`)" :style="popover.arrowStyle.value"></div>
        <!-- 普通模式 -->
        <div v-if="!useContentSlot" class="wd-tooltip__inner">{{ content }}</div>
        <!-- 用户自定义样式 -->
        <slot name="content" v-else />
      </div>
      <wd-icon v-if="showClose" name="close" custom-class="wd-tooltip__close-icon" @click="toggle"></wd-icon>
    </wd-transition>
    <div @click="toggle" class="wd-tooltip__target" id="target">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-tooltip',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePopover } from '../composables/usePopover'
import { closeOther, pushToQueue, removeFromQueue } from '../common/clickoutside'
import { type Queue, queueKey } from '../composables/useQueue'
import { tooltipProps, type TooltipExpose } from './types'
import { cn } from '../common/util'

const props = defineProps(tooltipProps)
const emit = defineEmits(['update:modelValue', 'menuclick', 'change', 'open', 'close'])

const popover = usePopover()
const queue = inject<Queue | null>(queueKey, null)
const selector: string = 'tooltip'
const { proxy } = getCurrentInstance() as any
const showTooltip = ref<boolean>(false) // 控制tooltip显隐

watch(
  () => props.content,
  (newVal) => {
    if (newVal === null || newVal === undefined) {
      // eslint-disable-next-line prettier/prettier
      console.error('[wot-design] warning(wd-tooltip): content can\'t be null or undefined')
    }
  }
)

watch(
  () => props.placement,
  () => {
    popover.init(props.placement, props.visibleArrow, selector)
  }
)

watch(
  () => props.modelValue,
  (newValue) => {
    showTooltip.value = newValue
  }
)

watch(
  () => showTooltip.value,
  (newValue) => {
    if (newValue) {
      popover.control(props.placement, props.offset)
      if (queue && queue.closeOther) {
        queue.closeOther(proxy)
      } else {
        closeOther(proxy)
      }
    }
    popover.showStyle.value = newValue ? 'display: inline-block;' : 'display: none;'
    emit('change', { show: newValue })
    emit(`${newValue ? 'open' : 'close'}`)
  }
)

onMounted(() => {
  popover.init(props.placement, props.visibleArrow, selector)
})

onBeforeMount(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }
  popover.showStyle.value = props.modelValue ? 'opacity: 1;' : 'opacity: 0;'
})

onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

function toggle() {
  if (props.disabled) return
  updateModelValue(!showTooltip.value)
}

function open() {
  updateModelValue(true)
}

function close() {
  updateModelValue(false)
}

function updateModelValue(value: boolean) {
  showTooltip.value = value
  emit('update:modelValue', value)
}

defineExpose<TooltipExpose>({
  open,
  close
})
</script>
<style>
.wd-tooltip {
  position: relative;
  display: inline-block;
}

.wd-tooltip__pos {
  position: absolute;
  min-width: 138px;
  min-height: 36px;
  font-size: var(--wot-tooltip-fs, var(--wot-fs-content, 14px));
  -webkit-backdrop-filter: blur(var(--wot-tooltip-blur, 10px));
  backdrop-filter: blur(var(--wot-tooltip-blur, 10px));
  background-clip: padding-box;
  border-radius: var(--wot-tooltip-radius, 8px);
  background: var(--wot-tooltip-bg, rgba(38, 39, 40, 0.8));
  color: var(--wot-tooltip-color, var(--wot-color-white, rgb(255, 255, 255)));
  text-align: center;
  box-sizing: border-box;
  z-index: var(--wot-tooltip-z-index, 500);
}

.wd-tooltip__hidden {
  left: -100vw;
  bottom: -100vh;
  visibility: hidden;
}

.wd-tooltip__container {
  line-height: var(--wot-tooltip-line-height, 18px);
  font-size: var(--wot-tooltip-fs, var(--wot-fs-content, 14px));
}

.wd-tooltip__inner {
  padding: var(--wot-tooltip-padding, 9px 20px);
  white-space: nowrap;
  line-height: var(--wot-tooltip-line-height, 18px);
}

.wd-tooltip__close-icon {
  font-size: 12px;
  position: absolute;
  right: -8px;
  top: -10px;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  padding: 10px;
}

.wd-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.wd-tooltip__arrow-down {
  border-left: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-right: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-top: var(--wot-tooltip-arrow-size, 5px) solid var(--wot-tooltip-bg, rgba(38, 39, 40, 0.8));
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  bottom: calc(-1 * var(--wot-tooltip-arrow-size, 5px));
}

.wd-tooltip__arrow-up {
  border-left: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-right: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-bottom: var(--wot-tooltip-arrow-size, 5px) solid var(--wot-tooltip-bg, rgba(38, 39, 40, 0.8));
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  top: calc(-1 * var(--wot-tooltip-arrow-size, 5px));
}

.wd-tooltip__arrow-left {
  border-top: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-bottom: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-right: var(--wot-tooltip-arrow-size, 5px) solid var(--wot-tooltip-bg, rgba(38, 39, 40, 0.8));
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: calc(-1 * var(--wot-tooltip-arrow-size, 5px));
}

.wd-tooltip__arrow-right {
  border-top: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-bottom: var(--wot-tooltip-arrow-size, 5px) solid transparent;
  border-left: var(--wot-tooltip-arrow-size, 5px) solid var(--wot-tooltip-bg, rgba(38, 39, 40, 0.8));
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: calc(-1 * var(--wot-tooltip-arrow-size, 5px));
}
</style>
