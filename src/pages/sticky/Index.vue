<template>
  <page-wraper>
    <view style="height: 250vh">
      <view class="demo-block">
        <view class="demo-title">基本用法</view>
        <view class="demo-container">
          <pro-sticky custom-style="margin-left: 20px">
            <wd-button type="success">基础用法</wd-button>
          </pro-sticky>
        </view>
      </view>

      <view class="demo-block">
        <view class="demo-title">吸顶距离</view>
        <view class="demo-container">
          <pro-sticky :offset-top="50" custom-style="margin-left: 120px">
            <wd-button>吸顶距离</wd-button>
          </pro-sticky>
        </view>
      </view>

      <view class="demo-block">
        <view class="demo-title">相对容器</view>
        <view class="demo-container">
          <pro-sticky-box>
            <view class="custom-container">
              <pro-sticky custom-style="margin-left: 220px">
                <wd-button type="warning">相对容器</wd-button>
              </pro-sticky>
            </view>
          </pro-sticky-box>
        </view>
      </view>

      <view class="demo-block">
        <view class="demo-title">动态插入</view>
        <view class="demo-container">
          <wd-button type="info" plain @click="insert">点击插入</wd-button>
          <pro-sticky custom-style="margin-left: 220px">
            <wd-button type="error" v-if="show">动态生成</wd-button>
          </pro-sticky>
        </view>
      </view>

      <view class="demo-block">
        <view class="demo-title">相对容器+吸顶距离</view>
        <view class="demo-container">
          <pro-sticky-box>
            <view class="custom-container">
              <pro-sticky :offset-top="150">
                <wd-button type="warning">相对容器+吸顶距离</wd-button>
              </pro-sticky>
            </view>
          </pro-sticky-box>
        </view>
      </view>
    </view>
  </page-wraper>
</template>
<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
const show = ref<boolean>(false)

function display() {
  show.value = true
}
function insert() {
  display()
}
onShow(() => {
  setTimeout(display, 5000)
})
</script>
<style lang="scss" scoped>
.demo-block {
  padding: 15px 0;
  color: #666;
}

.custom-container {
  height: 120px;
  width: 100vw;
  background-color: #ffffff;
}

.is-white {
  background: #fff;
}

.demo-title {
  padding: 0 15px;
  margin: 10px 0;
  font-size: 13px;
}
</style>
