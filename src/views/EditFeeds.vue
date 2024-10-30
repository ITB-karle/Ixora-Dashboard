<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from 'vue-router';

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import BackButton from "./components/BackButton.vue";

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";

const body = document.getElementsByTagName("body")[0];
// const imageslist = ref([]);

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
    getFeeds(uuid);
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

const oldImages= ref([]);

const getFeeds = async (uuid) => {
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/forum/${uuid}/show`);
    form.value = { ...response.data, files: response.data?.files ?? [] };

    // Assuming response.data.media is an array of image objects
    if (response.data.media && Array.isArray(response.data.media)) {
      oldImages.value = response.data.media.map((oldImage) => ({
        name: oldImage.name || 'Image', // Adjust according to your API response structure
        url: oldImage.media_path, // Adjust according to your API response structure
        file: null // No file object since this is fetched from the server
      }));
    }
  } catch (error) {
    handleApiError(error);
  }
};

const form = ref({
  feeds_uuid: '',
  text: '',
  receiver_uuid: {
    name: '',
  },
  files: [],
});

const updateFeeds = async () => {

  const data = {
    feeds_uuid: form.value.uuid,
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
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/forum/update`,
    {...data, ...newimglist});
    if (response.http_status < 300) {
      handleApiSuccess('Feeds created successfully');
      form.value.files = [];
      images.value = [];
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
      console.log(form.value.files);
    };
    reader.readAsDataURL(selectedFiles[i]);
  }
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  form.value.files.splice(index, 1);
};


// async function uploadImages() {
//   imageslist.value = images.value;
// };


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
          <form class="card" @submit.prevent="updateFeeds">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                 <p class="mb-0 text-primary font-weight-bolder">Update Feeds</p>
                <argon-button color="warning" size="sm" class="ms-auto">
                  Update
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
                  <argon-input type="text" v-model="form.receiver_uuid.name" disabled />
                </div>
                <div class="col-md-6">
                  <argon-textarea :rows="8" type="text" v-model:title="form.text" required>
                    Text
                  </argon-textarea>
                </div>
                <div class="col-md-12"> 
                  <div v-if="oldImages.length">
                    <label class="form-control-label d-block">Latest Images</label>
                    <ul class="d-flex flex-wrap px-0" style="list-style-type: none;">
                      <li class="mx-2 my-0 text-center" v-for="(oldImage, index) in oldImages" :key="index">
                        <img :src="oldImage.url" :alt="oldImage.name" class="border border-dark" width="200" height="120" />
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="col-md-12 mt-5">
                  <label class="form-control-label d-block">Upload New Images</label>
                  <input type="file" @change="onFileChange" multiple accept="image/*" />
                  <div v-if="images.length">
                    <h3>New Image Preview:</h3>
                    <div>(This upload function will overwrites the old images)</div>
                    <ul class="d-flex flex-wrap px-0" style="list-style-type: none;">
                      <li class="mx-2 text-center" v-for="(image, index) in images" :key="index">
                        <img :src="image.url" :alt="image.name" class="border border-dark" width="200" height="120" />
                        <p style="max-width: 200px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{ image.name }}</p>
                        <argon-button color="danger" class="text-xs text-center" @click="removeImage(index)">Remove</argon-button>
                      </li>
                    </ul>
                  </div>
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
