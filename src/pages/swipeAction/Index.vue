<template>
  <page-wraper>
    <pro-toast />

    <view @click.stop="closeOutside">
      <demo-block transparent title="基本用法">
        <pro-swipe-action>
          <wd-cell title="标题文字" value="内容" />
          <template #right>
            <view class="action">
              <view class="button" style="background: #fa4350" @click="handleAction('操作1')">操作1</view>
              <view class="button" style="background: #f0883a" @click="handleAction('操作2')">操作2</view>
              <view class="button" style="background: #4d80f0" @click="handleAction('操作3')">操作3</view>
            </view>
          </template>
        </pro-swipe-action>
      </demo-block>

      <demo-block transparent title="左右滑动">
        <pro-swipe-action>
          <template #left>
            <view class="action">
              <view class="button" style="background: #fa4350">操作1</view>
              <view class="button" style="background: #f0883a">操作2</view>
              <view class="button" style="background: #4d80f0">操作3</view>
            </view>
          </template>

          <wd-cell title="标题文字" value="内容" />

          <template #right>
            <view class="action">
              <view class="button" style="background: #fa4350">操作4</view>
              <view class="button" style="background: #f0883a">操作5</view>
              <view class="button" style="background: #4d80f0">操作6</view>
            </view>
          </template>
        </pro-swipe-action>
      </demo-block>

      <demo-block transparent title="切换按钮">
        <pro-swipe-action v-model="value" :before-close="beforeClose">
          <template #left>
            <view class="action">
              <view class="button" style="background: #fa4350">操作1</view>
              <view class="button" style="background: #f0883a">操作2</view>
              <view class="button" style="background: #4d80f0">操作3</view>
            </view>
          </template>

          <wd-cell title="标题文字" value="内容" />

          <template #right>
            <view class="action">
              <view class="button" style="background: #fa4350">操作4</view>
              <view class="button" style="background: #f0883a">操作5</view>
              <view class="button" style="background: #4d80f0">操作6</view>
            </view>
          </template>
        </pro-swipe-action>
      </demo-block>
      <view class="button-group">
        <view @click.stop="noop">
          <wd-button size="small" @click="changeState('left')">打开左边</wd-button>
        </view>
        <view @click.stop="noop">
          <wd-button size="small" @click="changeState('close')">关闭所有</wd-button>
        </view>
        <view @click.stop="noop">
          <wd-button size="small" @click="changeState('right')">打开右边</wd-button>
        </view>
      </view>

      <demo-block transparent title="点击事件">
        <pro-swipe-action @click="handleClick">
          <wd-cell title="标题文字" value="内容" />

          <template #right>
            <view class="action">
              <view class="button" style="background: #fa4350">操作1</view>
              <view class="button" style="background: #f0883a">操作2</view>
              <view class="button" style="background: #4d80f0">操作3</view>
            </view>
          </template>
        </pro-swipe-action>
      </demo-block>

      <demo-block transparent title="禁用滑动按钮">
        <pro-swipe-action disabled>
          <wd-cell title="标题文字" value="内容" />

          <template #right>
            <view class="action">
              <view class="button" style="background: #fa4350">操作1</view>
              <view class="button" style="background: #f0883a">操作2</view>
              <view class="button" style="background: #4d80f0">操作3</view>
            </view>
          </template>
        </pro-swipe-action>
      </demo-block>
    </view>
  </page-wraper>
</template>
<script lang="ts" setup>
import { useToast, useQueue } from '@/uni_modules/wot-design-uni'
import type { SwipeActionBeforeClose, SwipeActionStatus } from '@/uni_modules/wot-design-uni/components/pro-swipe-action/types'

const { closeOutside } = useQueue()

import { ref } from 'vue'
const toast = useToast()
const value = ref<SwipeActionStatus>('close')

const beforeClose: SwipeActionBeforeClose = (reason, position) => {
  if (reason === 'click') {
    toast.show(`${reason} ${position}导致滑动按钮关闭`)
  } else {
    toast.show(`${reason}导致${position}滑动按钮关闭`)
  }
}

function changeState(position: SwipeActionStatus) {
  value.value = position
}
function handleClick({ value }: any) {
  toast.show(`点击${value}关闭操作按钮`)
}
function handleAction(action: string) {
  toast.show(`点击了${action}`)
}

function noop() { }
</script>
<style lang="scss" scoped>
.action {
  height: 100%;
}

.button {
  display: inline-block;
  padding: 0 15px;
  height: 100%;
  color: white;
  line-height: 46px;
}

.button-group {
  padding: 10px;
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>
