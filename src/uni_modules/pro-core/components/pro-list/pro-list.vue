<template>
  <view class="flex flex-col gap-x-1 p-3">
    <div class="" v-for="item in data" :key="item[keyField as 'id']">
      <slot name="item" :item="item" />
    </div>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-list',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  props: {
    keyField: { type: String, default: 'id' }
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,

      data: [{
        id: 1,
        name: '张三'
      }, {
        id: 2,
        name: '李四'
      }, {
        id: 3,
        name: '王五'
      }]
    }
  }
}
</script>
