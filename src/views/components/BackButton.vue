<template>
  <argon-button color="secondary" size="sm" @click="goBack">
    Back
  </argon-button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ArgonButton from "@/components/ArgonButton.vue";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>