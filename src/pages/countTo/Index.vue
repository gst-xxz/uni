<template>
  <page-wraper>
    <demo-block title="基本用法">
      <pro-count-to :endVal="endVal" suffix="年" color="#16baaa"></pro-count-to>
      <pro-count-to prefix="￥" :decimals="2" :endVal="186.321" :fontSize="32" suffix="%" color="#1e9fff"></pro-count-to>
      <pro-count-to prefix="￥" :decimals="2" :endVal="21286.321" :fontSize="32" suffix="%"
        color="#ff5722"></pro-count-to>
      <pro-count-to prefix="￥" :decimals="2" :endVal="21286.321" :fontSize="32" suffix="%" color="#ffb800"
        :duration="2000"></pro-count-to>
    </demo-block>

    <demo-block title="手动控制">
      <pro-count-to ref="countTo" :auto-start="false" prefix="￥" :startVal="1000" :decimals="3" :endVal="9999.32"
        :fontSize="32" suffix="%" color="#1e9fff"></pro-count-to>

      <wd-grid clickable border>
        <wd-grid-item text="开始" icon="play-circle-stroke" @itemclick="start" />
        <wd-grid-item text="暂停" icon="pause-circle" @itemclick="pause" />
        <wd-grid-item text="重置" icon="refresh" @itemclick="reset" />
      </wd-grid>
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup>
import type { CountToInstance } from '@/uni_modules/wot-design-uni/components/pro-count-to/types'
import { ref } from 'vue'

const endVal = ref<number>(2024)
const countTo = ref<CountToInstance>()

const start = () => {
  countTo.value!.start()
}
const pause = () => {
  countTo.value!.pause()
}
const reset = () => {
  countTo.value!.reset()
}
</script>
<style lang="scss" scoped></style>
