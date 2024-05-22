<template>
  <div class="d-flex justify-center flex-wrap">
      <v-btn color="primary" class="ma-2" to='training_program'>Training Programs</v-btn>
      <v-btn color="success" class="ma-2" to='quiz'>Quizzes</v-btn>
      <v-btn color="info" class="ma-2" to="feedback">Feedback</v-btn>
    </div>

  <!-- <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="primary" class="text-none" v-bind="props" density="comfortable">
        <v-icon>mdi-link</v-icon>
        Links
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in quickAccessLinks" :key="index" :value="index" :to="item.link">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu> -->
</template>

<script setup lang="ts">
import { ref } from "vue"

// const quickAccessLinks = ref([
//   {
//     title: "Training Programs",
//     link: "training_program"
//   },
//   {
//     title: "Quizzes",
//     link: "quiz"
//   },
//   {
//     title: "Feedback",
//     link: "feedback"
//   },
// ])
</script>

<style scoped></style>