<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="tag in tags"
      :key="tag"
      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-black hover:bg-zinc-200 transition-colors cursor-pointer"
      @click="$emit('tag-click', tag)"
    >
      #{{ tag }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()

defineEmits<{
  'tag-click': [tag: string]
}>()
</script>

