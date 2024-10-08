<template>
  <view :class="cn('flex-1 text-center text-decoration-none h-full flex justify-center items-center', customClass)"
    :style="customStyle" @click="handleClick">
    <pro-badge v-bind="customBadgeProps">
      <view class="flex items-center flex-col leading-[1] p-0 relative">
        <slot name="icon" :active="active"></slot>
        <template v-if="!$slots.icon && icon">
          <pro-icon :name="icon" :custom-style="textStyle"
            :custom-class="cn('text-xl', active ? 'text-primary' : 'text-black')"></pro-icon>
        </template>
        <text v-if="title" :style="textStyle"
          :class="cn('text-[10px] leading-[initial]', active ? 'text-primary' : 'text-black')">
          {{ title }}
        </text>
      </view>
    </pro-badge>
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-tabbar-item',
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
import type { BadgeProps } from '../pro-badge/types'
import { cn } from '@/uni_modules/pro-core/lib/utils'

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