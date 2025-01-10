<template>
  <div v-if="showWrapper" :class="cn(`wd-drop-item`, customClass)" :style="positionStyle">
    <wd-popup
      v-model="showPop"
      :z-index="zIndex"
      :duration="duration"
      :position="position"
      :custom-style="customPopupStyle"
      :custom-class="cn('absolute max-h-[80%]', customPopupClass)"
      modalClass="absolute"
      :modal="modal"
      :close-on-click-modal="false"
      @click-modal="closeOnClickModal && close()"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div v-if="options.length">
        <div
          v-for="(item, index) in options"
          :key="index"
          @click="choose(index)"
          :class="cn(`wd-drop-item__option ${(item[valueKey] !== '' ? item[valueKey] : item) === modelValue ? 'is-active' : ''}`)"
        >
          <div :class="cn(`wd-drop-item__title`, customTitle)">
            <span>{{ item[labelKey] ? item[labelKey] : item }}</span>
            <span v-if="item[tipKey]" class="wd-drop-item__tip">{{ item[tipKey] }}</span>
          </div>
          <wd-icon
            v-if="(item[valueKey] !== '' ? item[valueKey] : item) === modelValue"
            :name="iconName"
            size="20px"
            :class="cn(`wd-drop-item__icon`, customIcon)"
          />
        </div>
      </div>
      <slot v-else />
    </wd-popup>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-drop-menu-item',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { pushToQueue, removeFromQueue } from '../common/clickoutside'
import { type Queue, queueKey } from '../composables/useQueue'
import type { PopupType } from '../wd-popup/types'
import { useParent } from '../composables/useParent'
import { DROP_MENU_KEY } from '../wd-drop-menu/types'
import { cn, isDef, isFunction } from '../common/util'
import { dorpMenuItemProps, type DropMenuItemExpose } from './types'

const props = defineProps(dorpMenuItemProps)
const emit = defineEmits(['change', 'update:modelValue', 'open', 'opened', 'closed', 'close'])

const queue = inject<Queue | null>(queueKey, null)
const showWrapper = ref<boolean>(false)
const showPop = ref<boolean>(false)
const position = ref<PopupType>()
const zIndex = ref<number>(12)
const modal = ref<boolean>(true)
const closeOnClickModal = ref<boolean>(true)
const duration = ref<number>(0)

const { parent: dropMenu } = useParent(DROP_MENU_KEY)

const { proxy } = getCurrentInstance() as any

const positionStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    ...props.customStyle,
    zIndex: zIndex.value
  }
  if (showWrapper.value && dropMenu) {
    style.top = dropMenu.props.direction === 'down' ? `calc(var(--window-top) + ${dropMenu.offset.value}px)` : 0
    style.bottom = dropMenu.props.direction === 'down' ? 0 : `calc(var(--window-bottom) + ${dropMenu.offset.value}px)`
  }
  return style
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (isDef(newValue) && typeof newValue !== 'number' && typeof newValue !== 'string') {
      console.error('[wot-design] warning(wd-drop-menu-item): the type of value should be a number or a string.')
    }
  },
  {
    deep: true,
    immediate: true
  }
)

onBeforeMount(() => {
  if (queue && queue.pushToQueue) {
    queue.pushToQueue(proxy)
  } else {
    pushToQueue(proxy)
  }
})

onBeforeUnmount(() => {
  if (queue && queue.removeFromQueue) {
    queue.removeFromQueue(proxy)
  } else {
    removeFromQueue(proxy)
  }
})

function getShowPop() {
  return showPop.value
}
// 模拟单选操作 默认根据 value 选中操作
function choose(index: number) {
  if (props.disabled) return
  const { valueKey } = props
  const item = props.options[index]
  emit('update:modelValue', item[valueKey] !== '' && item[valueKey] !== undefined ? item[valueKey] : item)
  emit('change', {
    value: item[valueKey] !== '' && item[valueKey] !== undefined ? item[valueKey] : item,
    selectedItem: item
  })
  close()
}
// 外部关闭弹出框
function close() {
  if (!showPop.value) {
    return
  }
  if (isFunction(props.beforeToggle)) {
    props.beforeToggle({
      status: false,
      resolve: (isPass: boolean) => {
        isPass && handleClose()
      }
    })
  } else {
    handleClose()
  }
}

function handleClose() {
  if (showPop.value) {
    showPop.value = false
  }
}

function open() {
  if (showPop.value) {
    return
  }
  if (isFunction(props.beforeToggle)) {
    props.beforeToggle({
      status: true,
      resolve: (isPass) => {
        isPass && handleOpen()
      }
    })
  } else {
    handleOpen()
  }
}

function handleOpen() {
  showWrapper.value = true
  showPop.value = true
  if (dropMenu) {
    modal.value = Boolean(dropMenu.props.modal)
    duration.value = Number(dropMenu.props.duration)
    closeOnClickModal.value = Boolean(dropMenu.props.closeOnClickModal)
    position.value = dropMenu.props.direction === 'down' ? 'top' : 'bottom'
  }
  emit('open')
}

function toggle() {
  if (showPop.value) {
    close()
  } else {
    open()
  }
}

function afterLeave() {
  showWrapper.value = false
  emit('closed')
}
function beforeEnter() {
  emit('open')
}
function afterEnter() {
  emit('opened')
}
function beforeLeave() {
  emit('close')
}

defineExpose<DropMenuItemExpose>({ getShowPop, open, close, toggle })
</script>

<style>
.wd-drop-item {
  position: fixed;
  right: 0;
  left: 0;
  overflow: hidden;
  font-size: var(--wot-drop-menu-item-fs, var(--wot-fs-content, 14px));
  color: var(--wot-drop-menu-item-color, var(--wot-color-content, #262626));
  width: 100%;
  z-index: 101;
}

.wd-drop-item .wd-drop-item__popup {
  position: absolute;
  max-height: 80%;
}

.wd-drop-item__option {
  display: flex;
  height: var(--wot-drop-menu-item-height, 48px);
  line-height: var(--wot-drop-menu-item-height, 48px);
  padding: 0 var(--wot-drop-menu-side-padding, var(--wot-size-side-padding, 15px));
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s;
}

.wd-drop-item__option.is-active {
  color: var(--wot-drop-menu-item-color-active, var(--wot-color-theme, #4d80f0));
}

.wd-drop-item__title {
  display: block;
}

.wd-drop-item__tip {
  display: inline-block;
  color: var(--wot-drop-menu-item-color-tip, rgba(0, 0, 0, 0.45));
  font-size: var(--wot-drop-menu-item-fs-tip, var(--wot-fs-secondary, 12px));
  margin-left: 2px;
}

.wd-drop-item__icon {
  display: block;
  font-size: var(--wot-drop-menu-option-check-size, 20px);
}

.wd-drop-item__modal {
  position: fixed;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  height: 100%;
}
</style>
