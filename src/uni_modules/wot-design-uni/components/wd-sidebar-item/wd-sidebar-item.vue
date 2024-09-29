<template>
  <view @click="handleClick" :class="cn(`
  wd-sidebar-item flex items-center justify-center relative p-4 box-border text-base 
  ${active ? 'wd-sidebar-item--active font-semibold' : ''} 
  ${prefix ? 'wd-sidebar-item--prefix' : ''}  
  ${suffix ? 'wd-sidebar-item--suffix' : ''} 
  ${disabled ? 'wd-sidebar-item--disabled cursor-not-allowed' : ''} 
  ${customClass}`)" :style="customStyle">
    <slot name="icon"></slot>
    <template v-if="!$slots.icon && icon">
      <pro-icon custom-class="mr-0.5 text-xl" :name="icon"></pro-icon>
    </template>
    <pro-badge v-bind="customBadgeProps" custom-class="z-[2]">
      {{ label }}
    </pro-badge>
  </view>
</template>

<script lang="ts">
export default {
  name: 'wd-sidebar-item',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useParent } from '../composables/useParent'
import { SIDEBAR_KEY } from '../wd-sidebar/types'
import { sidebarItemProps } from './types'
import type { BadgeProps } from '../pro-badge/types'
import { deepAssign, isDef, isUndefined, omitBy } from '../common/util'
import { cn } from '@/uni_modules/pro-core/lib/utils'

const props = defineProps(sidebarItemProps)

const { parent: sidebar } = useParent(SIDEBAR_KEY)

const customBadgeProps = computed(() => {
  const badgeProps: Partial<BadgeProps> = deepAssign(
    isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined) : {},
    omitBy(
      {
        max: props.max,
        isDot: props.isDot,
        modelValue: props.badge
      },
      isUndefined
    )
  )
  if (!isDef(badgeProps.max)) {
    badgeProps.max = 99
  }
  return badgeProps
})

const active = computed(() => {
  let active: boolean = false
  if (sidebar && sidebar.props.modelValue === props.value) {
    active = true
  }
  return active
})

const prefix = computed(() => {
  let prefix: boolean = false
  if (sidebar) {
    let activeIndex: number = sidebar.children.findIndex((c: any) => {
      return c.value === sidebar.props.modelValue
    })

    let currentIndex: number = sidebar.children.findIndex((c: any) => {
      return c.value === props.value
    })

    if (currentIndex === activeIndex - 1) {
      prefix = true
    }
  }
  return prefix
})

const suffix = computed(() => {
  let suffix: boolean = false
  if (sidebar) {
    let activeIndex: number = sidebar.children.findIndex((c: any) => {
      return c.value === sidebar.props.modelValue
    })

    let currentIndex: number = sidebar.children.findIndex((c: any) => {
      return c.value === props.value
    })

    if (currentIndex === activeIndex + 1) {
      suffix = true
    }
  }
  return suffix
})

function handleClick() {
  if (props.disabled) {
    return
  }
  sidebar && sidebar.setChange(props.value, props.label)
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
