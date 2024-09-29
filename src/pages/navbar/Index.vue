<template>
  <pro-toast></pro-toast>
  <page-wraper>
    <pro-navbar fixed placeholder title="Navbar 导航条" left-arrow safeAreaInsetTop
      @click-left="handleClickLeft"></pro-navbar>

    <demo-block title="基础用法" transparent>
      <pro-navbar title="标题"></pro-navbar>
    </demo-block>

    <demo-block title="返回上级" transparent>
      <pro-navbar title="标题" left-text="返回" left-arrow @click-left="handleClickLeft"></pro-navbar>
    </demo-block>

    <demo-block title="右侧按钮" transparent>
      <pro-navbar title="标题" left-text="返回" left-arrow right-text="按钮" @click-left="handleClickLeft"
        @click-right="handleClickRight"></pro-navbar>
    </demo-block>

    <demo-block title="使用插槽" transparent>
      <pro-navbar title="标题" @click-left="handleClickLeft">
        <template #left>
          <pro-icon name="arrow-left" size="24px" class="pro-navbar__arrow" />
        </template>
        <template #right>
          <pro-icon name="search" size="18" />
        </template>
      </pro-navbar>
    </demo-block>

    <demo-block title="禁用按钮" transparent>
      <pro-navbar title="标题" left-text="返回" right-text="按钮" left-arrow left-disabled right-disabled></pro-navbar>
    </demo-block>

    <demo-block title="胶囊样式" transparent>
      <pro-navbar title="标题" left-text="返回" right-text="设置" left-arrow>
        <template #capsule>
          <pro-navbar-capsule @back="handleBack" @back-home="handleBackHome"></pro-navbar-capsule>
        </template>
      </pro-navbar>
    </demo-block>

    <demo-block title="带搜索栏" transparent>
      <pro-navbar left-text="返回" right-text="设置" left-arrow>
        <template #title>
          <view class="search-box">
            <pro-search v-model="keyword" hide-cancel placeholder-left></pro-search>
          </view>
        </template>
      </pro-navbar>
    </demo-block>
    <view style="height: 500rpx"></view>
  </page-wraper>
</template>
<script lang="ts" setup>
import { useToast } from '@/uni_modules/wot-design-uni'
import { ref } from 'vue'

const keyword = ref('')
const { show: showToast } = useToast()

function handleClickLeft() {
  uni.navigateBack({})
}

function handleClickRight() {
  showToast('按钮')
}

function handleBack() {
  uni.navigateBack({})
}

function handleBackHome() {
  uni.reLaunch({ url: '/pages/index/Index' })
}
</script>
<style lang="scss" scoped>
.search-box {
  display: flex;
  height: 100%;
  align-items: center;
  --wot-search-padding: 0;
  --wot-search-side-padding: 0;
}
</style>
