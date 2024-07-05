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
import FileInput from"@/components/FileInput.vue";
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
    getReportDetails(uuid);
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

const reports = ref({});
const form = ref({});

const getReportDetails = async (uuid) => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_report/${ uuid }/edit`);
    reports.value = response.data;
    form.value = { ...response.data };
  } catch (error) {
    console.error('Get Data Failed:', error);
    // Handle login error
  }
};

const updateReport = async () => {
  const data = {
    uuid: form.value.uuid,
    remark: form.value.remark,
  };

  const dataImage = {
    uuid: form.value.uuid,
    image: form.value.imageF,
  };
  try {
    if (!dataImage.image) {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_report/update`, data);
      if (response.http_status < 300) {
        handleApiSuccess('Report Created Successfully');
      } else {
        throw new Error(response.message);
      }
    } else {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_report/update`, data);
      const response2 = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_report/update_image`, dataImage);
        if (response.http_status < 300) {
        handleApiSuccess('Report Updated Successfully');
      } else {
        throw new Error(response.message, response2.message);
      }
    }
    getReportDetails(form.value.uuid);
  }
  catch (error) {
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
                 <p class="mb-0 text-primary font-weight-bolder">Edit Report</p>
                <argon-button color="warning" size="sm" class="ms-auto" @click="updateReport">
                  Update
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Report Information</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label"
                    >UUID</label
                  >
                  <argon-input type="text" v-model="form.uuid" disabled />
                </div>
                <div class="col-md-6">
                  <argon-textarea id="remark" :rows="8" type="text" v-model:title="form.remark">
                    <label for="remark">Remark</label>
                  </argon-textarea>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Image (FOR UPDATE NEW)</label
                  >
                  <file-input class="mt-2" v-model="form.imageF" />
                  <div class="mt-3">
                    <div class="font-weight-bolder">Latest Image</div>
                    <img :src="form.report_photo_path" alt="" width="500" height="350" />
                  </div>
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
