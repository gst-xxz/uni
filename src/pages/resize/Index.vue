<template>
  <page-wraper>
    <demo-block title="基础用法">
      <pro-resize @resize="handleResize">
        <view :style="`background: #4d80f0; width: ${width};height: ${height}`"></view>
      </pro-resize>
      <view class="tip-item">
        <view class="tip-label">width:</view>
        {{ lastWidth }}
        <pro-icon name="arrow-thin-up" custom-class="icon"></pro-icon>
        {{ sizeWidth }}
      </view>
      <view class="tip-item">
        <view class="tip-label">height:</view>
        {{ lastHeight }}
        <pro-icon name="arrow-thin-up" custom-class="icon"></pro-icon>
        {{ sizeHeight }}
      </view>
      <view class="tip-item">
        <view class="tip-label">top:</view>
        {{ lastTop }}
        <pro-icon name="arrow-thin-up" custom-class="icon"></pro-icon>
        {{ sizeTop }}
      </view>
      <view class="tip-item">
        <view class="tip-label">right:</view>
        {{ lastRight }}
        <pro-icon name="arrow-thin-up" custom-class="icon"></pro-icon>
        {{ sizeRight }}
      </view>
      <view class="tip-item">
        <view class="tip-label">bottom:</view>
        {{ lastBottom }}
        <pro-icon name="arrow-thin-up" custom-class="icon"></pro-icon>
        {{ sizeBottom }}
      </view>
      <view class="tip-item">
        <view class="tip-label">left:</view>
        {{ lastLeft }}
        <pro-icon name="arrow-thin-up" custom-class="icon"></pro-icon>
        {{ sizeLeft }}
      </view>
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
const width = ref<string>('')
const height = ref<string>('')
const lastWidth = ref<string>('')
const lastHeight = ref<string>('')
const lastTop = ref<string>('')
const lastRight = ref<string>('')
const lastBottom = ref<string>('')
const lastLeft = ref<string>('')
const sizeWidth = ref<string>('')
const sizeHeight = ref<string>('')
const sizeTop = ref<string>('')
const sizeRight = ref<string>('')
const sizeBottom = ref<string>('')
const sizeLeft = ref<string>('')

onReady(() => {
  setTimeout(() => {
    width.value = '100px'
    height.value = '100px'
  }, 1500)
})

function handleResize(detail: Record<string, string | number>) {
  console.log(detail)
  const { height, width, top, right, bottom, left } = detail
  lastHeight.value = sizeHeight.value
  lastTop.value = sizeTop.value
  lastRight.value = sizeRight.value
  lastBottom.value = sizeBottom.value
  lastLeft.value = sizeLeft.value
  sizeHeight.value = height as string
  sizeWidth.value = width as string
  sizeTop.value = top as string
  sizeRight.value = right as string
  sizeBottom.value = bottom as string
  sizeLeft.value = left as string
}
</script>
<style lang="scss" scoped>
.tip-item {
  margin-top: 15px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.tip-label {
  display: inline-block;
  width: 70px;
}

:deep(.icon) {
  margin: 0 4px;
  transform: rotate(90deg);
}
</style>
