<template>
  <v-card>
    <v-card-title>
      <div class="d-flex">
        <span>Application Overview</span>
        <span style="cursor: pointer;" class="ml-auto">
          <v-icon size="25" color="primary" @click="downloadPdf" left>mdi-download</v-icon>
          <v-tooltip activator="parent" location="top">
            Download Application as PDF
          </v-tooltip>
        </span>
        
      </div>
    </v-card-title>
    
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-icon color="primary">mdi-account</v-icon> <span> Name: </span>
            <span>
              {{ applicationDetails?.applicant?.first_name }}
              {{ applicationDetails?.applicant?.last_name }}
            </span>
          </v-col>
          <v-col cols="12" md="6">
            <v-icon color="primary">mdi-briefcase</v-icon>
            <span> Job Title: </span>
            <span>
              {{ applicationDetails?.job?.title }}
            </span>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12" md="6">
            <v-icon color="primary">mdi-source-commit</v-icon>
            <span> Sub. Source: </span>
            <span>
              {{ applicationDetails?.submission_source }}
            </span>
          </v-col>
          <v-col cols="12" md="6">
            <v-icon color="primary">mdi-email</v-icon>
            <span> Email: </span>
            <span class="text-secondary"
              style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
              {{ applicationDetails?.applicant?.email_address }}
            </span>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12" md="6">
            <v-icon color="primary">mdi-calendar-clock</v-icon>
            <span> Sub. Date: </span>
            <span>
              {{ formatDate(applicationDetails?.submitted_at) }}
            </span>
          </v-col>

          <v-col cols="12" md="6">
            <v-icon color="primary">mdi-progress-check</v-icon>
            <span> Status: </span>
            <span>
              <v-chip :color="getStatusColor(applicationDetails?.status)" density="compact" variant="flat">
                {{ applicationDetails?.status }}
              </v-chip>
            </span>
          </v-col>
          <v-divider></v-divider>
          <v-expansion-panels v-model="panel">
            <v-expansion-panel elevation="0">
              <v-expansion-panel-title class="title text-primary">Application summary </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-divider class="my-4"></v-divider>
                <template v-for="(item, index) in applicationDetails?.application_form_version?.elements" :key="index">
                  <v-container>
                  <v-row>
                    <v-col cols="12" class="pt-0">
                      <div v-if="item.type === 'free_text'">
                        <h3 class="text-h5 py-0 font-medium text-label">{{ item.label }}</h3>
                        <div class="text-body-2 text-quill">
                          <QuillPreview :html="item.description || ''" />
                        </div>
                      </div>

                      <!-- Section -->
                      <div v-else-if="item.type === 'section'" class="py-0">
                        <h3 class="text-h5 py-0 font-medium text-quill">{{ item.label }}</h3>
                        <v-divider></v-divider>
                        <p class="text-body-2 text-quill">{{ item.description }}</p>
                      </div>

                      <!-- Text Input -->
                      <v-text-field v-else-if="item.type === 'text_input'" v-model="responseData[item.id]"
                        :label="`${item.label} ${item.required ? ' *' : ''}`" variant="outlined" density="comfortable"
                        class="py-0" disabled/>

                      <!-- Number -->
                      <v-text-field v-else-if="item.type === 'number'" v-model="responseData[item.id]"
                        :label="`${item.label} ${item.required ? ' *' : ''}`" type="number" 
                        variant="outlined" density="comfortable" class="mt-0 mb-1" disabled/>

                      <!-- Radio -->
                      <v-radio-group v-else-if="item.type === 'radio'" v-model="responseData[item.id]"
                        density="comfortable" :label="`${item.label} ${item.required ? ' *' : ''}`" class="mt-0 mb-1">
                        <v-radio v-for="(option, i) in item.options" :key="i" :label="option.text" :value="option.text"
                          color="primary" disabled/>
                      </v-radio-group>

                      <!-- Checkbox -->
                      <div v-else-if="item.type === 'checkbox'">
                        <h3 class="text-h6 font-medium text-label mb-2"> {{ `${item.label} ${item.required ? ' *' : ''}` }}</h3>
                        <v-checkbox v-model="responseData[item.id]" v-for="(option, index) in item.options" :key="index"
                          :label="option.text" :value="option.text" color="primary" density="compact" hide-details disabled/>
                      </div>

                      <!-- Dropdown -->
                      <v-select v-else-if="item.type === 'dropdown'" v-model="responseData[item.id]"
                        :items="item.choices?.map((choice: any) => choice.text)"
                        :label="`${item.label} ${item.required ? ' *' : ''}`" variant="outlined" density="comfortable"
                        class="mt-0 mb-1" disabled></v-select>

                      <!-- Date -->
                      <v-text-field v-else-if="item.type === 'date'" v-model="responseData[item.id]"
                        :label="`${item.label} ${item.required ? ' *' : ''}`" type="date" class="mt-0 mb-1"
                        variant="outlined" density="comfortable" disabled/>

                      <!-- Time -->
                      <v-text-field v-else-if="item.type === 'time'" v-model="responseData[item.id]"
                        :label="`${item.label} ${item.required ? ' *' : ''}`" type="time" class="mt-0 mb-1"
                        variant="outlined" density="comfortable" disabled/>

                      <!-- Linear Scale -->
                      <v-slider v-else-if="item.type === 'linear_scale'" v-model="responseData[item.id]"
                        :label="`${item.label} ${item.required ? ' *' : ''}`" :min="item.min || 1" :max="item.max || 5"
                        density="comfortable" disabled/>

                        <!-- file upload -->
                      <div v-else-if="item.type == 'file_upload'">
                        <div class="text-body-2 text-quill">{{ `${item.label} ${item.required ? ' *' : ''}` }} </div>
                        <v-list>
                          <v-list-item v-for="(file, i) in (responseData[item.id] || [])" :title="((file.name || file) as string)"
                            :key="i" disabled>
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
                </template>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';
import type { Application } from '@/types/recruiting/applicantApplication';
import { useRoute } from 'vue-router';
import jsPDF from "jspdf";
import "jspdf-autotable";

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  },
});

const panel = ref(1);
const statusDialog = ref(false)

const applicantApplicationStore = ApplicantApplicationStore();

const changeStatus = () => {
  statusDialog.value = true
}

const getStatusColor = (status: any) => {
  switch (status) {
    case 'Received':
      return 'secondary';
    case 'Under Review':
      return 'orange';
    case 'Interview Scheduled':
      return 'purple';
    case 'Rejected':
      return 'red';
    case 'Hire':
      return 'primary';
    case 'Offer':
      return 'yellow';
    default:
      return 'grey';
  }
};

// Map response data to a reactive object
const responseData = computed(() => {
  return props.applicationDetails?.response_data || {};
});

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const changeStatusForm = ref<HTMLFormElement | null>(null);
const currentApplication = ref<Partial<Application>>({ ...props.applicationDetails?.application as Application});
const recruitmentStore = useRecruitmentStore();

const applicationId = parseInt(route.params.applicationId as string, 10)

const saveStatus = async () => {
  let formStatus = await changeStatusForm?.value?.validate();
  if (!formStatus.valid) {
    return;
  }

  const payload: Partial<Application> = {
    ...currentApplication.value,
    status: currentApplication.value.status,
  };

  statusDialog.value = false
  await applicantApplicationStore.updateApplication(applicationId, payload)
  await recruitmentStore.fetchApplicationDetails(applicationId as number);
};

watch(
  () => statusDialog.value,
  (newVal) => {
    if(newVal == true){
      currentApplication.value.status = props.applicationDetails.status;
    }
  }
);

const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};

const pdfDataUri = ref("");
const currentY = ref(10);
const currentX = ref(10);

const doc = ref<jsPDF | null>(null); //creating a new pdf state

const downloadPdf = async () => {
  try {
  doc.value = new jsPDF();
  let y = 15;
  var fontLarge = 11;
  var fontMedium = 10;
  var fontRegular = 10;

  let currentPageNumber = ref(1);
  let totalPageNumber = ref(1);

    var fontLarge = 11;
    var fontMedium = 10;
    var fontRegular = 10
    doc.value.setTextColor(5, 5, 5); // Setting text color to black
    var pageWidth = doc.value.internal.pageSize.getWidth();
    var pageHeight = doc.value.internal.pageSize.getHeight();
    var bottomMargin = 20;
    const addPageIfNeeded = (requiredHeight?: number): boolean => {
      if (currentY.value + (requiredHeight ? requiredHeight : 0) >= pageHeight - bottomMargin) {
        // Add a new page
        currentY.value = 0;
        if (doc.value?.internal.getNumberOfPages() == 1) {
          addPageNumber(doc.value);
          totalPageNumber.value += 1;
          totalPageNumber.value = 0;
        }
        currentY.value = 0
        doc.value?.addPage();
        currentY.value = 10; // Reset Y position for the new page
        currentPageNumber.value++;
        totalPageNumber.value += currentPageNumber.value;
        addPageNumber(doc.value);

        return true;
      }
      return false;
    };

    const addPageNumber = (pdfDoc: any) => {
      const x = pdfDoc.internal.pageSize.width - 20;
      const y = pdfDoc.internal.pageSize.height - 10;
      pdfDoc.setFontSize(fontRegular);
      pdfDoc.text(`Page ${doc.value?.internal.getNumberOfPages()}`, x, y, { align: "center" });
    };

  // Load the image as base64
  const company_logo = await getBase64ImageFromURL("/images/users/company.webp");

  doc.value.setFont("helvetica", "normal");

  doc.value.addImage(company_logo, "WEBP", currentY.value, 10, 40, 20);
  doc.value.setFontSize(fontMedium);
  doc.value.setTextColor(50, 50, 50); // Setting text color to black
  doc.value.text("Moon Star Express", 60, currentY.value, {
    align: "left",
  });

  doc.value.text("\n7277 Rawsonville Road\nBelleville, Michigan, 48111 \nUS \n7344851100", 60, currentY.value, { align: "left" });
  currentY.value += 18;
  doc.value.line(currentX.value, currentY.value + 3, pageWidth - 15, currentY.value + 3);
  currentY.value += 10;
  doc.value.setFontSize(fontLarge +7);
  doc.value.text("Application Summary", 80, currentY.value + 3, { align: "left" });
  doc.value.setFontSize(fontRegular);

  
  currentY.value += fontRegular / 2;
  currentY.value += 5;

  // doc.value.setFontSize(16);
  // doc.value.text('Application Summary', 70,  y);
  // // doc.value.text('____________________________________________', 10, y);
  y += 40;

  doc.value.setFontSize(fontLarge);
  doc.value.line(currentX.value, currentY.value + 3, pageWidth - 15, currentY.value + 3);
  if (props.applicationDetails) {
    const details = props.applicationDetails;

    // Ajouter les éléments du formulaire
    if (details.application_form_version?.elements) {
      details.application_form_version.elements.forEach((item: any) => {
        if (y > 280) { // Gérer la pagination si nécessaire
          doc.value?.addPage();
          y = 10;
        }
        if (item.type === 'section') {
          doc.value?.setFontSize(14);
          y += 5;
          doc.value?.text(`${item.label || ''}`, 10, y +2);
          doc.value?.text('---------------------------------', 10, y+5);
          y += 13;
          doc.value?.setFontSize(12);
          if (item.description) {
            doc.value?.text(`${item.description}`, 10, y);
            y += 10;
          }
        } else {
          doc.value?.setFontSize(12);
         
          doc.value?.setFontSize(fontMedium);
          doc.value?.text(`${item.label || ''} : ${responseData.value[item.id] || 'N/A'}`, 10, y);
          doc.value?.setTextColor(50, 50, 50);
          // doc.value?.text(" :", 100, y, { align: "left" });
          // doc.value?.text(`${responseData.value[item.id] || 'N/A'}`, 10, y, { align: "left" });
          
          if (item.type === 'file_upload') {
            responseData.value[item.id].forEach((file: any) => {
                doc.value?.text(`${file.name || file}`, 10, y +2);
            })
          } 
          y += 10;

          if (addPageIfNeeded(50)) {
            addPageIfNeeded(50);
          } else {
            currentY.value -= 25
          }
          addPageNumber(doc.value);
          totalPageNumber.value += 1;
        }
      });
    }
  }

  // Générer un Blob et ouvrir dans un nouvel onglet
  const pdfBlob = doc.value.output('blob');
  const pdfURL = URL.createObjectURL(pdfBlob);

  pdfDataUri.value = doc.value.output("datauristring");
  const pdfWindow = window.open(pdfURL, '_blank');

  if (pdfWindow) {
      pdfWindow.document.open();
      pdfWindow.document.write(`
        <html>
          <head>
            <title>PDF Preview</title>
          </head>
          <body>
            <iframe width='100%' height='120%' src='${pdfDataUri.value}' frameborder='100'></iframe>
          </body>
        </html>
      `);
      pdfWindow.document.close();
    }

    } catch (error) {
        console.error(error);
      }
}

</script>

<style scoped>
.title {
  font-weight: bold;
}

.text-label {
  color: #aebac7; /* Vuetify primary color */
}
.text-quill {
  color: #757575; /* Vuetify secondary color */
}
</style>