<template>
  <view :class="cn(`relative inline-block ${customClass}`)" :style="customStyle" id="tooltip"
    @click.stop="popover.noop">
    <!-- 用于为渲染获取宽高的元素 -->
    <view
      class="absolute min-w-[138px] min-h-9 text-center box-border z-[500] bg-[rgba(38,39,40,0.8)] text-white rounded-lg text-sm backdrop-blur-[10px] bg-clip-padding left-[-100vw] top-[-100vh] visibility-hidden"
      id="pos">
      <view class="text-sm leading-[18px] custom-pop">
        <view v-if="!useContentSlot" class="whitespace-nowrap py-[9px] px-5 leading-[18px]">{{ content
          }}</view>
      </view>
    </view>
    <pro-transition
      custom-class="absolute min-w-[138px] min-h-9 text-center box-border z-[500] bg-[rgba(38,39,40,0.8)] text-white rounded-lg text-sm backdrop-blur-[10px] bg-clip-padding"
      :custom-style="popover.popStyle.value" :show="showTooltip" name="fade" :duration="200">
      <view class="text-sm leading-[18px] custom-pop">
        <view v-if="visibleArrow" :class="cn(`absolute w-0 h-0 ${popover.arrowClass.value} ${customArrow}`)"
          :style="popover.arrowStyle.value"></view>
        <!-- 普通模式 -->
        <view v-if="!useContentSlot" class="leading-[18px] whitespace-nowrap py-[9px] px-5">{{ content
          }}</view>
        <!-- 用户自定义样式 -->
        <slot name="content" v-else />
      </view>
      <pro-icon v-if="showClose" name="close"
        custom-class="text-xs absolute -right-2 -top-2.5 transform scale-[0.5] p-2.5" @click="toggle"></pro-icon>
    </pro-transition>
    <view @click="toggle" class="" id="target">
      <slot />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-tooltip',
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
import { cn } from '@/uni_modules/pro-core/lib/utils'

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
      console.error('content can\'t be null or undefined')
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
<style lang="scss">
.tooltip__arrow-down {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(38, 39, 40, .8);
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  bottom: calc(-1 * 5px)
}

.tooltip__arrow-up {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid rgba(38, 39, 40, .8);
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  top: calc(-1 * 5px)
}

.tooltip__arrow-left {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid rgba(38, 39, 40, .8);
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: calc(-1 * 5px)
}

.tooltip__arrow-right {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid rgba(38, 39, 40, .8);
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: calc(-1 * 5px)
}
</style>
