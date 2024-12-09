<template>
  <div>
    <page-wraper>
      <div class="icon">
        <div style="position: sticky; top: 0; z-index: 2">
          <wd-search hide-cancel placeholder="查找图标" light v-model="keyword" @search="handleSearch"
            @clear="handleClear" />
        </div>
        <div class="icon-list">
          <div v-for="(icon, index) in showIcons" :key="index" class="icon-item" @click="handleClick(icon)">
            <div><wd-icon :name="icon" size="22px" custom-class="icon-item-class" /></div>
            <div class="icon-item-name">{{ icon }}</div>
          </div>
          <wd-status-tip v-if="!showIcons.length" image="search" tip="当前无相关图标" />
        </div>
      </div>
    </page-wraper>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotify } from '@/uni_modules/wot-design-uni'
import iconData from '@/uni_modules/wot-design-uni/components/wd-icon/assets/iconfont.json'

const icons = ref(iconData.glyphs.map(item => item.name))
const { showNotify } = useNotify()
const keyword = ref<string>('')

const showIcons = ref<Array<string>>([])

onMounted(() => {
  showIcons.value = icons.value
})

function handleSearch() {
  showIcons.value = icons.value.filter((str) => str.includes(keyword.value))
}

function handleClear() {
  keyword.value = ''
  showIcons.value = icons.value
}

function handleClick(icon: string) {
  // #ifdef H5
  uni.setClipboardData({
    data: `<wd-icon name="${icon}" size="22px"></wd-icon>`,
    showToast: false,
    success: () => {
      showNotify({
        type: 'success',
        duration: 1500,
        message: `复制成功: <wd-icon name="${icon}" size="22px"></wd-icon>`
      })
    }
  })

  // #endif
}
</script>
<style lang="scss">
$-light-color: #999;

.wot-theme-dark {
  .icon-list {
    background: $-dark-background2;

    :deep(.icon-item-class) {
      color: $-dark-color;
    }
  }

  .icon-item-name {
    color: $-dark-color3;
  }
}

.icon {
  position: relative;
  height: 100vh;
  overflow: auto;
  height: calc(100vh - var(--window-top));
  height: calc(100vh - var(--window-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom));
}

.icon-list {
  box-sizing: border-box;
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  background: #fff;
}

.icon-item {
  width: 25%;
  padding: 15px 0;
  text-align: center;
}

:deep(.icon-item-class) {
  color: $-light-color;
}

.icon-item-name {
  margin: 10px 0;
  color: $-light-color;
}
</style>
