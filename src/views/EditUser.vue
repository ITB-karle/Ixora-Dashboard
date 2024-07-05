<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js'; 
import { useRouter } from "vue-router";

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

const goAccountManagement = () => {
  showSuccessModal.value = false;
  router.go();
}

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
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

const userProfile = ref('');

const getUserProfile = async (uuid) => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/${ uuid }/show`);
    userProfile.value = response.data;
    const { status, ...profileData} = { ...response.data }

    form.value = { ...profileData, status: status == 'active' ? 1 : 0 };
  } catch (error) {
    console.error('Login failed:', error);
    // Handle login error
  }
};

const user_role = ref('');

const getUserRole = async () => {
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user_roles/list');
    user_role.value = response.data;
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


onMounted(() => {
  // Extract the UUID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get('uuid');

  // Call getUserProfile function with the extracted UUID
  if (uuid) {
      getUserProfile(uuid);
  } else {
      console.error('UUID not found in URL query parameters');
      // Handle error
  };

  getUserRole();
  getBranchList();
});

const form = ref({});

const selectedBranchs = ref('');

const updateForm = async () => {
  if (form.value.user_role != userProfile.value.user_role) {
    const data = {
      uuid: form.value.uuid,
      user_role: form.value.user_role,
    };
    const data2 = {
      uuid: form.value.uuid,
      email: form.value.email,
      branch_uuid: selectedBranchs.value,
      status: form.value.status,
    };
    try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/user_role_update', data);
    const response2 = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/update', data2);  
    if (response.http_status < 300 && response2.http_status < 300) {
        console.log('Form updated successfully');
        handleApiSuccess('User updated successfully');
      } else {
        throw new Error(response.message);
      }
    
    } catch (error) {
      handleApiError(error);
    }
  } else {
    const data = {
      uuid: form.value.uuid,
      email: form.value.email,
      branch_uuid: selectedBranchs.value,
      status: form.value.status,
    };
    try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/update', data);
    console.log(selectedBranchs.value)
    if (response.http_status < 300) {
        console.log('Form updated successfully');
        handleApiSuccess('User updated successfully');
      } else {
        throw new Error(response.message);
      }
    
    } catch (error) {
      handleApiError(error);
    }
  }
  // if (form.value.email != userProfile.value.email) {
    
  // } else if (form.value.user_role != userProfile.value.user_role) {
  //   const data = {
  //     uuid: form.value.uuid,
  //     user_role: form.value.user_role,
  //   };
  //   try {
  //   const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/update', data);
      
  //   if (response.http_status < 300) {
  //       console.log('Form updated successfully');
  //       handleApiSuccess('User updated successfully');
  //     } else {
  //       throw new Error(response.message);
  //     }
    
  //   } catch (error) {
  //     handleApiError(error);
  //     console.log(error);
  //   }
  // }
  
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
          <form class="card" @submit.prevent="updateForm">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Edit User</p>
                <argon-button color="success" size="sm" class="ms-auto"
                  >Save</argon-button
                >
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">User Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Name</label
                  >
                  <input v-model="form.name" class="form-control" type="text" disabled  />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Username</label
                  >
                  <argon-input type="text" v-model="form.username" disabled />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Email address</label
                  >
                  <argon-input type="email" v-model="form.email" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label" 
                    >UUID</label
                  >
                  <argon-input type="text" v-model="form.uuid" :disabled="true" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >User role</label
                  >
                  <select class="form-select" v-model="form.user_role" aria-label="Default select example">
                    <option v-for="(role, index) in user_role" :key="index" :value="role">{{ role }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Status</label
                  >
                  <select class="form-select" v-model="form.status" aria-label="Default select example">
                    <option :value="1">Active</option>
                    <option :value="0">Inactive</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-control-label"
                    >Branch</label
                  >
                  <argon-input type="text" v-model="form.branch" :disabled="true" />
                  <label class="form-control-label"
                    >Change Branch</label
                  >
                  <select class="form-select" v-model="selectedBranchs">
                    <option value="" :selected="branchs === ''">Please select a branch</option>
                    <option v-for="(branch, index) in branchs" :key="index" :value="branch.uuid">{{ branch.branch_name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goAccountManagement" />
  </main>
</template>
