<template>
  <page-wraper>
    <demo-block title="基础用法">
      <wd-slider v-model="value1" />
    </demo-block>
    <demo-block title="指定选择范围">
      <wd-slider v-model="value2" :min="-10" :max="10" />
    </demo-block>
    <demo-block title="指定步长">
      <wd-slider v-model="value4" hide-min-max :step="10" />
    </demo-block>
    <demo-block title="指定最大值和最小值">
      <wd-slider v-model="value7" :min="5" :max="50" />
    </demo-block>
    <demo-block title="禁用状态">
      <wd-slider v-model="value5" disabled />
    </demo-block>
    <demo-block title="双向滑块">
      <wd-slider v-model="value6" :min="10" :max="80" />
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref<number>(30)
const value2 = ref<number>(479)
const value4 = ref<number>(11)
const value5 = ref<number>(70)
const value6 = ref<number[]>([20, 40])
const value7 = ref<number>(20)
</script>

<style lang="css" scoped></style>
