<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { apiRequest } from '@/assets/js/apiRequest.js'; 

import ArgonButton from "@/components/ArgonButton.vue";

import DeleteModal from "./components/DeleteModal.vue";

const router = useRouter();

onMounted(() => {

  getForumList();
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


const showDeleteModal = ref(false);
const deleteMessage = ref("Do you want to delete this forum?")
const deleteForumID = ref('');

const showModalD = (forum_uuid) => {
  showDeleteModal.value = true;
  deleteForumID.value = forum_uuid;
};

const closeModal = () => {
  showDeleteModal.value = false;
};


const forum = ref([]);

const getForumList = async () => {
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/forum/fullList?search&new&status&paginate&per_page`);
    forum.value = response.data;

  } catch (error) {
    console.error('Get Forum List Failed', error);
    // Handle login error
  }
};

const deleteForum = async (forum_uuid) => {
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/forum/delete`, {forum_uuid});
    console.log("Success", response);
    closeModal();
    router.go();
  } catch (error) {
    console.error('Forum Data Delete Failed', error);
  }
};

const currentPage = ref(1);

const perPage = 10; // Assuming 10 patients per page


/// Function to calculate the total number of pages
const totalPages = computed(() => Math.ceil(forum.value.length / perPage));

// Function to get the subset of patients to display on the current page
const forumDisplay = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return forum.value.slice(startIndex, endIndex);
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
  <main class="container-fluid">
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Forum List</p>
                <a
                  :href="`../create-forum`"
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
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Text
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Created By
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Created At
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(forum, index) in forumDisplay" :key="index">
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
                            <h6 class="badge badge-sm bg-gradient-primary">{{ forum.id }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ forum.receiver_uuid.name }}</span>
                      </td>
                      <!-- <td class="align-middle text-center text-sm">
                        <img
                          :src="forum.media"
                          class="avatar avatar-sm me-3"
                          alt="user1"
                        />
                      </td> -->
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold text-truncate">{{ forum.text }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ forum.created_by.name }}</span
                        >
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ forum.created_at }}</span
                        >
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-forum/?uuid=${forum.uuid}`"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Edit user"
                          >
                          <argon-button color="light">
                            <i class="fas fa-pen"></i>
                          </argon-button>
                        </a>
                      </td>
                      <td class="align-middle text-center">
                        <a
                          @click="showModalD(forum.uuid)"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Forum"
                          >
                          <argon-button color="danger">
                            <i class="fas fa-trash"></i>
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
        </div>
      </div>
    </div>
    <!-- Modal -->
    <!-- <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Forum</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="closeModal">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are u sure to delete this forum ?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="deleteForum(deleteForumID)">Confirm</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </div> -->
    <delete-modal :show-modal="showDeleteModal" :delete-message="deleteMessage" @close="showDeleteModal = false" @delete-data="deleteForum(deleteForumID)" />
  </main>
</template>

<style>
.text-truncate {
  max-width: 200px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

</style>
