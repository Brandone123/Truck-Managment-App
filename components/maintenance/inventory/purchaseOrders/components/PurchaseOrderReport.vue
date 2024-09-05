<script setup lang="ts">
import { ref, defineExpose, defineProps } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import type { PurchaseOrder } from "~/types/maintenance/purchaseOrderTypes";

const paddingLeft = 10; 
const paddingTop = 10;  
const lineHeight = 5;  
const tableSpacing = 10; 

const currentY = ref(paddingTop);
const currentX = ref(paddingLeft);

const props = defineProps({
  purchaseOrder: {
    type: Object as PropType<Partial<PurchaseOrder>>,
    required: true,
  },
});

const {
  id,
  description,
  status,
  parts,
  vendor_id,
  tax_type,
  tax_amount,
  tax,
  discount_type,
  discount_amount,
  discount,
  shipping_type,
  shipping_amount,
  shipping,
  subtotal,
  total_amount,
  created_by,
  approved_by,
  closed_at,
  closed_by,
  purchased_at,
  purchased_by,
  labels,
  invoice_number,
  location_id,
  created_at,
  custom_fields
} = props.purchaseOrder;

// Define the different variables to pass in the document 
const validInvoice = props.purchaseOrder.custom_fields?.invoice_number;
const forLocation = props.purchaseOrder.custom_fields?.for_location;
const createdBy = created_by ? created_by : '---';
const invoice = validInvoice ? validInvoice : '----';
const date = created_at ? new Date(created_at).toISOString().split('T')[0] : '----';
const descriptionValue = description ? description : '---';
const statusValue = status ? status : '---';
const partValue = parts ? parts : [];
const forLocationValue = forLocation ? forLocation : '----';

const vendorId = vendor_id ? vendor_id : '---';
const taxType = tax_type ==='percentage' ? '%' : tax_type
const taxAmount = tax_amount ? tax_amount : '---';
const taxValue = tax ? tax : '---';
const discountType = discount_type ==='percentage' ? '%' : discount_type;
const discountAmount = discount_amount ? discount_amount : '---';
const discountValue = discount ? discount : '---';
const shippingType = shipping_type ==='percentage' ? '%': shipping_type;
const shippingAmount = shipping_amount ? shipping_amount : '---';
const shippingValue = shipping ? shipping : '---';
const subtotalValue = subtotal ? subtotal : '---';
const totalAmountValue = total_amount ? total_amount : '---';

const approvedBy = approved_by ? approved_by : '---';
const purchasedBy = purchased_by ? purchased_by : '---';
const locationId = location_id ? location_id : '---';
const closedDate = closed_at ? new Date(closed_at).toISOString().split('T')[0] : '----';
const purchasedDate = purchased_at ? new Date(purchased_at).toISOString().split('T')[0] : '----';

const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);

const getVendorName = (vendorId: number) => {
  return suppliers.value?.find(vendor => vendor.id == vendorId)?.name;
};
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const technician = (userId: any) => {
  return technicians.value.find((technician: any) => technician.user_id == userId) || {};
};

const partLocationStore = usePartLocationStore();
const { partLocations } = storeToRefs(partLocationStore);

const getLocationName = (locationId: number) => {
  return partLocations.value?.find(location => location.id == locationId)?.name;
};

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore)

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find(part => part.id == partId)?.part_number
}

const purchseByValue = technician(purchasedBy);
const vendorName = getVendorName(vendorId);
const createdbyName = technician(createdBy)?.full_name;
const parttName = getLocationName(locationId);
const specialOrderedPart = props.purchaseOrder.custom_fields?.special_ordered_part;
// const getPartName =  

// Create a new PDF document  
const doc = ref<jsPDF | null>(null);
const loading = ref(false);
const dialog = ref<boolean>(false);

const selectedReportType = ref<string>("purchase_Order_Report");

const generateReport = () => {
  loading.value = true;
  switch (selectedReportType.value) {
    case "purchase_Order_Report":
      getReports();
      break;
  }
};

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

const getReports = async () => {
  try {
    doc.value = new jsPDF();

    // Load the image as base64
    const company_logo = await getBase64ImageFromURL("/images/users/company.webp");

    // Add the company logo
    const logoWidth = 40;
    const logoHeight = 20;
    doc.value.addImage(company_logo, "WEBP", paddingLeft, paddingTop, logoWidth, logoHeight);

    // Add the company details next to the logo
    const detailsX = paddingLeft + logoWidth + 10;
    doc.value.setFontSize(12);
    doc.value.text("Moon Star Express", detailsX, paddingTop + 5);
    doc.value.setFontSize(10);
    doc.value.text("7277 Rawsonville Road", detailsX, paddingTop + 10);
    doc.value.text("Belleville, Michigan, 48111", detailsX, paddingTop + 15);
    doc.value.text("US", detailsX, paddingTop + 20);
    doc.value.text("7344851100", detailsX, paddingTop + 25);

    // Add the Work Order details on the right
    const rightX = 150; // Adjust this value based on your document width
    doc.value.setFontSize(10);
    doc.value.text(`INVOICE #: ${invoice}`, rightX, paddingTop + 5);
    doc.value.setFontSize(10);
    doc.value.text(`Date Created: ${date}`, rightX, paddingTop + 10);
    doc.value.text(`Status: ${statusValue}`, rightX, paddingTop + 15);

    doc.value.setFontSize(8);
    doc.value.text("PURCHASE ORDER DETAILS", paddingLeft, currentY.value + lineHeight +33);

    // Draw a line below the header section
    const lineY = paddingTop + logoHeight + 20;
    doc.value.line(paddingLeft, lineY, 200, lineY);

    // Determine the Y position for the next content (tables)
    const nextContentStartY = lineY + tableSpacing; 
    autoTable(doc.value, {
      startY: nextContentStartY,
      body: [
        [
          {
            content: `Part Location: ${parttName} \nFor location: ${forLocationValue} \nVendor: ${vendorName}`,
            styles: {
              halign: "left",
            },
          },
          {
            content: `Closed date: ${closedDate}\nPurchased date: ${purchasedDate}`,
            styles: {
              halign: "left",
            },
          },
        ],
      ],
      theme: "plain",
    });

    autoTable(doc.value, {
      startY: doc.value.lastAutoTable.finalY + tableSpacing,
      body: [
        [
          {
            content: "Description",
            styles: {
              halign: "left",
              fontSize: 14,
            },
          },
        ],
        [
          {
            content: `${descriptionValue}`,
            styles: {
              halign: "left",
            },
          },
        ],
      ],
      theme: "plain",
    });


    autoTable(doc.value, {
      // startY: doc.value.lastAutoTable.finalY + tableSpacing,
      body: [
        [
          {
            content: "Products & Services",
            styles: {
              halign: "left",
              fontSize: 14,
            },
          },
        ],
      ],
      theme: "plain",
    });

    // Define the table body for parts
    const tableBody = parts?.map( (part,index) => [
    index +1,
    getPartNumber(part.part_id) || "----",
      part.subtotal || "----",
      part.unit_cost || "----",
      part.quantity_ordered || "----",
      part.quantity_received || "----",
    ]);

    // Use autoTable to generate the table for parts
    autoTable(doc.value, {
      // startY: doc.value.lastAutoTable.finalY + tableSpacing,
      head: [['#', "PartID", "Sub total", "Unit cost", "Quantity ordered", "Quantity received"]],
      body: tableBody,
      theme: "striped",
      headStyles: {
        fillColor: "#343a40",
      },
    });

    autoTable(doc.value, {
      // startY: doc.value.lastAutoTable.finalY + tableSpacing,
      body: [
        [
          {
            content: "Subtotal:",
            styles: {
              halign: "right",
            },
          },
          {
            content: `${subtotalValue}`,
            styles: {
              halign: "right",
            },
          },
        ],
        [
          {
            content: `Tax(${taxType})`,
            styles: {
              halign: "right",
            },
          },
          {
            content: `${taxAmount}`,
            styles: {
              halign: "right",
            },
          },
        ],
        [
          {
            content: `Shipping(${shippingType})`,
            styles: {
              halign: "right",
            },
          },
          {
            content: `${shippingAmount}`,
            styles: {
              halign: "right",
            },
          },
        ],
        [
          {
            content: `Discount(${discountType})`,
            styles: {
              halign: "right",
            },
          },
          {
            content: `${discountAmount}`,
            styles: {
              halign: "right",
            },
          },
        ],
        [
          {
            content: "Total amount:",
            styles: {
              halign: "right",
            },
          },
          {
            content: `${totalAmountValue}`,
            styles: {
              halign: "right",
            },
          },
        ],
      ],
      theme: "plain",
    });

    const pdfBlob = doc.value.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");

    loading.value = false;
    dialog.value = true;
  } catch (error) {
    console.error("An error occurred while generating the report:", error);
    loading.value = false;
  }
};

defineExpose({
  generateReport,
});
</script>
