<template>
  <div
    :class="
      cn(
        `wd-checkbox-group`,
        shape === 'button' && cell ? 'is-button w-full py-2 pr-[3px] pb-5 pl-[15px] box-border overflow-hidden h-auto' : '',
        customClass
      )
    "
    :style="customStyle"
  >
    <slot />
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-checkbox-group',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { watch } from 'vue'
import { checkNumRange, cn, deepClone } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { CHECKBOX_GROUP_KEY, checkboxGroupProps } from './types'

const props = defineProps(checkboxGroupProps)
const emit = defineEmits(['change', 'update:modelValue'])

const { linkChildren } = useChildren(CHECKBOX_GROUP_KEY)

linkChildren({ props, changeSelectState })

watch(
  () => props.min,
  (newValue) => {
    checkNumRange(newValue, 'min')
  },
  { deep: true, immediate: true }
)

watch(
  () => props.max,
  (newValue) => {
    checkNumRange(newValue, 'max')
  },
  { deep: true, immediate: true }
)

/**
 * @description 子节点通知父节点修改子节点选中状态
 * @param {any} value 子组件的标识符
 */
function changeSelectState(value: string | number | boolean) {
  const temp: (string | number | boolean)[] = deepClone(props.modelValue)
  const index = temp.indexOf(value)
  if (index > -1) {
    // 已经选中，则从 value 列表中删除子节点的标识符。
    temp.splice(index, 1)
  } else {
    // 之前未选中，则现在把加子节点的标识符加到 value 列表中。
    temp.push(value)
  }
  emit('update:modelValue', temp)

  emit('change', {
    value: temp
  })
}
</script>
