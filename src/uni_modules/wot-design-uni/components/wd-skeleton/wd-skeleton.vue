<template>
  <div :class="`wd-skeleton ${customClass}`" :style="customStyle">
    <div class="wd-skeleton__content" v-if="show">
      <div class="wd-skeleton__row" v-for="(row, index) of parsedRowCols" :key="`row-${index}`">
        <div v-for="(col, idx) of row" :key="`col-${idx}`" :class="col.class" :style="col.style" />
      </div>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  // #ifdef H5
  name: 'wd-skeleton',
  // #endif
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' }
}
</script>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { ref, computed, watch } from 'vue'
import type { SkeletonRowCol, SkeletonRowColObj } from './types'
import { skeletonProps } from './types'
import { isNumber, addUnit } from '../common/util'

const themeMap = {
  avatar: [{ type: 'circle', height: '64px', width: '64px' }],
  image: [{ type: 'rect', height: '64px', width: '64px' }],
  text: [
    1,
    [
      { width: '24%', height: '16px', marginRight: '16px' },
      { width: '76%', height: '16px' }
    ]
  ],
  paragraph: [1, 1, 1, { width: '55%' }]
}
const props = defineProps(skeletonProps)
const rowCols = ref<SkeletonRowCol[]>([])

const parsedRowCols = computed(() => {
  return rowCols.value.map((item) => {
    if (isNumber(item)) {
      return [
        {
          class: getColItemClass({ type: 'text' }),
          style: {}
        }
      ]
    }
    if (Array.isArray(item)) {
      return item.map((col) => {
        return {
          ...col,
          class: getColItemClass(col),
          style: getColItemStyle(col)
        }
      })
    }
    const nItem = item as SkeletonRowColObj

    return [
      {
        ...nItem,
        class: getColItemClass(nItem),
        style: getColItemStyle(nItem)
      }
    ]
  })
})

function getColItemClass(rowCol: SkeletonRowColObj) {
  return ['wd-skeleton__col', `wd-skeleton--type-${rowCol.type || 'text'}`, { [`wd-skeleton--animation-${props.animation}`]: props.animation }]
}
function getColItemStyle(rowCol: SkeletonRowColObj) {
  const style: CSSProperties = {}
  const styleName = ['size', 'width', 'height', 'margin', 'background', 'marginLeft', 'marginRight', 'borderRadius', 'backgroundColor']

  for (const name of styleName) {
    if (Object.prototype.hasOwnProperty.call(rowCol, name)) {
      const px = addUnit(rowCol[name])

      if (name === 'size') {
        style.width = px
        style.height = px
      } else {
        ;(style as any)[name] = px
      }
    }
  }
  return style
}

watch(
  () => props.rowCol,
  (rowCol) => {
    rowCols.value = [...(Array.isArray(rowCol) && rowCol.length ? props.rowCol : themeMap[props.theme])]
  },
  { immediate: true }
)

const show = computed(() => props.loading == undefined || props.loading === true)
</script>

<style>
.wd-skeleton {
  box-sizing: border-box;
}

.wd-skeleton__row {
  justify-content: space-between;
  margin-bottom: var(--wot-skeleton-row-margin-bottom, 16px);
  display: flex;
  align-items: center;
}

.wd-skeleton__row:only-child,
.wd-skeleton__row:last-child {
  margin-bottom: 0;
}

.wd-skeleton__col {
  border-radius: var(--wot-skeleton-border-radius-text, 2px);
  background-color: var(--wot-skeleton-background-color, #eee);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wd-skeleton__col:first-child:last-child,
.wd-skeleton__col:last-child {
  margin-right: 0;
}

.wd-skeleton--type-text {
  width: 100%;
  height: var(--wot-skeleton-text-height-default, 16px);
  border-radius: var(--wot-skeleton-border-radius-text, 2px);
}

.wd-skeleton--type-rect {
  width: 100%;
  height: var(--wot-skeleton-rect-height-default, 16px);
  border-radius: var(--wot-skeleton-border-radius-rect, 4px);
}

.wd-skeleton--type-circle {
  flex-shrink: 0;
  width: var(--wot-skeleton-circle-height-default, 48px);
  height: var(--wot-skeleton-circle-height-default, 48px);
  border-radius: var(--wot-skeleton-border-radius-circle, 50%);
}

.wd-skeleton--animation-gradient {
  position: relative;
  overflow-x: hidden;
}

.wd-skeleton--animation-gradient:after {
  content: ' ';
  position: absolute;
  -webkit-animation: wd-skeleton-gradient-d9d8a5e4 1.5s linear 2s infinite;
  animation: wd-skeleton-gradient-d9d8a5e4 1.5s linear 2s infinite;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), var(--wot-skeleton-animation-gradient, rgba(0, 0, 0, 0.04)), rgba(255, 255, 255, 0));
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.wd-skeleton--animation-flashed {
  animation: wd-skeleton-flashed 2s linear 2s infinite;
}

@keyframes wd-skeleton-gradient-d9d8a5e4 {
  0% {
    -webkit-transform: translateX(-100%) skewX(-15deg);
    transform: translate(-100%) skew(-15deg);
  }

  to {
    -webkit-transform: translateX(100%) skewX(-15deg);
    transform: translate(100%) skew(-15deg);
  }
}

@keyframes wd-skeleton-flashed {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
    background-color: var(--wot-skeleton-animation-flashed, rgba(230, 230, 230, 0.3));
  }

  to {
    opacity: 1;
  }
}
</style>
