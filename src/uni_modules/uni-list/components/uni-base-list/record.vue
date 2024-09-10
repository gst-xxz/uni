<template>
  <div class="flex h-9 bg-slate-200">
    <p class="flex-1">{{ item.label }}</p>
    {{ item.value }}
  </div>
</template>
<script>
export default {
  props: { item: { type: Object, default: () => ({}) } },
};
</script>
