<template>
  <view>
    <page-wraper>
      <view class="icon">
        <view style="position: sticky; top: 0; z-index: 2">
          <wd-search hide-cancel placeholder="查找图标" light v-model="keyword" @search="handleSearch"
            @clear="handleClear" />
        </view>
        <view class="icon-list">
          <view v-for="(icon, index) in showIcons" :key="index" class="icon-item" @click="handleClick(icon)">
            <view><wd-icon :name="icon" size="22px" custom-class="icon-item-class" /></view>
            <view class="icon-item-name">{{ icon }}</view>
          </view>
          <wd-status-tip v-if="!showIcons.length" image="search" tip="当前无相关图标" />
        </view>
      </view>
    </page-wraper>
  </view>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotify } from '@/uni_modules/wot-design-uni'
const { showNotify } = useNotify()
const keyword = ref<string>('')

const icons = ref<Array<string>>(["right", "cluster-o", "chat-o", "cluster", "column", "comment", "contact", "credit-pay", "coupon-o", "completed", "descending", "comment-circle", "cross", "diamond", "delete", "diamond-o", "envelop-o", "desktop-o", "ecard-pay", "edit", "coupon", "delete-o", "down", "ellipsis", "enlarge", "expand", "description", "exchange", "eye-o", "expand-o", "eye", "fail", "debit-pay", "discount", "filter-o", "failure", "fire", "font", "flag-o", "font-o", "fire-o", "free-postage", "friends-o", "gem-o", "gem", "friends", "gift", "gift-o", "gift-card-o", "good-job", "flower-o", "gold-coin-o", "gold-coin", "good-job-o", "home-o", "gift-card", "graphic", "hot-o", "idcard", "hot-sale-o", "info", "hot-sale", "hotel-o", "goods-collect-o", "info-o", "label-o", "hot", "label", "location-o", "goods-collect", "location", "lock", "like-o", "live", "manager-o", "like", "manager", "map-marked", "logistics", "more", "medal", "more-o", "music-o", "music", "newspaper-o", "minus", "new-o", "new-arrival", "notes-o", "orders-o", "medal-o", "new", "new-arrival-o", "other-pay", "pause", "peer-pay", "paid", "passed", "pause-circle", "pause-circle-o", "phone-o", "pending-payment", "photograph", "phone-circle", "photo-fail", "phone", "photo", "plus", "photo-o", "play", "play-circle", "share", "point-gift", "points", "point-gift-o", "printer", "revoke", "search", "phone-circle-o", "send-gift-o", "scan", "send-gift", "qr", "play-circle-o", "stop-circle-o", "service-o", "qr-invalid", "question-o", "records", "setting", "setting-o", "shop-collect-o", "share-o", "replay", "question", "refund-o", "shopping-cart", "shop", "shopping-cart-o", "shop-collect", "sign", "shop-o", "smile-o", "smile-comment-o", "stop", "smile", "stop-circle", "success", "smile-comment", "tosend", "star-o", "todo-list", "sort", "underway", "tv-o", "umbrella-circle", "video", "vip-card", "service", "volume-o", "user-o", "wap-nav", "wap-home", "video-o", "wap-home-o", "weapp-nav", "underway-o", "warning", "vip-card-o", "volume", "user-circle-o", "warn-o", "warning-o", "wechat-pay", "shrink", "star", "youzan-shield", "thumb-circle", "todo-list-o", "thumb-circle-o", "wechat", "upgrade", "shield-o", "invitation", "guide-o", "add-square", "add", "add-o", "arrow-left", "aim", "arrow", "arrow-up", "arrow-down", "alipay", "ascending", "after-sale", "bag-o", "audio", "back-top", "award", "bag", "award-o", "balance-list", "balance-o", "bell", "bar-chart-o", "balance-list-o", "bars", "balance-pay", "birthday-cake-o", "bill-o", "bookmark", "bookmark-o", "browsing-history-o", "brush-o", "bill", "bullhorn-o", "bulb-o", "calendar-o", "card", "cart", "browsing-history", "cart-o", "chart-trending-o", "cash-back-record", "certificate", "cashier-o", "cash-on-deliver", "cart-circle-o", "chat", "clock", "circle", "cart-circle", "apps-o", "clear", "close", "checked", "comment-o", "comment-circle-o", "closed-eye", "clock-o"])

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
<style lang="scss" scoped>
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
