<template>
  <page-wraper>
    <view class="page">
      <view class="page__bd">
        <pro-list>
          <template v-slot:item="{ item }">
            <XItem :item="item" />
          </template>
        </pro-list>
      </view>
    </view>
  </page-wraper>
</template>

<script lang="ts" setup>
import XItem from './x-item.vue'

</script>

<style lang="scss" scoped></style>
