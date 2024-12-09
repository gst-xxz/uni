<template>
  <page-wraper>
    <div>
      <demo-block title="基本使用" transparent>
        <wd-card title="经营分析">
          一般的，检举内容由承办的党的委员会或纪律检查委员会将处理意见或复议、复查结论同申诉人见面，听取其意见。复议、复查的结论和决定，应交给申诉人一份。
          <template #footer>
            <wd-button size="small" plain>查看详情</wd-button>
          </template>
        </wd-card>
        <wd-card title="新订单">
          <div class="content">
            <image
              src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
              alt="joy" style="width: 70px; height: 70px; border-radius: 4px; margin-right: 12px" />
            <div>
              <div>蜜滋兰(mizland)新西兰进口多花种…</div>
              <div>数量：1件</div>
              <div>金额：29.08</div>
              <div>买家昵称：Joy</div>
            </div>
          </div>
          <template #footer>
            <wd-button size="small" plain>查看详情</wd-button>
          </template>
        </wd-card>
      </demo-block>
      <demo-block title="矩形卡片" transparent>
        <wd-card title="2020-02-03服务到期" type="rectangle">
          <div style="height: 40px" class="content">
            <image
              src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
              width="40" height="40" alt="joy"
              style="width: 40px; height: 40px; border-radius: 4px; margin-right: 12px" />
            <div>
              <div class="custom-main">智云好客CRM短信_催评营销</div>
              <div class="custom-sub">高级版-快速吸粉 | 周期一年</div>
            </div>
          </div>
          <template #footer>
            <div>
              <wd-button size="small" plain custom-style="margin-right: 8px">评价</wd-button>
              <wd-button size="small">立即使用</wd-button>
            </div>
          </template>
        </wd-card>
        <wd-card type="rectangle">
          <template #title>
            <div class="title">
              <div>2020-02-03服务到期</div>
              <div class="title-tip">
                <wd-icon name="warning" size="14px" custom-style="vertical-align: bottom" />
                您可以去电脑上使用该服务
              </div>
            </div>
          </template>

          <div style="height: 40px" class="content">
            <image
              src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
              width="40" height="40" alt="joy"
              style="width: 40px; height: 40px; border-radius: 4px; margin-right: 12px" />
            <div>
              <div class="custom-main">智云好客CRM短信_催评营销</div>
              <div class="custom-sub">高级版-快速吸粉 | 周期一年</div>
            </div>
          </div>
          <template #footer>
            <div>
              <wd-button size="small" plain custom-style="margin-right: 8px">评价</wd-button>
              <wd-button size="small">立即使用</wd-button>
            </div>
          </template>
        </wd-card>
      </demo-block>
    </div>
  </page-wraper>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.wot-theme-dark {
  .title-tip {
    color: rgba(232, 230, 227, 0.8);
  }

  .custom-main {
    color: $-dark-color;
  }

  .custom-sub {
    color: $-dark-color-gray;
  }
}

.content,
.title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.content {
  justify-content: flex-start;
}

.title {
  justify-content: space-between;
}

.title-tip {
  color: rgba(0, 0, 0, 0.25);
  font-size: 12px;
}

.custom-main {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}

.custom-sub {
  color: rgba(0, 0, 0, 0.25);
  font-size: 12px;
}
</style>
