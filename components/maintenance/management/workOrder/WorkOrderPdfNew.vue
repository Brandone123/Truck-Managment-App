<template>
    <div>
      <button @click="generatePDF">Generate PDF</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { jsPDF } from 'jspdf';
  
  export default defineComponent({
    name: 'PdfGenerator',
    setup() {
      const generatePDF = () => {
        const doc = new jsPDF();
  
        // Set up the font and colors
        doc.setFont('helvetica');
        doc.setTextColor(0, 0, 0);
  
        // Header
        addHeader(doc);
  
        // Footer
        addFooter(doc);
  
        // Work Order Details Section
        addWorkOrderDetails(doc);
  
        // Line Items Section
        addLineItems(doc);
  
        // Save the PDF
        doc.save('work-order-7149.pdf');
      };
  
      const addHeader = (doc: jsPDF) => {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Moon Star Express', 10, 20);
  
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('7277 Rawsonville Road', 10, 28);
        doc.text('Belleville, Michigan, 48111', 10, 34);
        doc.text('US', 10, 40);
        doc.text('7344851100', 10, 46);
      };
  
      const addFooter = (doc: jsPDF) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Page 1 of 2', 105, 290, { align: 'center' });
      };
  
      const addWorkOrderDetails = (doc: jsPDF) => {
        // Add work order details
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Work Order Number #7149', 10, 60);
  
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Invoice Number', 10, 66);
        doc.text('PO Number', 10, 72);
  
        doc.setFont('helvetica', 'bold');
        doc.text('WORK ORDER DETAILS', 10, 88);
  
        doc.setFont('helvetica', 'normal');
        doc.text('Issue Date: Sat, Mar 23, 2024 8:25 AM', 10, 98);
        doc.text('Scheduled Start Date: Sat, Mar 23, 2024 8:25 AM', 10, 104);
        doc.text('Actual Start Date: Sat, Mar 23, 2024 8:25 AM', 10, 110);
        doc.text('Expected Completion Date', 10, 116);
        doc.text('Actual Completion Date: Tue, Apr 2, 2024 4:35 PM', 10, 122);
        doc.text('Duration: 10 days 8 hrs 10 mins', 10, 128);
        doc.text('Repair Priority Class: Non-Scheduled', 10, 134);
        doc.text('Status: Completed', 10, 140);
        doc.text('Issued By: JAMES STAFFORD', 10, 146);
        doc.text('Assigned to: JAMES STAFFORD', 10, 152);
  
        // Vehicle details
        doc.text('Vendor: 727806', 10, 162);
        doc.text('2019 HYUNDAI DRY VAN TRAILER', 10, 168);
        doc.text('VIN/SN: 3H3V532C0KT266014', 10, 174);
        doc.text('License Plate: D867594', 10, 180);
        doc.text('Operator: N/A', 10, 186);
        doc.text('Type: DRY VAN', 10, 192);
        doc.text('Group: OWNED TRAILER', 10, 198);
  
        // Placeholder for image
        doc.rect(150, 60, 50, 50); // Image box
      };
  
      const addLineItems = (doc: jsPDF) => {
        // Line Items
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('LINE ITEMS', 10, 208);
  
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('remove four bad slack adjusters replace 7-way plug repaired air assist', 10, 218);
        doc.text('Airline: 3.53 hrs', 10, 224);
        doc.text('Labor: $23.00', 10, 230);
        doc.text('Black Plastic 7-Way (Part) · PARTS ROOM', 10, 236);
        doc.text('7-way receptacle (Black Plastic) 1 ea: $11.49', 10, 242);
  
        // Pricing
        doc.text('Item Labor Parts Subtotal', 10, 252);
        doc.text('7 way box inspect $81.19 $11.49 $92.68', 10, 258);
  
        // Summary and Total
        doc.text('Subtotal: $92.68', 10, 268);
        doc.text('Labor: $81.19', 10, 274);
        doc.text('Parts: $11.49', 10, 280);
        doc.text('Warranty Credits: - $0.00', 10, 286);
        doc.text('Discount: - $0.00 (0.0%)', 10, 292);
        doc.text('Tax: +$0.00 (0.0%)', 10, 298);
        doc.setFont('helvetica', 'bold');
        doc.text('Total: $92.68', 10, 304);
      };
  
      return {
        generatePDF,
      };
    }
  });
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  