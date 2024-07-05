<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import { apiRequest } from '@/assets/js/apiRequest.js'; 

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ArgonInput.vue";
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
    getMedicationDetails(uuid);
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


const medicationDetails = ref({});
const form = ref({});

const getMedicationDetails = async (uuid) => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_medication_record/${ uuid }/edit`);
    medicationDetails.value = response.data;
    form.value = { ...response.data };
  } catch (error) {
    console.error('Get Data Failed:', error);
    // Handle login error
  }
};


const updateMedication = async () => {
  const data = {
    uuid: form.value.uuid,
    medication_name: form.value.medication_name,
    unit: form.value.unit,
    restock_date: form.value.restock_date,
    inventory: form.value.inventory,
    dosing: form.value.dosing,
    frequency: form.value.frequency,
    restock_amount: form.value.restock_amount,
    record_type: form.value.record_type,
  };
    
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_medication_record/update`, data);

    if (response.http_status < 300) {
      handleApiSuccess('Medication Created Successfully');
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
          <form class="card" @submit.prevent="updateMedication">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                 <p class="mb-0 text-primary font-weight-bolder">Edit Medication</p>
                <argon-button color="warning" size="sm" class="ms-auto">
                  Update
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Medication Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >UUID</label
                  >
                  <argon-input type="text" v-model="form.uuid" disabled />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Medication Name</label
                  >
                  <argon-input type="text" v-model="form.medication_name" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Unit (1=tablet, 2=capsule, 3=mL, 4=unit (injection))</label
                  >
                  <select class="form-select" v-model="form.unit" aria-label="Default select example">
                    <option :value="1">Tablet</option>
                    <option :value="2">Capsule</option>
                    <option :value="3">mL</option>
                    <option :value="4">Unit</option>
                  </select>
                  <!-- <argon-input type="text" v-model="form.unit" /> -->
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Restock Date</label
                  >
                  <input class="form-control" type="date" v-model="form.restock_date" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Inventory</label
                  >
                  <argon-input type="number" v-model="form.inventory" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >dosing</label
                  >
                  <argon-input type="number" v-model="form.dosing" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Frequency</label
                  >
                  <argon-input type="number" v-model="form.frequency" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Restock Amount</label
                  >
                  <argon-input type="number" v-model="form.restock_amount" required />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Record Type (0=unknown,1=permanent,2=temporary)</label
                  >
                  <select class="form-select" v-model="form.record_type" aria-label="Default select example">
                    <option :value="0">Unknown</option>
                    <option :value="1">Permanent</option>
                    <option :value="2">Temporay</option>
                  </select>
                  <!-- <argon-input type="text" v-model="form.record_type" /> -->
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
