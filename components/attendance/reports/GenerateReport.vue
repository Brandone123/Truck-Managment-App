<script setup lang="ts">
import { ref, defineExpose } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { storeToRefs } from "pinia";

const currentY = ref(10);
const currentX = ref(10);

// // Create a new PDF document
const doc = ref<jsPDF | null>(null); //creating a new pdf state

const loading = ref(false);

const pdfDataUri = ref("");
const dialog = ref<boolean>(false);

const selectedReportType = ref<string>("attendance_Report");

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
const generateReport = () => {
  loading.value = true;
  switch (selectedReportType.value) {
    case "attendance_Report": // Employee Timeoff Request Report;
      getReport();
      break;
  }
};

const getReport = async () => {
  try {
    let tableData: any[][] = [];
    let tableHeaders: string[] = [];
    doc.value = new jsPDF();
    var fontSize = 12;
    doc.value.setTextColor(20, 20, 20); // Setting text color to black
    var pageWidth = doc.value.internal.pageSize.getWidth();
    doc.value.setFontSize(12);
    // Function to add page number to the bottom of the page
    const addPageNumber = (pdfDoc) => {
      // Position for page number (bottom center)
      const x = pdfDoc.internal.pageSize.width - 20;
      const y = pdfDoc.internal.pageSize.height - 10; // 10 units from bottom

      pdfDoc.setFontSize(10);
      pdfDoc.text(`Page ${doc.value.internal.getNumberOfPages()}`, x, y, {
        align: "center",
      });
    };

    // Load the image as base64
    const company_logo = await getBase64ImageFromURL(
      "/images/users/company.webp"
    );
    doc.value.setFont("Helveca", "normal");

    doc.value.addImage(company_logo, "WEBP", currentX.value, 10, 40, 20);
    doc.value.setFontSize(11);
    currentY.value = 10;
    doc.value.text("Moon Star Express", 60, currentY.value, {
      align: "left",
    });
    // Setting text color to black

    doc.value.text(
      "\n7277 Rawsonville Road\nBelleville, Michigan, 48111 \nUS \n7344851100",
      60,
      currentY.value,
      { align: "left" }
    );

    const workorderdata = [
      ["Report Number:", `#${new Date()}`],
      ["Date:", `${new Date().toString().slice(0, 15)}`],
      ["PO Number:", ``],
    ];

    // Setting text color to black
    (doc.value as any).autoTable({
      startY: currentY.value - 5,
      margin: { left: pageWidth - pageWidth / 3 },
      body: workorderdata.slice(1),
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 0.2,
        minCellHeight: 2,
        textColor: [50, 50, 50],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
      },
    });

    doc.value.setFontSize(18);

    (currentY.value += 35),
      doc.value.text(
        `Employee Timeoff Report `,
        pageWidth / 3,
        currentY.value,
        {
          align: "left",
        }
      );

    doc.value.setFontSize(11);

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)
tableHeaders = ['Employee Name',  'Start Date', 'End Date', 'Req. Status', 'Description',]
const getEmployeeName = (user_id : number) =>{
      let employee = employeeList.value.find((employee: any) => employee.user_id == user_id)
      return employee ? `${employee.first_name} ${employee.last_name}` : 'N/A'
  }
  /**
   * 
   */
const timeoffRequestStore = useTimeoffRequestStore()
        const { timeoffRequestList, loading : loadingTimeoffRequests } = storeToRefs(timeoffRequestStore)
       tableData = timeoffRequestList.value.map((item) => {
            return [ item.user_id ? getEmployeeName(item.user_id) : 'None',  item.start_date, item.end_date, `${item.status?.slice(0,1).toUpperCase()}${item.end_date, item.status?.slice(1)}`,item.description]
        });

    (doc.value as any).autoTable({
      startY: (currentY.value += 10), // Specify the Y position to start the table
      head: [tableHeaders],
      body: tableData,
      columnStyles: {
        4: { halign: "left", cellWidth: 60 },
        0: { halign: "left", valign: "left" },
        1: { halign: "center", valign: "middle" },
        2: { halign: "center", valign: "middle" },
        3: { halign: "center", valign: "middle" },
      },
      margin: { top: 10, bottom: 20 },
      willDrawCell: function (data) {
        const { doc, cell, column } = data;

        // Check if the current column index is 2 (which is the 3rd column, 0-indexed)
        if (column.index === 3) {
          if (cell.raw === "Accepted") {
            // Set text color to green for "Accepted"
            doc.setTextColor(0, 128, 0);
          } else if (cell.raw === "Rejected") {
            // Set text color to red for "Rejected"
            doc.setTextColor(255, 0, 0);
          } else if (cell.raw === "Pending") {
            // Set text color to orange for "Pending"
            doc.setTextColor(255, 165, 0);
          } else {
            // Default text color for other values
            doc.setTextColor(255, 255, 255);
          }
        }
      },
    });

    currentY.value += fontSize;
    fontSize = 12;

    pdfDataUri.value = doc.value.output("datauristring");
    const pdfWindow = window.open("", "_blank");
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

    loading.value = false;

    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};

defineExpose({ generateReport });
</script>

<template>
  <v-dialog fullscreen v-model="dialog">
    <template v-slot:default="{ isActive }">
      <v-card class="grey-background">
        <v-toolbar color="primary" title="Work Order" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="isActive.value = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="4" class="overflow-y-scroll filled-height">
              <v-col class="px-0">
                <v-btn color="primary" density="compact" @click="generateReport"
                  >Generate Report</v-btn
                >
              </v-col>
            </v-col>
            <v-col cols="8" class="overflow-y-scroll filled-height pa-0">
              <div
                v-if="loading"
                class="loading-overlay d-flex justify-center align-center"
                style="height: 100%; width: 100%"
              >
                <span>
                  <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="primary"
                  ></v-progress-circular
                ></span>
              </div>
              <iframe
                v-if="pdfDataUri"
                id="pdfPreview"
                :src="pdfDataUri"
              ></iframe>
              <div
                v-else
                class="d-flex justify-center align-center"
                style="height: 100%; width: 100%"
              ></div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.overflow-y-scroll {
  overflow-y: auto;
}

.filled-height {
  height: calc(100vh - 60px);
}

#pdfPreview {
  width: 100%;
  height: calc(100vh - 70px);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  /* Couleur semi-transparente pour la superposition */
  z-index: 2;
  /* Valeur de z-index supérieure pour superposer le spinner */
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
