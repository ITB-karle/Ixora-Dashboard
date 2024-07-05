<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
// import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { apiRequest } from '@/assets/js/apiRequest.js'; 

import { ref } from 'vue';
import { useRouter } from "vue-router";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const username = ref('');
const password = ref('');
const loggedIn = ref(false);
const user = ref('');
const router = useRouter();


const login = async () => {
  try {
    // Make API call to authenticate user
    // Example using axios:
    const response = await apiRequest('https://staging.itbrightsolution.com/ixora_backend/public/api/v1/login', {
        username: username.value,
        password: password.value
    }, 'POST', false);

    loggedIn.value = true;
    user.value = response;
    
    // Assuming the response contains a token upon successful login
    // Store the token in local storage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('authentication', true);
    // For demonstration, setting loggedIn to true
    
    router.push('/account-management');
  } catch (error) {
    console.error('Login failed:', error);
    // Handle login error
  }
};

</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <!-- <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        /> -->
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Hi, <br> Welcome back.</h4>
                  <!-- <p class="mb-0">Enter your email and password to sign in</p> -->
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="login">
                    <div class="mb-3">
                      <label for="username">Username :</label>
                      <argon-input
                        id="username"
                        type=""
                        placeholder="username"
                        name="username"
                        size="lg"
                        v-model="username"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="password">Password :</label>
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                        v-model="password"
                      />
                    </div>
                    <!-- <argon-switch id="rememberMe" name="remember-me"
                      >Remember me</argon-switch
                    > -->

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="danger"
                        fullWidth
                        size="lg"
                        >Login</argon-button
                      >
                    </div>
                  </form>
                </div>
                <!-- <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</a
                    >
                  </p>
                </div> -->
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-danger opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Attention is the new currency"
                </h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the
                  writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
