<template>
  <view :class="`wd-skeleton box-border ${customClass}`" :style="customStyle">
    <view class="wd-skeleton__content" v-if="show">
      <view class="wd-skeleton__row flex justify-between items-center mb-4 only:mb-0 last:mb-0"
        v-for="(row, index) of parsedRowCols" :key="`row-${index}`">
        <view v-for="(col, idx) of row" :key="`col-${idx}`" :class="cn(col.class)" :style="col.style" />
      </view>
    </view>
    <view v-else>
      <slot />
    </view>
  </view>
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
import { cn } from '@/uni_modules/pro-core/lib/utils'

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
        ; (style as any)[name] = px
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

<style lang="scss" scoped>
@import './index.scss';
</style>
