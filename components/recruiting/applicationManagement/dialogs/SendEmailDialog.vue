<template>
    <v-dialog v-model="emailDialog" max-width="800px" scrollable>
    <v-card>
    <v-toolbar density="compact" color="primary" dark>
        <v-toolbar-title>Send Email</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeEmailDialog">
        <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-toolbar>
    <v-card-text>
        <v-text-field variant="outlined" density="comfortable" v-model="emailForm.to" label="To" placeholder="To"
        outlined dense :readonly="true" />
        <v-text-field variant="outlined" density="comfortable" v-model="emailForm.subject" label="Subject"
        placeholder="Enter the subject" outlined dense />
        <v-textarea variant="outlined" density="comfortable" v-model="emailForm.message" label="Message"
        placeholder="Write your message here" outlined rows="4" dense />
        <v-col cols="12">
        <v-card>
            <v-card-title class="font-weight-bold d-flex">
            Documents <span v-if="emailForm.attachments">({{
                emailForm.attachments?.length
            }})</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="addDocument">
                <v-icon>mdi-plus</v-icon>
                <span class="ml-2" style="cursor: pointer;">Add Documents</span>
            </v-btn>
            </v-card-title>
            <v-card-text>
            <v-list v-if="emailForm.attachments?.length">

                <template v-for="(document, index) in emailForm.attachments" :key="index">
                <v-list-item>
                    <v-list-item-title>{{ document.name }}</v-list-item-title>
                    <template v-slot:append>
                    <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                        @click.stop="removeDocument(index)">
                    </v-btn>
                    </template>
                </v-list-item>
                <v-divider v-if="index + 1 < emailForm.attachments.length"></v-divider>
                </template>
            </v-list>
            <input ref="documentfile" type="file" multiple accept="application/pdf"
                @change="storeFile($event, 'documents')" style="display: none;" />
            </v-card-text>
        </v-card>
        </v-col>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
        <v-btn color="primary" @click="closeEmailDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="sendEmail">Send</v-btn>
    </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, mergeProps } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  selectedItems: {
    type: Object as any,
    default: null,
  },
  contactSelect: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(['modelValue', 'close', 'save']);

const emailDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('modelValue', value),
});

export interface formEmail {
  to: string;
  subject: string;
  message: string;
  attachments: Array<any>;
}


const emailForm = ref<formEmail>({
  to: '',
  subject: '',
  message: '',
  attachments: [],
});



const sendEmail = () => {
  console.log('Sending email with data:', emailForm.value);
  // Add your email sending logic here
  closeEmailDialog();
};

// Close dialog
const closeEmailDialog = () => {
  emit('close');
};

const resetEmailForm = () => {
  emailForm.value = {
    to: '',
    subject: '',
    message: '',
    attachments: [],
  };
};

const mediaStore = useMediaStore()

async function storeFile(event: any, location: string) {
  const files = (event.target as HTMLFormElement).files as FileList;

  if (files.length === 0) {
    return;
  }

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
      switch (location) {
        case 'documents':
          if (!Array.isArray(emailForm.value.attachments)) {
            emailForm.value.attachments = [];
          }
          // Add file data to documents array
          emailForm.value.attachments.push(data);
          break;
      }
    }
  }

  //clear input value
  if (event.target) {
    (event.target as HTMLFormElement).value = null
  }
}

const documentfile = ref<HTMLInputElement | null>(null);

function addDocument() {
  documentfile.value?.click();
}

function removeDocument(index: number) {
  emailForm.value.attachments?.splice(index, 1);
}


watch(() => emailDialog.value, () => {
    if(props.contactSelect == true){
        emailForm.value.to = props.selectedItems.map((item: any) => item.reference_contact).join(', ');
    } else {
        emailForm.value.to = props.selectedItems.map((item: any) => item.reference_email).join(', ');
    }
}, { deep: true })

</script>