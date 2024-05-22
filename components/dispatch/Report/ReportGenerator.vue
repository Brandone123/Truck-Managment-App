<script setup lang="ts">
import { ref } from 'vue'
import type { DepartmentInfo } from '@/types/store/department';
import type { EmployeeInfo } from '@/types/store/employee';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'

const props = defineProps({
    filter: {
        type: String,
        required: false,
        default: ''
    }
});

const departmentStore = useDepartmentStore()
const { departmentList, loading: loadingDepartmentStore } = storeToRefs(departmentStore)

const employeeStore = useEmployeeStore()
const { employeeList, loading: loadingEmployeeStore } = storeToRefs(employeeStore)

const attendanceReportStore = useAttendanceReportStore()

const sheduleLoadStore = useLoadInfoStore()
const { loadTemplateList: masterLoadList, loading: loadingLoads } = storeToRefs(sheduleLoadStore)

const carrierListStore = useCarrierStore()
const {carrierList} = storeToRefs(carrierListStore)

const loadList = computed(() => {
    return masterLoadList.value.filter((item) => props.filter ? props.filter == item.Status : true)
        .map((load: LoadInfo) => {
            const pickup = load.stops ? load.stops[0] : {} as StopInfo
            const delivery = load.stops ? load.stops[load.stops.length - 1] : {} as StopInfo
            return {
                ...load,
                pickup_date: `${pickup?.earliest_date} ${pickup?.earliest_time}`,
                pickup_city: pickup?.location?.City,
                pickup_state: pickup?.location?.State,
                pickup_address: pickup?.location?.AddressLine,
                delivery_date: `${delivery?.earliest_date} ${delivery?.earliest_time}`,
                delivery_city: delivery?.location?.City,
                delivery_state: delivery?.location?.State,
                delivery_address: delivery?.location?.AddressLine,
            }
        })
})


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
    { name: 'Load Request Window', id: 'load_window' }
])

const reportTypes = ref([
    { name: 'Load History Report', id: 'load_request_report' },
    { name: 'Active Load Report', id: 'active_load_request_report' },
    { name: 'Pickup Performance Report', id: 'pickup_request_report' },
    { name: 'Delivery Performance Report', id: 'delivery_request_report' },
    { name: 'Check Call History Report', id: 'call_request_report' },
    { name: 'Daily Dispatch Report', id: 'daily_request_report' },
])

const selectedReportType = ref<string>('load_request_report')
const pdfDataUri = ref('')

// const filterdEmployeeList = computed(() => {
//     if (departmentFilter.value && selectedDepartments.value.length) {
//         let department_ids = selectedDepartments.value.map((item: DepartmentInfo) => item.id)
//         return employeeList.value.filter((item: EmployeeInfo) => department_ids.includes(item.department_id as number))
//     }

//     return employeeList.value
// })

const currentReportType = computed(() => {
    const report = reportTypes.value.find((report:any) => report.id === selectedReportType.value);
    return report ? report.name : '';
})

const getDispatcherName = (dispatcher_id:any) => {
   const dispatcher = employeeList.value.find((dispatcher) => dispatcher.id === dispatcher_id);
  return dispatcher ? dispatcher.full_name : '';
}

const getCarrierName = (carrier_id:any) => {
   const carrier = carrierList.value.find((carrier) => carrier.id === carrier_id);
  return carrier ? carrier.name : '';
}

const generateReport = () => {
    switch (selectedReportType.value) {
        case 'load_request_report': // Load Request Report;
            getReport()
            break;
        case 'active_load_request_report': 
            getReport()
            break;
        case 'pickup_request_report': 
            getReport()
            break;
        case 'delivery_request_report': 
            getReport()
            break;
        case 'call_request_report': 
            getReport()
            break;
        case 'daily_request_report': 
            getReport()
            break;
    }
}

const getReport = async () => {

    try {
        // const payloadLoad = computed((item: LoadInfo) =>{
        //     return {
        //         ...item,
        //         reportType: selectedReportType.value,
        //         durationType: selectedDuration.value,
        //         startDate: startDate.value,
        //         endDate: endDate.value
        //     }
        // })

            
        let data = loadList.value

        let tableData = data.map((item: any) => {
            return [
                item.id, 
                item.customer.name, 
                item.current_truck_id, 
                item.current_trailer_id, 
                getDispatcherName(item.dispatcher_id),
                getCarrierName(item.carrier_id),
                item.Status
            ]
        })

        let loadTableData = data.map((item: any) => {
            return [
                item.id, 
                item.customer.name, 
                item.pickup_date, 
                item.pickup_address, 
                item.delivery_address, 
                item.Status
            ]
        })

        const LoadHistorytableHeaders = [
            'PRO NUMBER', 
            'CUSTOMER', 'PU DATE',
            'ORIGIN', 
            'DESTINATION',
            'STATUS'
        ]
            const tableHeaders = [
            'PRO NUMBER', 
            'CUSTOMER', 'TRUCK',
            'TRAILER', 
            'DISPATCHER', 'CARRIER',
            'STATUS'
        ]

       
 
        // // Create a new PDF document
        const doc = new jsPDF('landscape');

        // Set the font size and text color
        var fontSize = 12;
        // doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Set text color to black
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // Set the initial cursor position
        var currentX = 10;
        var currentY = 10;
        var currentZ = 25;

        fontSize = 15
        doc.setFontSize(fontSize)

        doc.text('Moon star Express', pageWidth / 2, currentY, { align: 'center' });


        // Update the cursor position
        currentY += fontSize / 2; // Adjust Y position based on font size and desired spacing
        fontSize = 12
        doc.setFontSize(fontSize);

        // Add more text at the updated cursor position
        doc.text(currentReportType.value, pageWidth / 2, currentY, { align: 'center' });
        doc.text('From ' + `${ startDate.value }` + ' To ' + `${ endDate.value }`, pageWidth / 6, currentZ, { align: 'center' });

        (doc as any).autoTable({
            startY: currentY += fontSize, // Specify the Y position to start the table
            head: selectedReportType.value === "load_request_report" ? [LoadHistorytableHeaders] : [tableHeaders],
            body: selectedReportType.value === "load_request_report" ? loadTableData : tableData,
        });

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
                <v-toolbar color="primary" title="Load Reports" density="compact">
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
                                        item-title="name" item-text="name" hide-details density="compact" variant="solo"
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
                                <!-- <v-divider class="my-1"></v-divider>
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
                                </v-col> -->
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