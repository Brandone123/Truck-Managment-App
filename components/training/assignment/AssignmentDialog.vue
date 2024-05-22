<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" density="comfortable" color="primary">Assign Training</v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" density="compact" title="">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-window-close</v-icon></v-btn>
      </v-toolbar>
      <v-window v-model="currentWindow">
        <v-window-item value="assign">
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete variant="solo" density="comfortable" v-model="selectedEmployees" :items="employees"
                    item-title="name" item-value="id" label="Choose employees or drivers" multiple chips small-chips
                    :menu-props="{ maxHeight: '400' }" :search-input.sync="search"></v-autocomplete>
                </v-col>
                <v-col cols="12"> <!-- Assignment Method: Automatic or Manual -->
                  <v-card>
                    <v-radio-group label="Assignment Method" v-model="assignmentMethod" density="comfortable"
                      color="primary">
                      <v-radio label="Automatic" value="automatic"></v-radio>
                      <v-radio label="Manual" value="manual"></v-radio>
                    </v-radio-group>
                  </v-card>
                </v-col>
                <v-col cols="12"> <!-- Due Date Picker -->
                  <v-text-field variant="solo" v-model="dueDate" type="date" density="comfortable" label="Due Date"
                    prepend-icon="mdi-calendar" olor="primary"></v-text-field></v-col>
              </v-row>

              <!-- Additional Options Here -->
            </v-form>
          </v-card-text>
        </v-window-item>
        <v-window-item value="confirm">
          <v-card-text>
            <p class="text-primary text-h6">Please review the details of your assignment:</p>
            <v-list dense rounded>
              <v-list-item>
                <v-list-item-title class="text-primary">Training Program/Module:</v-list-item-title>
                <v-list-item-subtitle>{{ assignmentDetails.programName }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-primary">Assigned To:</v-list-item-title>
                <v-list density="compact">
                  <v-list-item v-for="(assigneeName, index) in assignmentDetails.assigneeNames" :key="index">
                    {{ assigneeName }}
                  </v-list-item>
                </v-list>
                <!-- <v-list-item-subtitle>{{ assignmentDetails.assigneeNames.join(', ') }}</v-list-item-subtitle> -->
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-primary">Due Date:</v-list-item-title>
                <v-list-item-subtitle>{{ formattedDueDate }}</v-list-item-subtitle>
              </v-list-item>
              <!-- Additional details can be listed here -->
            </v-list>
          </v-card-text>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" class="text-none" density="comfortable" @click="currentWindow = 'assign'" v-if="currentWindow == 'confirm'">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" density="comfortable" @click="save()">{{ currentWindow == 'confirm' ?
    'Save' : 'Next' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Employee {
  id: number;
  name: string;
  // Additional employee/driver details can be added here
};
const currentWindow = ref<string>('assign');

const dialog = ref<boolean>(false);
const assignmentMethod = ref('manual');
const dueDate = ref(new Date().toISOString().substr(0, 10));
const menu = ref(false);



// Sample list of employees/drivers. In a real application, this would be fetched from an API.
const employees = ref<Employee[]>([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'William Johnson' },
  // more employees/drivers...
]);

const assignmentDetails = ref({
  programName: 'test program',
  assigneeNames: employees.value.map(employee => employee.name),
})

const formattedDueDate = computed(() => {
  return dueDate
})

const selectedEmployees = ref<number[]>([]);

const search = ref('');

const save = () => {
  if (currentWindow.value == 'confirm') {
    dialog.value = false
  } else {
    currentWindow.value = 'confirm'
  }
}

// Example watch function to simulate fetching employees/drivers based on search input
watch(search, (newValue) => {
  console.log('Search input:', newValue);
  // Implement search functionality here, possibly updating 'employees' with search results
});

watch(dialog, (newValue) => {
  if (!newValue) {
    currentWindow.value = 'assign'
  }
})
</script>