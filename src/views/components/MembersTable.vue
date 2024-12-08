<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiRequest } from '@/assets/js/apiRequest.js';
import ArgonButton from "@/components/ArgonButton.vue";

  const memberList = ref([]);
  const currentPage = ref(1);
  const perPage = 10;

  const getMemberList = async () => {
    try {
      // Make API call to authenticate user
      // Example using axios:
      const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/list');
      memberList.value = response.data.patients;
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
    }
  };

  onMounted(() => {
    getMemberList();
  });

  // Function to calculate the total number of pages
  const totalPages = computed(() => Math.ceil(memberList.value.length / perPage));

  // Function to get the subset of patients to display on the current page
  const memberToDisplay = computed(() => {
    const startIndex = (currentPage.value - 1) * perPage;
    const endIndex = startIndex + perPage;
    return memberList.value.slice(startIndex, endIndex);
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

  const showModal = ref(false);
  const userData = ref('');
  const familyPatients = ref('');

  const openModal = (uuid) => {
    showModal.value = true;
    getUserDetails(uuid);
    getUserFamilyPatients(uuid);
  };

  const closeModal = () => {
    showModal.value = false;
  };

  const getUserDetails = async (uuid) => {
    try {
      // Make API call to authenticate user
      // Example using axios:
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/${uuid}/show`);
      userData.value = response.data;
    } catch (error) {
      console.error('Get Data Failed', error);
      // Handle login error
    }
  };

  const getUserFamilyPatients = async (uuid) => {
    try {
      // Make API call to authenticate user
      // Example using axios:
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/user/${uuid}/show_family_patients`);
      familyPatients.value = response.data;
    } catch (error) {
      console.error('Get Data Failed', error);
      // Handle login error
    }
  };

</script>
<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Family List</h6>
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
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Branch
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Updated At
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                patient
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">edit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in memberToDisplay" :key="index">
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
                    <h6 class="mb-0 text-sm">{{ member.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">
                  {{ member.email }}
                </p>
              </td>
              <td class="align-middle">
                <span class="text-secondary text-xs font-weight-bold">{{ member.branch }}</span>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{ member.updated_at }}</span>
              </td>
              <td class="align-middle text-center">
                <!-- <a
                  v-if="member.patient_uuid" 
                  :href="`edit-patient/?uuid=${member.patient_uuid}`"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                >
                  <argon-button color="dark">
                    <i class="fas fa-pen"></i>
                  </argon-button>
                </a> -->
                <a
                  v-if="member.patient_uuid" 
                  @click="openModal(member.uuid)"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                >
                  <argon-button color="dark">
                    <i class="fas fa-pen"></i>
                  </argon-button>
                </a>
                <a
                  v-else
                  :href="`create-patient/?uuid=${member.uuid}`"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="add user"
                >
                  <argon-button color="warning">
                    <i class="fas fa-plus"></i>
                  </argon-button>
                </a>
              </td>
              <td class="align-middle text-center">
                <a
                  :href="`edit-user/?uuid=${member.uuid}`"
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
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <form class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: black;">{{ userData.name }}'s Patients</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="closeModal">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h6>Family Members:</h6>
            <div v-for="(family, index) in familyPatients" :key="index" class="d-flex justify-content-between border rounded mb-2 py-2 px-3">
              <div class="d-flex align-items-center">
                <i class="ni ni-single-02"></i>
                <div class="ms-4">
                  <div style="font-size: 9px;">Current Family</div>
                  <div>{{ family.name }}</div>
                </div>
              </div>
              <router-link
                :to="{ path: 'edit-patient/', query: { uuid: family.uuid }}"
                class="text-secondary font-weight-bold text-xs"
              >
                <argon-button color="danger">
                  <i class="fas fa-pen"></i>
                </argon-button>
              </router-link>

            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <div class="text-center">
              <argon-button color="dark" @click="closeModal">Close</argon-button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>