<template>
  <view>
    <pro-popup custom-class="rounded-[16px_16px_0_0]"
      :custom-style="`${(actions && actions.length) || (panels && panels.length) ? 'background: transparent;' : ''}`"
      v-model="showPopup" :duration="duration" position="bottom" :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom" :lazy-render="lazyRender" @enter="handleOpen" @close="close"
      @after-enter="handleOpened" @after-leave="handleClosed" @click-modal="handleClickModal" :z-index="zIndex">
      <view :class="cn('bg-white pb-[1px]', customClass)" :style="`${(actions && actions.length) || (panels && panels.length)
        ? 'margin: 0 10px calc(var(--window-bottom) + 10px) 10px; border-radius: 16px;'
        : 'margin-bottom: var(--window-bottom);'
        } ${customStyle}`">
        <view v-if="title"
          :class="`relative text-center text-black/85 h-16 leading-[1] text-base font-medium ${customHeaderClass}`">
          {{ title }}
          <pro-icon custom-class="absolute leading-[1.1] top-[25px] right-[15px] text-black/65 text-base" name="cross"
            @click="close" />
        </view>
        <view class="py-2 px-0 max-h-[50vh] overflow-y-auto overflow-scrolling-touch" v-if="actions && actions.length">
          <button v-for="(action, rowIndex) in actions" :key="rowIndex" :class="cn(
            `relative block w-full text-center border-none outline-none h-12 leading-[1] text-black/85 text-base text-white after:hidden`,
            action.disabled ? 'cursor-not-allowed text-black/25' : '',
            action.loading ? 'flex items-center justify-center leading-[initial]' : '',
            !action.disabled && !action.loading ? 'bg-[#f5f5f5]' : '')" :style="`color: ${action.color}`"
            @click="select(rowIndex, 'action')">
            <pro-loading custom-class="`w-5 h-5" v-if="action.loading" />
            <view v-else class="inline-block">{{ action.name }}</view>
            <view v-if="!action.loading && action.subname" class="inline-block ml-1 text-xs text-black/45">{{
              action.subname }}</view>
          </button>
        </view>
        <view v-if="formatPanels && formatPanels.length">
          <view v-for="(panel, rowIndex) in formatPanels" :key="rowIndex"
            class="h-[84px] overflow-y-hidden first-of-type:mt-5 last-of-type:mb-3">
            <view class="flex overflow-x-auto overflow-scrolling-touch">
              <view v-for="(col, colIndex) in panel" :key="colIndex"
                class="h-[88px] flex-[0_0_auto] inline-block p-[12px_0_11px]"
                @click="select(rowIndex, 'panels', colIndex)">
                <image class="block my-0 mx-auto mb-[7px] w-10 h-10 rounded" :src="(col as any).iconUrl" />
                <view
                  class="text-center leading-[1.2] text-black/85 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ (col as any).title }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <slot />
        <button v-if="cancelText"
          class="block p-0 text-center leading-[44px] text-base text-[#131415] rounded-[22px] bg-[#f0f0f0] outline-none mx-auto mt-0 mb-6 font-medium border-none w-[calc(100%-48px)] active:bg-[#e0e0e0] after:hidden"
          @click="handleCancel">
          {{ cancelText }}
        </button>
      </view>
    </pro-popup>
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-action-sheet',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>


import { watch, ref } from 'vue'
import { actionSheetProps, type Panel } from './types'
import { isArray } from '../common/util'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(actionSheetProps)
const emit = defineEmits(['select', 'click-modal', 'cancel', 'closed', 'close', 'open', 'opened', 'update:modelValue'])

const formatPanels = ref<Array<Panel> | Array<Panel[]>>([])

const showPopup = ref<boolean>(false)

watch(() => props.panels, computedValue, { deep: true, immediate: true })

watch(
  () => props.modelValue,
  (newValue) => {
    showPopup.value = newValue
  },
  { deep: true, immediate: true }
)

function isPanelArray() {
  return props.panels.length && !isArray(props.panels[0])
}
function computedValue() {
  formatPanels.value = isPanelArray() ? [props.panels as Panel[]] : (props.panels as Panel[][])
}

function select(rowIndex: number, type: 'action' | 'panels', colIndex?: number) {
  if (type === 'action') {
    if (props.actions[rowIndex].disabled || props.actions[rowIndex].loading) {
      return
    }
    emit('select', {
      item: props.actions[rowIndex],
      index: rowIndex
    })
  } else if (isPanelArray()) {
    emit('select', {
      item: props.panels[Number(colIndex)],
      index: colIndex
    })
  } else {
    emit('select', {
      item: (props.panels as Panel[][])[rowIndex][Number(colIndex)],
      rowIndex,
      colIndex
    })
  }
  close()
}
function handleClickModal() {
  emit('click-modal')
  // if (props.closeOnClickModal) {
  //   close()
  // }
}
function handleCancel() {
  emit('cancel')
  close()
}
function close() {
  emit('update:modelValue', false)
  emit('close')
}
function handleOpen() {
  emit('open')
}
function handleOpened() {
  emit('opened')
}
function handleClosed() {
  emit('closed')
}
</script>
