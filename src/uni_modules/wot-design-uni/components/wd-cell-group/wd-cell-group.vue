<template>
  <div :class="['wd-cell-group', border ? 'is-border' : '', customClass]" :style="customStyle">
    <div v-if="title || value || useSlot" class="wd-cell-group__title">
      <!--左侧标题-->
      <div class="wd-cell-group__left">
        <span v-if="title">{{ title }}</span>
        <slot v-else name="title"></slot>
      </div>
      <!--右侧标题-->
      <div class="wd-cell-group__right">
        <span v-if="value">{{ value }}</span>
        <slot v-else name="value"></slot>
      </div>
    </div>
    <div class="wd-cell-group__body">
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
import { useChildren } from '../composables/useChildren'
import { CELL_GROUP_KEY, cellGroupProps } from './types'

const props = defineProps(cellGroupProps)

const { linkChildren } = useChildren(CELL_GROUP_KEY)

linkChildren({ props })
</script>

<style lang="scss">
@import './index.scss';
</style>
