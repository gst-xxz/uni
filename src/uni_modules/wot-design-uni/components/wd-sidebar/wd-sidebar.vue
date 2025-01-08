<template>
  <div :class="cn(`wd-sidebar flex flex-col overflow-y-auto w-[104px] h-full bg-white`, customClass)" :style="customStyle">
    <slot></slot>
    <div class="wd-sidebar__padding flex-auto bg-gray-1"></div>
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
import { cn, isFunction } from '../common/util'
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
