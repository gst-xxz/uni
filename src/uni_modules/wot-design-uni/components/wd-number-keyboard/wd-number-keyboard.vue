<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :z-index="zIndex"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :modal-style="modal ? '' : 'opacity: 0;'"
    :modal="hideOnClickOutside"
    :lockScroll="lockScroll"
    @click-modal="handleClose"
  >
    <div :class="cn(`wd-number-keyboard ${customClass}`)" :style="customStyle">
      <div class="wd-number-keyboard__header" v-if="showTitle">
        <slot name="title">
          <span class="wd-number-keyboard__title">{{ title }}</span>
        </slot>
        <div class="wd-number-keyboard__close" hover-class="wd-number-keyboard__close--hover" v-if="showClose" @click="handleClose">
          <span>{{ closeText }}</span>
        </div>
      </div>
      <div class="wd-number-keyboard__body">
        <div class="wd-number-keyboard__keys">
          <wd-key v-for="key in keys" :key="key.text" :text="key.text" :type="key.type" :wider="key.wider" @press="handlePress"></wd-key>
        </div>
        <div class="wd-number-keyboard__sidebar" v-if="mode === 'custom'">
          <wd-key v-if="showDeleteKey" large :text="deleteText" type="delete" @press="handlePress"></wd-key>
          <wd-key large :text="closeText" type="close" :loading="closeButtonLoading" @press="handlePress"></wd-key>
        </div>
      </div>
    </div>
  </wd-popup>
</template>
<script lang="ts">
export default {
  name: 'wd-number-keyboard',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import WdKey from './key/index.vue'
import { numberKeyboardProps, type Key } from './types'
import type { NumberKeyType } from './key/types'
import { cn } from '../common/util'

const props = defineProps(numberKeyboardProps)
const emit = defineEmits(['update:visible', 'input', 'close', 'delete', 'update:modelValue'])

const show = ref(props.visible)
watch(
  () => props.visible,
  (newValue) => {
    show.value = newValue
  }
)

const keys = computed(() => (props.mode === 'custom' ? genCustomKeys() : genDefaultKeys()))

const showClose = computed(() => {
  return props.closeText && props.mode === 'default'
})

const showTitle = computed(() => {
  return props.title || showClose.value
})

/**
 * 随机打乱数组的顺序
 * @param arr 要打乱顺序的数组
 * @returns 打乱顺序后的数组
 */
function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    // 生成一个随机索引 j，范围是 [0, i]
    const j = Math.floor(Math.random() * (i + 1))

    // 交换索引 i 和 j 处的元素
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}
function genBasicKeys(): Key[] {
  const keys = Array.from({ length: 9 }, (_, i) => ({ text: i + 1 }))

  // 如果需要随机顺序，则调用 shuffleArray 方法打乱数组顺序
  return props.randomKeyOrder ? shuffleArray(keys) : keys
}

function genDefaultKeys(): Key[] {
  return [
    ...genBasicKeys(),
    { text: props.extraKey as string, type: 'extra' },
    { text: 0 },
    {
      // 根据条件是否显示删除键的文本和类型
      text: props.showDeleteKey ? props.deleteText : '',
      type: props.showDeleteKey ? 'delete' : ''
    }
  ]
}

function genCustomKeys(): Key[] {
  const keys = genBasicKeys()
  const extraKeys = Array.isArray(props.extraKey) ? props.extraKey : [props.extraKey]
  if (extraKeys.length === 1) {
    // 如果只有一个额外按键，则添加一个宽度较大的数字0和一个额外按键
    keys.push({ text: 0, wider: true }, { text: extraKeys[0], type: 'extra' })
  } else if (extraKeys.length === 2) {
    // 如果有两个额外按键，则添加两个额外按键和一个数字0
    keys.push({ text: extraKeys[0], type: 'extra' }, { text: 0 }, { text: extraKeys[1], type: 'extra' })
  }

  return keys
}

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

const handlePress = (text: string, type: NumberKeyType) => {
  if (text === '' && type === 'extra') {
    return handleClose()
  }
  const value = props.modelValue
  if (type === 'delete') {
    emit('delete')
    emit('update:modelValue', value.slice(0, value.length - 1))
  } else if (type === 'close') {
    handleClose()
  } else if (value.length < +props.maxlength) {
    emit('input', text)
    emit('update:modelValue', value + text)
  }
}
</script>

<style>
.wot-theme-dark .wd-number-keyboard {
  background: #646566;
}

.wot-theme-dark .wd-number-keyboard__header {
  color: #fff;
}

.wd-number-keyboard {
  width: 100%;
  background: var(--wot-number-keyboard-background, var(--wot-color-gray-2, #f2f3f5));
  color: var(--wot-color-black, rgb(0, 0, 0));
  -webkit-user-select: none;
  user-select: none;
}

.wd-number-keyboard--with-title {
  border-radius: 20px 20px 0 0;
}

.wd-number-keyboard__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  height: var(--wot-number-keyboard-title-height, 34px);
  padding-top: 6px;
  color: var(--wot-number-keyboard-title-color, var(--wot-color-gray-7, #646566));
  font-size: var(--wot-number-keyboard-title-font-size, 16px);
}

.wd-number-keyboard__title {
  display: inline-block;
  font-weight: 400;
}

.wd-number-keyboard__title-left {
  position: absolute;
  left: 0;
}

.wd-number-keyboard__body {
  display: flex;
  padding: 6px 0 0 6px;
}

.wd-number-keyboard__keys {
  display: flex;
  flex: 3;
  flex-wrap: wrap;
}

.wd-number-keyboard__close {
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  height: 100%;
  padding: var(--wot-number-keyboard-title-font-size, 0 16px);
  color: var(--wot-number-keyboard-close-color, var(--wot-color-theme, #4d80f0));
  font-size: var(--wot-number-keyboard-close-font-size, 14px);
  background-color: transparent;
  border: none;
}

.wd-number-keyboard__close--hover {
  opacity: 0.6;
}

.wd-number-keyboard__sidebar {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
