<template>
  <page-wraper>
    <demo-block title="基本用法">
      <pro-steps :active="0">
        <wd-step></wd-step>
        <wd-step></wd-step>
        <wd-step></wd-step>
      </pro-steps>
    </demo-block>
    <demo-block title="水平局中">
      <pro-steps :active="0" align-center>
        <wd-step></wd-step>
        <wd-step></wd-step>
        <wd-step></wd-step>
      </pro-steps>
    </demo-block>
    <demo-block title="标题和描述信息">
      <pro-steps :active="active" align-center>
        <wd-step title="步骤1" description="注册1个账号" />
        <wd-step title="步骤2" description="登录账号并绑定手机" />
        <wd-step title="步骤3" description="完善个人信息" />
      </pro-steps>
      <view style="margin-top: 15px; text-align: center">
        <wd-button size="small" @click="nextStep">下一步</wd-button>
      </view>
    </demo-block>
    <demo-block title="修改图标">
      <pro-steps :active="1" align-center>
        <wd-step icon="setting" />
        <wd-step icon="star-o" />
        <wd-step icon="clock" />
      </pro-steps>
    </demo-block>
    <demo-block title="竖向步骤条">
      <pro-steps :active="1" vertical>
        <wd-step description="注册1个账号" />
        <wd-step description="登录账号并绑定手机，后面是比较长的文案，后面是比较长的文案" />
        <wd-step description="完善个人信息" />
      </pro-steps>
    </demo-block>
    <demo-block title="点状步骤和垂直方向">
      <pro-steps :active="1" vertical dot>
        <wd-step description="注册1个账号" />
        <wd-step description="登录账号并绑定手机" />
        <wd-step description="完善个人信息" />
      </pro-steps>
    </demo-block>
    <demo-block title="修改状态">
      <pro-steps :active="1" align-center>
        <wd-step title="绑定手机" status="error" />
        <wd-step title="重新绑定手机" />
        <wd-step title="步骤3" />
      </pro-steps>
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const active = ref<number>(0)

function nextStep() {
  active.value = active.value + 1
}
</script>
<style lang="scss" scoped></style>
