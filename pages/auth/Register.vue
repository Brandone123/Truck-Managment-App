<script setup lang="ts">
/*-For Set Blank Layout-*/
definePageMeta({
  layout: "auth",
});
</script>
<template>
    <div class="authentication fill-height">
        <v-container fluid class="pa-3 fill-height">
            <v-row class="align-center fill-height">
                <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
                    <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto gray-background fill-height" max-width="500">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4">
                                <LayoutFullLogo />
                            </div>
                            <div class="text-body-1 text-muted text-center mb-3">Your Social Campaigns</div>
                            <AuthRegisterForm />
                            <h6 class="text-h6 text-muted font-weight-medium d-flex justify-center align-center mt-3">
                                Already have an Account?
                                <NuxtLink to="/auth/login"
                                    class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium pl-2">
                                    Sign In</NuxtLink>
                            </h6>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
.authentication{
    background-image: url("../../public/images/background/truck.jpeg");
    background-position: right;
}
.gray-background{
    background-color: #EEEEEE;
}
.login-card{
    min-height: 50%;
}
</style>

