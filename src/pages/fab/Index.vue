<template>
  <pro-toast />
  <view class="fab" @click="closeOutside">
    <page-wraper>
      <demo-block title="悬浮按钮主题色">
        <pro-radio-group v-model="type" inline shape="dot">
          <wd-radio value="primary" custom-class="custom-radio">主要按钮</wd-radio>
          <wd-radio value="success" custom-class="custom-radio">成功按钮</wd-radio>
          <wd-radio value="warning" custom-class="custom-radio">警告按钮</wd-radio>
          <wd-radio value="error" custom-class="custom-radio">危险按钮</wd-radio>
          <wd-radio value="info" custom-class="custom-radio">信息按钮</wd-radio>
        </pro-radio-group>
      </demo-block>
      <demo-block title="悬浮按钮位置">
        <pro-radio-group v-model="position" inline shape="dot">
          <wd-radio value="left-top" custom-class="custom-radio">左上</wd-radio>
          <wd-radio value="right-top" custom-class="custom-radio">右上</wd-radio>
          <wd-radio value="left-bottom" custom-class="custom-radio">左下</wd-radio>
          <wd-radio value="right-bottom" custom-class="custom-radio">右下</wd-radio>
        </pro-radio-group>
      </demo-block>
      <demo-block title="菜单弹出方向">
        <pro-radio-group v-model="direction" inline shape="dot">
          <wd-radio value="top" custom-class="custom-radio">向上</wd-radio>
          <wd-radio value="bottom" custom-class="custom-radio">向下</wd-radio>
          <wd-radio value="right" custom-class="custom-radio">向右</wd-radio>
          <wd-radio value="left" custom-class="custom-radio">向左</wd-radio>
        </pro-radio-group>
      </demo-block>
      <demo-block title="禁用">
        <view @click.stop="">
          <pro-switch v-model="disabled" size="22px" />
        </view>
      </demo-block>
      <demo-block title="可拖动">
        <view @click.stop="">
          <pro-switch v-model="draggable" size="22px" />
        </view>
      </demo-block>

      <demo-block title="切换展示">
        <view @click.stop="">
          <wd-button type="primary" @click="active = !active" round>切换</wd-button>
        </view>
      </demo-block>
      <wd-fab v-model:active="active" :disabled="disabled" :type="type" :position="position" :direction="direction"
        :draggable="draggable">
        <wd-button @click="showToast('一键三连')" :disabled="disabled" custom-class="custom-button" type="primary" round>
          <pro-icon name="github-filled" size="22px"></pro-icon>
        </wd-button>
        <wd-button @click="showToast('我要收藏')" :disabled="disabled" custom-class="custom-button" type="success" round>
          <pro-icon name="star" size="22px"></pro-icon>
        </wd-button>

        <wd-button @click="showToast('我要投币')" :disabled="disabled" custom-class="custom-button" type="error" round>
          <pro-icon name="money-circle" size="22px"></pro-icon>
        </wd-button>
        <wd-button @click="showToast('我要点赞')" :disabled="disabled" custom-class="custom-button" type="warning" round>
          <pro-icon name="thumb-up" size="22px"></pro-icon>
        </wd-button>
      </wd-fab>
    </page-wraper>
  </view>
</template>
<script lang="ts" setup>
import { useQueue, useToast } from '@/uni_modules/wot-design-uni'
import { ref } from 'vue'
const { show: showToast } = useToast()
const active = ref<boolean>(false)
const type = ref<'primary' | 'success' | 'info' | 'warning' | 'error' | 'default'>('primary')
const position = ref<'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'>('left-bottom')
const direction = ref<'top' | 'right' | 'bottom' | 'left'>('top')
const disabled = ref<boolean>(false)
const draggable = ref(false)
const { closeOutside } = useQueue()
</script>
<style lang="scss" scoped>
.fab {
  position: relative;
  height: 100%;
  width: 100%;

  :deep(.custom-button) {
    min-width: auto !important;
    box-sizing: border-box;
    width: 32px !important;
    height: 32px !important;
    border-radius: 16px !important;
    margin: 8rpx;
  }

  :deep(.custom-radio) {
    height: 32px !important;
    line-height: 32px !important;
  }
}
</style>
