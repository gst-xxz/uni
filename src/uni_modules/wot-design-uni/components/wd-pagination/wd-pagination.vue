<template>
  <div :class="cn(`wd-pager ${customClass}`)" :style="customStyle" v-if="!(hideIfOnePage && totalPageNum === 1)">
    <div class="wd-pager__content">
      <wd-button :plain="modelValue > 1" type="info" size="small" :disabled="modelValue <= 1" custom-class="wd-pager__nav" @click="sub">
        <span v-if="!showIcon">{{ prevText }}</span>
        <wd-icon
          v-else
          :custom-class="`wd-pager__left wd-pager__icon ${modelValue <= 1 ? 'wd-pager__nav--disabled' : 'wd-pager__nav--active'}`"
          name="arrow-left"
        ></wd-icon>
      </wd-button>
      <div class="wd-pager__size">
        <span class="wd-pager__current">{{ modelValue }}</span>
        <span class="wd-pager__separator">/</span>
        <span>{{ totalPageNum }}</span>
      </div>
      <wd-button
        :plain="modelValue < totalPageNum"
        type="info"
        size="small"
        :disabled="modelValue >= totalPageNum"
        custom-class="wd-pager__nav"
        @click="add"
      >
        <span v-if="!showIcon">{{ nextText }}</span>
        <wd-icon
          v-else
          :custom-class="`wd-pager__icon ${modelValue >= totalPageNum ? 'wd-pager__nav--disabled' : 'wd-pager__nav--active'}`"
          name="arrow"
        ></wd-icon>
      </wd-button>
    </div>
    <div class="wd-pager__message" v-if="showMessage">
      <span>{{ `当前页：${modelValue}` }}，</span>
      <span v-if="total">{{ `当前数据：${total}条` }}，</span>
      <span>{{ `分页大小：${pageSize}` }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-pagination',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { paginationProps } from './types'
import { cn } from '../common/util'

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

<style>
.wd-pager {
  -webkit-user-select: none;
  user-select: none;
  background-color: #fff;
}

.wd-pager__icon {
  font-size: var(--wot-pagination-icon-size, var(--wot-fs-content, 14px));
}

.wd-pager__content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: var(--wot-pagination-content-padding, 10px 15px);
}

.wd-pager__message {
  text-align: center;
  color: var(--wot-pagination-message-color, rgba(0, 0, 0, 0.69));
  font-size: var(--wot-pagination-message-fs, 12px);
  padding: var(--wot-pagination-message-padding, 1px 0 16px 0);
}

.wd-pager__nav {
  min-width: var(--wot-pagination-nav-width, 60px);
}

.wd-pager__nav--active {
  color: rgba(0, 0, 0, 0.65);
}

.wd-pager__nav--disabled {
  color: rgba(0, 0, 0, 0.15);
}

.wd-pager__size {
  flex: 1;
  text-align: center;
  font-size: var(--wot-pagination-nav-content-fs, 12px);
}

.wd-pager__separator {
  padding: var(--wot-pagination-nav-sepatator-padding, 0 4px);
}

.wd-pager__left {
  -webkit-transform: rotate(180deg) translateY(1px);
  transform: rotate(180deg) translateY(1px);
  display: inline-block;
}

.wd-pager__current {
  color: var(--wot-pagination-nav-current-color, var(--wot-color-theme, #4d80f0));
}
</style>
