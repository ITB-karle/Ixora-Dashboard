<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import { apiRequest } from '@/assets/js/apiRequest.js'; 

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import ArgonButton from "@/components/ArgonButton.vue";
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

const form = ref({});

const createVitalSign = async () => {
  const data = {
    patient_uuid: form.value.patient_uuid,
    blood_pressure_diastolic: form.value.blood_pressure_diastolic,
    blood_pressure_systolic: form.value.blood_pressure_systolic,
    spo2: form.value.spo2,
    pulse_rate: form.value.pulse_rate,
    blood_glucose_level_before: form.value.blood_glucose_level_before,
    blood_glucose_level_after: form.value.blood_glucose_level_after,
    remark: form.value.remark,
  };
    
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/vital_sign/create`, data);
    if (response.http_status < 300) {
      handleApiSuccess('Vital Sign Created Successfully');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
  }
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
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                 <p class="mb-0 text-primary font-weight-bolder">Create Vital Sign</p>
                <argon-button color="success" size="sm" class="ms-auto" @click="createVitalSign">
                  Create
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Vital Sign Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Patient UUID</label
                  >
                  <argon-input type="text" v-model="form.patient_uuid" disabled />
                </div>
                <div class="form-group col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Blood Pressure Diastolic</label
                  >
                  <div class="input-group">
                    <input v-model="form.blood_pressure_diastolic" type="number" class="form-control" aria-describedby="basic-addon2">
                    <span class="input-group-text border" id="basic-addon2">mmHg</span>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Blood Pressure Systolic</label
                  >
                  <div class="input-group">
                    <input v-model="form.blood_pressure_systolic" type="number" class="form-control" aria-describedby="basic-addon2">
                    <span class="input-group-text border" id="basic-addon2">mmHg</span>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >SPO2</label
                  >
                  <div class="input-group">
                    <input v-model="form.spo2" type="number" class="form-control" aria-describedby="basic-addon2">
                    <span class="input-group-text border" id="basic-addon2">%</span>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Pulse Rate</label
                  >
                  <div class="input-group">
                    <input v-model="form.pulse_rate" type="number" class="form-control" aria-describedby="basic-addon2">
                    <span class="input-group-text border" id="basic-addon2">bpm</span>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Blood Glucose Level (Before Eat)</label
                  >
                  <div class="input-group">
                    <input v-model="form.blood_glucose_level_before" type="number" class="form-control" aria-describedby="basic-addon2">
                    <span class="input-group-text border" id="basic-addon2">mmol/L</span>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Blood Glucose Level (After Eat)</label
                  >
                  <div class="input-group">
                    <input v-model="form.blood_glucose_level_after" type="number" class="form-control" aria-describedby="basic-addon2">
                    <span class="input-group-text border" id="basic-addon2">mmol/L</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <argon-textarea :rows="8" type="text" v-model:title="form.remark">
                    Remark
                  </argon-textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
  </main>
</template>
