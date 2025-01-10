<template>
  <div :class="cn('wd-card', type == 'rectangle' ? 'is-rectangle' : '', customClass)" :style="customStyle">
    <div :class="cn('wd-card__title-content', customTitleClass)">
      <div class="wd-card__title">
        <span v-if="title">{{ title }}</span>
        <slot v-else name="title"></slot>
      </div>
    </div>
    <div :class="cn(`wd-card__content`, customContentClass)">
      <slot></slot>
    </div>
    <div :class="cn(`wd-card__footer`, customFooterClass)">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-card',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { cn } from '../common/util'
import { cardProps } from './types'

defineProps(cardProps)
</script>

<style>
.wd-card {
  padding: var(--wot-card-padding, 0 var(--wot-size-side-padding, 15px));
  background-color: var(--wot-card-bg, var(--wot-color-white, rgb(255, 255, 255)));
  line-height: var(--wot-card-line-height, 1.1);
  margin: var(--wot-card-margin, 0 var(--wot-size-side-padding, 15px));
  border-radius: var(--wot-card-radius, 8px);
  box-shadow: var(--wot-card-shadow-color, 0px 4px 8px 0px rgba(0, 0, 0, 0.02));
  font-size: var(--wot-card-fs, var(--wot-fs-content, 14px));
  margin-bottom: 12px;
}

.wd-card.is-rectangle {
  margin-left: 0;
  margin-right: 0;
  border-radius: 0;
  box-shadow: none;
}

.wd-card.is-rectangle .wd-card__title-content {
  font-size: var(--wot-card-fs, var(--wot-fs-content, 14px));
}

.wd-card.is-rectangle .wd-card__content {
  padding: var(--wot-card-rectangle-content-padding, 16px 0);
  position: relative;
}

.wd-card.is-rectangle .wd-card__content:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-card-content-border-color, rgba(0, 0, 0, 0.09));
}

.wd-card.is-rectangle .wd-card__footer {
  padding: var(--wot-card-rectangle-footer-padding, 12px 0);
  position: relative;
}

.wd-card.is-rectangle .wd-card__footer:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-card-content-border-color, rgba(0, 0, 0, 0.09));
}

.wd-card__title-content {
  padding: 16px 0;
  color: var(--wot-card-title-color, rgba(0, 0, 0, 0.85));
  font-size: var(--wot-card-title-fs, var(--wot-fs-title, 16px));
}

.wd-card__content {
  color: var(--wot-card-content-color, rgba(0, 0, 0, 0.45));
  line-height: var(--wot-card-content-line-height, 1.428);
}

.wd-card__footer {
  padding: var(--wot-card-footer-padding, 12px 0 16px);
  text-align: right;
}
</style>
