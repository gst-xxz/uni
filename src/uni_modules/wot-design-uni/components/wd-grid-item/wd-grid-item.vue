<template>
  <div :class="cn(`wd-grid-item ${border && !gutter ? itemClass : ''} ${customClass}`)" @click="click" :style="`${style};${customStyle}`">
    <div :class="cn(`wd-grid-item__content ${square ? 'is-square' : ''} ${border && gutter > 0 ? 'is-round' : ''}`)" :style="gutterContentStyle">
      <slot v-if="useSlot" />
      <block v-else>
        <div :style="'width:' + iconSize + '; height: ' + iconSize" class="wd-grid-item__wrapper">
          <wd-badge custom-class="badge" v-bind="customBadgeProps">
            <template v-if="useIconSlot">
              <slot name="icon" />
            </template>
            <wd-icon v-else :name="icon" :size="iconSize" :custom-class="customIcon" />
          </wd-badge>
        </div>
        <slot name="text" v-if="useTextSlot" />
        <div v-else class="wd-grid-item__text custom-text">{{ text }}</div>
      </block>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-grid-item',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useParent } from '../composables/useParent'
import { GRID_KEY } from '../wd-grid/types'
import { cn, deepAssign, isDef, isUndefined, omitBy } from '../common/util'
import { gridItemProps } from './types'
import type { BadgeProps } from '../wd-badge/types'

const props = defineProps(gridItemProps)
const emit = defineEmits(['itemclick'])

const style = ref<string>('')
const gutterContentStyle = ref<string>('')
const itemClass = ref<string>('')
const gutter = ref<number>(0)
const square = ref<boolean>(false)
const border = ref<boolean>(true)
const { parent: grid } = useParent(GRID_KEY)

const childCount = computed(() => {
  if (isDef(grid) && isDef(grid.children)) {
    return grid.children.length
  } else {
    return 0
  }
})

const customBadgeProps = computed(() => {
  const badgeProps: Partial<BadgeProps> = deepAssign(
    isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: props.max,
        isDot: props.isDot,
        modelValue: props.value,
        type: props.type
      },
      isUndefined
    )
  )
  return badgeProps
})

watch(
  () => childCount.value,
  () => {
    if (!grid) return
    const width = grid.props.column ? 100 / grid.props.column + '%' : 100 / (childCount.value || 1) + '%'
    // 单独定义间隔
    const gutterStyle = grid.props.gutter ? `padding:${grid.props.gutter}px ${grid.props.gutter}px 0 0; background-color: transparent;` : ''
    // 单独定义正方形
    const squareStyle = grid.props.square ? `background-color:transparent; padding-bottom: 0; padding-top:${width}` : ''
    style.value = `width: ${width}; ${squareStyle || gutterStyle}`
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  init()
})

function init() {
  if (!grid) return
  const children = grid.children
  const width = grid.props.column ? 100 / grid.props.column + '%' : 100 / children.length + '%'
  // 单独定义间隔
  const gutterStyle = grid.props.gutter ? `padding:${grid.props.gutter}px ${grid.props.gutter}px 0 0; background-color: transparent;` : ''
  // 单独定义正方形
  const squareStyle = grid.props.square ? `background-color:transparent; padding-bottom: 0; padding-top:${width}` : ''
  // 间隔+正方形
  gutterContentStyle.value =
    grid.props.gutter && grid.props.square
      ? `right: ${grid.props.gutter}px; bottom:${grid.props.gutter}px;height: auto; background-color: ${grid.props.bgColor}`
      : `background-color: ${grid.props.bgColor}`

  border.value = Boolean(grid.props.border)
  square.value = Boolean(grid.props.square)
  gutter.value = Number(grid.props.gutter)
  style.value = `width: ${width}; ${squareStyle || gutterStyle}`
}

function click() {
  if (grid && !grid.props.clickable) return
  const { url, linkType } = props
  emit('itemclick')
  if (url) {
    switch (linkType) {
      case 'navigateTo':
        uni.navigateTo({
          url
        })
        break
      case 'reLaunch':
        uni.reLaunch({
          url
        })
        break
      case 'redirectTo':
        uni.redirectTo({
          url
        })
        break
      case 'switchTab':
        uni.switchTab({
          url
        })
        break
      default:
        console.error(`[wot-design] warning(wd-grid-item): linkType can not be ${linkType}`)
        break
    }
  }
}
/**
 * 设置样式
 * @param classes
 */
function setiIemClass(classes: string) {
  itemClass.value = classes
}

defineExpose({
  setiIemClass,
  itemClass,
  init
})
</script>

<style>
.wd-grid-item {
  height: 100%;
  font-size: var(--wot-grid-item-fs, 12px);
  box-sizing: border-box;
  position: relative;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.wd-grid-item.is-border:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: var(--wot-grid-item-border-color, var(--wot-color-border-light, #e8e8e8));
  top: 0;
  left: 0;
  z-index: 1;
}

.wd-grid-item.is-border:after {
  content: '';
  position: absolute;
  width: 1px;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
  height: 100%;
  background-color: var(--wot-grid-item-border-color, var(--wot-color-border-light, #e8e8e8));
  bottom: 0;
  right: 0;
}

.wd-grid-item.is-first:after {
  content: '';
  position: absolute;
  width: 1px;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
  height: 100%;
  background-color: var(--wot-grid-item-border-color, var(--wot-color-border-light, #e8e8e8));
  bottom: 0;
  right: 0;
}

.wd-grid-item.is-right:after {
  display: none;
}

.wd-grid-item.is-last:after {
  display: none;
}

.wd-grid-item__wrapper {
  display: inline-block;
  margin: 0 auto;
}

.wd-grid-item__content {
  height: 100%;
  padding: var(--wot-grid-item-padding, 14px 0px);
  background-color: var(--wot-grid-item-bg, var(--wot-color-white, rgb(255, 255, 255)));
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wd-grid-item__content.is-square {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding: 0;
  height: 100%;
}

.wd-grid-item__content.is-round:after {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  border: 1px solid var(--wot-grid-item-border-color, var(--wot-color-border-light, #e8e8e8));
  -webkit-transform-origin: top left;
  transform-origin: top left;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  box-sizing: border-box;
}

.wd-grid-item__text {
  margin-top: 8px;
  font-size: var(--wot-grid-item-fs, 12px);
  line-height: var(--wot-grid-item-fs, 12px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
