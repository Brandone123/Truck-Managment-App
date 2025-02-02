src/components/recruiting/applicationManagement/dialogs/OfferEditDialog.vue

<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ offer?.id ? 'Edit Offer' : 'Add Offer' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="offerForm" @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Terms</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <EmployeeAutoCompleteInput variant="outlined" density="comfortable"
                            v-model="currentOffer.supervised_by" item-value="id" label="Select Supervisor"
                            color="primary" :rules="[rules.required]" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.start_date" label="Start Date" variant="outlined"
                            density="comfortable" type="date" :rules="[rules.required, validateStartTime]" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.end_date" label="End Date" variant="outlined"
                            density="comfortable" type="date" :rules="[validateStartTime]" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select :items="['Full Time', 'Part Time']" v-model="currentOffer.employment"
                            label="Employement" variant="outlined" density="comfortable" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select :items="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
                            v-model="currentOffer.workdays" label="Work days" variant="outlined" density="comfortable"
                            multiple />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.expected_start_hours" label="Expected Hours Start"
                            variant="outlined" density="comfortable" type="time" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.expected_end_hours" label="Expected Hours End"
                            variant="outlined" density="comfortable" type="time" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select :items="['401(k)', 'Medical Insurance', 'Other']" v-model="currentOffer.benefits"
                            label="Banefits" variant="outlined" density="comfortable" multiple />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-5">
                    <v-card-text>
                      <v-card-title class="font-weight-bold">Others</v-card-title>
                      <v-card-text>
                        <v-row>
                          <!-- <v-col cols="12" md="6">
                          <v-select label="Offer Status" :items="offerStatuses" v-model="currentOffer.status"
                            :rules="[rules.required]" variant="outlined" density="comfortable"></v-select>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.sent_at" label="Sent At" variant="outlined"
                            density="comfortable" type="datetime-local" />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.accepted_at" label="Accepted At" variant="outlined"
                            density="comfortable" type="datetime-local" />
                        </v-col>


                        <v-col cols="12" md="6">
                          <v-text-field v-model="currentOffer.declined_at" label="Declined At" variant="outlined"
                            density="comfortable" type="datetime-local" />
                        </v-col> -->

                          <v-col cols="12">
                            <v-textarea label="Offer Details" v-model="currentOffer.offer_details" variant="outlined"
                              density="comfortable"></v-textarea>
                          </v-col>
                        </v-row>
                      </v-card-text>

                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Conditions</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="currentOffer.acceptance_date" label="Acceptance Date" variant="outlined"
                        density="comfortable" type="datetime-local" />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select :items="['Hourly', 'Salary']" v-model="currentOffer.pay_standard" label="Pay Standard"
                        variant="outlined" density="comfortable" />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="currentOffer.salary" variant="outlined" density="comfortable"
                        :label="currentOffer.pay_standard == 'Salary' ? 'Net Amount of Salary ($)' : 'Hourly Rate ($)'" />
                    </v-col>

                    <v-col cols="12">
                      <h3> Background Report Required ?</h3>
                      <div class="d-flex">
                        <v-checkbox v-model="currentOffer.background_report" :label="'Yes'" :value="false"></v-checkbox>
                        <v-checkbox v-model="currentOffer.background_report" :label="'No'" :value="false"></v-checkbox>
                      </div>

                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="downloadPdf">Preview</v-btn>
        <v-btn color="primary" variant="text" @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { Offer, Application, CompletedDocument } from '@/types/recruiting/recruitment';
import { useRouter, useRoute } from 'vue-router';
import EmployeeAutoCompleteInput from '~/components/shared/input/EmployeeAutoCompleteInput.vue';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from 'moment'

const route = useRoute();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  offer: {
    type: Object as () => Offer | null,
    default: null,
  },
  details: {
    type: Object as () => Application | null,
    default: null,
  }
});

const step = ref(1)

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Dialog visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Validation rules
const validateStartTime = (value: string) => {
  if (!value) return true;
  const now = moment().format('YYYY-MM-DDTHH:mm');
  return value >= now || 'Start Date cannot be in the past.';
}

const validateEndTime = (value: string) => {
  if (!value) return true;
  if (!currentOffer.value.start_date) return 'Start Date must be selected first.';
  return value > currentOffer.value.start_date || 'End Date must be after Start Time.';
}

// Current offer form data
const currentOffer = ref<Partial<Offer>>({ ...props.offer });

// Watch for changes in offer prop to update form data
watch(
  () => props.offer,
  (newOffer) => {
    currentOffer.value = { ...newOffer };
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


const company_logo = await getBase64ImageFromURL("/images/users/company.webp");


const pdfDataUri = ref("");
const currentY = ref(10);
const currentX = ref(10);

const doc = ref<jsPDF | null>(null); //creating a new pdf state
const downloadPdf = async () => {
  try {
    doc.value = new jsPDF();
    let y = 15;
    const fontLarge = 11;
    const fontMedium = 10;
    const fontRegular = 10;

    let currentPageNumber = ref(1);
    let totalPageNumber = ref(1);

    doc.value.setTextColor(5, 5, 5); // Couleur du texte en noir
    const pageWidth = doc.value.internal.pageSize.getWidth();
    const pageHeight = doc.value.internal.pageSize.getHeight();
    const bottomMargin = 20;

    const addPageIfNeeded = (requiredHeight) => {
      if (currentY.value + (requiredHeight || 0) >= pageHeight - bottomMargin) {
        currentY.value = 0;
        if (doc.value?.internal.getNumberOfPages() === 1) {
          addPageNumber(doc.value);
          totalPageNumber.value += 1;
        }
        currentY.value = 0;
        doc.value?.addPage();
        currentY.value = 10; // Réinitialisation Y pour nouvelle page
        currentPageNumber.value++;
        totalPageNumber.value += currentPageNumber.value;
        addPageNumber(doc.value);
        return true;
      }
      return false;
    };

    const addPageNumber = (pdfDoc) => {
      const x = pdfDoc.internal.pageSize.width - 20;
      const y = pdfDoc.internal.pageSize.height - 10;
      pdfDoc.setFontSize(fontRegular);
      pdfDoc.text(`Page ${doc.value?.internal.getNumberOfPages()}`, x, y, { align: "center" });
    };

    // Charger l'image en base64
    const company_logo = await getBase64ImageFromURL("/images/users/company.webp");

    doc.value.setFont("helvetica", "normal");
    doc.value.addImage(company_logo, "WEBP", currentY.value + 70, 10, 40, 20);
    doc.value.setFontSize(fontMedium);
    doc.value.setTextColor(50, 50, 50); // Setting text color to black
    currentY.value += 10;
    doc.value.setFontSize(fontRegular);


    currentY.value += fontRegular / 2;
    currentY.value += 5;
    y += 40;

    if (props.details) {
      const details = props.details;

      doc.value.setFontSize(12);

      // Offres
      doc.value.setFont("helvetica", "bold"); // Définir la police en gras
      doc.value.text(`Offer: ${details.job?.title || ''}`, 10, y);
      y += 5;

      doc.value.text(`Ref: ${details?.job?.id || ''}`, 10, y);
      y += 5;

      doc.value.text(`Date: ${currentOffer.value.accepted_at || ''}`, 10, y);
      y += 10;

      // Adresse de l'utilisateur
      doc.value.setFont("helvetica", "normal"); // Revenir à une police normale
      doc.value.text(`${details?.applicant?.first_name || ''} ${details?.applicant?.middle_name || ''} ${details?.applicant?.last_name || ''}`, 10, y);
      y += 5;

      doc.value.text(`${details?.applicant?.country || ''}`, 10, y);
      y += 5;

      doc.value.text(`${details?.applicant?.state || ''}`, 10, y);
      y += 5;

      doc.value.text(`${details?.applicant?.current_street_address || ''}`, 10, y);
      y += 10;

      // Salutations
      doc.value.text(`Dear ${details?.applicant?.first_name || ''} ${details?.applicant?.middle_name || ''} ${details?.applicant?.last_name || ''},`, 10, y);
      y += 10;

      // Sujet
      doc.value.setFont("helvetica", "bold");
      doc.value.text(`Sub: Letter of offer`, 10, y);
      y += 10;

      // Première section
      doc.value.setFont("helvetica", "normal");
      doc.value.text(
        `Thank you for exploring career opportunities with Moonstar TMS. You have successfully completed our initial selection process and we are pleased to make you an offer.`,
        10,
        y,
        { align: "justify", maxWidth: pageWidth - 20 }
      );
      y += 15;
      // Détails du poste
      doc.value.setFont("helvetica", "normal");
      doc.value.text(
        `This offer is based on your profile and performance in the selection process. You have been selected for the position of ${details?.job?.title || ''}. Your gross salary, including all benefits, will be ${currentOffer.value.salary} $ ${currentOffer.value.pay_standard === 'Hourly' ? 'per hour' : 'per month'}, as per the terms and conditions set out herein. The gross salary mentioned above is inclusive of the Variable Allowance becoming effective upon successful completion of the Initial Training Programme.`,
        10,
        y,
        { align: "justify", maxWidth: pageWidth - 20 }
      );

      y += 30; // Ajouter un espace pour le paragraphe suivant

      doc.value.text(
        `Kindly confirm your acceptance before ${new Date(currentOffer.value.acceptance_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}, if not, it will be construed that you are not interested in this employment and this offer will be automatically withdrawn.`,
        10,
        y,
        { align: "justify", maxWidth: pageWidth - 20 }
      );
      y += 20;
      doc.value.text(
        `After you accept this offer, you will be given a joining letter indicating the details of your joining date and initial place of posting. You will also be issued a letter of appointment at the time of your joining after completing joining formalities as per company policy.`,
        10,
        y,
        { align: "justify", maxWidth: pageWidth - 20 }
      );
      y += 20;

      // Clôture
      doc.value.text(
        `We happily look forward to the opportunity of working with you.`,
        10,
        y,
        { align: "justify", maxWidth: pageWidth - 20 }
      );
      y += 10;

      // Champs texte
      doc.value.text(`Sincerely,`, 10, y);
      y += 10;

      doc.value.text(`_______________________________`, 10, y);
      y += 10;
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
            <iframe width='100%' height='120%' src='${pdfDataUri.value}' frameborder='0'></iframe>
          </body>
        </html>
      `);
      pdfWindow.document.close();
    }
  } catch (error) {
    console.error(error);
  }
};

const offerStatuses = ['Pending', 'Sent', 'Accepted', 'Declined'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reference to the form
const offerForm = ref<HTMLFormElement | null>(null);

// Submit form
const submitForm = async () => {
  const isValid = await offerForm.value?.validate();


  if (!isValid) return;
  emit('save', {
    ...currentOffer.value,
    application_id: parseInt(route.params.applicationId as string, 10),
    status: "Pending",
    sent_at: new Date().toLocaleDateString,
  });
};

// Close dialog
const closeDialog = () => {
  emit('close');
};

// Generate the preview document HTML

</script>

<style scoped>
/* Add your custom styles here */
</style>