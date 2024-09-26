<template>
  <view
    :class="`wd-search flex items-center bg-white p-[10px_0_10px_15px] ${props.light ? 'is-light' : ''}  ${props.hideCancel ? 'is-without-cancel' : ''} ${props.customClass}`"
    :style="customStyle">
    <!--自定义label插槽-->
    <!--搜索框主体-->
    <view class="wd-search__block flex-1 flex flex-col items-center relative bg-[#f5f5f5] rounded-2xl">
      <slot name="prefix"></slot>
      <view class="wd-search__field flex-1 flex flex-row items-center relative">
        <view v-if="!placeholderLeft" :style="coverStyle"
          class="wd-search__cover w-full flex-row justify-center items-center h-[30px] leading-[1] bg-[#f5f5f5] text-sm rou"
          @click="closeCover">
          <pro-icon name="search" custom-class="wd-search__search-icon mr-2 text-[#d9d9d9] text-lg"></pro-icon>
          <text class="wd-search__placeholder-txt text-sm text-[#bfbfbf]">{{ placeholder || translate('search')
            }}</text>
        </view>
        <!--icon:search-->
        <pro-icon v-if="showInput || str || placeholderLeft" name="search"
          custom-class="wd-search__search-left-icon absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#d9d9d9]"></pro-icon>
        <!--搜索框-->
        <input v-if="showInput || str || placeholderLeft" :placeholder="placeholder || translate('search')"
          placeholder-class="wd-search__placeholder-txt" confirm-type="search" v-model="str"
          class="wd-search__input flex-1 box-border border-none bg-transparent outline-none z-0 text-[#262626] text-sm p-[0_32px_0_42px] h-[30px] appearance-none"
          @focus="searchFocus" @input="inputValue" @blur="searchBlur" @confirm="search" :disabled="disabled"
          :maxlength="maxlength" :focus="isFocused" />
        <!--icon:clear-->
        <pro-icon v-if="str"
          custom-class="wd-search__clear absolute right-0 py-1.5 pr-[9px] pl-[7px] text-black/65 wd-search__clear-icon align-middle text-base"
          name="close" @click="clearSearch" />
      </view>
    </view>
    <!--the button behind input,care for hideCancel without displaying-->

    <slot v-if="!hideCancel" name="suffix">
      <!--默认button-->
      <view class="wd-search__cancel text-black/65 text-base leading-[1] h-[30px] py-0 pr-[15px] pl-2.5 tap-transparent"
        @click="handleCancel">
        {{ cancelTxt || translate('cancel') }}
      </view>
    </slot>
  </view>
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
import { objToStyle, requestAnimationFrame } from '../common/util'
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

  return objToStyle(coverStyle)
})

function hackFocus(focus: boolean) {
  showInput.value = focus
  requestAnimationFrame(() => {
    isFocused.value = focus
  })
}

function closeCover() {
  if (props.disabled) return
  requestAnimationFrame()
    .then(() => requestAnimationFrame())
    .then(() => requestAnimationFrame())
    .then(() => {
      showPlaceHolder.value = false
      hackFocus(true)
    })
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
function clearSearch() {
  str.value = ''
  clearing.value = true
  if (props.focusWhenClear) {
    isFocused.value = false
  }
  requestAnimationFrame()
    .then(() => requestAnimationFrame())
    .then(() => requestAnimationFrame())
    .then(() => {
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
    })
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
<style lang="scss" scoped>
@import './index.scss';
</style>
