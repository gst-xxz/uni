<template>
  <view class="navbar-capsule relative box-border flex items-center justify-center w-[88px] h-8">
    <pro-icon @click="handleBack" name="chevron-left" custom-class="flex-1 relative text-gray-1 text-[20px]" />
    <pro-icon @click="handleBackHome" name="home" custom-class="flex-1 relative text-gray-1 text-[20px]" />
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-navbar-capsule',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

const emit = defineEmits(['back', 'back-home'])

function handleBack() {
  emit('back')
}
function handleBackHome() {
  emit('back-home')
}
</script>

<style lang="scss">
.navbar-capsule {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 32px;
    border: 1px solid #e7e7e7;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 18px;
    background: #e7e7e7;
  }

  &:empty {
    display: none;
  }
}
</style>
