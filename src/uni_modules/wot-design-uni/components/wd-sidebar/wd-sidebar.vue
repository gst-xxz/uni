<template>
  <div :class="`wd-sidebar ${customClass}`" :style="customStyle">
    <slot></slot>
    <div class="wd-sidebar__padding"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-sidebar',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { isFunction } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { SIDEBAR_KEY, sidebarProps } from './types'

const props = defineProps(sidebarProps)
const emit = defineEmits(['change', 'update:modelValue'])

const { linkChildren } = useChildren(SIDEBAR_KEY)
linkChildren({ props, setChange })

/**
 * 子项状态变更
 * @param value 目标值
 * @param label 目标值标题
 */
function setChange(value: number | string, label: string) {
  if (isFunction(props.beforeChange)) {
    props.beforeChange({
      value: value,
      resolve: (pass: boolean) => {
        if (pass) {
          updateValue(value, label)
        }
      }
    })
  } else {
    updateValue(value, label)
  }
}

/**
 * 更新选中状态
 * @param value 目标值
 * @param label 目标值标题
 */
function updateValue(value: number | string, label: string) {
  emit('update:modelValue', value)
  emit('change', { value, label })
}
</script>

<style>
.wd-sidebar {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: var(--wot-sidebar-width, 104px);
  height: var(--wot-sidebar-height, 100%);
  background: var(--wot-color-white, rgb(255, 255, 255));
}

.wd-sidebar__padding {
  flex: 1 1 auto;
  background: var(--wot-sidebar-bg, var(--wot-color-gray-1, #f7f8fa));
}
</style>
