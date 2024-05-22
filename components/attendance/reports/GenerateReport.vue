<script setup lang="ts">
import { ref } from 'vue'
import type { DepartmentInfo } from '@/types/store/department';
import type { EmployeeInfo } from '@/types/store/employee';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
// import { Chart , registerables} from 'chart.js'
// Chart.register(...registerables)
import Chart from 'chart.js/auto'

const departmentStore = useDepartmentStore()
const { departmentList, loading: loadingDepartmentStore } = storeToRefs(departmentStore)

const employeeStore = useEmployeeStore()
const { employeeList, loading: loadingEmployeeStore } = storeToRefs(employeeStore)

const attendanceReportStore = useAttendanceReportStore()


const startDate = ref('');
const endDate = ref('');
const employeeFilter = ref(false);
const departmentFilter = ref(false);
const selectedDepartments = ref<DepartmentInfo[]>([])
const selectedEmployees = ref<EmployeeInfo[]>([])
const selectedDuration = ref('creation_window');
const dialog = ref<boolean>(false);

const durationTypes = ref([
    { name: 'Creation Window', id: 'creation_window' },
    { name: 'Timeoff Request Window', id: 'timeoff_window' }
])

const reportTypes = ref([
    { name: 'Employee Timeoff Request Report', id: 'timeoff_request_report' },
])

const selectedReportType = ref<string>('timeoff_request_report')
const pdfDataUri = ref('')

const filterdEmployeeList = computed(() => {
    if (departmentFilter.value && selectedDepartments.value.length) {
        let department_ids = selectedDepartments.value.map((item: DepartmentInfo) => item.id)
        return employeeList.value.filter((item: EmployeeInfo) => department_ids.includes(item.department_id as number))
    }

    return employeeList.value
})

const currentReportType = computed(() => {
    return reportTypes.value.find((item: any) => item.id == selectedReportType.value)
})

const generateReport = () => {
    switch (selectedReportType.value) {
        case 'timeoff_request_report': // Employee Timeoff Request Report;
            getReport()
            break;
    }
}

const getReport = async () => {

    try {
        const employeeIds = selectedEmployees.value?.map((employee: EmployeeInfo) => employee.id as number)
        const payload: { reportType: string; startDate: string; endDate: string; durationType: string; employeeIds?: number[]; } = {
            reportType: selectedReportType.value,
            durationType: selectedDuration.value,
            startDate: startDate.value,
            endDate: endDate.value
        }
        if (employeeIds.length > 0) {
            payload.employeeIds = employeeIds
        }

        const response: any = await attendanceReportStore.getAttendanceReport(payload);

        let data = response.value

        if (data.statistics.length == 0) {
            //handle no timeoff request data returned
        }

        let tableData = data.statistics.map((item: any) => {
            return [item.employee?.full_name, item.totalRequestCount, item.pendingRequests, item.acceptedRequests, item.rejectedRequests]
            // return [item.employee?.full_name, item.totalRequestCount, item.maxRequestDuration, item.minRequestDuration, item.pendingRequests, item.acceptedRequests, item.rejectedRequests]
            // item.maxAcceptedTimeoffRequestDuration, item.minAcceptedTimeoffRequestDuration]
        })

        // const tableHeaders = ['Name', 'Req. Count', 'Max. Duration', 'Min. Duration', 'Pending Req.', 'Accepted Req.', 'Rejected Req.'] //, 'Accepted Req. Duration', 'Max Accepted Duration (Days)', 'Min Accepted Duration (Days)']
        const tableHeaders = ['Employee Name', 'Request Count', 'Pending Requests', 'Accepted Requests', 'Rejected Requests']
       
        // const chartEl = document.createElement("canvas");
        // const ctx = chartEl.getContext("2d");
        // chartEl.setAttribute("width", "400");
        // chartEl.setAttribute("height", "400");
        // chartEl.style.display = "none";

        // var base64ImageData = ''
        // document.body.append(chartEl);

        // let chart = new Chart(ctx!, {
        //     type: "bar",
        //     data: {
        //         datasets: [
        //             {
        //                 barPercentage: 0.5,
        //                 barThickness: 6,
        //                 maxBarThickness: 8,
        //                 minBarLength: 2,
        //                 data: [10, 20, 30, 40, 50, 60, 70]
        //             }
        //         ]
        //     },
        //     options: {
        //         scales: {}
        //     },
        // });

        // // cleanup
        // chartEl.remove();


        // // Create a new PDF document
        const doc = new jsPDF();

        // Set the font size and text color
        var fontSize = 12;
        // doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Set text color to black
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // Set the initial cursor position
        var currentX = 10;
        var currentY = 10;

        fontSize = 15
        doc.setFontSize(fontSize)

        doc.text('Moon star Express', pageWidth / 2, currentY, { align: 'center' });


        // Update the cursor position
        currentY += fontSize / 2; // Adjust Y position based on font size and desired spacing
        fontSize = 12
        doc.setFontSize(fontSize);

        // Add more text at the updated cursor position
        doc.text('Attendance Time-Off Request Report', pageWidth / 2, currentY, { align: 'center' });

        // var width = 100;
        // var height = 100;
        // doc.addImage(image, 'PNG', 0, 0, width, height);

        (doc as any).autoTable({
            startY: currentY += fontSize, // Specify the Y position to start the table
            head: [tableHeaders],
            body: tableData,
        });

        // autoTable(doc, {
        //     head: [tableHeaders],
        //     body: tableData,
        // })

        // Save the PDF as a data URI
        pdfDataUri.value = doc.output('datauristring');
        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = pdfDataUri.value;
    } catch (error) {
        // Handle the rejected error
        console.error(error);
    }
}

const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfDataUri.value;
    link.download = 'output.pdf';
    link.click();
}

const setStartAndEndDate = () => {
    console.log('testing')
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    startDate.value = thirtyDaysAgo.toISOString().slice(0, 10)
    endDate.value = today.toISOString().slice(0, 10)
}

watch(dialog, (val) => {
    if (val) {
        setStartAndEndDate()
    }
})

</script>

<template>
    <v-dialog fullscreen v-model="dialog">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text="Report Generator" color="primary" density="compact" class="mr-2"> </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="grey-background">
                <v-toolbar color="primary" title="Attendance Reports" density="compact">
                    <v-spacer></v-spacer>
                    <v-btn icon @click="isActive.value = false">
                        <v-icon>mdi-window-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col cols="4" class="overflow-y-scroll filled-height">
                            <v-col class="px-0">
                                <v-btn color="primary" density="compact" @click="generateReport">Generate
                                    Report</v-btn>
                            </v-col>
                            <v-row>
                                <v-col cols="12">
                                    <v-select :items="reportTypes" item-value="id" v-model="selectedReportType"
                                        item-title="name" hide-details density="compact" variant="solo"
                                        label="Report Type"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-select label="Type of Duration (Start Date - End Date)" :items="durationTypes"
                                        v-model="selectedDuration" item-value="id" item-title="name" hide-details
                                        density="compact" variant="solo"></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field hide-details v-model="startDate" density="compact" variant="solo"
                                        type="date" label="Start Date"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field hide-details v-model="endDate" density="compact" variant="solo"
                                        type="date" label="End Date"></v-text-field>
                                </v-col>
                                <v-divider class="my-1"></v-divider>
                                <v-col class="pa-0">
                                    <p class="text-center">Filters</p>
                                </v-col>
                                <v-divider class="my-1"></v-divider>
                                <v-col cols="12" class="py-0">
                                    <v-checkbox hide-details v-model="departmentFilter" color="primary"
                                        label="Filter By Department"></v-checkbox>
                                    <v-autocomplete v-model="selectedDepartments" :items="departmentList" multiple
                                        hide-selected hide-details return-object item-title="name" density="compact"
                                        variant="solo" label="Select Department(s)" :disabled="!departmentFilter" chips
                                        closable-chips color="blue-grey-lighten-2"></v-autocomplete>

                                </v-col>

                                <v-col cols="12" class="pb-0">
                                    <v-checkbox hide-details v-model="employeeFilter" color="primary"
                                        label="filter By Employee"></v-checkbox>
                                    <v-autocomplete v-model="selectedEmployees" :items="filterdEmployeeList" hide-selected
                                        multiple hide-details return-object item-title="full_name" density="compact"
                                        variant="solo" label="Select Employee(s)" :disabled="!employeeFilter" chips
                                        closable-chips color="blue-grey-lighten-2"></v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="8" class="overflow-y-scroll filled-height pa-0">
                            <!-- <div v-if="pdfDataUri.length"> <v-btn @click="downloadPDF">Download PDF</v-btn></div> -->

                            <iframe v-if="pdfDataUri" id="pdfPreview" :src="pdfDataUri"></iframe>
                            <div v-else class="d-flex justify-center align-center" style="height:100%;width:100%">
                                <span>No Document Generated</span>
                            </div>
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
</style>