<template>
  <page-wraper>
    <demo-block title="搜索无结果">
      <pro-status-tip image="search" tip="当前搜索无结果" />
    </demo-block>

    <demo-block title="404页面">
      <pro-status-tip image="network" tip="当前网络不可用，请检查你的网络设置" />
    </demo-block>

    <demo-block title="页面暂无内容">
      <pro-status-tip image="content" tip="暂无内容" />
    </demo-block>

    <demo-block title="我的收藏为空">
      <pro-status-tip image="collect" tip="暂无收藏" />
    </demo-block>

    <demo-block title="我的评论为空">
      <pro-status-tip image="comment" tip="暂无评论" />
    </demo-block>

    <demo-block title="支付失败">
      <pro-status-tip image="halo" tip="支付失败，请重新订购" />
    </demo-block>

    <demo-block title="已订阅全部消息">
      <pro-status-tip image="message" tip="已订阅全部消息" />
    </demo-block>

    <demo-block title="自定义大小">
      <pro-status-tip :image-size="{
        height: 200,
        width: 300
      }" image="search" tip="当前搜索无结果" />
    </demo-block>

    <demo-block title="自定义图片">
      <pro-status-tip image="https://img.wot-design-uni.cn/static/1.jpg" tip="查看我的头像" />
    </demo-block>
  </page-wraper>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped></style>
