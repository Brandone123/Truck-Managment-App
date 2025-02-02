<script setup lang="ts">
import { ref } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { YardOccupancyInfo } from '~/types/yard/yard_occupancy';
import type { YardDetailInfo, YardInfo } from '~/types/yard/yard';
import { ChevronsDownLeftIcon } from 'vue-tabler-icons';
import type { ApexOptions } from 'apexcharts';
import generateChartImage, {getBase64ImageDimensions} from '~/composables/chartImageGenerator';
import moment from 'moment'

const yardReportStore = useYardStore()
const { current, capacity, yardList, yardDetailVehicle, yardDetail } = storeToRefs(yardReportStore)

const yardOccupancyStore = useYardOccupancyStore()
const { EntryExitFrequency, occupancyData, yardOccupancyList, stationaryVehicle } = storeToRefs(yardOccupancyStore)

const filterdYardList = computed(() => {
    return yardList.value
})

const selectedYard = ref<YardInfo | null>(null); //creating a state of type YardInfo

const currentY = ref(10)
const currentX = ref(10)

// // Create a new PDF document
const doc = ref<jsPDF | null>(null ); //creating a new pdf state

const loading = ref(false);

const name = ref('');
const truck_id = ref();
const trailer_id = ref();
const recorded_at = ref('');
const pdfDataUri = ref('')
const dialog = ref<boolean>(false);

const reportTypes = ref([
    { name: 'Yard Occupancy Report', id: 'yard_occupancy_report' },
    // { name: 'Yard Dwell Time Report', id: 'yard_dwell_time_report' },
])

const selectedReportType = ref<string>('yard_occupancy_report')

function convertToAmericanFormat(date: string) {
  return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
}

const selectedTimeFrame = ref("daily");
const selectedTimeFrameForYardDetail = ref("daily");

const categories = occupancyData.value.length > 0 ? occupancyData.value[0].dates?.map(date => date? convertToAmericanFormat(date) : null) : [];
const series = occupancyData.value.map((yard) => ({
    name: yard.yardName ? yard.yardName : '',
    data: yard.occupancies,
})) as any;

const entries: (number | null)[] = [];
const exits: (number | null)[] = [];
const yardDetailcategories: never[] = [];


// sample chart options
const chartOptions = computed(() => {

    return {
        title: {
            text: 'Yard Occupancy Chart',
            align: 'center',
            margin: 20,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                color: '#000000'
            }
        },
        grid: {
            borderColor: "rgba(0,0,1,1)",
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },

        chart: {
            type: "bar", //specify the chart type (e.g. line, bar, area, etc.)
            animations: {
                enabled: false, //disable animation to speed up rendering
            },
            height: 300,
            width: 600,
            toolbar: { show: true },
            foreColor: "#000000",
            // fontFamily: "inherit",
            sparkline: { enabled: false },
        },
        series: series,

        dataLabels: { enabled: false },
        // markers: { size: 0 },
        legend: { show: false, position: 'bottom', offsetY: 30 },

        xaxis: {
            type: "category",
            categories: categories,
            labels: {
                style: { cssClass: "fill-color" },   
            },
        },

        yaxis: {
            show: true,
            min: 0,  //comment out min and max, so chart auto sizes scale to match data
            max: 30,
            labels: {
                style: {
                    cssClass: "fill-color",
                },
            },
        },
        plotOptions: {
            bar: {
            horizontal: false,
            dataLabels: {
                position: 'bottom',
            },
            },
        },
    } as ApexOptions;
    
})

const donutOptions = computed(() => {

    return {
        title: {
            text: 'Real-Time Occupancy Chart',
            align: 'center',
            margin: 20,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                color: '#000000'
            }
        },
        chart: {
            type: 'donut',
            height: 310,
            width: 300,
            toolbar: { show: true },
            foreColor: '#adb0bb',
            fontFamily: 'inherit',
        },
        series: [current.value, capacity.value - current.value],
        colors: ["#1984c5", "#22a7f0"],
        dataLabels: { enabled: true },
        markers: { size: 0 },
        legend: { show: true, position: 'bottom' },
        tooltip: { theme: 'light' },
        labels: ['Occupied', 'Available'],

    } as ApexOptions;
   
})

const yardDetailData = () => {
    for (const date in EntryExitFrequency.value) {
    const entryData = EntryExitFrequency.value[date].entries;
    const exitData = EntryExitFrequency.value[date].exits;

    // Ajout des valeurs dans les tableaux correspondants
    entries.push(entryData);
    exits.push(exitData);
    categories.push(date);
  }
}

const yardDetailchartOptions = computed(() => {

    return {
        title: {
            text: 'Entry/Exit Frequency Chart',
            align: 'center',
            margin: 20,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                color: '#000000'
            }
        },
        colors: ["#1984c5", "#22a7f0"],
        grid: {
            borderColor: "rgba(0,0,1,1)",
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },

        chart: {
            type: "bar", //specify the chart type (e.g. line, bar, area, etc.)
            animations: {
                enabled: false, //disable animation to speed up rendering
            },
            height: 300,
            width: 300,
            toolbar: { show: true },
            foreColor: "#000000",
            // fontFamily: "inherit",
            sparkline: { enabled: false },
        },
        series: [{
            name: "Entries",
            data: entries,
        },
        {
            name: "Exits",
            data: exits,
        },],

        dataLabels: { enabled: false },
        // markers: { size: 0 },
        legend: { show: true, position: 'bottom' },

        xaxis: {
            type: "category",
            categories: yardDetailcategories,
            labels: {
                style: { cssClass: "fill-color" },   
            },
        },

        yaxis: {
            show: true,
            min: 0,  //comment out min and max, so chart auto sizes scale to match data
            max: 30,
            labels: {
                style: {
                    cssClass: "fill-color",
                },
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: 'bottom',
                },
            },
        },
    } as ApexOptions;
    
})

const generateReport = () => {
    loading.value = true;
    switch (selectedReportType.value) {
        case 'yard_occupancy_report': // Employee Timeoff Request Report;
            getReport()
            break;
        // case 'yard_dwell_time_report':
        //     getReportDwellTime()
        //     break;
    }
}

const getReport = async () => {

    try {
        let tableData: any[][] = [];
        let tableHeaders: string[] = [];
        doc.value = new jsPDF();

        currentY.value = 10
        currentX.value = 10

         // Set the font size and text color
        var fontSize = 12;
        // doc.setFontSize(12);
        doc.value.setTextColor(0, 0, 0); // Set text color to black
        var pageWidth = doc.value.internal.pageSize.width || doc.value.internal.pageSize.getWidth();

        fontSize = 15
        doc.value.setFontSize(fontSize)

        doc.value.text('Moon Star Express', pageWidth / 2, currentY.value, { align: 'center' });


        // Update the cursor position
        currentY.value += fontSize / 2; // Adjust Y position based on font size and desired spacing
        fontSize = 12
        doc.value.setFontSize(fontSize);

        // Add more text at the updated cursor position
        doc.value.text('Yard Occupancy Report', pageWidth / 2, currentY.value, { align: 'center' });

        currentY.value += fontSize;

        if (selectedYard.value && selectedTimeFrameForYardDetail.value) {
            // Yard selected

            await yardReportStore.getYardDetailById(selectedYard.value.id as number);
            await yardOccupancyStore.getStationaryVehicles(selectedYard.value.id as number);
            await yardOccupancyStore.getEntryExitFrenquency(selectedYard.value.id as number, selectedTimeFrameForYardDetail.value);
            await yardReportStore.getYardOccupancyReport(selectedYard.value.id as number)
            yardDetailData();

            tableData = yardDetailVehicle.value.map((item: any) => {

                const vehicleData = stationaryVehicle.value.find((vehicle) => vehicle.vehicle_id === item.vehicle_id)

                return [
                    item.vehicle_id,
                    item.vehicle_details?.model,
                    item.vehicle_details?.vin,
                    item.asset_type,
                    item.entry_time,
                    vehicleData?.stationary_time,
                ];
            });

            tableHeaders = ['Vehicle Id', 'Vehicle Model', 'Vehicle Vin', 'Asset Type', 'Entry Time', 'Stationary Time'];
            var pageWidth = doc.value.internal.pageSize.width || doc.value.internal.pageSize.getWidth();

            //get image using apex chart
            let imgURI = await generateChartImage(donutOptions.value);

            // get width and height of generated chart Image
            let {naturalWidth, naturalHeight} = await getBase64ImageDimensions(imgURI)

            let imgURI2 = await generateChartImage(yardDetailchartOptions.value);

            let {naturalWidth: naturalWidth2, naturalHeight: naturalHeight2} = await getBase64ImageDimensions(imgURI2)

            var firstImageX = (pageWidth - (((naturalWidth / 3) * 2) + 4)) / 2;

            var secondImageX = firstImageX + ((naturalWidth / 3) + 4); 

            // Calculate the X-coordinate to center the image horizontally
            var imageX = (pageWidth - (naturalWidth / 4)) / 2;    //FORMULA: (pageWidth - imageWidth) / 2;

            doc.value.addImage(imgURI, 'PNG', firstImageX, currentY.value, naturalWidth / 4, naturalHeight / 4);
            doc.value.addImage(imgURI2, 'PNG', secondImageX, currentY.value, naturalWidth2 / 4, naturalHeight2 / 4);

            currentY.value += naturalHeight / 4;

        } else if(selectedTimeFrame.value){

            await yardOccupancyStore.yardOccupancyData(selectedTimeFrame.value);
        
            // No yard selected
            tableData = yardOccupancyList.value.map((item: any) => {
                const yard = yardList.value.find((yard: any) => yard.id === item.yardId);
                const capacity = yard ? yard.capacity : '';
                const location = yard ? yard.location : '';
                return [item.name, location, capacity, item.trucks, item.trailers, item.totalOccupancy, item.alerts.length];
            });

            tableHeaders = ['Yard Name', 'Location', 'Capacity', 'Trucks', 'Trailers', 'Total Occupancy', 'Number of Alerts'];
            
            var pageWidth = doc.value.internal.pageSize.width || doc.value.internal.pageSize.getWidth();

            //get image using apex chart
            let imgURI = await generateChartImage(chartOptions.value);
            
            // get width and height of generated chart Image
            let {naturalWidth, naturalHeight} = await getBase64ImageDimensions(imgURI)
            // Calculate the X-coordinate to center the image horizontally
            var imageX = (pageWidth - (naturalWidth / 4)) / 2;    //FORMULA: (pageWidth - imageWidth) / 2;

            doc.value.addImage(imgURI, 'PNG', imageX, currentY.value, naturalWidth / 4, naturalHeight / 4);

            //move cursor below image by adding in image's rendered height
            currentY.value += naturalHeight / 4;
        }
        
        // move cursor to below text
        currentY.value += fontSize / 2;


        //CODE TO PLACE TWO CHARTS SIDE BY SIDE:

        // Calculate the X-coordinate for the first image to center it horizontally
        // var firstImageX = (pageWidth - (((naturalWidth / 4) * 2) + 4)) / 2;  //FORMULA: (pageWidth - [(imageWidth * 2)+OPTIONAL_IMAGE MARGIN] / 2;

        // // Calculate the X-coordinate for the second image
        // var secondImageX = firstImageX + ((naturalWidth / 4) + 4);   //FORMULA: FirstImageX + imageWidth + OPTIONAL_IMAGE_MARGIN

        // // Add the image to the PDF document at the current cursor position.
        // // doc.value.addImage(imgURI, 'PNG', currentX + 4, currentY, naturalWidth / 4, naturalHeight / 4);

        // doc.value.addImage(imgURI, 'PNG', firstImageX, currentY, naturalWidth / 4, naturalHeight / 4);
        // // doc.value.addImage(imgURI, 'PNG', secondImageX, currentY, naturalWidth / 4, naturalHeight / 4);

        // //move cursor below image by adding in image's rendered height
        // currentY += naturalHeight / 4;


        //CODE TO CENTRALIZE A SINGLE IMAGE:

       

        (doc.value as any).autoTable({
            startY: currentY.value += fontSize / 2, // Specify the Y position to start the table
            head: [tableHeaders],
            body: tableData,
        });

        // Save the PDF as a data URI
        pdfDataUri.value = doc.value.output('datauristring');
        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = pdfDataUri.value;

        loading.value = false;
    } catch (error) {
        // Handle the rejected error
        console.error(error);
        loading.value = false;
    }
}

// watch(selectedTimeFrame, (chartOptions) => {
//      generateChartImage(chartOptions);
// });

</script>

<template>
    <v-dialog fullscreen v-model="dialog">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text="Generate Report" color="primary" density="compact" class="mr-2"> </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="grey-background">
                <v-toolbar color="primary" title="Yard Reports" density="compact">
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
                                <v-col cols="12">
                                    <v-select v-model="selectedTimeFrame" :items="['daily', 'weekly', 'monthly']"
                                        variant="outlined" density="compact" hide-details></v-select> 
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-divider class="my-1"></v-divider>

                                <v-col cols="12" class="pb-0">
                                    <v-select v-model="selectedYard" :items="yardList" hide-details return-object
                                        item-title="name" item-value="id" density="compact" variant="solo"
                                        label="Select Yard" hide-selected>
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-select v-model="selectedTimeFrameForYardDetail" :items="['daily', 'weekly', 'monthly']"
                                        variant="outlined" density="compact" hide-details></v-select> 
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="8" class="overflow-y-scroll filled-height pa-0">
                            <!-- <div v-if="pdfDataUri.length"> <v-btn @click="downloadPDF">Download PDF</v-btn></div> -->
                            <div v-if="loading" class="loading-overlay d-flex justify-center align-center"
                                style="height:100%;width:100%">
                                <span> <v-progress-circular v-if="loading" indeterminate
                                        color="primary"></v-progress-circular></span>
                            </div>
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