<template>
  <div :class="cn(['wd-cell-group', border ? 'is-border' : '', customClass])" :style="customStyle">
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
import { cn } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { CELL_GROUP_KEY, cellGroupProps } from './types'

const props = defineProps(cellGroupProps)

const { linkChildren } = useChildren(CELL_GROUP_KEY)

linkChildren({ props })
</script>

<style>
.wot-theme-dark .wd-cell-group {
  background-color: #1b1b1b;
}

.wot-theme-dark .wd-cell-group.is-border .wd-cell-group__title {
  position: relative;
}

.wot-theme-dark .wd-cell-group.is-border .wd-cell-group__title:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  bottom: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-dark-border-color, #3a3a3c);
}

.wot-theme-dark .wd-cell-group__title {
  background: #1b1b1b;
  color: #fff;
}

.wot-theme-dark .wd-cell-group__right {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-cell-group__body {
  background: #1b1b1b;
}

.wd-cell-group {
  background-color: var(--wot-color-white, rgb(255, 255, 255));
}

.wd-cell-group.is-border .wd-cell-group__title {
  position: relative;
}

.wd-cell-group.is-border .wd-cell-group__title:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  bottom: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-color-border-light, #e8e8e8);
}

.wd-cell-group__title {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: var(--wot-cell-group-padding, 13px var(--wot-cell-padding, var(--wot-size-side-padding, 15px)));
  background: var(--wot-color-white, rgb(255, 255, 255));
  font-size: var(--wot-cell-group-title-fs, var(--wot-fs-title, 16px));
  color: var(--wot-cell-group-title-color, rgba(0, 0, 0, 0.85));
  font-weight: var(--wot-fw-medium, 500);
  line-height: 1.43;
}

.wd-cell-group__right {
  color: var(--wot-cell-group-value-color, var(--wot-color-content, #262626));
  font-size: var(--wot-cell-group-value-fs, var(--wot-fs-content, 14px));
}

.wd-cell-group__body {
  background: var(--wot-color-white, rgb(255, 255, 255));
}
</style>
