<template>
  <div :class="cn(`wd-radio-group  ${customClass} ${cell && shape === 'button' ? 'is-button' : ''}`)" :style="customStyle">
    <slot />
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-radio-group',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { watch } from 'vue'
import { useChildren } from '../composables/useChildren'
import { RADIO_GROUP_KEY, radioGroupProps } from './types'
import { cn } from '../common/util'

const props = defineProps(radioGroupProps)
const emit = defineEmits(['change', 'update:modelValue'])

const { linkChildren, children } = useChildren(RADIO_GROUP_KEY)

linkChildren({ props, updateValue })

watch(
  () => props.shape,
  (newValue) => {
    // type: 'dot', 'button', 'check'
    const type = ['check', 'dot', 'button']
    if (type.indexOf(newValue) === -1) console.error(`shape must be one of ${type.toString()}`)
  },
  { deep: true, immediate: true }
)

/**
 * @description 处理radio子节点通知
 */
function updateValue(value: string | number | boolean) {
  emit('update:modelValue', value)
  emit('change', {
    value
  })
}
</script>
<style>
.wot-theme-dark .wd-radio-group {
  background-color: #1b1b1b;
}

.wd-radio-group {
  background-color: var(--wot-radio-bg, var(--wot-color-white, rgb(255, 255, 255)));
  font-size: 0;
}

.wd-radio-group.is-button {
  width: 100%;
  height: 100%;
  padding: 8px 3px 20px 15px;
  box-sizing: border-box;
  overflow: hidden;
  height: auto;
}
</style>
