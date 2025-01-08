<template>
  <div :class="`wd-tabbar-item ${customClass}`" :style="customStyle" @click="handleClick">
    <wd-badge v-bind="customBadgeProps">
      <div class="wd-tabbar-item__body">
        <slot name="icon" :active="active"></slot>
        <template v-if="!$slots.icon && icon">
          <wd-icon
            :name="icon"
            :custom-style="textStyle"
            :custom-class="`wd-tabbar-item__body-icon ${active ? 'is-active' : 'is-inactive'}`"
          ></wd-icon>
        </template>
        <span v-if="title" :style="textStyle" :class="`wd-tabbar-item__body-title ${active ? 'is-active' : 'is-inactive'}`">
          {{ title }}
        </span>
      </div>
    </wd-badge>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-tabbar-item',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { type CSSProperties, computed } from 'vue'
import { deepAssign, isDef, isUndefined, objToStyle, omitBy } from '../common/util'
import { useParent } from '../composables/useParent'
import { TABBAR_KEY } from '../wd-tabbar/types'
import { tabbarItemProps } from './types'
import type { BadgeProps } from '../wd-badge/types'

const props = defineProps(tabbarItemProps)

const { parent: tabbar, index } = useParent(TABBAR_KEY)

const customBadgeProps = computed(() => {
  const badgeProps: Partial<BadgeProps> = deepAssign(
    isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: props.max,
        isDot: props.isDot,
        modelValue: props.value
      },
      isUndefined
    )
  )
  if (!isDef(badgeProps.max)) {
    badgeProps.max = 99
  }
  return badgeProps
})

const textStyle = computed(() => {
  const style: CSSProperties = {}
  if (tabbar) {
    if (active.value && tabbar.props.activeColor) {
      style['color'] = tabbar.props.activeColor
    }
    if (!active.value && tabbar.props.inactiveColor) {
      style['color'] = tabbar.props.inactiveColor
    }
  }

  return `${objToStyle(style)}`
})

const active = computed(() => {
  const name = isDef(props.name) ? props.name : index.value
  if (tabbar) {
    if (tabbar.props.modelValue === name) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
})

/**
 * 点击tabbar选项
 */
function handleClick() {
  const name: string | number = isDef(props.name) ? props.name : index.value
  tabbar && tabbar.setChange({ name })
}
</script>
<style>
.wot-theme-dark .wd-tabbar-item__body .is-inactive {
  color: #595959;
}

.wd-tabbar-item {
  flex: 1;
  text-align: center;
  text-decoration: none;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wd-tabbar-item__body {
  display: flex;
  align-items: center;
  flex-direction: column;
  line-height: 1;
  padding: 0;
  position: relative;
}

.wd-tabbar-item__body .is-active {
  color: var(--wot-tabbar-active-color, var(--wot-color-theme, #4d80f0));
}

.wd-tabbar-item__body .is-inactive {
  color: var(--wot-tabbar-inactive-color, var(--wot-color-title, var(--wot-color-black, rgb(0, 0, 0))));
}

.wd-tabbar-item__body-title {
  font-size: var(--wot-tabbar-item-title-font-size, 10px);
  line-height: var(--wot-tabbar-item-title-line-height, initial);
}

.wd-tabbar-item__body-icon {
  font-size: var(--wot-tabbar-item-icon-size, 20px);
}
</style>
