<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from 'vue-router';
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";

const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (v, k) => currentYear - k);

const selectedMonth = ref(months[new Date().getMonth()].value);
const selectedYear = ref(currentYear);

const handleMonthChange = () => {
  getMonthlyReminder(selectedYear.value, selectedMonth.value);
};

const handleYearChange = () => {
  getMonthlyReminder(selectedYear.value, selectedMonth.value);
};

const router = useRouter();

onMounted(() => {
  // logCurrentMonth();
  getMonthlyReminder(selectedYear.value, selectedMonth.value);
});

// function logCurrentMonth() {
//   const calendarTitle = document.querySelector('.fc-toolbar-title');
//   if (calendarTitle) {
//     const titleText = calendarTitle.textContent;
//     const [monthName, year] = titleText.split(' ');
//     const monthNumber = monthMap[monthName];
//     console.log(`Current view month: ${monthName} (${monthNumber})`);
//     getMonthlyReminder(year, monthNumber);
//   }
// }

const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

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

const patient_reminder = ref([]);
const form = ref([]);

const getMonthlyReminder = async (year, month) => {
  const data = { year, month };
  try {
    console.log(data);
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/monthly`, data);
    patient_reminder.value = response.data;
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
}

// const sortedItems = computed(() => {
//   return patient_reminder.value.slice().sort((a, b) => {
//     return new Date(a.date_from) - new Date(b.date_from);
//   });
// });


const groupedReminders = computed(() => {
  return patient_reminder.value.reduce((acc, item) => {
    const date = item.date_from.split(" ")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
});
</script>
<template>
    <main>
    <div class="container-fluid">
      <!-- <div
        class="page-header min-height-300"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&quot;);
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-warning opacity-6"></span>
      </div> -->
      <div class="row mb-4">
        <div class="col-md-6 text-end">
          <label for="year-select" class="calendar-label">Select Year: </label>
          <select id="year-select" class="calendar-select" v-model="selectedYear" @change="handleYearChange">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="month-select" class="calendar-label">Select Month: </label>
          <select id="month-select" class="calendar-select" v-model="selectedMonth" @change="handleMonthChange">
            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="groupedReminders && Object.keys(groupedReminders).length" class="py-4 container-fluid">
      <div v-for="(reminders, date) in groupedReminders" :key="date" class="mb-4 card p-4">
        <h3>{{ date }}</h3>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="(reminder, index) in reminders" :key="index">
            <div class="card">
              <div class="card-header border-bottom border-light">
                <div class="d-flex align-items-center justify-content-between">
                  <p class="mb-0 text-primary font-weight-bolder">{{ reminder.patient_name }}</p>
                  <p class="mb-0">{{ reminder.date_from }}</p>
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
      <div class="bg-white text-center p-5 rounded">
        This month no reminder
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
                Reminder
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
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
  </main>
</template>

<style>
.text-truncate {
  max-width: 200px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.calendar-label {
  color: white;
}

.calendar-select {
  width: 135px;
  border-radius: 10px;
  margin-left: 10px;
  text-align: center;
}
</style>