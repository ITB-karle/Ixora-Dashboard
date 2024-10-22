<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import { apiRequest } from '@/assets/js/apiRequest.js'; 

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";  
import BackButton from "./components/BackButton.vue";

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const router = useRouter();

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  // Extract the UUID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const patient_uuid = urlParams.get('uuid');
  

  // // Call getUserProfile function with the extracted UUID
  // if (patient_uuid) {
  //   getPatientDetails(patient_uuid);
  // } else {
  //     console.error('UUID not found in URL query parameters');
  //     // Handle error
  // };

  form.value.patient_uuid = patient_uuid;
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});

onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});

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
  router.push(`../edit-patient/?uuid=${form.value.patient_uuid}`);
};

const form = ref({
  repeat: 0, // Initially set to 0 (off)
});

const createReminder = async () => {
  const data = {
    patient_uuid: form.value.patient_uuid,
    reminder: form.value.reminder,
    date_replaced: form.value.date_replaced,
    frequency_weeks: form.value.frequency_weeks,
    repeat: form.value.repeat,
  };
    
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/create`, data);
    if (response.http_status < 300) {
      handleApiSuccess('Reminder Created Successfully');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
  }
};

// Function to toggle between 0 and 1
const toggleRepeat = (event) => {
  form.value.repeat = event.target.checked ? 1 : 0;
};


</script>
<template>
  <main>
    <div class="container-fluid">
      <div
        class="page-header min-height-300"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&quot;);
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
    </div>
    <div class="py-4 container-fluid shadow-lg mt-n8">
      <back-button class="position-relative mb-3" />
      <div class="row">
        <div class="col-md-12">
          <form class="card" @submit.prevent="createReminder">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                 <p class="mb-0 text-primary font-weight-bolder">Create Reminder</p>
                <argon-button color="success" size="sm" class="ms-auto">
                  Create
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Reminder Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >UUID</label
                  >
                  <argon-input type="text" v-model="form.patient_uuid" disabled />
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Date Replaced</label
                  >
                  <argon-input type="date" v-model="form.date_replaced" required />
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Frequency Weeks</label
                  >
                  <argon-input type="number" v-model="form.frequency_weeks" required />
                </div>
                <div class="col-md-6">
                  <argon-textarea :rows="8" type="text" v-model:title="form.reminder" required>
                    Reminder
                  </argon-textarea>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Repeat</label
                  >
                  <argon-switch id="repeat" name="Repeat" :checked="form.repeat === 1" @change="toggleRepeat">
                  </argon-switch>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
  </main>
</template>
