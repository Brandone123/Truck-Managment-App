<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Safety Meetings & Training
              <v-spacer></v-spacer>
              <v-btn color="success" @click="openMeetingDialog">Schedule Meeting/Training</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search meetings/training..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="meetings"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editMeeting(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteMeeting(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Meeting/Training Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="currentMeeting.date" label="Date"></v-text-field>
                  <v-text-field v-model="currentMeeting.type" label="Meeting/Training Type"></v-text-field>
                  <v-textarea v-model="currentMeeting.agenda" label="Agenda"></v-textarea>
                  <v-textarea v-model="currentMeeting.notes" label="Notes/Minutes"></v-textarea>
                  <!-- Additional fields for attendance, action items, etc. -->
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveMeeting">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const meetings = ref([
    // Sample data
    {
      id: 1,
      date: '2024-03-15',
      type: 'Safety Protocol Update',
      agenda: 'Review of new safety protocols',
      notes: 'Discussed implementation steps.',
    },
    // More meetings/training sessions
  ]);
  
  const headers = ref([
    { text: 'Date', value: 'date' },
    { text: 'Type', value: 'type' },
    { text: 'Agenda', value: 'agenda' },
    { text: 'Notes/Minutes', value: 'notes' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const dialogTitle = ref('');
  const currentMeeting = ref({});
  
  const openMeetingDialog = () => {
    dialog.value = true;
    dialogTitle.value = 'Schedule New Meeting/Training';
    currentMeeting.value = {}; // Reset for new entry
  };
  
  const editMeeting = (item) => {
    currentMeeting.value = { ...item };
    dialogTitle.value = 'Edit Meeting/Training';
    dialog.value = true;
  };
  
  const deleteMeeting = (item) => {
    console.log('Deleting meeting/training', item);
    // Implement deletion logic here
  };
  
  const saveMeeting = () => {
    console.log('Saving meeting/training', currentMeeting.value);
    // Implement save logic here
    closeDialog();
  };
  
  const closeDialog = () => {
    dialog.value = false;
  };
  </script>
  