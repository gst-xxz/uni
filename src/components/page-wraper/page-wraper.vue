<template>
  <view>
    <wd-toast />
    <view class="page-wraper">
      <slot />
    </view>
    <pro-notify />
  </view>
</template>
<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<style lang="scss" scoped>
.page-wraper {
  min-height: calc(100vh - var(--window-top));
  box-sizing: border-box;
}
</style>
