<template>
  <view class="flex">
    <view class="item-title">{{ item.name }}</view>
    <view class="item-desc">{{ item.id }}</view>
  </view>
</template>

<script>
export default {
  name: 'XItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>