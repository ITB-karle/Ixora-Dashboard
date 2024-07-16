<script setup>
import PatientsTable from "./components/PatientsTable.vue";

// import ArgonButton from "@/components/ArgonButton.vue";


</script>
<template>
  <div class="container-fluid mt-6">
    <!-- <div class="text-end mt-5 mb-3">
      <router-link :to="{ name: 'Create User' }">
        <argon-button color="warning" variant="gradient">
          <i class="fas fa-plus me-2"></i>
          Add New User
        </argon-button>
      </router-link>
    </div> -->

    <div class="row">
      <div class="mb-5">
        <patients-table />
      </div>
    </div>

  </div>
</template> 