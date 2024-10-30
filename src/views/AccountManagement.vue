<script setup>
import MembersTable from "./components/MembersTable.vue";
import DoctorsTable from "./components/DoctorsTable.vue";
import StaffTable from "./components/StaffTable.vue";
import HelpdeskTable from "./components/HelpdeskTable.vue";

import ArgonButton from "@/components/ArgonButton.vue";

import { ref } from 'vue';

const displayTable = ref('members');
const activeButton = ref('members')

const changeToMembers = () => {
  displayTable.value = "members";
  activeButton.value = "members";
};

const changeToDoctors = () => {
  displayTable.value = "doctors";
  activeButton.value = "doctors";
};

const changeToCs = () => {
  displayTable.value = "cs";
  activeButton.value = "cs";
};

const changeToHelpdesk = () => {
  displayTable.value = "helpdesk";
  activeButton.value = "helpdesk";
};

</script>
<template>
  <div class="container-fluid">
    <div class="text-end mt-5 mb-3">
      <router-link :to="{ name: 'Create User' }">
        <argon-button color="warning" variant="gradient">
          <i class="fas fa-plus me-2"></i>
          Add New User
        </argon-button>
      </router-link>
    </div>

    <div class="row">
      <div class="col-6 col-md-3 my-3">
        <button class="btn w-100" :class="{ 'btn-light': activeButton !== 'members', 'btn-dark': activeButton === 'members' }" @click="changeToMembers">Family</button>
      </div>
      <div class="col-6 col-md-3 my-3">
        <button class="btn w-100" :class="{ 'btn-light': activeButton !== 'doctors', 'btn-dark': activeButton === 'doctors' }" @click="changeToDoctors">Medical</button>
      </div>
      <div class="col-6 col-md-3 my-3">
        <button class="btn w-100" :class="{ 'btn-light': activeButton !== 'cs', 'btn-dark': activeButton === 'cs' }" @click="changeToCs">Staff</button>
      </div>
      <div class="col-6 col-md-3 my-3">
        <button class="btn w-100" :class="{ 'btn-light': activeButton !== 'helpdesk', 'btn-dark': activeButton === 'helpdesk' }" @click="changeToHelpdesk">Helpdesk</button>
      </div>
      <div v-if="displayTable === 'members'" class="mb-5">
        <members-table />
      </div>
      <div v-else-if="displayTable === 'doctors'" class="mb-5">
        <doctors-table />
      </div>
      <div v-else-if="displayTable === 'cs'" class="mb-5">
        <staff-table />
      </div>
      <div v-else class="mb-5">
        <helpdesk-table />
      </div>
    </div>

  </div>
</template> 