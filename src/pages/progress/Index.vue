<template>
  <page-wraper>
    <demo-block title="基本用法">
      <pro-progress :percentage="30" />
    </demo-block>

    <demo-block title="不显示进度文字">
      <pro-progress :percentage="60" hide-text />
    </demo-block>

    <demo-block title="进度条状态">
      <pro-progress :percentage="100" hide-text status="success" />
      <pro-progress :percentage="80" hide-text status="danger" />
    </demo-block>

    <demo-block title="修改颜色">
      <pro-progress :percentage="80" color="#00c740" />
    </demo-block>

    <demo-block title="颜色数组">
      <pro-progress :percentage="100" :color="['#00c740', '#ffb300', '#e2231a', '#0083ff']" />
      <pro-progress :percentage="percentage" :color="colorObject" />
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const colorObject = ref<any>([
  {
    color: 'yellow',
    percentage: 30
  },
  {
    color: 'red',
    percentage: 60
  },
  {
    color: 'blue',
    percentage: 80
  },
  {
    color: 'black',
    percentage: 90
  }
])
const percentage = ref<number>(100)
</script>
<style lang="scss" scoped></style>
