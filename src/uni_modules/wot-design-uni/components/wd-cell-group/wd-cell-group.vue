<template>
  <div :class="cn(['wd-cell-group bg-white', border ? 'is-border border-default' : '', customClass])" :style="customStyle">
    <div
      v-if="title || value || useSlot"
      class="wd-cell-group__title relative flex justify-between py-[13px] px-[15px] bg-white text-base text-black/85 font-medium leading-[1.43]"
    >
      <!--左侧标题-->
      <div class="wd-cell-group__left">
        <span v-if="title">{{ title }}</span>
        <slot v-else name="title"></slot>
      </div>
      <!--右侧标题-->
      <div class="wd-cell-group__right text-[#262626] text-sm">
        <span v-if="value">{{ value }}</span>
        <slot v-else name="value"></slot>
      </div>
    </div>
    <div class="wd-cell-group__body bg-white">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-cell-group',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { cn } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { CELL_GROUP_KEY, cellGroupProps } from './types'

const props = defineProps(cellGroupProps)

const { linkChildren } = useChildren(CELL_GROUP_KEY)

linkChildren({ props })
</script>
