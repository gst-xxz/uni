<template>
  <pro-popup v-model="state.visible" :custom-style="customStyle" :position="state.position" :z-index="state.zIndex"
    :duration="250" :modal="false" @leave="onClosed" @enter="onOpened">
    <view :class="cn(
      'flex items-center justify-center box-border whitespace-pre-wrap text-center text-white text-sm py-2 px-4',
      {
        'bg-primary': state.type == 'primary',
        'bg-success': state.type == 'success',
        'bg-danger': state.type == 'danger',
        'bg-warning': state.type == 'warning',
      }
    )" :style="{ color: state.color, background: state.background, wordWrap: 'break-word' }" @click="onClick">
      <slot>{{ state.message }}</slot>
    </view>
  </pro-popup>
</template>
<script lang="ts">
export default {
  // #ifdef H5
  name: 'pro-notify',
  // #endif
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' }
}
</script>

<script lang="ts" setup>
import { inject, computed, watch } from 'vue'
import { notifyProps, type NotifyProps } from './types'
import { getNotifyOptionKey } from '.'
import { addUnit, isFunction } from '../common/util'
import { cn } from '@/uni_modules/pro-core/lib/utils'

const props = defineProps(notifyProps)
const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'click', event: MouseEvent): void
  (e: 'closed'): void
  (e: 'opened'): void
}>()
const state = inject<NotifyProps>(getNotifyOptionKey(props.selector), props)

const customStyle = computed(() => {
  const { safeHeight, position } = state
  let customStyle: string = ''
  switch (position) {
    case 'top':
      customStyle = `top: calc(var(--window-top) + ${addUnit(safeHeight || 0)})`
      break
    case 'bottom':
      customStyle = 'bottom: var(--window-bottom)'
      break
    default:
      break
  }
  return customStyle
})

const onClick = (event: MouseEvent) => {
  if (isFunction(state.onClick)) return state.onClick(event)
  emits('click', event)
}
const onClosed = () => {
  if (isFunction(state.onClosed)) return state.onClosed()
  emits('closed')
}
const onOpened = () => {
  if (isFunction(state.onOpened)) return state.onOpened()
  emits('opened')
}

watch(
  () => state.visible,
  (visible) => emits('update:visible', visible as boolean)
)
</script>
