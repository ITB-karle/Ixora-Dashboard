<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js'; 

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  getNotificationList();
  // Extract the UUID from the URL query parameters
  // const urlParams = new URLSearchParams(window.location.search);
  // const patient_uuid = urlParams.get('uuid');

  // if (patient_uuid) {
  //   getPatientDetails(patient_uuid);
  //   getVitalSignsList(patient_uuid);
  // } else {
  //     console.error('UUID not found in URL query parameters');
  // };

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


const notification = ref([]);
// const form = ref({});
// const receiver = ref([]);
// const reminders = ref([]);
// const introduction = ref([]);
// const reports = ref([]);

const getNotificationList = async () => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/notifications/fullList?search&new&status&paginate&per_page`);
    notification.value = response.data;
    // form.value = { ...response.data.profile };
    // receiver.value = response.data.receiver_uuid;
    // reminders.value = response.data.reminders;
    // introduction.value = response.data.introductions;
    // reports.value = response.data.reports;
  } catch (error) {
    console.error('Get Data Failed', error);
    // Handle login error
  }
};

const currentPage = ref(1);

const perPage = 10; // Assuming 10 patients per page


/// Function to calculate the total number of pages
const totalPages = computed(() => Math.ceil(notification.value.length / perPage));

// Function to get the subset of patients to display on the current page
const notificationDisplay = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return notification.value.slice(startIndex, endIndex);
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
        <span class="mask bg-gradient-warning opacity-6"></span>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12 mt-n5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Notification List</p>
                <a
                  :href="`../create-notification`"
                >
                  <argon-button >Add</argon-button>
                </a>
              </div>
            </div>
            <div class="card-body px-0 pt-0 pb-2">
              <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        ID
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Receiver Name
                      </th>
                      <!-- <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Media
                      </th> -->
                      <!-- <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Text
                      </th> -->
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Title
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Created At
                      </th>
                      <!-- <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(notification, index) in notificationDisplay" :key="index">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <!-- <img
                              src="../../assets/img/team-2.jpg"
                              class="avatar avatar-sm me-3"
                              alt="user1"
                            /> -->
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="badge badge-sm bg-gradient-primary mb-0">{{ notification.uniqId }}</h6>
                          </div>
                        </div>
                      </td>
                      <td v-if="notification.receiver_uuid" class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ notification.receiver_uuid.name }}</span>
                      </td>
                      <td v-else class="align-middle text-center text-sm">
                        <span class="badge badge-sm bg-gradient-danger">All</span>
                      </td>
                      <!-- <td class="align-middle text-center text-sm">
                        <img
                          :src="forum.media"
                          class="avatar avatar-sm me-3"
                          alt="user1"
                        />
                      </td> -->
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ notification.title }}</span>
                      </td>
                      <!-- <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ notification.description }}</span
                        >
                      </td> -->
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ notification.created_at }}</span
                        >
                      </td>
                      <!-- <td class="align-middle text-center">
                        <a
                          :href="`../edit-notification/?uuid=${notification.uuid}`"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Edit user"
                          >
                          <argon-button color="light">
                            <i class="fas fa-pen"></i>
                          </argon-button>
                        </a>
                      </td> -->
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
        </div>
      </div>
    </div>
  </main>
</template>
