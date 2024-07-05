<template>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Success</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ successMessage }}</p>
        </div>
        <div class="modal-footer">
          <argon-button @click="closeModal" color="success">Ok</argon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArgonButton from "@/components/ArgonButton.vue";

const { showModal, successMessage } = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  successMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>