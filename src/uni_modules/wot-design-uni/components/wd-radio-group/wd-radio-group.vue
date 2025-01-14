<template>
  <div
    :class="
      cn(
        `wd-radio-group bg-white text-[0]`,
        cell && shape === 'button' ? 'is-button w-full pt-2 pr-[3px] pb-5 pl-[15px] box-border overflow-hidden h-auto' : '',
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
  name: 'wd-radio-group',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { useChildren } from '../composables/useChildren'
import { RADIO_GROUP_KEY, radioGroupProps } from './types'
import { cn } from '../common/util'

const props = defineProps(radioGroupProps)
const emit = defineEmits(['change', 'update:modelValue'])

const { linkChildren } = useChildren(RADIO_GROUP_KEY)

linkChildren({ props, updateValue })

function updateValue(value: string | number | boolean) {
  emit('update:modelValue', value)
  emit('change', {
    value
  })
}
</script>
