<template>
  <div :class="cn(`wd-search`, light ? 'is-light' : '', hideCancel ? 'is-without-cancel' : '', customClass)" :style="customStyle">
    <div class="wd-search__block">
      <slot name="prefix"></slot>
      <div class="wd-search__field">
        <div v-if="!placeholderLeft" :style="coverStyle" class="wd-search__cover" @click="closeCover">
          <wd-icon name="search" custom-class="wd-search__search-icon"></wd-icon>
          <span class="wd-search__placeholder-txt">{{ placeholder || translate('search') }}</span>
        </div>
        <wd-icon v-if="showInput || str || placeholderLeft" name="search" custom-class="wd-search__search-left-icon"></wd-icon>
        <input
          v-if="showInput || str || placeholderLeft"
          :placeholder="placeholder || translate('search')"
          placeholder-class="wd-search__placeholder-txt"
          confirm-type="search"
          v-model="str"
          class="wd-search__input"
          @focus="searchFocus"
          @input="inputValue"
          @blur="searchBlur"
          @confirm="search"
          :disabled="disabled"
          :maxlength="maxlength"
          :focus="isFocused"
        />
        <wd-icon v-if="str" custom-class="wd-search__clear wd-search__clear-icon" name="error-fill" @click="clearSearch" />
      </div>
    </div>

    <slot v-if="!hideCancel" name="suffix">
      <div class="wd-search__cancel" @click="handleCancel">
        {{ cancelTxt || translate('cancel') }}
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-search',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { type CSSProperties, computed, onMounted, ref, watch } from 'vue'
import { pause, cn } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import { searchProps } from './types'

const props = defineProps(searchProps)
const emit = defineEmits(['update:modelValue', 'change', 'clear', 'search', 'focus', 'blur', 'cancel'])

const { translate } = useTranslate('search')

const isFocused = ref<boolean>(false) // 是否聚焦中
const showInput = ref<boolean>(false) // 是否显示输入框 用于实现聚焦的hack
const str = ref('')
const showPlaceHolder = ref<boolean>(true)
const clearing = ref<boolean>(false)

watch(
  () => props.modelValue,
  (newValue) => {
    str.value = newValue
    if (newValue) {
      showInput.value = true
    }
  },
  { immediate: true }
)

watch(
  () => props.focus,
  (newValue) => {
    if (newValue) {
      if (props.disabled) return
      closeCover()
    }
  }
)

onMounted(() => {
  if (props.focus) {
    closeCover()
  }
})

const coverStyle = computed(() => {
  const coverStyle: CSSProperties = {
    display: str.value === '' && showPlaceHolder.value ? 'flex' : 'none'
  }

  return coverStyle
})

async function hackFocus(focus: boolean) {
  showInput.value = focus
  await pause()
  isFocused.value = focus
}

async function closeCover() {
  if (props.disabled) return
  await pause(100)
  showPlaceHolder.value = false
  hackFocus(true)
}
/**
 * @description input的input事件handle
 * @param value
 */
function inputValue(event: any) {
  str.value = event.detail.value
  emit('update:modelValue', event.detail.value)
  emit('change', {
    value: event.detail.value
  })
}
/**
 * @description 点击清空icon的handle
 */
async function clearSearch() {
  str.value = ''
  clearing.value = true
  if (props.focusWhenClear) {
    isFocused.value = false
  }
  await pause(100)
  if (props.focusWhenClear) {
    showPlaceHolder.value = false
    hackFocus(true)
  } else {
    showPlaceHolder.value = true
    hackFocus(false)
  }
  emit('change', {
    value: ''
  })
  emit('update:modelValue', '')
  emit('clear')
}
/**
 * @description 点击搜索按钮时的handle
 * @param value
 */
function search({ detail: { value } }: any) {
  // 组件触发search事件
  emit('search', {
    value
  })
}
/**
 * @description 输入框聚焦时的handle
 */
function searchFocus() {
  if (clearing.value) {
    clearing.value = false
    return
  }
  showPlaceHolder.value = false
  emit('focus', {
    value: str.value
  })
}
/**
 * @description 输入框失焦的handle
 */
function searchBlur() {
  if (clearing.value) return
  // 组件触发blur事件
  showPlaceHolder.value = !str.value
  showInput.value = !showPlaceHolder.value
  isFocused.value = false
  emit('blur', {
    value: str.value
  })
}
/**
 * @description 点击取消搜索按钮的handle
 */
function handleCancel() {
  // 组件触发cancel事件
  emit('cancel', {
    value: str.value
  })
}
</script>
<style>
.wd-search {
  display: flex;
  padding: var(--wot-search-padding, 10px 0 10px var(--wot-search-side-padding, var(--wot-size-side-padding, 15px)));
  align-items: center;
  background: #fff;
}

.wd-search__block {
  flex: 1;
  background-color: var(--wot-search-input-bg, var(--wot-color-bg, #f5f5f5));
  border-radius: var(--wot-search-input-radius, 15px);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.wd-search__field {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.wd-search__input {
  flex: 1;
  height: var(--wot-search-input-height, 30px);
  box-sizing: border-box;
  padding: var(--wot-search-input-padding, 0 32px 0 42px);
  border: none;
  background: transparent;
  font-size: var(--wot-search-input-fs, var(--wot-fs-content, 14px));
  -webkit-appearance: none;
  outline: none;
  color: var(--wot-search-input-color, #262626);
  z-index: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-search__input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.wd-search__cover {
  width: 100%;
  height: var(--wot-search-input-height, 30px);
  background-color: var(--wot-search-input-bg, var(--wot-color-bg, #f5f5f5));
  line-height: var(--wot-search-input-height, 30px);
  font-size: var(--wot-search-input-fs, var(--wot-fs-content, 14px));
  border-radius: var(--wot-search-input-radius, 15px);
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.wd-search__search-icon {
  margin-right: 8px;
  color: var(--wot-search-icon-color, var(--wot-color-icon, #d9d9d9));
  font-size: var(--wot-search-icon-size, 18px);
}

.wd-search__search-left-icon {
  position: absolute;
  font-size: var(--wot-search-icon-size, 18px);
  top: 50%;
  left: 16px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  color: var(--wot-search-icon-color, var(--wot-color-icon, #d9d9d9));
}

.wd-search__placeholder-txt {
  color: var(--wot-search-placeholder-color, #bfbfbf);
  font-size: var(--wot-search-input-fs, var(--wot-fs-content, 14px));
}

.wd-search__clear {
  position: absolute;
  right: 0;
  padding: 6px 9px 6px 7px;
  color: var(--wot-search-cancel-color, rgba(0, 0, 0, 0.65));
}

.wd-search__clear-icon {
  vertical-align: middle;
  font-size: var(--wot-search-clear-icon-size, var(--wot-fs-title, 16px));
}

.wd-search__cancel {
  padding: var(--wot-search-cancel-padding, 0 var(--wot-search-side-padding, var(--wot-size-side-padding, 15px)) 0 10px);
  height: var(--wot-search-input-height, 30px);
  line-height: var(--wot-search-input-height, 30px);
  font-size: var(--wot-search-cancel-fs, var(--wot-fs-title, 16px));
  color: var(--wot-search-cancel-color, rgba(0, 0, 0, 0.65));
  -webkit-tap-highlight-color: transparent;
}

.wd-search.is-light {
  background: var(--wot-search-light-bg, var(--wot-color-bg, #f5f5f5));
}

.wd-search.is-light .wd-search__block,
.wd-search.is-light .wd-search__cover {
  background: #fff;
}

.wd-search.is-without-cancel {
  padding-right: var(--wot-search-side-padding, var(--wot-size-side-padding, 15px));
}
</style>
