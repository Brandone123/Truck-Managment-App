<template>
  <div>
    <h2>Training Programs</h2>
    <v-card>
      <v-card-title>Add New Training Program</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addTrainingProgram">
          <v-text-field
            v-model="newTrainingProgram.name"
            label="Training Program Name"
            required
          ></v-text-field>
          <v-textarea
            v-model="newTrainingProgram.description"
            label="Description"
          ></v-textarea>
          <v-btn type="submit">Add Training Program</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <h3>All Training Programs</h3>
    <v-list>
      <v-list-item
        v-for="trainingProgram in trainingPrograms"
        :key="trainingProgram.id"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ trainingProgram.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ trainingProgram.description }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="deleteTrainingProgram(trainingProgram.id)" variant="text">Delete</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface TrainingProgram {
  id: number;
  name: string;
  description: string;
}

export default defineComponent({
  name: 'TrainingPrograms',
  setup() {
    const trainingPrograms = ref<TrainingProgram[]>([
      { id: 1, name: 'Program A', description: 'This is Program A' },
      { id: 2, name: 'Program B', description: 'This is Program B' },
      { id: 3, name: 'Program C', description: 'This is Program C' },
    ]);

    const newTrainingProgram = ref<TrainingProgram>({
      id: 0,
      name: '',
      description: '',
    });

    const addTrainingProgram = (): void => {
      const newId = trainingPrograms.value.length + 1;
      const newTrainingProgramValue: TrainingProgram = {
        id: newId,
        name: newTrainingProgram.value.name,
        description: newTrainingProgram.value.description,
      };

      trainingPrograms.value.push(newTrainingProgramValue);

      newTrainingProgram.value.name = '';
      newTrainingProgram.value.description = '';
    };

    const deleteTrainingProgram = (trainingProgramId: number): void => {
      const index = trainingPrograms.value.findIndex(
        (program) => program.id === trainingProgramId
      );

      if (index !== -1) {
        trainingPrograms.value.splice(index, 1);
      }
    };

    return {
      trainingPrograms,
      newTrainingProgram,
      addTrainingProgram,
      deleteTrainingProgram,
    };
  },
});
</script>

<style scoped>
/* Add custom styles for the component here */
</style>