<template>
  <wd-popup
    v-model="state.visible"
    :custom-style="customStyle"
    :position="state.position"
    :z-index="state.zIndex"
    :duration="250"
    :modal="false"
    @leave="onClosed"
    @enter="onOpened"
  >
    <div
      :class="cn('wd-notify flex justify-center items-center box-border whitespace-pre-wrap text-center', `wd-notify--${state.type}`)"
      :style="{ color: state.color, background: state.background }"
      @click="onClick"
    >
      <slot>{{ state.message }}</slot>
    </div>
  </wd-popup>
</template>
<script lang="ts">
export default {
  name: 'wd-notify',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { inject, computed, watch, ref } from 'vue'
import { notifyProps, type NotifyProps } from './types'
import { getNotifyOptionKey } from '.'
import { addUnit, cn, isFunction } from '../common/util'

const props = defineProps(notifyProps)
const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'click', event: MouseEvent): void
  (e: 'closed'): void
  (e: 'opened'): void
}>()
const state = inject(getNotifyOptionKey(props.selector), ref<NotifyProps>(props))

const customStyle = computed(() => {
  const { safeHeight, position } = state.value
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
  if (isFunction(state.value.onClick)) return state.value.onClick(event)
  emits('click', event)
}
const onClosed = () => {
  if (isFunction(state.value.onClosed)) return state.value.onClosed()
  emits('closed')
}
const onOpened = () => {
  if (isFunction(state.value.onOpened)) return state.value.onOpened()
  emits('opened')
}

watch(
  () => state.value.visible,
  (visible) => {
    emits('update:visible', visible as boolean)
  },
  { deep: true }
)
</script>

<style>
.wd-notify {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--wot-notify-padding, 8px 16px);
  font-size: var(--wot-notify-font-size, var(--wot-fs-content, 14px));
  line-height: var(--wot-notify-line-height, 20px);
  color: var(--wot-notify-text-color, var(--wot-color-white, rgb(255, 255, 255)));
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;
}

.wd-notify--primary {
  background: var(--wot-notify-primary-background, var(--wot-color-theme, #4d80f0));
}

.wd-notify--success {
  background: var(--wot-notify-success-background, var(--wot-color-success, #34d19d));
}

.wd-notify--danger {
  background: var(--wot-notify-danger-background, var(--wot-color-danger, #fa4350));
}

.wd-notify--warning {
  background: var(--wot-notify-warning-background, var(--wot-color-warning, #f0883a));
}
</style>
