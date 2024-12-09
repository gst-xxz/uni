<template>
  <page-wraper>
    <demo-block title="基本用法（适用于按钮加载状态和页面轻提示）">
      <div class="flex">
        <wd-loading custom-class="loading" />
      </div>
    </demo-block>

    <demo-block title="outline 类型（适用于通用模块加载）">
      <div class="flex">
        <wd-loading type="outline" custom-class="loading" />
      </div>
    </demo-block>

    <demo-block title="修改颜色">
      <div class="flex">
        <wd-loading custom-class="loading" color="#fa34aa" />
      </div>
    </demo-block>

    <demo-block title="修改指示器大小">
      <div class="flex">
        <wd-loading custom-class="loading" :size="20" />
        <wd-loading custom-class="loading" :size="30" />
        <wd-loading custom-class="loading" size="50px" />
      </div>
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup></script>
<style lang="scss">
.flex {
  display: flex;
  align-items: center;
}

:deep(.loading) {
  margin-right: 20px;
}
</style>
