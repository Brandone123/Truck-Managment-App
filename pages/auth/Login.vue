<script setup lang="ts">
/*-For Set Blank Layout-*/
definePageMeta({
    layout: "auth",
});
</script>
<template>
    <div class="fill-height">
        <v-row class="" style="height:100% !important;">
            <v-col lg="7" xl="8" cols="12" class="blue-background hidden-sm-and-down">
                <v-col class="d-flex fill-height align-center justify-center position-relative">
                    <img style="width: 50%;" src="/login_image.svg" class="position-relative d-none d-lg-flex"
                        alt="login-background">
                </v-col>

            </v-col>
            <v-col lg="5" xl="4" cols="12" class="d-flex align-center justify-center authentication bg-surface">
                <div class="mt-xl-0 mt-5 mw-100 bg-surface">
                    <h2 class="text-h6 font-weight-semibold mb-2 text-center">Moonstar Express TMS</h2>
                    <v-row class="d-flex mb-3">
                        <v-col sm="6" cols="12" class="pr-2">
                            <v-btn block variat="outlined" class="border text-subtitle-1">
                                <img src="/google-icon.svg" width="16" height="16" class="mr-1" alt="google"><span
                                    class="d-sm-flex d-none mr-1">Sign in with</span>Google
                            </v-btn>
                        </v-col>
                        <v-col sm="6" cols="12" class="pl-2">
                            <v-btn block variat="outlined" class="border text-subtitle-1">
                                <img src="/microsoft-icon.svg" width="16" height="16" class="mr-2" alt="microsoft">
                                <span class="d-sm-flex d-none mr-1">Sign in with</span>Microsoft
                            </v-btn>
                        </v-col>
                    </v-row>
                    <div class="d-flex align-center text-center mb-6">
                        <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                            <span class="bg-surface px-5 py-3 position-relative" style="z-index: 1">or sign in with</span>
                        </div>
                    </div>
                    <AuthLoginForm />
                    <!-- <h6 class="text-h6 text-medium-emphasis d-flex align-center mt-6 font-weight-medium">
                        New to Moonstar?
                        <v-btn variant="plain" class="pl-0 text-primary text-body-1 opacity-1 pl-2 font-weight-medium"
                            to="/auth/register">
                            Create an account
                        </v-btn>
                    </h6> -->
                </div>
            </v-col>

        </v-row>
    </div>
</template>

<style scoped>
.auth-divider:before {
    position: absolute;
    width: 100%;
    border-top: thin solid rgb(229, 234, 239);
    top: 50%;
    content: "";
    transform: translateY(50%);
    left: 0;
}

.authentication {
    background-color: white !important;
}

.auth-divider:after {
    position: absolute;
    width: 100%;
    border-top: thin solid rgb(229, 234, 239);
    top: 50%;
    content: "";
    transform: translateY(50%);
    right: 0;
}


.blue-background {
    content: "";
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    background: radial-gradient(rgb(210, 241, 223), rgb(211, 215, 250), rgb(186, 216, 244))
}

.bg-surface {
    background-color: white !important;
}
</style>
