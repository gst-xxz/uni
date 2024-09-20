<template>
  <pro-page>
    <pro-list :api="api">
      <template v-slot:item="{ item }">
        <XItem :item="item" />
      </template>
    </pro-list>
  </pro-page>
</template>

<script lang="ts" setup>
import XItem from './x-item.vue'

const api = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, name: '章三' },
          { id: 2, name: '李四' },
          { id: 3, name: '王五' },
          { id: 4, name: '王五' },
          { id: 5, name: '王五' },
          { id: 6, name: '王五' },
          { id: 7, name: '王五' },
          { id: 8, name: '王五' },
          { id: 9, name: '王五' },
          { id: 10, name: '王五' },
        ],
      })
    }, 1000)
  })
}

</script>

<style lang="scss" scoped></style>
