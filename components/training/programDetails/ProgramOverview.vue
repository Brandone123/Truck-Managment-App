<template>
  <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Program Overview</span>
    </div>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="pb-0">
            <div class="title text-primary">Title</div>
            <div>{{ program.title }}</div>
          </v-col>
          <v-col cols="12" class="pb-0">
            <div class="title text-primary">Description</div>
            <div>{{ program.description }}</div>
          </v-col>
          <v-col cols="12" class="pb-0">
            <div class="title text-primary">Target Audience</div>
            <div>{{ program.targetAudience }}</div>
          </v-col>
          <v-col cols="12">
            <div class="title text-primary">Estimated Completion Time</div>
            <div>{{ program.completionTime }} hours</div>
          </v-col>
          <v-col>
            <div class="title text-primary">Program Progress</div>
            <v-progress-linear color="light-blue" height="10" :model-value="progress" striped>
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
        <!-- Add additional program details here -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Program {
  title: string;
  description: string;
  targetAudience: string;
  completionTime: number;
}

// Dummy program data - replace this with real data fetched from your API/store
const program = ref<Program>({
  title: 'Advanced Safety Training',
  description: 'An in-depth course on advanced safety procedures and protocols.',
  targetAudience: 'Experienced drivers and safety officers',
  completionTime: 15
});


// Sample progress value
const progress = ref<number>(75); // Assume the user has completed 75% of the program
</script>

<style scoped>
.title {
  font-weight: bold;
}
</style>