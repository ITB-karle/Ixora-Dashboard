<script setup>

const title = defineModel('title');

defineProps({
  id: {
    type: String,
  },
  placeholder: {
    type: String,
    default: "",
  },
  rows: {
    type: Number,
    default: 5,
  },
  value: {
    type: Object,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="form-group">
    <label :for="id">
      <slot />
    </label>
    <textarea
      :id="id"
      class="form-control"
      v-model="title"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
    ></textarea>
  </div>
</template>
