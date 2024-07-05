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
  router.push('/account-management');
}

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  getUserRole();
  getBranchList();
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

const form = ref({
    username: '',
    name: '',
    password: '',
    user_role: '',
    branchs: '',
});

const submitForm = async () => {
  const data = {
    username: form.value.username,
    name: form.value.name,
    password: form.value.password,
    email: form.value.email,
    user_role: form.value.user_role,
    branch_uuid: form.value.branchs,
  };
    
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/create', data);
    if (response.http_status < 300) {
      console.log('Form submitted successfully');
      handleApiSuccess('User created successfully');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
    console.log(error);
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
                <p class="mb-0">Create User</p>
                <argon-button color="success" size="sm" class="ms-auto"
                  >Create</argon-button
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
                  <argon-input v-model="form.name" type="text" required/>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Username</label
                  >
                  <argon-input type="text" v-model="form.username" required/>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Email address</label
                  >
                  <argon-input type="email" v-model="form.email" required/>
                </div>
                
                <div class="col-md-6">
                  <label class="form-control-label" 
                    >Password</label
                  >
                  <argon-input type="password" v-model="form.password" required/>
                </div>
                <div class="col-md-6">
                  <label class="form-control-label"
                    >User role</label
                  >
                  <select class="form-select" v-model="form.user_role" required>
                    <option value="" :selected="user_role === ''">Please select a role</option>
                    <option v-for="(role, index) in user_role" :key="index" :value="role">{{ role }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-control-label"
                    >Branch</label
                  >
                  <select class="form-select" v-model="form.branchs" required>
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