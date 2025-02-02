<!-- src/components/recruiting/applicationManagement/tabs/OfferTab.vue -->
<template>
  <div>
    <div class="d-flex">
      <div class="ml-auto mb-2">
        <v-btn color="primary" @click="openAddOfferDialog">Add Offer</v-btn>
      </div>
    </div>

    <!-- Offer Edit/Create Dialog -->
    <OfferEditDialog :modelValue="offerDialog" :offer="selectedOffer" @update:modelValue="offerDialog = $event"
      @close="closeOfferDialog" @save="saveOffer" :details="applicationDetails" />

    <!-- Offers Data Table -->
    <SharedUiServerTable :sticky-top="true" :sticky-top-offset="95" :show-footer-in-head="false" :headers="offerHeaders"
      :items="offers" :loading="loadingOffers" dynamicSearch :items-per-page="pagination.itemsPerPage"
      :sort-by="pagination.sortBy" :items-length="total_items" v-model="selectedItems"
      @hoveredRow="hoveredRow = $event;" @update:options="pagination = $event"
      @update:selectedFilters="selectedFilters = $event" show-select return-object>
      <template v-slot:item.actions="{ item }">
        <v-icon small color="secondary" class="mr-2" @click="editOffer(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteOffer(item)">mdi-delete</v-icon>
        <span style="cursor: pointer;" class="ml-auto">
          <v-icon size="25" color="primary" @click="downloadPdf(item)" left>mdi-download</v-icon>
          <v-tooltip activator="parent" location="top">
            Download Offer Letter
          </v-tooltip>
        </span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
      </template>
      <!-- slot for bulk actions -->
      <template v-slot:bulkActions>
        <div>
          <v-btn small class="mr-1" color="primary" @click="">
            <v-icon left>mdi-email-send</v-icon>
            Send Email
          </v-btn>
        </div>
      </template>
      <template v-slot:item.supervised_by="{ item }">
        <SharedTableDynamicTechnicianItem v-if="item.supervisor" :technician="item.supervisor" />
      </template>
      <template v-slot:item.accepted_at="{ item }">
       {{ item.accepted_at ? item.accepted_at : '---' }}
      </template>
      <template v-slot:item.declined_at="{ item }">
       {{ item.declined_at ? item.declined_at : '---' }}
      </template>
    </SharedUiServerTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRecruitmentStore } from '~/stores/recruiting/applicationManagement/recruitmentStore';
import OfferEditDialog from '@/components/recruiting/applicationManagement/dialogs/OfferEditDialog.vue';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';
import type { Offer } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';
import jsPDF from "jspdf";
import "jspdf-autotable";

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  }
});

const recruitmentStore = useRecruitmentStore();

const allOffers = computed(() => recruitmentStore.offers);
const loadingOffers = computed(() => recruitmentStore.loadingOffers);
const { pagination: offerPagination, total_items } = storeToRefs(recruitmentStore)

const offers = computed(() => {
  return allOffers.value.filter(offer => offer.application_id === parseInt(route.params.applicationId as string, 10));
});

const offerDialog = ref(false);
const selectedOffer = ref<Partial<Offer> | null>(null);

const openAddOfferDialog = () => {
  selectedOffer.value = null;
  offerDialog.value = true;
};

const editOffer = (offer: Offer) => {
  selectedOffer.value = offer;
  offerDialog.value = true;
};

const closeOfferDialog = () => {
  offerDialog.value = false;
};

const saveOffer = async (offer: Partial<Offer>) => {
  offerDialog.value = false;
  if (offer.id) {
    await recruitmentStore.updateOffer(offer.id, offer);
  } else {
    await recruitmentStore.createOffer(offer);
  }
  await recruitmentStore.fetchOffers();
};

const layoutStore = useLayoutStore();
const deleteOffer = async (offer: Offer) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this offer ?`)
  if (confirm) {
    await recruitmentStore.deleteOffer(offer.id);
    await recruitmentStore.fetchOffers();
  }
}

// Table Headers
const offerHeaders = [
  { title: 'Supervisor', value: 'supervised_by' },
  { title: 'Employment', value: 'employment' },
  { title: 'Pay Standard', value: 'pay_standard' },
  { title: 'Status', value: 'status' },
  { title: 'Sent Email Offer At', value: 'sent_at' },
  { title: 'Accepted Offer At', value: 'accepted_at' },
  { title: 'Declined Offer At', value: 'declined_at' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Fetch screenings on component mount
onMounted(() => {
  recruitmentStore.fetchOffers(searchQuery.value);
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'purple';
    case 'Sent':
      return 'secondary';
    case 'Accepted':
      return 'primary';
    case 'Declined':
      return 'red';
    default:
      return 'grey';
  }
};
const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

onMounted(() => {
  recruitmentStore.fetchOffers(searchQuery.value);
})
const pagination = computed({
  get() {
    return offerPagination.value
  },
  set(value) {
    recruitmentStore.setPagination(value);
  }
})

const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: pagination.value.itemsPerPage,
  }

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0]
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  if (activeFilter.value != 'all') {
    payload['filters'].stage = activeFilter.value
  }

  return payload
})


watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchOffers(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recruitmentStore.fetchOffers(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchOffers(searchQuery.value);
})


const pdfDataUri = ref("");
const currentY = ref(10);
const currentX = ref(10);

const doc = ref<jsPDF | null>(null); //creating a new pdf state

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

const downloadPdf = async (item: Offer) => {
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

    if (item) {

      doc.value.setFontSize(12);

      // Offres
      doc.value.setFont("helvetica", "bold"); // Définir la police en gras
      doc.value.text(`Offer: ${item.application?.job?.title || ''}`, 10, y);
      y += 5;

      doc.value.text(`Ref: ${item.application?.job?.id || ''}`, 10, y);
      y += 5;

      doc.value.text(`Date: ${item.sent_at || ''}`, 10, y);
      y += 10;

      // Adresse de l'utilisateur
      doc.value.setFont("helvetica", "normal"); // Revenir à une police normale
      doc.value.text(`${item.application?.applicant?.first_name || ''} ${item.application?.applicant?.middle_name || ''} ${item.application?.applicant?.last_name || ''}`, 10, y);
      y += 5;

      doc.value.text(`${item.application?.applicant?.country || ''}`, 10, y);
      y += 5;

      doc.value.text(`${item.application?.applicant?.state || ''}`, 10, y);
      y += 5;

      doc.value.text(`${item.application?.applicant?.current_street_address || ''}`, 10, y);
      y += 10;

      // Salutations
      doc.value.text(`Dear ${item.application?.applicant?.first_name || ''} ${item.application?.applicant?.middle_name || ''} ${item.application?.applicant?.last_name || ''},`, 10, y);
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
        `This offer is based on your profile and performance in the selection process. You have been selected for the position of ${item.application.job?.title || ''}. Your gross salary, including all benefits, will be ${item.salary} $ ${item.pay_standard === 'Hourly' ? 'per hour' : 'per month'}, as per the terms and conditions set out herein. The gross salary mentioned above is inclusive of the Variable Allowance becoming effective upon successful completion of the Initial Training Programme.`,
        10,
        y,
        { align: "justify", maxWidth: pageWidth - 20 }
      );

      y += 30;

      doc.value.text(
        `Kindly confirm your acceptance before ${new Date(item.acceptance_date).toLocaleDateString('en-US', {
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
</script>

<style scoped>
/* Add your styles here */
</style>