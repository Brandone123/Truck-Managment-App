<script setup lang="ts">
import { ref, defineExpose, defineProps } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAttendanceStore } from "@/stores/attendance/attendance";
import { storeToRefs } from "pinia";
import moment from "moment";

const attendanceStore = useAttendanceStore();
const { timeCards, payPeriodAttendanceList } = storeToRefs(attendanceStore);
const roleStore = useRoleStore();
const { roleList } = storeToRefs(roleStore);
const router = useRouter();
const currentY = ref(10);
const currentX = ref(10);

// // Create a new PDF document
const doc = ref<jsPDF | null>(null); //creating a new pdf state

const loading = ref(false);

const pdfDataUri = ref("");
const dialog = ref<boolean>(false);

const selectedReportType = ref<string>("attendance_Report");
const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const serviceTaskStore = useServiceTaskStore();
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

    const getEmployeePosition = (user_id: number) => {
      let employee = timeCards.value.find(
        (timecard: any) => timecard.id == user_id
      );
      return employee?.role_id
        ? roleList.value.find((role: any) => role.id == employee?.role_id)?.name
        : "None";
    };
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
      doc.value.text(`Attendance Report for, `, pageWidth / 3, currentY.value, {
        align: "center",
      });
    doc.value.text(
      `${moment(payPeriodAttendanceList.value.pay_period.start_date)
        .format("MMM D YYYY")
        .toString()
        .slice(0, 20)} - ${moment(
          payPeriodAttendanceList.value.pay_period.end_date
        )
          .format("MMM D YYYY")
          .toString()
          .slice(0, 20)}`,
      pageWidth - 72,
      currentY.value,
      {
        align: "center",
      }
    );

    doc.value.setFontSize(11);
    tableHeaders = [
      "Employee Name",
      "Role",
      "Hours Worked",
      "OverTime",
      " Total Hours",
      "Salary Employee",
    ];

    tableData = payPeriodAttendanceList.value.employees.map((attendance) => {
      return [
        `${attendance.first_name} ${attendance.last_name}`,
        getEmployeePosition(attendance.id as number),
        attendance.total_hours,
        "None",
        attendance.total_hours,
        attendance.employment_type ? "Yes" : "No",
      ];
    });
    (doc.value as any).autoTable({
      startY: (currentY.value += 10), // Specify the Y position to start the table
      head: [tableHeaders],
      body: tableData,
    });
    currentY.value += fontSize;
    fontSize = 12;

    pdfDataUri.value = doc.value.output("datauristring");

    // Open the PDF in a new tab
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
                <v-btn color="primary" density="compact" @click="generateReport">Generate Report</v-btn>
              </v-col>
            </v-col>
            <v-col cols="8" class="overflow-y-scroll filled-height pa-0">
              <div v-if="loading" class="loading-overlay d-flex justify-center align-center"
                style="height: 100%; width: 100%">
                <span>
                  <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular></span>
              </div>
              <iframe v-if="pdfDataUri" id="pdfPreview" :src="pdfDataUri"></iframe>
              <div v-else class="d-flex justify-center align-center" style="height: 100%; width: 100%"></div>
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
