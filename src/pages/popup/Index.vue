<template>
  <page-meta :page-style="`overflow:${show10 ? 'hidden' : 'visible'};`"></page-meta>
  <view>
    <page-wraper>
      <demo-block title="基础用法" transparent>
        <pro-cell-group>
          <wd-cell title="弹出层" is-link @click="handleClick1" />
        </pro-cell-group>
      </demo-block>
      <demo-block title="弹出位置" transparent>
        <pro-cell-group border>
          <wd-cell title="顶部" is-link @click="handleClick2" />
          <wd-cell title="右侧" is-link @click="handleClick3" />
          <wd-cell title="底部" is-link @click="handleClick4" />
          <wd-cell title="左侧" is-link @click="handleClick5" />
        </pro-cell-group>
      </demo-block>
      <demo-block title="关闭按钮" transparent>
        <pro-cell-group border>
          <wd-cell title="关闭按钮" is-link @click="handleClick6" />
        </pro-cell-group>
      </demo-block>

      <demo-block title="锁定滚动" transparent>
        <pro-cell-group border>
          <wd-cell title="锁定滚动" is-link @click="handleClick10" />
        </pro-cell-group>
      </demo-block>

      <demo-block title="禁用遮罩点击" transparent>
        <pro-cell-group border>
          <wd-cell title="禁用遮罩点击" is-link @click="handleClick7" />
        </pro-cell-group>
      </demo-block>

      <demo-block title="禁用遮罩" transparent>
        <pro-cell-group border>
          <wd-cell title="禁用遮罩" is-link @click="handleClick8" />
        </pro-cell-group>
      </demo-block>

      <demo-block title="开启底部安全区" transparent>
        <pro-cell-group border>
          <wd-cell title="开启底部安全区" is-link @click="handleClick9" />
        </pro-cell-group>
      </demo-block>

      <pro-popup v-model="show1" custom-style="padding: 30px 40px;" @close="handleClose1"><text
          class="custom-txt">内容</text></pro-popup>
      <pro-popup v-model="show2" position="top" custom-style="height: 200px;" @close="handleClose2"></pro-popup>
      <pro-popup v-model="show3" position="right" custom-style="width: 200px;" @close="handleClose3"></pro-popup>
      <pro-popup v-model="show4" position="bottom" custom-style="height: 200px;" @close="handleClose4"></pro-popup>
      <pro-popup v-model="show5" position="left" custom-style="width: 200px;" @close="handleClose5"></pro-popup>
      <pro-popup v-model="show6" position="bottom" closable custom-style="height: 200px;"
        @close="handleClose6"></pro-popup>
      <pro-popup v-model="show7" position="bottom" :close-on-click-modal="false" closable custom-style="height: 200px;"
        @close="handleClose7"></pro-popup>

      <pro-popup v-model="show8" position="bottom" :modal="false" closable custom-style="height: 200px;"
        @close="handleClose8"></pro-popup>
      <pro-popup v-model="show9" position="bottom" :safe-area-inset-bottom="true" custom-style="height: 200px;"
        @close="handleClose9"></pro-popup>
      <pro-popup v-model="show10" lock-scroll position="bottom" :safe-area-inset-bottom="true"
        custom-style="height: 200px;" @close="handleClose10"></pro-popup>
    </page-wraper>
  </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const show1 = ref<boolean>(false)
const show2 = ref<boolean>(false)
const show3 = ref<boolean>(false)
const show4 = ref<boolean>(false)
const show5 = ref<boolean>(false)
const show6 = ref<boolean>(false)
const show7 = ref<boolean>(false)

function handleClick1() {
  show1.value = true
}
function handleClose1() {
  show1.value = false
}
function handleClick2() {
  show2.value = true
}
function handleClose2() {
  show2.value = false
}
function handleClick3() {
  show3.value = true
}
function handleClose3() {
  show3.value = false
}
function handleClick4() {
  show4.value = true
}
function handleClose4() {
  show4.value = false
}
function handleClick5() {
  show5.value = true
}
function handleClose5() {
  show5.value = false
}
function handleClick6() {
  show6.value = true
}
function handleClose6() {
  show6.value = false
}

function handleClick7() {
  show7.value = true
}

function handleClose7() {
  show7.value = false
}

const show8 = ref<boolean>(false)

function handleClick8() {
  show8.value = true
}

function handleClose8() {
  show8.value = false
}

const show9 = ref<boolean>(false)

function handleClick9() {
  show9.value = true
}

function handleClose9() {
  show9.value = false
}

const show10 = ref<boolean>(false)

function handleClick10() {
  show10.value = true
}

function handleClose10() {
  show10.value = false
}
</script>
<style lang="scss" scoped>
.custom-txt {
  color: black;
}
</style>
