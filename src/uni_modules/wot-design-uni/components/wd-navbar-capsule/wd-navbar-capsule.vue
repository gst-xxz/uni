<template>
  <div class="wd-navbar-capsule relative box-border w-[88px] h-8 flex items-center justify-center empty:hidden">
    <wd-icon @click="handleBack" name="chevron-left" custom-class="wd-navbar-capsule__icon" />
    <wd-icon @click="handleBackHome" name="home" custom-class="wd-navbar-capsule__icon" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-navbar-capsule',
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

<style>
.wd-navbar-capsule:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
  border-radius: calc(var(--wot-navbar-capsule-border-radius, 16px) * 2);
  border: 0.0625rem solid var(--wot-navbar-capsule-border-color, #e7e7e7);
}

.wd-navbar-capsule:after {
  content: '';
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 1px;
  height: 1.125rem;
  background: var(--wot-navbar-capsule-border-color, #e7e7e7);
}

.wd-navbar-capsule__icon {
  flex: 1;
  position: relative;
  color: var(--wot-navbar-desc-font-color, var(--wot-font-gray-1, rgba(0, 0, 0, 0.9)));
  font-size: var(--wot-navbar-capsule-icon-size, 20px);
}
</style>
