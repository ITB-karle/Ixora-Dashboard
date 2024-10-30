<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from 'vue-router';

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import BackButton from "./components/BackButton.vue";
import Multiselect from 'vue-multiselect';

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";

const body = document.getElementsByTagName("body")[0];
// const imageslist = ref([]);

const store = useStore();
const router = useRouter();
const selectUser = ref([]);
const options = ref([]);      

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  getMemberList();
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

const goListPage= () => {
  showSuccessModal.value = false;
  router.push('/feeds-list');
};

// const userList = ref([]);
const getMemberList = async () => {
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/list');
    const patients = response.data.patients;
    options.value = patients.map(patient => ({
      name: patient.name,
      uuid: patient.uuid
    }));
  } catch (error) {
    console.error('Failed to fetch member list:', error);
  }
};                          


const form = ref({
  receiver_uuid: [],
  text: '',
  files: []
});

const createIntroduction = async () => {
  const data = {
    receiver_uuid: selectUser.value.uuid,
    text: form.value.text,
  }
  let newimglist = {}
  form.value.files.map((image, index) => {
    console.log(image)
    newimglist = {
      ...newimglist,
      [`files[${index}]`]: image
    }
  })

  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/forum/store`,
    {...data, ...newimglist});
    if (response.http_status < 300) {
      handleApiSuccess('Feeds created successfully');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
  }
};


const images = ref([]);

const onFileChange = (event) => {
  const files = event.target.files;
  const maxFiles = 10; // Example limit
  if (files.length > maxFiles) {
    console.warn('Exceeded maximum allowed files. Only the first 10 files will be uploaded.');
  }
  const selectedFiles = Array.from(files).slice(0, maxFiles);

  for (let i = 0; i < selectedFiles.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push({
        name: selectedFiles[i].name,
        url: e.target.result,
        file: selectedFiles[i],
      });
      form.value.files.push(selectedFiles[i]);
    };
    reader.readAsDataURL(selectedFiles[i]);
  }
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  form.value.files.splice(index, 1);
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
                 <p class="mb-0 text-primary font-weight-bolder">Create Feeds</p>
                <argon-button color="success" size="sm" class="ms-auto" @click="createIntroduction">
                  Create
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Feeds Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Patient Name</label
                  >
                  <multiselect v-model="selectUser" :options="options" label="name" track-by="uuid" placeholder="Select users"></multiselect>
                </div>
                <div class="col-md-6">
                  <argon-textarea :rows="8" type="text" v-model:title="form.text">
                    Text
                  </argon-textarea>
                </div>
                <div class="col-md-6">
                  <input type="file" @change="onFileChange" multiple accept="image/*" />
                  <div v-if="images.length">
                    <h3>Image Preview:</h3>
                    <ul class="d-flex flex-wrap px-0" style="list-style-type: none;">
                      <li class="mx-3 text-center" v-for="(image, index) in images" :key="index">
                        <img :src="image.url" :alt="image.name" class="border border-dark" width="200" height="120" />
                        <p style="max-width: 200px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{ image.name }}</p>
                        <argon-button color="danger" class="text-xs text-center" @click="removeImage(index)">Remove</argon-button>
                      </li>
                    </ul>
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
<style src="vue-multiselect/dist/vue-multiselect.css"></style>