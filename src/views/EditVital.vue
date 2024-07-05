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
  const uuid = urlParams.get('uuid');
  

  // Call getUserProfile function with the extracted UUID
  if (uuid) {
    getVital(uuid);
  } else {
      console.error('UUID not found in URL query parameters');
      // Handle error
  };

  form.value.uuid = uuid;

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
  router.go();
};

const vitalSign = ref({});
const form = ref({});

const getVital = async (uuid) => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/vital_sign/${ uuid }/edit`);
    vitalSign.value = response.data;
    form.value = { ...response.data };
  } catch (error) {
    console.error('Get Data Failed:', error);
    // Handle login error
  }
};


const updateVital = async () => {
  const data = {
    uuid: form.value.uuid,
    blood_pressure: form.value.blood_pressure,
    spo2: form.value.spo2,
    pulse_rate: form.value.pulse_rate,
    blood_glucose_level: form.value.blood_glucose_level,
    remark: form.value.remark,
  };
    
  try {
    console.log(form.value.remark);
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/vital_sign/update`, data);
    if (response.http_status < 300) {
      handleApiSuccess('Vital Sign Updated Successfully');
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
          <form class="card" @submit.prevent="updateVital">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                 <p class="mb-0 text-primary font-weight-bolder">Edit Vital Sign</p>
                <argon-button color="warning" size="sm" class="ms-auto">
                  Update
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Vital Sign Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >UUID</label
                  >
                  <argon-input type="text" v-model="form.uuid" disabled />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Blood Pressure</label
                  >
                  <argon-input type="number" v-model="form.blood_pressure" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >SPO2</label
                  >
                  <argon-input type="number" v-model="form.spo2" required  />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Pulse Rate</label
                  >
                  <argon-input type="number" v-model="form.pulse_rate" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Blood Glucose Level</label
                  >
                  <argon-input type="number" v-model="form.blood_glucose_level" required />
                </div>
                <div class="col-md-6">
                  <argon-textarea id="remark" :rows="8" type="text" v-model:title="form.remark" required>
                    <label for="remark">Remark</label>
                  </argon-textarea>
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
