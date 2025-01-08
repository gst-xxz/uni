<template>
  <div
    @click="handleClick"
    :class="`wd-sidebar-item ${active ? 'wd-sidebar-item--active' : ''} ${prefix ? 'wd-sidebar-item--prefix' : ''}  ${
      suffix ? 'wd-sidebar-item--suffix' : ''
    } ${disabled ? 'wd-sidebar-item--disabled' : ''} ${customClass}`"
    :style="customStyle"
  >
    <slot name="icon"></slot>
    <template v-if="!$slots.icon && icon">
      <wd-icon custom-class="wd-sidebar-item__icon" :name="icon"></wd-icon>
    </template>
    <wd-badge v-bind="customBadgeProps" custom-class="wd-sidebar-item__badge">
      {{ label }}
    </wd-badge>
  </div>
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
import type { BadgeProps } from '../wd-badge/types'
import { deepAssign, isDef, isUndefined, omitBy } from '../common/util'

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

<style>
.wd-sidebar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
  font-size: var(--wot-sidebar-font-size, 16px);
  color: var(--wot-sidebar-color, var(--wot-font-gray-1, rgba(0, 0, 0, 0.9)));
  background: var(--wot-sidebar-bg, var(--wot-color-gray-1, #f7f8fa));
  min-height: var(--wot-sidebar-item-height, 56px);
  box-sizing: border-box;
  white-space: wrap;
  line-height: var(--wot-sidebar-item-line-height, 24px);
}

.wd-sidebar-item:active {
  background-color: var(--wot-sidebar-hover-bg, var(--wot-color-gray-2, #f2f3f5));
}

.wd-sidebar-item--active {
  font-weight: 600;
  background: var(--wot-sidebar-active-bg, var(--wot-color-white, rgb(255, 255, 255)));
  color: var(--wot-sidebar-active-color, var(--wot-color-theme, #4d80f0));
}

.wd-sidebar-item--active:before {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--wot-sidebar-active-border-width, 4px);
  height: var(--wot-sidebar-active-border-height, 16px);
  background: var(--wot-sidebar-active-color, var(--wot-color-theme, #4d80f0));
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  content: '';
  border-radius: var(--wot-sidebar-active-border-width, 4px);
}

.wd-sidebar-item--active:active {
  background-color: transparent;
}

.wd-sidebar-item--prefix {
  border-bottom-right-radius: var(--wot-sidebar-border-radius, 8px);
}

.wd-sidebar-item--suffix {
  border-top-right-radius: var(--wot-sidebar-border-radius, 8px);
}

.wd-sidebar-item--disabled {
  color: var(--wot-side-bar-disabled-color, var(--wot-font-gray-4, rgba(0, 0, 0, 0.26)));
  cursor: not-allowed;
}

.wd-sidebar-item--disabled:active {
  background-color: var(--wot-sidebar-bg, var(--wot-color-gray-1, #f7f8fa));
}

.wd-sidebar-item__badge {
  z-index: 2;
}

.wd-sidebar-item__icon {
  font-size: var(--wot-sidebar-icon-size, 20px);
  margin-right: 2px;
}
</style>
