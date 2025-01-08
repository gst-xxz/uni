<template>
  <div :style="customStyle" :class="cn(`wd-drop-menu`, customClass)" @click.stop="noop" :id="dropMenuId">
    <!-- #ifdef MP-DINGTALK -->
    <div :id="dropMenuId">
      <!-- #endif -->
      <div class="wd-drop-menu__list">
        <div
          v-for="(child, index) in children"
          :key="index"
          @click="toggle(child)"
          :class="cn(`wd-drop-menu__item ${child.disabled ? 'is-disabled' : ''} ${child.$.exposed!.getShowPop() ? 'is-active' : ''}`)"
        >
          <div class="wd-drop-menu__item-title">
            <div class="wd-drop-menu__item-title-text">{{ getDisplayTitle(child) }}</div>
            <wd-icon :name="child.icon" :size="child.iconSize" custom-class="wd-drop-menu__arrow" />
          </div>
        </div>
      </div>
      <slot />
      <!-- #ifdef MP-DINGTALK -->
    </div>
    <!-- #endif -->
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-drop-menu',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, inject, onBeforeMount, ref, watch } from 'vue'
import { closeOther } from '../common/clickoutside'
import { type Queue, queueKey } from '../composables/useQueue'
import { cn, getRect, uuid } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { DROP_MENU_KEY, dropMenuProps } from './types'

const props = defineProps(dropMenuProps)
const queue = inject<Queue | null>(queueKey, null)
const dropMenuId = ref<string>(`dropMenuId${uuid()}`)
const offset = ref<number>(0)
const windowHeight = ref<number>(0)

const { proxy } = getCurrentInstance() as any

const { linkChildren, children } = useChildren(DROP_MENU_KEY)

linkChildren({ props, fold, offset })

watch(
  () => props.direction,
  (newValue) => {
    if (!['up', 'down'].includes(newValue)) {
      // eslint-disable-next-line quotes
      console.error("[wot design] warning(wd-drop-menu): direction must be 'up' or 'down'")
    }
  },
  { deep: true, immediate: true }
)

onBeforeMount(() => {
  windowHeight.value = uni.getSystemInfoSync().windowHeight
})

function noop(event: Event) {
  event.preventDefault()
  event.stopPropagation()
}

function getDisplayTitle(child: any) {
  const { title, modelValue, options, valueKey, labelKey } = child

  if (title) {
    return title
  }
  for (let i = 0, len = options.length; i < len; i++) {
    if (modelValue === options[i][valueKey]) {
      return options[i][labelKey]
    }
  }
  console.error('[wot-design] warning(wd-drop-menu-item): no value is matched in the options option.')
}

function toggle(child: any) {
  // 点击当前 menu, 关闭其他 menu
  if (child && !child.disabled) {
    if (queue && queue.closeOther) {
      queue.closeOther(child)
    } else {
      closeOther(child)
    }
    fold(child)
  }
}

/**
 * 控制菜单内容是否展开
 */
function fold(child: any) {
  getRect(`#${dropMenuId.value}`, false, proxy).then((rect) => {
    if (!rect) return
    const { top, bottom } = rect
    if (props.direction === 'down') {
      offset.value = Number(bottom)
    } else {
      offset.value = windowHeight.value - Number(top)
    }
    child.$.exposed!.toggle()
  })
}
</script>

<style>
.wd-drop-menu {
  box-sizing: border-box;
  color: var(--wot-drop-menu-color, var(--wot-color-content, #262626));
  font-size: var(--wot-drop-menu-fs, var(--wot-fs-content, 14px));
  position: relative;
}

.wd-drop-menu__list {
  display: flex;
  text-align: center;
  background-color: #fff;
}

.wd-drop-menu__item {
  flex: 1;
  min-width: 0;
  height: var(--wot-drop-menu-height, 48px);
  line-height: var(--wot-drop-menu-height, 48px);
  text-align: center;
}

.wd-drop-menu__item.is-active {
  font-weight: var(--wot-fw-medium, 500);
}

.wd-drop-menu__item.is-active .wd-drop-menu__item-title:after {
  opacity: 1;
}

.wd-drop-menu__item.is-active .wd-drop-menu__arrow {
  -webkit-transform: scale(0.6) rotate(-180deg);
  transform: scale(0.6) rotate(-180deg);
  -webkit-transform-origin: center center;
  transform-origin: center center;
}

.wd-drop-menu__item.is-disabled {
  color: var(--wot-drop-menu-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-drop-menu__item-title {
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 0 var(--wot-drop-menu-side-padding, var(--wot-size-side-padding, 15px));
  box-sizing: border-box;
}

.wd-drop-menu__item-title:after {
  position: absolute;
  content: '';
  width: 19px;
  height: var(--wot-drop-menu-line-height, 3px);
  bottom: 6px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%);
  background: var(--wot-drop-menu-line-color, var(--wot-color-theme, #4d80f0));
  border-radius: var(--wot-drop-menu-line-height, 3px);
  transition: opacity 0.15s;
  opacity: 0;
}

.wd-drop-menu__item-title-text {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-drop-menu__arrow {
  position: absolute;
  display: inline-block;
  top: 0;
  right: -4px;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  -webkit-transform: scale(0.6);
  transform: scale(0.6);
  font-size: var(--wot-drop-menu-arrow-fs, var(--wot-fs-content, 14px));
}
</style>
