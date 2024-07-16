<script setup>
import { onMounted, ref, computed } from "vue";
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from 'vue-router';

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import Multiselect from 'vue-multiselect';

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";



const router = useRouter();
var is_All = ref(true);
const selectUser = ref([]);
// const options = ref([]);    

onMounted(() => {
  getMemberList();
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

const goListPage= () => {
  showSuccessModal.value = false;
  router.go();
};

// const userList = ref([]);
const optionsPatient = ref([]);
const optionsDoctor = ref([]);
const optionsCS = ref([]);
const getMemberList = async () => {
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/list');
    const patients = response.data.patients;
    optionsPatient.value = patients.map(patient => ({
      name: patient.name,
      uuid: patient.uuid
    }));
    const doctors = response.data.doctors;
    optionsDoctor.value = doctors.map(doctor => ({
      name: doctor.name,
      uuid: doctor.uuid
    }));
    const css = response.data.customer_service;
    optionsCS.value = css.map(cs => ({
      name: cs.name,
      uuid: cs.uuid
    }));
  } catch (error) {
    console.error('Failed to fetch member list:', error);
  }
};                          

const options = computed(() => [...optionsPatient.value, ...optionsDoctor.value, ...optionsCS.value]);

const form = ref({});

const pushNotification = async () => {
  const data = {
    headings: form.value.headings,
    message: form.value.message,
  };
  if (is_All.value) {  
    try {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/pushNotification/all`, data);

      if (response.http_status < 300) {
        handleApiSuccess('Notification pushed successfully');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  } else {
    if (selectUser.value.length > 0) {
      selectUser.value.forEach((user, index) => {
        data[`external_id[${index}]`] = user.uuid;
      });
      console.log(selectUser.value.map(user => user.uuid));  // Logging the list of UUIDs

      try {
        const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/pushNotification/single`, data);

        if (response.http_status < 300) {
          handleApiSuccess('Notification pushed successfully');
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        handleApiError(error);
      }
    } else {
      console.error('No users selected');
      handleApiError('No users selected');
    }
  }
  
};



</script>
<template>
  <main class="container-fluid">
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <form class="card" @submit.prevent="pushNotification">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0 text-primary font-weight-bolder">Push Notification</p>
                <argon-button color="success" size="sm" class="ms-auto">
                  Push
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Notification Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Heading</label
                  >
                  <argon-input type="text" v-model="form.headings" required/>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Send to</label
                  >
                  <argon-switch id="sent" name="Send to" v-model:title="is_All">
                    <span v-if="is_All == true">Everyone</span>
                    <span v-else>Selected Users</span>
                  </argon-switch>
                </div>
                <div class="col-md-6">
                  <argon-textarea :rows="8" type="text" v-model:title="form.message" required>
                    Message
                  </argon-textarea>
                </div>
                <div class="col-md-6" v-if="is_All == false">
                  <label for="example-text-input" class="form-control-label"
                    >Receiver UUID</label
                  >
                  <multiselect v-model="selectUser" :options="options" label="name" track-by="uuid" placeholder="Select users"
                  :close-on-select="false" :multiple="true"></multiselect>
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
