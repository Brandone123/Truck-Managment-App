<script setup lang="ts">
import { ref, defineExpose, defineProps } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { WorkOrder, CustomField } from "@/types/maintenance/workOrder";
const props = defineProps({
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
  CustomField: {
    type: Object as PropType<Partial<CustomField>>,
    required: true,
  },
});

const currentY = ref(10);
const currentX = ref(10);
const displayed = ref(false);

const doc = ref<jsPDF | null>(null); //creating a new pdf state

const loading = ref(false);

const pdfDataUri = ref("");
const dialog = ref<boolean>(false);

const selectedReportType = ref<string>("Work_Order_Report");
const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const serviceTaskStore = useServiceTaskStore();
const serviceTasks = computed(() => serviceTaskStore.serviceTaskList);

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore);

const employeeStore = useEmployeeStore();
const { employeeList, getTechnicianList } = storeToRefs(employeeStore);

const serviceTask = (service_task_id: any) => {
  return serviceTasks.value.find(
    (serviceTask) => serviceTask.id === service_task_id
  );
};
const getVehicleName = (vehicleId: any) => {
  const vehicleName = assetList.value.find(
    (vehicle) => vehicle.id === vehicleId
  );
  return vehicleName;
};

const generateReport = async () => {
  useLayoutStore().setOverlay(true);
  switch (selectedReportType.value) {
    case "Work_Order_Report": // Employee Timeoff Request Report;
      try {
        await getReport(); // Wait for the report to be generated
      } catch (error) {
        console.error("Error generating report:", error);
      } finally {
        useLayoutStore().setOverlay(false);
      }
      break;
  }
};


const toDataURLs = async (url: string) => {
  try {
    const response = await fetch(url, { mode: "cors" }); // Ensure CORS mode is set
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}
const toDataURL = async (url: string): Promise<string | void> => {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching image:", error);
  }
};

function formatDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr.replace(" ", "T") + "Z");
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(date);
}

// Convert Uint8Array to base64
function uint8ArrayToBase64(uint8Array: any) {
  let binary = "";
  const bytes = new Uint8Array(uint8Array);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

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

const getReport = async () => {
  try {
    doc.value = new jsPDF();
    currentY.value = 15;
    currentX.value = 15;
    displayed.value = false;
    let currentPageNumber = ref(1);
    let totalPageNumber = ref(1);

    const {
      id,
      date_created,
      vehicle_id,
      assigned_to,
      created_by,
      status,
      priority,
      schedule_date,
      expected_completion_date,
      actual_start_date,
      actual_completion_date,
      vendor,
      invoice_number,
      po_number,
      photos,
      documents,
      odometer,
      watchers,
      operator_id,
      number,
      description,
      duration,
      labels,
      meter,
      line_items,
      parts_subtotal,
      labor_subtotal,
      subtotal,
      tax_type,
      tax_amount,
      tax,
      discount_type,
      discount_amount,
      discount,
      warranty_credits_type,
      warranty_credits_amount,
      warranty_credits,
      total_cost,
      custom_fields,
      operator,
      comments,
      issues,
      issue_ids,
      created_at,
    } = props.workOrder;

    const {
      afterhours_call = "",
      charge_back = "",
      charge_back_issued = "",
      charge_back_to = "",
      roadcall = "",
      tire_dot_number = "",
      truck_number = "",
      trailer_number = "",
    } = props.CustomField || {};

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
    const user_icon = await getBase64ImageFromURL("/images/users/user.jpg");
    const part_icon = await getBase64ImageFromURL("/images/users/spare_parts.png");

    doc.value.setFont("helvetica", "normal");

    doc.value.addImage(company_logo, "WEBP", currentX.value, 10, 40, 20);
    doc.value.setFontSize(fontMedium);
    doc.value.setTextColor(50, 50, 50); // Setting text color to black
    doc.value.text("Moon Star Express", 60, currentY.value, {
      align: "left",
    });
    // Setting text color to black

    doc.value.text("\n7277 Rawsonville Road\nBelleville, Michigan, 48111 \nUS \n7344851100", 60, currentY.value, { align: "left" });

    const workorderdata = [
      ["Work Order Number:", `#${props.workOrder.id?.toString()}`],
      ["Work Order Number:", `${props.workOrder.id ? "#" + props.workOrder.id?.toString() : ""}`,],
      ["Invoice Number:", `${props.workOrder.invoice_number ? "#" + props.workOrder.invoice_number?.toString() : ""}`],
      ["PO Number:", `${props.workOrder.po_number ? "#" + props.workOrder.po_number?.toString() : ""}`],
    ];

    // Setting text color to black
    (doc.value as any).autoTable({
      startY: currentY.value - 5,
      margin: { left: pageWidth - pageWidth / 3 },
      body: workorderdata.slice(1),
      theme: "plain",
      styles: { fontSize: fontMedium, cellPadding: 0.2, minCellHeight: 2, textColor: [50, 50, 50], },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 } },
    });

    currentY.value += 30;
    doc.value.setFontSize(fontLarge);
    doc.value.text("WORK ORDER DETAILS", currentX.value, currentY.value, { align: "left" });
    doc.value.setFontSize(fontRegular);

    doc.value.line(currentX.value, currentY.value + 3, pageWidth - 15, currentY.value + 3);
    currentY.value += fontRegular / 2;
    currentY.value += 5;

    // row data
    const getTechnicianName = (id: any) => {
      const technician = employeeList.value.find((employee: any) => employee.user_id == id);
      return technician;
    };
    const issueDate = props.workOrder.schedule_date;
    const data = [
      ["Issue Date:", date_created ? formatDateTime(date_created.slice(0, 11)) : "--", props.workOrder.id?.toString(), "",],
      ["", date_created ? date_created.slice(11) : "", "", "\n"],
      ["Scheduled Start Date:", schedule_date ? formatDateTime(schedule_date) : "--", "VIN/SN", "--",],
      ["Actual Start Date:", actual_start_date ? `${formatDateTime(actual_start_date).slice(0, 11)} ${formatDateTime(actual_start_date).slice(18)}` : "--", "License Plate", "D867594",],
      ["Expected Completion Date:", expected_completion_date ? formatDateTime(expected_completion_date) : "--", "Operator:", operator ? operator : "--",],
      ["Actual Completion Date:", actual_completion_date ? formatDateTime(actual_completion_date) : "--", "", ""],
      ["Duration:", duration ? duration : "--", "Type", "DRY VAN"],
      ["", "", "Group", "OWNED TRAILER"],
      ["Repair Priority Class:", priority ? priority : " --", "Odometer", odometer ? odometer : "--",],
      ["Status:", status ? status : "--", "AFTERHOURS CALL ?:", afterhours_call ? afterhours_call.toString() : "",],
      ["Issued By:", created_by ? created_by.toString() : "--", "CHARGE BACK?:", "", "", charge_back ? charge_back.toString() : "",],
      ["Assigned to:", assigned_to ? getTechnicianName(assigned_to)?.full_name : "--", "CHARGE BACK ISSUED:", "", "", charge_back_issued ? charge_back_issued.toString() : "",],
      ["Vendor:", vendor ? vendor : "--", "charge back to:", "", "", charge_back_to ? charge_back_to.toString() : "",],
      ["Labels:", labels ? labels[0] : "--", "trailer number:", "", "", trailer_number ? trailer_number : "",],
      ["ROADCALL?:", "", "", roadcall ? roadcall.toString() : "", "tire dot number:", "", "", tire_dot_number ? tire_dot_number.toString() : "",],
      ["truck number:", truck_number ? truck_number.toString() : vehicle_id ? getVehicleName(vehicle_id)?.model : "",],
    ];

    const startX = currentX.value;
    const startY = currentY.value;
    const columnWidth = 50;
    const rowHeight = 7.5;

    doc.value.setFontSize(fontMedium);

    // Loop through data to add rows to PDF
    data.map((row, rowIndex) => {
      if (doc.value) {
        const y = startY + rowIndex * rowHeight;
        doc.value.text(row[0] + "", currentX.value, y);
        if (rowIndex == 0) {
          doc.value.setFont("helvetica", "normal");
          doc.value.text(row[1], startX + columnWidth, y);
          doc.value.text(row[2] ? row[2].toString() : "--", currentX.value + columnWidth + columnWidth, y);
        }
        doc.value.text(row[1] ? row[1].toString() : "--", startX + columnWidth, y);

        if (row[2] || row[3]) {
          doc.value.text(row[2] + "", currentX.value + columnWidth + columnWidth, y);
          doc.value.text(row[3] ? row[3].toString() : "--", currentX.value + columnWidth + 2 * columnWidth, y);
        }
      }
    });

    currentY.value += data.length * rowHeight + 5;
    doc.value.setFontSize(fontLarge);
    doc.value.setTextColor(5, 5, 5); // Setting text color to black
    doc.value.text("LINE ITEMS", currentX.value, currentY.value, { align: "left", });
    doc.value.setTextColor(50, 50, 50); // Setting text color to black
    doc.value.line(currentX.value, currentY.value + 3, pageWidth - 15, currentY.value + 3);

    currentY.value += 10;
    const col1Width = (pageWidth - 15) * 0.7;
    const col2Width = ((pageWidth - 15) * 0.3) / 3;
    const col3Width = col2Width;
    const col4Width = col2Width;

    // Define column positions
    const col1X = currentX.value;
    const col2X = col1X + col1Width;
    const col3X = col2X + col2Width;
    const col4X = col3X + col4Width;
    doc.value.setFontSize(fontMedium);

    // Draw column headers
    doc.value.text("Item", col1X, currentY.value);
    doc.value.text("Labor", col2X, currentY.value, { align: "right" });
    doc.value.text("Parts", col3X, currentY.value, { align: "right" });
    doc.value.text("Subtotal", col4X, currentY.value, { align: "right" });
    const tableHeaders = ["Item", "Labor", "Parts", "Subtotal"];
    addPageIfNeeded(20)
    // Draw a horizontal line under the headers
    doc.value.setDrawColor(200, 200, 200);
    doc.value.line(col1X, currentY.value + 2, pageWidth - 15, currentY.value + 2);

    // Data rows for the table
    const rowHeightTable = 10;
    currentY.value = currentY.value + 10;
    let itemPosition = ref(0);

    if (line_items && line_items?.length > 0) {
      line_items?.map((item, index) => {
        if (index >= 1) {
          currentY.value -= 30;
        }
        if (doc.value) {
          doc.value.setTextColor(50, 50, 50)
          doc.value.setFontSize(fontMedium);
          doc.value.text(item.service_task_id ? (("#" + serviceTask(item.service_task_id)?.name) as string) : "--", col1X, currentY.value);
          doc.value.text(item.labor_cost ? "$" + item.labor_cost?.toString() : "$0", col2X, currentY.value, { align: "right", });
          doc.value.text(item.part_cost ? "$" + item.part_cost.toString() : "$0", col3X, currentY.value, { align: "right", });
          doc.value.text(item.subtotal ? "$" + item.subtotal.toString() : "$0", col4X, currentY.value, { align: "right", });
          currentY.value += 5;
          doc.value.line(col1X, currentY.value, pageWidth - 15, currentY.value);
          currentY.value += rowHeightTable;

          let newPosition = ref(0);
          if (item.labor && item.labor.length > 0) {
            item.labor.map((subitem, index) => {
              if (doc.value) {
                doc.value.setDrawColor(200, 200, 200);

                const getTechnicianName = (id: any) => {
                  const technician = employeeList.value.find(
                    (employee: any) => employee.user_id == id
                  );
                  return technician;
                };
                const lines = doc.value.splitTextToSize(subitem.notes ? subitem.notes.toString() : "", pageWidth / 3);
                //alert(lines.length)
                addPageIfNeeded(lines.length);
                doc.value.addImage(user_icon, "PNG", col1X + 5, currentY.value - 3, 4, 4);
                doc.value.setTextColor(5, 5, 5)

                doc.value.text(subitem.user_id ? (getTechnicianName(subitem.user_id)?.full_name.toString() as string) : "", col1X + 10, currentY.value);
                doc.value.setFontSize(fontRegular);
                newPosition.value += 5;
                const hoursText = subitem.hour ? subitem.hour.toString() + 'hrs' : "--";
                const hoursX = pageWidth - 100;
                doc.value.setFontSize(fontRegular);
                doc.value.text(hoursText, hoursX, currentY.value);
                const rateText = subitem.hourly_labor_rate ? "$" + subitem.hourly_labor_rate.toString() : "--";
                const rateX = pageWidth - 100;
                doc.value.text(rateText, hoursX, currentY.value + 5);

                doc.value.text(subitem.subtotal ? "$" + subitem.subtotal.toString() : "--", col4X, currentY.value, { align: "right" });
                // Print each line with the specified line height
                doc.value.setTextColor(50, 50, 50)
                doc.value.setFontSize(fontMedium);
                lines.forEach((line, index) => {
                  newPosition.value = currentY.value + 5 + index * 5;
                  addPageIfNeeded(20)
                  doc.value?.setFontSize(fontRegular)
                  if (doc.value) {
                    doc.value.text(line, col1X + 10, currentY.value + 5 + index * 5);
                  }
                });
                currentY.value = newPosition.value + 8;
                doc.value.setTextColor(5, 5, 5)
                addPageIfNeeded();
              }
            });
            doc.value.setDrawColor(200, 200, 200); // Light grey color
            currentY.value += 2;
            doc.value.line(col1X, currentY.value - 2, pageWidth - 15, currentY.value - 2);
          } else {
            doc.value.text(
              " - No Labor Associated with this service",
              col1X + 5,
              currentY.value
            );
            currentY.value += 5;
          }
          addPageIfNeeded();
          if (item.parts && item.parts.length >= 0) {
            item.parts.map((part, index) => {
              if (doc.value) {
                const getPartNumber = (partId: number) => {
                  return partSupplies.value?.find((part) => part.id == partId)?.part_number;
                };
                const lines = doc.value.splitTextToSize(part.notes ? part.notes.toString() : "", pageWidth / 3);
                addPageIfNeeded(lines.length);

                currentY.value += 5;
                doc.value.setFontSize(fontMedium);
                doc.value.addImage(part_icon, "PNG", col1X + 5, currentY.value - 3, 3, 3);
                doc.value.text(getPartNumber(part.part_id) ? getPartNumber(part.part_id) : "", col1X + 9, currentY.value
                );
                doc.value.setFontSize(fontRegular);
                doc.value.setTextColor(50, 50, 50)
                const hoursText = part.qte ? part.qte.toString() + "hrs" : "--";
                const hoursX = pageWidth - 100;
                doc.value.text(hoursText, hoursX, currentY.value);

                const rateText = part.unit_cost ? "$" + part.unit_cost.toString() : "--";
                const rateX = pageWidth - 100;
                doc.value.text(rateText, hoursX, currentY.value + 5);

                const unitCostText = part.unit_cost ? "$" + part.unit_cost.toString() : "--";
                const unitCostX = pageWidth - 100;
                doc.value.text(unitCostText, unitCostX, currentY.value + 5);

                doc.value.text(part.subtotal ? "$" + part.subtotal.toString() : "--", col4X, currentY.value, { align: "right" });
                // Print each line with the specified line height
                doc.value.setTextColor(50, 50, 50)
                lines.forEach((line, index) => {
                  addPageIfNeeded(50);
                  itemPosition.value += 5;
                  if (doc.value) {
                    doc.value.setFontSize(fontRegular);
                    doc.value.text(line, col1X + 10, currentY.value + 5 + index * 5);
                    currentY.value += 1;
                  }
                });
                doc.value.setTextColor(5, 5, 5)
                doc.value?.setFontSize(fontLarge)
                addPageIfNeeded();  //tem[oart]
                currentY.value += itemPosition.value + 5;
                currentY.value += 2;
                doc.value.line(col1X, currentY.value - 2, pageWidth - 15, currentY.value - 2);
              }
            });
          } else {
            doc.value.setFontSize(fontRegular);
            doc.value.setTextColor(50, 50, 50)
            doc.value.text("- No Part Associated with this Item", col1X + 5, currentY.value + 10);
            currentY.value += 10;
            doc.value.line(col1X, currentY.value - 15, pageWidth - 15, currentY.value - 15);
            addPageIfNeeded();
          }

          currentY.value += 15;
          // doc.value.line(col1X, currentY.value - 5, pageWidth - 20, currentY.value - 5);
        }
        currentY.value += 20; //initial is 20
      });
    } else {
      doc.value.setFontSize(fontMedium);
      doc.value.text("- No Part Associated with this Item", col1X + 5, currentY.value);
      doc.value.line(col1X, currentY.value + 2, pageWidth - 20, currentY.value + 2);
      currentY.value += 15;
    }

    if (addPageIfNeeded(50)) {
      addPageIfNeeded(50);
    } else {
      currentY.value -= 25
    }
    addPageNumber(doc.value);
    totalPageNumber.value += 1;
    const tableX = pageWidth - pageWidth * 0.4;
    const textX = currentX.value;
    const startYY = currentY.value;

    //Add a page break if needed before adding text
    doc.value.setFontSize(fontLarge);
    doc.value.text("DESCRIPTION.", textX, startYY + 5);
    doc.value.setFontSize(fontMedium);

    doc.value.setDrawColor(5, 5, 5)
    const lines = doc.value.splitTextToSize(description ? description : "", pageWidth / 3);

    // Print each line with the specified line height
    doc.value.setTextColor(50, 50, 50)
    lines.forEach((line, index) => {
      if (doc.value) {
        doc.value.setFontSize(fontRegular);
        doc.value.text(line, textX, currentY.value + 12 + index * 2);
      }
      currentY.value += 2;
    });
    doc.value.setTextColor(5, 5, 5)

    const tableData1 = [
      ["Key", "Value"],
      ["Subtotal", `$${props.workOrder.subtotal ? props.workOrder.subtotal?.toString() : "0"}`,],
      ["Labor", `$${props.workOrder.labor_subtotal ? props.workOrder.labor_subtotal?.toString() : "0"}`],
      ["Parts", `$${props.workOrder.parts_subtotal ? props.workOrder.parts_subtotal?.toString() : "0"}`],
      ["Warranty Credits", `$${props.workOrder.warranty_credits ? props.workOrder.warranty_credits?.toString() : "0"}`,],
      ["Discount", `$${props.workOrder.discount_amount ? props.workOrder.discount_amount?.toString() : "0"}`],
      ["Tax", `$${props.workOrder.tax ? props.workOrder.tax?.toString() : "0"}`,],
    ];

    const totalAmount = [
      ["Total", `${props.workOrder.total_cost ? "$" + props.workOrder.total_cost?.toString() : "$0"}`],
    ];
    doc.value.setFontSize(fontLarge);
    doc.value.text("SUMMARY", tableX, startYY + 5, { align: "left" });
    doc.value.setFontSize(fontMedium);

    doc.value.setDrawColor(0, 0, 0); // Light grey color
    doc.value.line(tableX, startYY + 10, pageWidth - pageWidth / 9, startYY + 10);
    const summaryPosition = ref(startYY);
    // Add table to PDF
    doc.value.setTextColor(5, 5, 5); // Setting text color to black
    doc.value.setFontSize(fontRegular);
    (doc.value as any).autoTable({
      startY: startYY + 12,
      margin: { left: tableX },
      body: tableData1.slice(1),
      theme: "plain",
      styles: {
        fontSize: 10, cellPadding: 1, minCellHeight: 2, textColor: [50, 50, 50],
      },
      willDrawCell: (HookData) => {
        addPageIfNeeded();
      },
      didDraw: (data) => {
        addPageIfNeeded();
      },
      columnStyles: {
        0: { cellWidth: 40, halign: 'left' },
        1: { cellWidth: 20, halign: 'right', textColor: [50, 50, 50] },
      },
    });
    currentY.value += tableData1.length * 3;
    doc.value.setFontSize(fontMedium);
    currentY.value += 18;
    (doc.value as any).autoTable({
      startY: currentY.value + 10,
      margin: { left: tableX - 1 },
      body: totalAmount,
      theme: "plain", // No stripes
      styles: { fontSize: fontLarge, cellPadding: 1, minCellHeight: 2, direction: 'ltr', textColor: [10, 10, 10], },
      columnStyles: {
        0: { cellWidth: 40, halign: 'left' },
        1: { cellWidth: 20, halign: 'right', },
      },
    });

    if (addPageIfNeeded(95)) {
      addPageIfNeeded(95)
      currentY.value -= 25

    } else {
    }
    currentY.value = currentY.value + tableData1.length * 5;
    doc.value.setFontSize(fontLarge);
    doc.value.text("PHOTOS", currentX.value, currentY.value, { align: "left" });
    doc.value.setFontSize(fontMedium);

    doc.value.line(currentX.value, currentY.value + 5, pageWidth - 10, currentY.value + 5);

    doc.value.setFontSize(fontMedium);

    currentY.value += 10;
    var imageWidth = 50;

    // (async () => {
    try {
      if (photos && photos.length > 0) {
        for (const photo of photos) {
          const base64Image = await toDataURL(photo.src) //await toDataURL(photo.src);
          const extension = photo.src.split('.').pop()?.toUpperCase() || 'jpg';
          if (doc.value && base64Image) {
            doc.value.addImage(base64Image, extension, currentX.value, currentY.value, imageWidth, imageWidth);
            currentY.value += 55;
            doc.value.text(photo ? photo.name : "", currentX.value, currentY.value, { align: "left", });
          }
          currentY.value -= 55;
          currentX.value += imageWidth + imageWidth / 4;

          if (currentX.value + imageWidth + imageWidth / 4 >= pageWidth) {
            console.log("Resetting currentX");
            currentX.value = 15;
            currentY.value += 60;
            addPageIfNeeded(55);
          }
        };
      } else {
        doc.value.setFontSize(fontRegular)
        doc.value.setTextColor(50, 50, 50)
        doc.value.text(
          "No Image for this Service",
          currentX.value,
          currentY.value,
          { align: "left" }
        );
      }
    } catch (error) {
      doc.value.text(
        "Cant display the images for this Service",
        currentX.value,
        currentY.value,
        { align: "left" }
      );
    }
    // })

    currentY.value += fontLarge;
    // addPageIfNeeded(50);

    pdfDataUri.value = doc.value.output("datauristring");

    // Open the PDF in a new tab
    const pdfWindow = window.open("", "_blank");
    if (pdfWindow) {
      useLayoutStore().setOverlay(true);
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
      useLayoutStore().setOverlay(false);
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
  <!-- <v-dialog fullscreen v-model="dialog">
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
              <div v-else class="d-flex justify-center align-center" style="height: 100%; width: 100%">
                <span>No Document Generated</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog> -->
  <v-btn color="primary" @click="generateReport">Generate Report</v-btn>
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
