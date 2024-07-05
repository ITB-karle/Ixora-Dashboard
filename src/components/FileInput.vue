<template>
  <div>
    <input type="file" @change="onFileChange" />
    <!-- <p v-if="fileName">Selected File: {{ fileName }}</p>
    <p v-if="fileContent">File Content: {{ fileContent }}</p> -->
  </div>
</template>

<script>
export default {
  name: 'FileInputComponent',
  props: {
    modelValue: File,
  },
  emits: ['update:modelValue'],
  data() {
    return {
      fileName: '',
      fileContent: '',
    };
  },
  watch: {
    modelValue(newFile) {
      if (newFile) {
        this.fileName = newFile.name;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.fileContent = event.target.result;
        };
        reader.readAsText(newFile);
      } else {
        this.fileName = '';
        this.fileContent = '';
      }
    },
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      this.$emit('update:modelValue', file);
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>