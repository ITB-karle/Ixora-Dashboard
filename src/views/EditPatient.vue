<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useStore } from "vuex";
import { apiRequest } from '@/assets/js/apiRequest.js';
import { useRouter } from 'vue-router';

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
// import ProfileCard from "./components/ProfileCard.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import FileInput from"@/components/FileInput.vue";
import Multiselect from 'vue-multiselect';

import ErrorModal from "./components/ErrorModal.vue";
import SuccessModal from "./components/SuccessModal.vue";
import DeleteModal from "./components/DeleteModal.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const router = useRouter();
const selectUser = ref([]);
const options = ref([]);  

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  // Extract the UUID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const patient_uuid = urlParams.get('uuid');

  // Call getUserProfile function with the extracted UUID
  if (patient_uuid) {
    getPatientDetails(patient_uuid);
    getMedicationList(patient_uuid);
    getVitalSignsList(patient_uuid);
    fetchFamilyMembers(patient_uuid);
  } else {
      console.error('UUID not found in URL query parameters');
      // Handle error
  };

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

const showModal = ref(false);
const recordType = ref(true);


const showModalD = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const showDeleteModal = ref(false);
const deleteMessage = ref("Do you want to delete this data?");
const deleteDataID = ref('');
const deleteType = ref('');

const showModalDelete = (uuid, type) => {
  showDeleteModal.value = true;
  deleteDataID.value = uuid;
  deleteType.value = type;
};

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

const deleteData = async (deleteDataID, deleteType) => {
  console.log(deleteType);
  const uuid = deleteDataID;
  if (deleteType == 'medication') {
    try {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_medication_record/delete`, {uuid});
      if (response.http_status < 300) {
        handleApiSuccess('Data Deleted Successfully');
        showDeleteModal.value = false;
        router.go();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
    //   console.log("Success", response);
    //   showDeleteModal.value = false;
    //   router.go();
    // } catch (error) {
    //   console.error('Forum Data Delete Failed', error);
    // }
  } else if (deleteType == 'reminder') {
    try {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/delete`, {uuid});
      if (response.http_status < 300) {
        handleApiSuccess('Data Deleted Successfully');
        showDeleteModal.value = false;
        router.go();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  } else if (deleteType == 'introduction') {
    try {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_introduction/delete`, {uuid});
      if (response.http_status < 300) {
        handleApiSuccess('Data Deleted Successfully');
        showDeleteModal.value = false;
        router.go();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  } else if (deleteType == 'report') {
    try {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_report/delete`, {uuid});
      if (response.http_status < 300) {
        handleApiSuccess('Data Deleted Successfully');
        showDeleteModal.value = false;
        router.go();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  } else if (deleteType == 'vital') {
    try {
      const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/vital_sign/delete`, {uuid});
      if (response.http_status < 300) {
        handleApiSuccess('Data Deleted Successfully');
        showDeleteModal.value = false;
        router.go();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  }
  
};

const assignFamily = async () => {
  const familyUserUuids = selectUser.value.map(user => user.uuid);

  const data = {
    uuid: form.value.uuid,
    family_user_uuids: familyUserUuids,
  };
  console.log('Assigned data:', data);
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient/assign_family_members`,
    data);
    console.log('Assigned data:', data);
    if (response.http_status < 300) {
      handleApiSuccess('User Profile Updated Successfully');
      console.log(data);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
  }
}

const updateProfile = async () => {
  const payload = {
    emergency_contact: form.value.emergency_contact.map(contact => contact.phone).join(','),
    emergency_name: form.value.emergency_name.map(name => name.phone).join(',')
  };

  const data = {
    uuid: form.value.uuid,
    name: form.value.name,
    date_of_birth: form.value.date_of_birth,
    ic_number: form.value.ic_number,
    gender: form.value.gender,
    home_address: form.value.home_address,
    emergency_contact: payload.emergency_contact,
    emergency_name: payload.emergency_name,
  };
  console.log(payload.emergency_contact);
  console.log(data);
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient/update`,
    data);
    if (response.http_status < 300) {
      handleApiSuccess('User Profile Updated Successfully');
      console.log(data);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    handleApiError(error);
  }
};

const uploadProfileImage = async () => {
  const data = {
    uuid: form.value.uuid,
    image: form.value.image,
  };

  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient/update_image`, data)
    if (response.http_status < 300) {
      closeModal();
      handleApiSuccess('User Profile Image Updated Successfully');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    closeModal();
    handleApiError(error);
  }
}
  


const patientProfile = ref('');
const form = ref({
  emergency_contact: [
    { phone: '' },
    { phone: '' },
    { phone: '' }
  ],
  emergency_name: [
    { phone: '' },
    { phone: '' },
    { phone: '' }
  ]
});
const reminders = ref([]);
const introduction = ref([]);
const reports = ref([]);

const getPatientDetails = async (patient_uuid) => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient/${ patient_uuid }/show`);
    patientProfile.value = response.data.profile;
    const { emergency_contact, emergency_name, gender, ...profileData} = { ...response.data.profile }
    const emergencyContactObjects = emergency_contact.map(contact => ({ phone: contact }));
    const emergencyNameObjects = emergency_name.map(name => ({ phone: name }));
    form.value = { ...profileData, gender: gender == 'male' ? 1 : 2, emergency_contact: emergencyContactObjects, emergency_name: emergencyNameObjects };
    // selectUser.value = patientProfile.value.family_members;
    // medicationRecords.value = response.data.medication_records;
    reminders.value = response.data.reminders;
    introduction.value = response.data.introductions;
    reports.value = response.data.reports;
  } catch (error) {
    console.error('Get Patient Data Failed', error);
    // Handle login error
  }
};

const medicationRecords = ref([]);
const mrTemporary = ref([]);
// const remark = ref(
//   {
//     remark: "",
//     time: "",
//     before_after: "",
//   }
// );

const formatDate = (datetime) => {
  return datetime.split(' ')[0]; // Just extract the date part, e.g., '2024-10-16'
};

// Helper function to get unit label
const getUnitLabel = (unitValue) => {
  switch(unitValue) {
    case 1:
      return 'tablet';   // Unit is 'tablet'
    case 2:
      return 'capsule';       // Unit is 'mL'
    case 3:
      return 'mL';       // Unit is 'mg'
    default:
      return 'unit';         // No unit for other values
  }
};

const getMedicationList = async (patient_uuid) => {
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_medication_record/${ patient_uuid }/list`);

    // Format the 'updated_at' date and handle unit label for each medication record
    medicationRecords.value = response.data.permanent.map(record => ({
      ...record,
      updated_at: formatDate(record.updated_at),  // Apply formatting to 'updated_at'
      unitLabel: getUnitLabel(record.unit),  // Add 'mL' if unit.value equals 1
    
      // Parse 'remark' for each record
      remark: (() => {
        try {
          return JSON.parse(record.remark) ?? { remark: "", time: "", before_after: "" };
        } catch (error) {
          console.error('Error parsing remark for permanent record:', error);
          return { remark: "", time: "", before_after: "" };  // Default structure
        }
      })(),
    }));

    mrTemporary.value = response.data.temporary.map(record => ({
      ...record,
      updated_at: formatDate(record.updated_at),  // Apply formatting to 'updated_at'
      unitLabel: getUnitLabel(record.unit),  // Add 'mL' if unit.value equals 1
      
      // Parse 'remark' for each record
      remark: (() => {
        try {
          return JSON.parse(record.remark) ?? { remark: "", time: "", before_after: "" };
        } catch (error) {
          console.error('Error parsing remark for permanent record:', error);
          return { remark: "", time: "", before_after: "" };  // Default structure
        }
      })(),
    
    }));
    
  } catch (error) {
    console.error('Get Patient Data Failed', error);
  }
  
};

const vitalSigns = ref([]);

const getVitalSignsList = async (patient_uuid) => {
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/vital_sign/${ patient_uuid }/list`);
    vitalSigns.value = response.data;
  } catch (error)  {
    console.error('Get Patient Vital Sign Failed', error);
  }
};

const fetchFamilyMembers = async (patient_uuid) => {
  try {
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient/${ patient_uuid }/show_family_members`);
    const patients = response.data;
    options.value = patients.map(patient => ({
      name: patient.username,
      uuid: patient.uuid,
      selected: patient.selected
    }));
    selectUser.value = options.value.filter(option => option.selected);
  } catch (error) {
    console.error('Failed to fetch member list:', error);
  }
};     


const currentPage = ref(1);
const currentPageReminder = ref(1);
const currentPageIntro = ref(1);
const currentPageReport = ref(1);
const currentPageVital = ref(1);
const perPage = 10; // Assuming 10 patients per page


/// Function to calculate the total number of pages
const totalPages = computed(() => Math.ceil(medicationRecords.value.length / perPage));
const totalPagesReminder = computed(() => Math.ceil(reminders.value.length / perPage));
const totalPagesIntro = computed(() => Math.ceil(introduction.value.length / perPage));
const totalPagesReport = computed(() => Math.ceil(reports.value.length / perPage));
const totalPagesVital = computed(() => Math.ceil(vitalSigns.value.length / perPage));

// Function to get the subset of patients to display on the current page


const remindersDisplay = computed(() => {
  const startIndex = (currentPageReminder.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return reminders.value.slice(startIndex, endIndex);
});

const introDisplay = computed(() => {
  const startIndex = (currentPageIntro.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return introduction.value.slice(startIndex, endIndex);
});

const reportsDisplay = computed(() => {
  const startIndex = (currentPageReport.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return reports.value.slice(startIndex, endIndex);
});

const vitalsDisplay = computed(() => {
  const startIndex = (currentPageVital.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return vitalSigns.value.slice(startIndex, endIndex);
});

// Function to navigate to a specific page
const goToPage = (page) => {
  currentPage.value = page;
};


const goToPageReminder = (page) => {
  currentPageReminder.value = page;
};

const goToPageIntro = (page) => {
  currentPageIntro.value = page;
};

const goToPageReport = (page) => {
  currentPageReport.value = page;
};

// Function to navigate to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const nextPageReminder = () => {
  if (currentPageReminder.value < totalPagesReminder.value) {
    currentPageReminder.value++;
  }
};

const nextPageIntro = () => {
  if (currentPageIntro.value < totalPagesIntro.value) {
    currentPageIntro.value++;
  }
};

const nextPageReport = () => {
  if (currentPageReport.value < totalPagesReport.value) {
    currentPageReport.value++;
  }
};

const nextPageVital = () => {
  if (currentPageVital.value < totalPagesVital.value) {
    currentPageVital.value++;
  }
};

// Function to navigate to the previous page
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const prevPageReminder = () => {
  if (currentPageReminder.value > 1) {
    currentPageReminder.value--;
  }
};

const prevPageIntro = () => {
  if (currentPageIntro.value > 1) {
    currentPageIntro.value--;
  }
};

const prevPageReport = () => {
  if (currentPageReport.value > 1) {
    currentPageReport.value--;
  }
};

const prevPageVital = () => {
  if (currentPageVital.value > 1) {
    currentPageVital.value--;
  }
};

const vitalTable = ref(null);
const medicationTable = ref(null);

const printTable = () => {
  const printContent = vitalTable.value.outerHTML; // Get the table HTML content
  const originalContent = document.body.innerHTML; // Backup the original content of the page

  document.body.innerHTML = printContent; // Replace the body content with only the table
  window.print(); // Trigger the print dialog
  document.body.innerHTML = originalContent; // Restore the original page content
  location.reload();
};

const printMedicationTable = () => {
  const printContent = medicationTable.value.outerHTML; // Get the table HTML content
  const originalContent = document.body.innerHTML; // Backup the original content of the page

  document.body.innerHTML = printContent; // Replace the body content with only the table
  window.print(); // Trigger the print dialog
  document.body.innerHTML = originalContent; // Restore the original page content
  location.reload();
};

const displayedRecords = computed(() => {
  const recordsToDisplay = recordType.value ? medicationRecords.value : mrTemporary.value;

  const startIndex = (currentPage.value - 1) * perPage; // Calculate the starting index
  const endIndex = startIndex + perPage; // Calculate the ending index

  return recordsToDisplay.slice(startIndex, endIndex); // Return the sliced array
});

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
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img
                  :src="form.profile_photo_path"
                  alt="profile_image"
                  class="shadow-sm border-radius-lg"
                  style="width: 75px; height: 75px;"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{ patientProfile.name }}</h5>
                <!-- <p class="mb-0 font-weight-bold text-sm">Public Relations</p> -->
              </div>
            </div>
            <div
              class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 text-end"
            >
              <div class="nav-wrapper position-relative end-0">
                <argon-button class="mx-3" color="primary" @click="showChangePassword">Change Password</argon-button>
                <argon-button color="secondary" @click="showModalD()">Change Profile Image</argon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <form class="card" @submit.prevent="updateProfile">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0 text-primary font-weight-bolder">Edit Profile</p>
                <argon-button color="warning" size="sm" class="ms-auto"
                  >Update</argon-button
                >
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Patient Information</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Name</label
                  >
                  <argon-input type="text" v-model="form.name" required />
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Gender</label
                  >
                  <select class="form-select" v-model="form.gender" aria-label="Default select example">
                    <option value="" :selected="gender === ''">Please select a gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >Date of Birth</label
                  >
                  <input class="form-control" type="date" v-model="form.date_of_birth" required />
                </div>
                <div class="col-md-3">
                  <label for="example-text-input" class="form-control-label"
                    >IC Number</label
                  >
                  <argon-input type="number" v-model="form.ic_number" required/>
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">Contact Information</p>
              <div class="row">
                <div class="col-md-6">
                  <argon-textarea :rows="9" type="text" v-model:title="form.home_address" required>
                    Address
                  </argon-textarea>
                </div>
                <div class="col-md-3" >
                  <div v-for="(name, index) in form.emergency_name" :key="index">
                    <label :for="`emergency-name-${index}`" class="form-control-label">
                      Emergency Contact Name {{ index + 1 }}{{ index === 0 ? '' : ' (Optional)' }}
                    </label>
                    <argon-input type="text" v-model="name.phone" required/>
                  </div>
                </div>
                <div class="col-md-3" >
                  <div v-for="(contact, index) in form.emergency_contact" :key="index">
                    <label :for="`emergency-contact-${index}`" class="form-control-label">
                      Emergency Contact {{ index + 1 }}{{ index === 0 ? '' : ' (Optional)' }}
                    </label>
                    <argon-input type="number" v-model="contact.phone" required/>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Family Member -->
        <div class="col-md-12 mt-5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Family Members</p>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <multiselect v-model="selectUser" :options="options" label="name" :multiple="true" :close-on-select="false" track-by="uuid" placeholder="Select users"></multiselect>
                  <argon-button @click="assignFamily" class="mt-3">Assign</argon-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12 mt-5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="mb-0 text-primary font-weight-bolder">Medication Records</p>
                  <argon-switch id="sent" name="Send to" v-model:title="recordType">
                    <span v-if="recordType == true" class="text-dark font-weight-bolder">Permanent</span>
                    <span v-else class="text-dark font-weight-bolder">Temporary</span>
                  </argon-switch>
                </div>
                <div>
                  <argon-button class="mx-3" color="dark" @click="printMedicationTable">Print</argon-button>
                  <a
                    :href="`../create-medication/?uuid=${form.uuid}`"
                  >
                    <argon-button >Add</argon-button>
                  </a>
                </div>
                
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
                        Medicine Name
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Dosing
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Frequency
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Inventory
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Updated At
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(medication, index) in displayedRecords" :key="index">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ medication.medication_name }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ medication.dosing }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ medication.frequency }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ medication.inventory }}</span
                        >
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ medication.updated_at }}</span
                        >
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-medication/?uuid=${medication.uuid}`"
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
                          @click="showModalDelete(medication.uuid, 'medication')"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Medication"
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
            <!-- <div v-else class="card-body px-0 pt-0 pb-2">
              <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Medicine Name
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Dosing
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Frequency
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Inventory
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Updated At
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(medication, index) in mrTemporaryDisplay" :key="index">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ medication.medication_name }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ medication.dosing }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ medication.frequency }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ medication.inventory }}</span
                        >
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold"
                          >{{ medication.updated_at }}</span
                        >
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-medication/?uuid=${medication.uuid}`"
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
                          @click="showModalDelete(medication.uuid, 'medication')"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Medication"
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
                    <li class="page-item" :class="{ disabled: currentPageT === 1 }">
                      <a class="page-link" tabindex="-1" @click="prevPageT">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>
                    <li v-for="page in totalPagesT" :key="page" class="page-item" :class="{ active: page === currentPageT }">
                      <a class="page-link" @click="goToPageT(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageT === totalPagesT }">
                      <a class="page-link" @click="nextPageT">
                        <i class="fa fa-angle-right"></i>
                        <span class="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div> -->
          </div>
        </div>
        <div class="d-none">
          <table class="printTable border" ref="medicationTable">
            <tr class="border">
              <th>Medication Name</th>
              <th>Unit</th>
              <th>Dose</th>
              <th>Frequency</th>
              <th>Inventory</th>
              <th>Routine</th>
              <th>Before/After Meal</th>
              <th>Time</th>
              <th>Remark</th>
              <th>Updated At</th>
            </tr>
            <tr v-for="(medication, index) in displayedRecords" :key="index">
              <td>{{ medication.medication_name }}</td>
              <td>{{ medication.unitLabel }}</td>
              <td>{{ medication.dosing }}</td>
              <td>{{ medication.frequency }}</td>
              <td>{{ medication.inventory }}</td>
              <td>{{ medication.routine }}</td>
              <td>{{ medication.remark.before_after || 'N/A' }}</td>
              <td>{{ medication.remark.time || 'N/A' }}</td>
              <td>{{ medication.remark.remark || 'N/A' }}</td>
              <td>{{ medication.updated_at }}</td>
            </tr>
          </table>
        </div>
        
        <div class="col-md-6 mt-5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Reminders</p>
                <a
                  :href="`../create-reminder/?uuid=${form.uuid}`"
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
                        Reminder
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Frequency Weeks
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Date
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Updated At
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(reminder, index) in remindersDisplay" :key="index">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ reminder.reminder }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="badge badge-sm bg-gradient-warning">{{ reminder.frequency_weeks }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ reminder.date_from }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ reminder.updated_at }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-reminder/?uuid=${reminder.uuid}`"
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
                          @click="showModalDelete(reminder.uuid, 'reminder')"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Medication"
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
                    <li class="page-item" :class="{ disabled: currentPageReminder === 1 }">
                      <a class="page-link" tabindex="-1" @click="prevPageReminder">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>
                    <li v-for="page in totalPagesReminder" :key="page" class="page-item" :class="{ active: page === currentPageReminder }">
                      <a class="page-link" @click="goToPageReminder(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageReminder === totalPagesReminder }">
                      <a class="page-link" @click="nextPageReminder">
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
        <div class="col-md-6 mt-5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Introduction</p>
                <a
                  :href="`../create-introduction/?uuid=${form.uuid}`"
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
                        Remark
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Created By
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Updated By
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(introduction, index) in introDisplay" :key="index">
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
                            <h6 class="mb-0 text-sm">{{ introduction.remark }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ introduction.created_by }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ introduction.updated_at }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-introduction/?uuid=${introduction.uuid}`"
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
                          @click="showModalDelete(introduction.uuid, 'introduction')"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Medication"
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
                    <li class="page-item" :class="{ disabled: currentPageIntro === 1 }">
                      <a class="page-link" tabindex="-1" @click="prevPageIntro">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>
                    <li v-for="page in totalPagesIntro" :key="page" class="page-item" :class="{ active: page === currentPageIntro }">
                      <a class="page-link" @click="goToPageIntro(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageIntro === totalPagesIntro }">
                      <a class="page-link" @click="nextPageIntro">
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

        <div class="col-md-6 mt-5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Reports</p>
                <a
                  :href="`../create-report/?uuid=${form.uuid}`"
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
                        Remark
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Created By
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Updated By
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(report, index) in reportsDisplay" :key="index">
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
                            <h6 class="mb-0 text-sm">{{ report.remark }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ report.created_by }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ report.updated_at }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-report/?uuid=${report.uuid}`"
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
                          @click="showModalDelete(report.uuid, 'report')"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Medication"
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
                    <li class="page-item" :class="{ disabled: currentPageReport === 1 }">
                      <a class="page-link" tabindex="-1" @click="prevPageReport">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>
                    <li v-for="page in totalPagesReport" :key="page" class="page-item" :class="{ active: page === currentPageReport }">
                      <a class="page-link" @click="goToPageReport(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageReport === totalPagesReport }">
                      <a class="page-link" @click="nextPageReport">
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

        <div class="col-md-12 mt-5">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 text-primary font-weight-bolder">Vital Sign</p>
                <div>
                  <argon-button color="dark" class="mx-3" @click="printTable">Print</argon-button>
                  <a
                    :href="`../create-vital/?uuid=${form.uuid}`"
                  >
                    <argon-button >Add</argon-button>
                  </a>
                </div>  
              </div>
            </div>
            <div class="card-body px-0 pt-0 pb-2">
              <div class="table-responsive p-0" ref="vitalTable">
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Remark
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Blood Pressure Diastolic/Systolic
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        SPO2
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Pulse Rate
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Blood Glucose Level (Before Eat)
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Blood Glucose Level (After Eat)
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Created At
                      </th>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      >
                        Updated At
                      </th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Edit</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(vital, index) in vitalsDisplay" :key="index">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ vital.remark }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.blood_pressure_diastolic }}/{{ vital.blood_pressure_systolic }}  mmHg</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.spo2 }} %</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.pulse_rate }} bpm</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.blood_glucose_level_before }} mmol/L</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.blood_glucose_level_after }} mmol/L</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.created_at }}</span>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-secondary text-xs font-weight-bold">{{ vital.updated_at }}</span>
                      </td>
                      <td class="align-middle text-center">
                        <a
                          :href="`../edit-vital/?uuid=${vital.uuid}`"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Edit user"
                          >
                          <argon-button color="light">
                            <i class="fas fa-pen"></i>
                          </argon-button>
                        </a>
                      </td> <td class="align-middle text-center">
                        <a
                          @click="showModalDelete(vital.uuid, 'vital')"
                          class="text-secondary font-weight-bold text-xs"
                          data-toggle="tooltip"
                          data-original-title="Delete Medication"
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
                    <li class="page-item" :class="{ disabled: currentPageVital === 1 }">
                      <a class="page-link" tabindex="-1" @click="prevPageVital">
                        <i class="fa fa-angle-left"></i>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>
                    <li v-for="page in totalPagesVital" :key="page" class="page-item" :class="{ active: page === currentPageVital }">
                      <a class="page-link" @click="goToPageVital(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageVital === totalPagesVital }">
                      <a class="page-link" @click="nextPageVital">
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

        <div class="d-none">
          <table class="printTable border" ref="vitalTable">
            <tr class="border">
              <th>Blood Pressure Diastolic / Systolic</th>
              <th>SPO2</th>
              <th>Pulse Rate</th>
              <th>Blood Glucose Level (Before/After Eat)</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Remark</th>
            </tr>
            <tr v-for="(vital, index) in vitalsDisplay" :key="index">
              <td>{{ vital.blood_pressure_diastolic }}/{{ vital.blood_pressure_systolic }} mmHg</td>
              <td>{{ vital.spo2 }} %</td>
              <td>{{ vital.pulse_rate }} bpm</td>
              <td>{{ vital.blood_glucose_level_before }}/{{ vital.blood_glucose_level_after }} mmol/L</td>
              <td>{{ vital.created_at }} by {{ vital.created_by }}</td>
              <td>{{ vital.updated_at }} by {{ vital.updated_by }}</td>
              <td>{{ vital.remark }}</td>
            </tr>
          </table>
        </div>

      </div>
    </div>
    <error-modal :show-modal="showErrorModal" :error-message="errorMessage" @close="showErrorModal = false" />
    <success-modal :show-modal="showSuccessModal" :success-message="successMessage" @close="goListPage" />
    <delete-modal :show-modal="showDeleteModal" :delete-message="deleteMessage" @close="showDeleteModal = false" @delete-data="deleteData(deleteDataID, deleteType)" />
    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Change Profile Image</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="closeModal">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <file-input v-model="form.image" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="uploadProfileImage()">Confirm</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
