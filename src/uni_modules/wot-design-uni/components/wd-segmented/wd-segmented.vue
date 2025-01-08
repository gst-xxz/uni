<template>
  <div :class="`wd-segmented ${customClass}`" :style="customStyle">
    <div
      :class="`wd-segmented__item is-${size} ${state.activeIndex === index ? 'is-active' : ''} ${
        disabled || (isObj(option) ? option.disabled : false) ? 'is-disabled' : ''
      }`"
      @click="handleClick(option, index)"
      v-for="(option, index) in options"
      :key="index"
    >
      <div class="wd-segmented__item-label">
        <slot name="label" v-if="$slots.label" :option="isObj(option) ? option : { value: option }"></slot>
        <template v-else>
          {{ isObj(option) ? option.value : option }}
        </template>
      </div>
    </div>
    <div :class="`wd-segmented__item--active ${activeDisabled ? 'is-disabled' : ''}`" :style="state.activeStyle"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-segmented',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, reactive, watch } from 'vue'
import { getRect, isObj, objToStyle, addUnit, pause } from '../common/util'
import type { CSSProperties } from 'vue'
import { segmentedProps, type SegmentedExpose, type SegmentedOption } from './types'
const $item = '.wd-segmented__item'

const props = defineProps(segmentedProps)
const emit = defineEmits(['update:value', 'change', 'click'])

const state = reactive({
  activeIndex: 0, // 选中项
  activeStyle: '' // 选中样式
})

const activeDisabled = computed(() => {
  return props.disabled || (props.options[0] && isObj(props.options[0]) ? props.options[0].disabled : false)
})

watch(
  () => props.value,
  () => {
    updateCurrentIndex()
    updateActiveStyle()
    if (props.vibrateShort) {
      uni.vibrateShort({})
    }
  },
  {
    immediate: false
  }
)

const { proxy } = getCurrentInstance() as any

onMounted(async () => {
  updateCurrentIndex()
  await pause()
  updateActiveStyle(false)
})

/**
 * 更新滑块偏移量
 *
 */
function updateActiveStyle(animation: boolean = true) {
  getRect($item, true, proxy).then((rects) => {
    const rect = rects[state.activeIndex]
    const style: CSSProperties = {
      position: 'absolute',
      width: addUnit(rect.width!),
      'z-index': 0
    }
    const left = rects.slice(0, state.activeIndex).reduce((prev, curr) => prev + Number(curr.width), 0)
    if (left) {
      style.transform = `translateX(${left}px)`
    }
    if (animation) {
      style.transition = 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'
    }
    state.activeStyle = objToStyle(style)
  })
}

/**
 * 更新当前下标
 */
function updateCurrentIndex() {
  const index = props.options.findIndex((option: string | number | SegmentedOption) => {
    const value = isObj(option) ? option.value : option
    return value == props.value
  })
  if (index >= 0) {
    state.activeIndex = index
  } else {
    const value = isObj(props.options[0]) ? props.options[0].value : props.options[0]
    emit('update:value', value)
    emit('change', isObj(props.options[0]) ? props.options[0] : { value })
  }
}

function handleClick(option: string | number | SegmentedOption, index: number) {
  const disabled = props.disabled || (isObj(option) ? option.disabled : false)
  if (disabled) {
    return
  }
  const value = isObj(option) ? option.value : option
  state.activeIndex = index
  updateActiveStyle()
  emit('update:value', value)
  emit('change', isObj(option) ? option : { value })
  emit('click', isObj(option) ? option : { value })
}

defineExpose<SegmentedExpose>({
  updateActiveStyle
})
</script>

<style>
.wot-theme-dark .wd-segmented {
  background: #1b1b1b;
}

.wot-theme-dark .wd-segmented__item {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-segmented__item.is-active {
  color: #fff;
}

.wot-theme-dark .wd-segmented__item.is-active.is-disabled {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-segmented__item.is-disabled {
  color: #595959;
}

.wot-theme-dark .wd-segmented__item--active {
  background-color: var(--wot-color-theme, #4d80f0);
}

.wot-theme-dark .wd-segmented__item--active.is-disabled {
  opacity: 0.6;
}

.wd-segmented {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-items: flex-start;
  width: 100%;
  background-color: var(--wot-segmented-item-bg-color, #eeeeee);
  padding: var(--wot-segmented-padding, 4px);
  border-radius: 4px;
  box-sizing: border-box;
}

.wd-segmented__item {
  position: relative;
  text-align: center;
  border-radius: 4px;
  flex: 1;
  min-width: 0;
  z-index: 1;
  min-height: 28px;
  line-height: 28px;
  padding: 0 12px;
  font-size: 14px;
  color: var(--wot-segmented-item-color, rgba(0, 0, 0, 0.85));
  font-weight: 400;
}

.wd-segmented__item.is-active {
  font-weight: 550;
}

.wd-segmented__item.is-large {
  min-height: 32px;
  line-height: 32px;
  padding: 0 12px;
  font-size: 16px;
}

.wd-segmented__item.is-small {
  min-height: 24px;
  line-height: 24px;
  padding: 0 7px;
  font-size: 12px;
}

.wd-segmented__item.is-disabled {
  cursor: no-drop;
  color: var(--wot-segmented-item-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-segmented__item--active {
  background-color: var(--wot-segmented-item-acitve-bg, #ffffff);
  border-radius: 4px;
  height: calc(100% - var(--wot-segmented-padding, 4px) * 2);
}

.wd-segmented__item--active.is-disabled {
  opacity: 0.8;
}

.wd-segmented__item-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
