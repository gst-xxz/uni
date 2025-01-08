<template>
  <div :class="cn(`wd-popover ${customClass}`)" :style="customStyle" id="popover" @click.stop="popover.noop">
    <!-- 使用插槽时无法获取正确宽高 -->
    <div class="wd-popover__pos wd-popover__hidden" id="pos">
      <div :class="cn(`wd-popover__container ${customPop}`)">
        <div v-if="!useContentSlot && mode === 'normal'" class="wd-popover__inner">
          {{ content }}
        </div>
        <div v-if="!useContentSlot && mode === 'menu' && typeof content === 'object'" class="wd-popover__menu">
          <div v-for="(item, index) in content" :key="index" class="wd-popover__menu-inner" @click="menuClick(index)">
            <wd-icon v-if="item.iconClass" :name="item.iconClass" custom-class="wd-popover__icon" />
            <span>{{ item.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <wd-transition custom-class="wd-popover__pos" :custom-style="popover.popStyle.value" :show="showPopover" name="fade" :duration="200">
      <div :class="cn(`wd-popover__container ${customPop}`)">
        <div
          v-if="props.visibleArrow"
          :class="cn(`wd-popover__arrow ${popover.arrowClass.value} ${customArrow}`)"
          :style="popover.arrowStyle.value"
        ></div>
        <!-- 普通模式 -->
        <div v-if="!useContentSlot && mode === 'normal'" class="wd-popover__inner">
          {{ content }}
        </div>
        <!-- 列表模式 -->
        <div v-if="!useContentSlot && mode === 'menu'" class="wd-popover__menu">
          <div
            v-for="(item, index) in content"
            :key="index"
            class="wd-popover__menu-inner"
            @click="menuClick(index)"
            :style="index === 0 ? 'border-top: none' : ''"
          >
            <wd-icon v-if="typeof item === 'object' && item.iconClass" :name="item.iconClass" custom-class="wd-popover__icon" />
            <div style="display: inline-block">{{ typeof item === 'object' && item.content ? item.content : '' }}</div>
          </div>
        </div>
        <!-- 用户自定义样式 -->
        <slot name="content" v-else />
      </div>
      <wd-icon v-if="showClose" name="close" custom-class="wd-popover__close-icon" @click="toggle"></wd-icon>
    </wd-transition>
    <div @click="toggle" class="wd-popover__target" id="target">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-popover',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePopover } from '../composables/usePopover'
import { closeOther, pushToQueue, removeFromQueue } from '../common/clickoutside'
import { type Queue, queueKey } from '../composables/useQueue'
import { popoverProps, type PopoverExpose } from './types'
import { cn, isArray } from '../common/util'

const props = defineProps(popoverProps)
const emit = defineEmits(['update:modelValue', 'menuclick', 'change', 'open', 'close'])

const queue = inject<Queue | null>(queueKey, null)
const selector: string = 'popover'
const { proxy } = getCurrentInstance() as any
const popover = usePopover()

const showPopover = ref<boolean>(false) // 控制popover显隐

watch(
  () => props.content,
  (newVal) => {
    const { mode } = props
    if (mode === 'normal' && typeof newVal !== 'string') {
      console.error('The value type must be a string type in normal mode')
    } else if (mode === 'menu' && !isArray(newVal)) {
      console.error('The value type must be a Array type in menu mode')
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
    showPopover.value = newValue
  }
)

watch(
  () => showPopover.value,
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
  popover.showStyle.value = showPopover.value ? 'opacity: 1;' : 'opacity: 0;'
})

onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

function menuClick(index: number) {
  updateModelValue(false)
  emit('menuclick', {
    item: (props.content as Array<Record<string, any>>)[index],
    index
  })
}

function toggle() {
  if (props.disabled) return
  updateModelValue(!showPopover.value)
}

function open() {
  updateModelValue(true)
}

function close() {
  updateModelValue(false)
}

function updateModelValue(value: boolean) {
  showPopover.value = value
  emit('update:modelValue', value)
}

defineExpose<PopoverExpose>({
  open,
  close
})
</script>
<style>
.wot-theme-dark .wd-popover__pos {
  background: #4b4c4d;
  color: #fff;
  box-shadow: 0 2px 10px rgba(75, 76, 77, 0.1);
}

.wot-theme-dark .wd-popover__menu {
  background: #4b4c4d;
}

.wot-theme-dark .wd-popover__inner {
  background-color: #4b4c4d;
}

.wot-theme-dark .wd-popover__menu-inner {
  position: relative;
}

.wot-theme-dark .wd-popover__menu-inner:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-dark-border-color, #3a3a3c);
}

.wot-theme-dark .wd-popover__arrow {
  position: absolute;
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  z-index: var(--wot-popover-z-index, var(--wot-tooltip-z-index, 500))-1;
}

.wot-theme-dark .wd-popover__arrow-down {
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  bottom: 0;
}

.wot-theme-dark .wd-popover__arrow-down:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: #4b4c4d;
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wot-theme-dark .wd-popover__arrow-up {
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  top: 0;
}

.wot-theme-dark .wd-popover__arrow-up:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: #4b4c4d;
  position: absolute;
  left: 0;
  top: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wot-theme-dark .wd-popover__arrow-left {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 0;
}

.wot-theme-dark .wd-popover__arrow-left:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: #4b4c4d;
  position: absolute;
  left: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  top: 0;
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wot-theme-dark .wd-popover__arrow-right {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 0;
}

.wot-theme-dark .wd-popover__arrow-right:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: #4b4c4d;
  position: absolute;
  right: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  top: 0;
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wd-popover {
  position: relative;
  display: inline-block;
}

.wd-popover__icon {
  vertical-align: middle;
  font-size: 18px;
  margin-right: 5px;
}

.wd-popover__menu-inner {
  padding: var(--wot-popover-padding, 15px) 0;
  display: flex;
  align-items: center;
  position: relative;
}

.wd-popover__menu-inner:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-popover-border-color, rgba(0, 0, 0, 0.09));
}

.wd-popover__menu-inner:first-child:after {
  display: none;
}

.wd-popover__menu {
  display: inline-block;
  padding: 0 var(--wot-popover-padding, 15px);
  white-space: nowrap;
  z-index: var(--wot-popover-z-index, var(--wot-tooltip-z-index, 500));
  position: relative;
  background: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  border-radius: var(--wot-popover-radius, 4px);
}

.wd-popover__pos {
  position: absolute;
  box-sizing: border-box;
  background-clip: padding-box;
  text-align: center;
  min-height: 36px;
  z-index: var(--wot-popover-z-index, var(--wot-tooltip-z-index, 500));
  line-height: var(--wot-popover-line-height, 18px);
  font-size: var(--wot-popover-fs, var(--wot-fs-content, 14px));
  border-radius: var(--wot-popover-radius, 4px);
  transition: opacity 0.2s;
  background: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  box-shadow: var(--wot-popover-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.1));
  color: var(--wot-popover-color, rgba(0, 0, 0, 0.85));
}

.wd-popover__hidden {
  left: -100vw;
  visibility: hidden;
}

.wd-popover__container {
  position: relative;
  line-height: var(--wot-tooltip-line-height, 18px);
  font-size: var(--wot-tooltip-fs, var(--wot-fs-content, 14px));
}

.wd-popover__inner {
  position: relative;
  white-space: nowrap;
  padding: var(--wot-popover-padding, 15px);
  line-height: var(--wot-popover-line-height, 18px);
  z-index: var(--wot-popover-z-index, var(--wot-tooltip-z-index, 500));
  background-color: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  border-radius: var(--wot-popover-radius, 4px);
}

.wd-popover__close-icon {
  font-size: 12px;
  position: absolute;
  right: -8px;
  top: -10px;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  padding: 10px;
}

.wd-popover__arrow {
  position: absolute;
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  z-index: var(--wot-popover-z-index, var(--wot-tooltip-z-index, 500))-1;
}

.wd-popover__arrow-down {
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  bottom: 0;
}

.wd-popover__arrow-down:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wd-popover__arrow-up {
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  top: 0;
}

.wd-popover__arrow-up:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  position: absolute;
  left: 0;
  top: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wd-popover__arrow-left {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 0;
}

.wd-popover__arrow-left:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  position: absolute;
  left: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  top: 0;
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}

.wd-popover__arrow-right {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 0;
}

.wd-popover__arrow-right:after {
  content: '';
  width: var(--wot-popover-arrow-size, 6px);
  height: var(--wot-popover-arrow-size, 6px);
  background-color: var(--wot-popover-bg, var(--wot-color-white, rgb(255, 255, 255)));
  position: absolute;
  right: calc(-1 * var(--wot-popover-arrow-size, 6px) / 2);
  top: 0;
  -webkit-transform: rotateZ(45deg);
  transform: rotate(45deg);
  box-shadow: var(--wot-popover-arrow-box-shadow, 0px 2px 10px 0px rgba(0, 0, 0, 0.2));
}
</style>
