<template>
  <div
    :class="
      cn(
        'wd-divider relative flex py-0 px-[15px] my-4 mx-0 items-center text-black/45 text-sm',
        slots.default && 'wd-divider--center',
        contentPosition === 'left' && 'wd-divider--left',
        contentPosition === 'right' && 'wd-divider--right',
        dashed && 'is-dashed',
        hairline && 'is-hairline',
        vertical && 'wd-divider--vertical'
      )
    "
    :style="rootStyle"
  >
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
import { computed, useSlots, type CSSProperties } from 'vue'
import { dividerProps } from './types'
import { cn } from '../common/util'

const props = defineProps(dividerProps)
const slots = useSlots()

const rootStyle = computed<CSSProperties>(() => {
  return {
    ...props.customStyle,
    color: props.color
  }
})
</script>

<style>
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
