<template>
  <div>
    <wd-popup
      custom-class="wd-action-sheet__popup"
      :custom-style="`${(actions && actions.length) || (panels && panels.length) ? 'background: transparent;' : ''}`"
      v-model="showPopup"
      :duration="duration"
      position="bottom"
      :close-on-click-modal="closeOnClickModal"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :lazy-render="lazyRender"
      @enter="handleOpen"
      @close="close"
      @after-enter="handleOpened"
      @after-leave="handleClosed"
      @click-modal="handleClickModal"
      :z-index="zIndex"
    >
      <div
        :class="cn(`wd-action-sheet bg-white pb-px`, customClass)"
        :style="`${
          (actions && actions.length) || (panels && panels.length)
            ? 'margin: 0 10px calc(var(--window-bottom) + 10px) 10px; border-radius: 16px;'
            : 'margin-bottom: var(--window-bottom);'
        } ${customStyle}`"
      >
        <div v-if="title" :class="cn(`wd-action-sheet__header`, customHeaderClass)">
          {{ title }}
          <wd-icon custom-class="wd-action-sheet__close" name="cross" @click="close" />
        </div>
        <div class="wd-action-sheet__actions py-2 px-0 max-h-[50vh] overflow-y-auto overflow-scrolling-touch" v-if="actions && actions.length">
          <button
            v-for="(action, rowIndex) in actions"
            :key="rowIndex"
            :class="
              cn(
                'wd-action-sheet__action relative block w-full h-12 text-black/85 text-base leading-[48px] text-center border-none bg-white outline-none',
                'after:hidden',
                action.disabled ? 'wd-action-sheet__action--disabled text-black/25 cursor-not-allowed' : '',
                action.loading ? 'wd-action-sheet__action--loading flex justify-center items-center leading-[initial]' : ''
              )
            "
            :style="`color: ${action.color}`"
            @click="select(rowIndex, 'action')"
          >
            <wd-loading custom-class="`wd-action-sheet__action-loading w-5 h-5" v-if="action.loading" />
            <div v-else class="wd-action-sheet__name inline-block">{{ action.name }}</div>
            <div v-if="!action.loading && action.subname" class="wd-action-sheet__subname inline-block ml-1 text-xs text-black/45">
              {{ action.subname }}
            </div>
          </button>
        </div>
        <div v-if="formatPanels && formatPanels.length">
          <div
            v-for="(panel, rowIndex) in formatPanels"
            :key="rowIndex"
            class="wd-action-sheet__panels h-[84px] overflow-y-hidden first-of-type:mt-5 last-of-type:mb-3"
          >
            <div class="wd-action-sheet__panels-content flex overflow-x-auto overflow-scrolling-touch">
              <div
                v-for="(col, colIndex) in panel"
                :key="colIndex"
                class="wd-action-sheet__panel w-[88px] flex-[0_0_auto] inline-block pt-3 px-0 pb-[11px]"
                @click="select(rowIndex, 'panels', colIndex)"
              >
                <img class="wd-action-sheet__panel-img block w-10 h-10 mt-0 mx-auto mb-[7px] rounded" :src="(col as any).iconUrl" />
                <div
                  class="wd-action-sheet__panel-title text-xs leading-[1.2] text-center text-black/85 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ (col as any).title }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <slot />
        <button v-if="cancelText" class="wd-action-sheet__cancel" @click="handleCancel">{{ cancelText }}</button>
      </div>
    </wd-popup>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-action-sheet',
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
import { cn, isArray } from '../common/util'

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

<style>
.wd-action-sheet__popup {
  border-radius: var(--wot-action-sheet-radius, 16px) var(--wot-action-sheet-radius, 16px) 0 0;
}

.wd-action-sheet__action:not(.wd-action-sheet__action--disabled):not(.wd-action-sheet__action--loading):active {
  background: var(--wot-action-sheet-active-color, var(--wot-color-bg, #f5f5f5));
}

.wd-action-sheet__cancel {
  display: block;
  width: calc(100% - 48px);
  line-height: var(--wot-action-sheet-cancel-height, 44px);
  padding: 0;
  color: var(--wot-action-sheet-cancel-color, #131415);
  font-size: var(--wot-action-sheet-fs, var(--wot-fs-title, 16px));
  text-align: center;
  border-radius: var(--wot-action-sheet-cancel-radius, 22px);
  border: none;
  background: var(--wot-action-sheet-cancel-bg, rgb(240, 240, 240));
  outline: none;
  margin: 0 auto 24px;
  font-weight: var(--wot-action-sheet-weight, 500);
}

.wd-action-sheet__cancel:active {
  background: var(--wot-action-sheet-active-color, var(--wot-color-bg, #f5f5f5));
}

.wd-action-sheet__cancel:after {
  display: none;
}

.wd-action-sheet__header {
  color: var(--wot-action-sheet-color, rgba(0, 0, 0, 0.85));
  position: relative;
  height: var(--wot-action-sheet-title-height, 64px);
  line-height: var(--wot-action-sheet-title-height, 64px);
  text-align: center;
  font-size: var(--wot-action-sheet-title-fs, var(--wot-fs-title, 16px));
  font-weight: var(--wot-action-sheet-weight, 500);
}

.wd-action-sheet__close {
  position: absolute;
  top: var(--wot-action-sheet-close-top, 25px);
  right: var(--wot-action-sheet-close-right, 15px);
  color: var(--wot-action-sheet-close-color, rgba(0, 0, 0, 0.65));
  font-size: var(--wot-action-sheet-close-fs, var(--wot-fs-title, 16px));
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  line-height: 1.1;
}
</style>
