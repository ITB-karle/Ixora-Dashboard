<script setup>
import { ref, watch, onMounted } from 'vue';
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from 'vue-router';
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";

onMounted(() => {
  getDailyReminder();

});

const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const router = useRouter();

const handleApiError = (error) => {
  errorMessage.value = error.message || 'An unknown error occurred';
  showErrorModal.value = true;
};

const handleApiSuccess = (message) => {
  successMessage.value = message || 'Operation completed successfully';
  showSuccessModal.value = true;
};

const goListPage = () => {
  showSuccessModal.value = false;
  router.go();
};

const showModal = ref(false);
const task = ref({
  id: '',
  remark: '',
});

const modalTask = (uuid) => {
  showModal.value = true;
  task.value.id = uuid;
};

const closeModal = () => {
  showModal.value = false;
};

const currentDate = ref(new Date());

// Initialize input date with today's date
const formattedDateInput = ref(currentDate.value.toISOString().substr(0, 10));

function changeDate(days) {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + days);
  currentDate.value = newDate;
  formattedDateInput.value = newDate.toISOString().substr(0, 10);
};

// Watch for changes in formattedDateInput and call getDailyReminder
watch(formattedDateInput, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    console.log(`Date changed from ${oldValue} to ${newValue}`);
    getDailyReminder(newValue);
  }
});
// Function to update currentDate when input date changes
function updateDate(event) {
  currentDate.value = new Date(event.target.value);
  formattedDateInput.value = event.target.value; // Update formattedDateInput as well
  getDailyReminder(event.target.value); // Call getDailyReminder when date changes
}

const daily_reminder = ref([]);
const form = ref([]);

const getDailyReminder = async () => {
  const date  = formattedDateInput.value;
  try {
    console.log(date);
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/select_daily`, {date});
    daily_reminder.value = response.data;
    form.value = { ...response.data };
    // setCalendarEvents(patient_reminder.value);
  } catch (error) {
    console.error('Get Data Failed:', error);
  }
};

const completeTask = async () => {
  const data = {
    uuid: task.value.id,
    remark: task.value.remark,
  };
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/log/create`, data);
    if (response.http_status < 300) {
      closeModal();
      handleApiSuccess('Task Completed');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
  }
};

</script>

<template>
  <main class="container-fluid">
    <div class="card mt-5" style="min-height: 500px;">
      <div class="text-center my-4">
        <div>
          <argon-button color="primary" @click="changeDate(-1)">Prev</argon-button>
          <input class="dateInput" type="date" v-model="formattedDateInput" @input="updateDate" />
          <argon-button color="primary" @click="changeDate(1)">Next</argon-button>
        </div>
      </div>

      <div v-if="daily_reminder.length" class="py-4 container-fluid">
        <div class="mb-4">
          <div class="row">
            <div class="col-md-4 mb-4" v-for="(reminder, index) in daily_reminder" :key="index">
              <div class="card">
                <div class="card-header border-bottom border-light">
                  <div class="d-flex align-items-center justify-content-between">
                    <p class="mb-0 text-primary font-weight-bolder">{{ reminder.patient_name }}</p>
                    <p class="mb-0 text-dark font-weight-bolder">Frequency Weeks:
                      <span class="badge badge-md bg-gradient-primary">{{ reminder.frequency_weeks }}</span>
                    </p>
                  </div>
                </div>
                <div class="card-body px-0 pt-0 pb-2"  style="min-height: 120px;">
                  <div class="p-4">{{ reminder.reminder }}</div>
                </div>
                <div class="card-footer">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="font-weight-bolder text-end">
                      <span class="font-weight-normal">Created by: </span>
                      {{ reminder.created_by }}
                    </div>
                    <div>
                      <argon-button @click="modalTask(reminder.uuid)">Complete</argon-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="py-4 container-fluid">
        <div class="bg-white text-primary h4 text-center p-5 rounded">
          Today no reminder
        </div>
        
      </div>
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <form class="modal-content" @submit.prevent="completeTask()">
            <div class="modal-header">
              <h5 class="modal-title">Complete Task</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" @click="closeModal">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Please make sure this task uuid
                <span class="font-weight-bolder">({{ task.id }})</span>
                is completed
              </p>
              <div class="">
                <argon-textarea :rows="8" type="text" v-model:title="task.remark" required>
                  Remark
                </argon-textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Confirm</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
  </main>
</template>


<style>
.dateInput {
  border-radius: 8px;
  background-color: rgba(94, 114, 228, 0.95);
  border-color: rgba(94, 114, 228, 0.95);
  color: white;
  padding: 5px;
  margin: 0px 15px;
}
</style>