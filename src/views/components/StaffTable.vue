<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiRequest } from '@/assets/js/apiRequest.js';
import ArgonButton from "@/components/ArgonButton.vue";

  const staffList = ref([]);
  const currentPage = ref(1);
  const perPage = 10;

  const getStaffList = async () => {
    try {
      // Make API call to authenticate user
      // Example using axios:
      const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/list');
      staffList.value = response.data.customer_service;
    } catch (error) {
      console.error('Get Data Failed:', error);
      // Handle login error
    }
  };

  onMounted(() => {
    getStaffList();
  });

  // Function to calculate the total number of pages
  const totalPages = computed(() => Math.ceil(staffList.value.length / perPage));

  // Function to get the subset of patients to display on the current page
  const staffToDIsplay = computed(() => {
    const startIndex = (currentPage.value - 1) * perPage;
    const endIndex = startIndex + perPage;
    return staffList.value.slice(startIndex, endIndex);
  });

  // Function to navigate to a specific page
  const goToPage = (page) => {
    currentPage.value = page;
  };

  // Function to navigate to the next page
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  // Function to navigate to the previous page
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
</script>
<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Staff List</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Name
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Email
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Branch
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Updated At
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(staff, index) in staffToDIsplay" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img
                      src="../../assets/img/team-2.jpg"
                      class="avatar avatar-sm me-3"
                      alt="user1"
                    />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ staff.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">
                  {{ staff.email }}
                </p>
              </td>
              <td class="align-middle">
                <span class="text-secondary text-xs font-weight-bold">{{ staff.branch }}</span>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{ staff.updated_at }}</span>
              </td>
              <td class="align-middle text-center">
                <a
                  :href="`edit-user/?uuid=${staff.uuid}`"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                  >
                  <argon-button color="light">
                    <i class="fas fa-pen"></i>
                  </argon-button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation example" class="my-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" tabindex="-1" @click="prevPage">
                <i class="fa fa-angle-left"></i>
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" @click="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" @click="nextPage">
                <i class="fa fa-angle-right"></i>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>