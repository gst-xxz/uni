<template>
  <view :class="cn('user-select-none bg-white', customClass)" :style="customStyle"
    v-if="!(hideIfOnePage && totalPageNum === 1)">
    <view class="flex justify-start items-center pt-2.5 px-[15px]">
      <wd-button :plain="modelValue > 1" type="info" size="small" :disabled="modelValue <= 1"
        custom-class="min-w-[60px]" @click="sub">
        <text v-if="!showIcon">{{ prevText || translate('prev') }}</text>
        <pro-icon v-else
          :custom-class="cn('inline-block text-sm', { 'text-black/15': modelValue <= 1, 'text-black/65': modelValue > 1 })"
          name="arrow-left"></pro-icon>
      </wd-button>
      <view class="flex-1 text-center text-xs">
        <text class="text-primary">{{ modelValue }}</text>
        <text class="pt-0 px-1">/</text>
        <text>{{ totalPageNum }}</text>
      </view>
      <wd-button :plain="modelValue < totalPageNum" type="info" size="small" :disabled="modelValue >= totalPageNum"
        custom-class="min-w-[60px]" @click="add">
        <text v-if="!showIcon">{{ nextText || translate('next') }}</text>
        <pro-icon v-else
          :custom-class="cn('text-sm', { 'text-black/15': modelValue >= totalPageNum, 'text-black/65': modelValue < totalPageNum })"
          name="arrow"></pro-icon>
      </wd-button>
    </view>
    <view class="text-center text-black/65 text-xs pt-[1px] px-0 pb-4" v-if="showMessage">
      <text>{{ translate('page', modelValue) }}，</text>
      <text v-if="total">{{ translate('total', total) }}，</text>
      <text>{{ translate('size', pageSize) }}</text>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-pagination',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import { paginationProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const { translate } = useTranslate('pagination')

const props = defineProps(paginationProps)
const emit = defineEmits(['change', 'update:modelValue'])

const totalPageNum = ref<number>(0) // 总页数

watch(
  () => props.totalPage,
  (newValue) => {
    if (!totalPageNum.value && newValue) {
      totalPageNum.value = newValue
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.total,
  () => {
    updateTotalPage()
  },
  { immediate: true, deep: true }
)

function add() {
  const { modelValue } = props
  if (modelValue > totalPageNum.value - 1) {
    return
  }
  emit('change', { value: modelValue + 1 })
  emit('update:modelValue', modelValue + 1)
}

function sub() {
  const { modelValue } = props
  if (modelValue < 2) {
    return
  }
  emit('change', { value: modelValue - 1 })
  emit('update:modelValue', modelValue - 1)
}

function updateTotalPage() {
  const { total, pageSize } = props
  if (total) {
    totalPageNum.value = Math.ceil(total / pageSize)
  }
}
</script>
