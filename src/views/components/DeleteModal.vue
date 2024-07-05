<template>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" @click="closeModal">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ deleteMessage }}</p>
        </div>
        <div class="modal-footer">
          <argon-button color="success" @click="confirmDeleteHandler">Confirm</argon-button>
          <argon-button color="secondary" @click="closeModal">Cancel</argon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import ArgonButton from "@/components/ArgonButton.vue";

const { showModal, deleteMessage } = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  deleteMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['closeModal', 'deleteForum']);

const closeModal = () => {
  emit('close'); // Emit event to parent to close modal
};

const confirmDeleteHandler = () => {
  emit('deleteData'); // Emit event to parent to perform delete action
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>