<template>
  <view class="min-h-screen">
    <wd-toast />
    <slot />
    <wd-notify />
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-page',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>