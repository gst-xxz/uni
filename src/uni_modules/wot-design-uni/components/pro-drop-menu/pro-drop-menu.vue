<template>
  <view :style="customStyle" :class="cn('box-border relative text-[#262626] text-sm', customClass)" @click.stop="noop"
    :id="dropMenuId">
    <!-- #ifdef MP-DINGTALK -->
    <view :id="dropMenuId">
      <!-- #endif -->
      <view class="flex text-center bg-white">
        <view v-for="(child, index) in children" :key="index" @click="toggle(child)"
          :class="cn('flex-1 min-w-0 text-center h-12 leading-[48px]', child.disabled ? 'text-black/25' : '', child.$.exposed!.getShowPop() ? 'is-active font-medium' : '')">
          <view
            :class="cn('after-content-empty relative inline-block max-w-full box-border py-0 px-[15px] after:absolute after:w-[19px] after:h-[3px] after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:bg-primary after:rounded-[3px] after:transition-opacity after:opacity-0 after:duration-150', child.$.exposed!.getShowPop() ? 'after:opacity-100' : '')">
            <view class="relative overflow-hidden text-ellipsis whitespace-nowrap">
              {{ getDisplayTitle(child) }}
            </view>
            <pro-icon :name="child.icon" :size="child.iconSize"
              :custom-class="cn('absolute top-1/2 -right-1 inline-block scale-[0.6] text-sm transition-transform origin-center duration-300 -translate-y-1/2 align-baseline', child.$.exposed!.getShowPop() ? 'rotate-180' : '')" />
          </view>
        </view>
      </view>
      <slot />
      <!-- #ifdef MP-DINGTALK -->
    </view>
    <!-- #endif -->
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-drop-menu',
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
import { getRect, uuid } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { DROP_MENU_KEY, dropMenuProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils'

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
      console.error("warning(pro-drop-menu): direction must be 'up' or 'down'")
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
  console.error('[wot-design] warning(pro-drop-menu-item): no value is matched in the options option.')
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
