<template>
  <div :class="rootClass" :style="rootStyle">
    <slot v-if="!vertical"></slot>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-divider',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { dividerProps } from './types'

const props = defineProps(dividerProps)
const slots = useSlots()

const rootStyle = computed(() => {
  return `--wot-divider-color:${props.color};${props.customStyle}`
})

const rootClass = computed(() => {
  const prefixCls = 'wd-divider'
  if (!props.vertical) {
    return {
      [prefixCls]: true,
      [`${prefixCls}--center`]: slots.default,
      [`${prefixCls}--left`]: props.contentPosition === 'left',
      [`${prefixCls}--right`]: props.contentPosition === 'right',
      ['is-dashed']: props.dashed,
      ['is-hairline']: props.hairline
    }
  } else {
    return {
      [prefixCls]: true,
      [`${prefixCls}--vertical`]: true,
      ['is-dashed']: props.dashed,
      ['is-hairline']: props.hairline
    }
  }
})
</script>

<style>
.wot-theme-dark .wd-divider {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-divider__line {
  background: #595959;
}

.wd-divider {
  position: relative;
  display: flex;
  padding: var(--wot-divider-padding, 0 var(--wot-size-side-padding, 15px));
  margin: var(--wot-divider-margin, 16px 0);
  align-items: center;
  color: var(--wot-divider-color, rgba(0, 0, 0, 0.45));
  font-size: var(--wot-divider-fs, 14px);
}

.wd-divider:after,
.wd-divider:before {
  flex: 1;
  display: block;
  box-sizing: border-box;
  border-style: solid;
  border-color: var(--wot-divider-line-color, currentColor);
  border-width: var(--wot-divider-line-height, 1px) 0 0;
}

.wd-divider:before {
  content: '';
}

.wd-divider--center:after,
.wd-divider--left:after,
.wd-divider--right:after {
  content: '';
  margin-left: var(--wot-divider-content-left-margin, 12px);
}

.wd-divider--center:before,
.wd-divider--left:before,
.wd-divider--right:before {
  margin-right: var(--wot-divider-content-right-margin, 12px);
}

.wd-divider--left:before {
  max-width: var(--wot-divider-content-left-width, 10%);
}

.wd-divider--right:after {
  max-width: var(--wot-divider-content-right-width, 10%);
}

.wd-divider.is-hairline:before,
.wd-divider.is-hairline:after {
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.wd-divider.is-dashed:before,
.wd-divider.is-dashed:after {
  border-style: dashed;
}

.wd-divider--vertical {
  display: inline-block;
  width: var(--wot-divider-vertical-line-width, 1px);
  height: var(--wot-divider-vertical-height, 16px);
  margin: var(--wot-divider-vertical-content-margin, 0 8px);
  padding: 0;
  vertical-align: middle;
}

.wd-divider--vertical:before {
  height: 100%;
  border-width: 0 0 0 var(--wot-divider-vertical-line-width, 1px);
}

.wd-divider--vertical:after {
  display: none;
}

.wd-divider--vertical.is-hairline:before {
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
</style>
