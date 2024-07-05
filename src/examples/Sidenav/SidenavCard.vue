<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from "vue-router";

import ErrorModal from "../../views/components/ErrorModal.vue";
import SuccessModal from "../../views/components/SuccessModal.vue";

const store = useStore();
const router = useRouter();

const layout = computed(() => store.state.layout);
defineProps({
  card: {
    type: Object,
    required: true,
    title: String,
    description: String,
    links: {
      type: Array,
      label: String,
      route: String,
      color: String,
    },
  },
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
  router.push('/signin');
}


const logout = async () => {
  try {
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/logout','Post');
    if (response.http_status < 300) {
      handleApiSuccess('Logout Successfully');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
    console.log(error);
  }
}

</script>
<template>
  <div
    v-show="layout !== 'landing'"
    class="card card-plain shadow-none"
    id="sidenavCard"
  >
    <!-- <div class="p-3 card-body text-center w-100 pt-0">
      <img
        class="w-50 mx-auto"
        src="@/assets/img/illustrations/icon-documentation.svg"
        alt="sidebar_illustration"
      />

      <h6 class="mb-0 text-dark up">Need Help ?</h6>



      <p class="text-xs font-weight-bold">Please check our docs</p>
    </div>

    <a
      href="https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/"
      target="_blank"
      class="mb-3 btn btn-dark btn-sm w-100"
    >
      Documentation
    </a> -->

    <a
      class="mt-8 mb-3 btn btn-danger btn-sm w-100"
      @click="logout"
    >
      Logout
    </a>
    
  </div>
  <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
  <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
</template>
