<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/ixora_black.webp";
import logoWhite from "@/assets/img/logo-ct.png";
import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-danger'}`"
  />

  <aside
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'}    
      ${
        layout === 'landing' ? 'bg-transparent shadow-none' : ' '
      } ${sidebarType}`"
    id="sidenav-main"
    data-color="danger"
  >
    <div class="d-flex flex-column justify-content-around h-100">
      <div class="sidenav-header">
        <i
          class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        ></i>

        <router-link class="m-0 navbar-brand text-center" to="/account-management">
          <img
            :src="darkMode || sidebarType === 'bg-default' ? logoWhite : logo"
            class="navbar-brand-img h-100"
            alt="main_logo"
          />

          <!-- <span class="ms-2 font-weight-bold me-2">Ixora</span> -->
        </router-link>
      </div>

      <hr class="mt-0 horizontal dark" />

      <sidenav-list />
      <div class="pt-3 mx-3 my-3 sidenav-footer">
        <sidenav-card
        />
      </div>
    </div>
    
  </aside>
</template>
