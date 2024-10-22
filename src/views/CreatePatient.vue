<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from "vue-router";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
//  
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
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
  getUserRole();
  getBranchList();

  const urlParams = new URLSearchParams(window.location.search);
  const user_uuid = urlParams.get('uuid');
  form.value.user_uuid = user_uuid;
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
  router.push('/account-management');
}

const user_role = ref('');
const getUserRole = async () => {
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user_roles/list');
    user_role.value = response.data;
    console.log(user_role.value, response);
  } catch (error) {
    handleApiError(error);
  }
};

const branchs = ref('');
const getBranchList = async () => {
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/branch/list');
    branchs.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};


const form = ref({
    username: '',
    name: '',
    emergency_contact: [
      { phone: '' },
      { phone: '' },
      { phone: '' }
    ],
    emergency_name: [
      { phone: '' },
      { phone: '' },
      { phone: '' }
    ]
});

const submitForm = async () => {
  const payload = {
    emergency_contact: form.value.emergency_contact.map(contact => contact.phone).join(','),
    emergency_name: form.value.emergency_name.map(name => name.phone).join(',')
  };
  const data = {
    user_uuid: form.value.user_uuid,
    // username: form.value.username,
    name: form.value.name,
    date_of_birth: form.value.date_of_birth,
    // email: form.value.email,
    ic_number: form.value.ic_number,
    gender: form.value.gender,
    home_address: form.value.home_address,
    emergency_contact: payload.emergency_contact,
    emergency_name: payload.emergency_name,
    image: form.value.image,
  };
    
  const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient/create', data);
  try {
    if (response.http_status < 300) {
      handleApiSuccess('User created successfully');
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
    <div class="py-4 container-fluid mt-n8">
      <back-button class="position-relative mb-3" />
      <div class="row">
        <div class="col-md-12">
          <form class="card" @submit.prevent="submitForm">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Create Patient</p>
                <argon-button color="success" size="sm" class="ms-auto"
                  >Create</argon-button
                >
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Patient Information</p>
              <div class="row">
                <!-- <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >User UUID</label
                  >
                  <input v-model="form.user_uuid" class="form-control" type="text" disabled />
                </div> -->
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Name</label
                  >
                  <input v-model="form.name" class="form-control" type="text"  />
                </div>
                <!-- <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Username</label
                  >
                  <argon-input type="text" v-model="form.username" />
                </div> -->
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Gender</label
                  >
                  <select class="form-select" v-model="form.gender" aria-label="Default select example">
                    <option value="" :selected="gender === ''">Please select a gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Date of Birth</label
                  >
                  <argon-input type="date" v-model="form.date_of_birth" />
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >IC Number</label
                  >
                  <argon-input type="number" v-model="form.ic_number" required/>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Image</label
                  >
                  <file-input v-model="form.image" />
                </div>
              </div>

              <p class="text-uppercase text-sm mt-5">Contact Information</p>
              <div class="row">
                <div class="col-md-6">
                  <argon-textarea :rows="9" type="text" v-model:title="form.home_address" required>
                    Address
                  </argon-textarea>
                </div>
                <div class="col-md-3" >
                  <div v-for="(name, index) in form.emergency_name" :key="index">
                    <label :for="`emergency-name-${index}`" class="form-control-label">
                      Emergency Contact Name {{ index + 1 }}{{ index === 0 ? '' : ' (Optional)' }}
                    </label>
                    <argon-input type="text" v-model="name.phone" required/>
                  </div>
                </div>
                <div class="col-md-3" >
                  <div v-for="(contact, index) in form.emergency_contact" :key="index">
                    <label :for="`emergency-contact-${index}`" class="form-control-label">
                      Emergency Contact {{ index + 1 }}{{ index === 0 ? '' : ' (Optional)' }}
                    </label>
                    <argon-input type="number" v-model="contact.phone" required/>
                  </div>
                </div>
              </div>
              <hr class="horizontal dark" />
            </div>
          </form>
        </div>
      </div>
    </div>
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
  </main>
</template>
