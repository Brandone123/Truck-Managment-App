<script setup lang="ts">
import { ref, computed } from "vue"
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
import type { EmployeeInfo } from '~/types/store/employee';

interface YearMonth {
    year: number;
    month: number;
    date?: any;
}

interface DayOfWeek {
    day: number;
    dayOfWeek: string;
    isToday: boolean;
}

export interface TimeoffGroup {
    id: number;
    attendance_leave_type_id: number;
    status: string;
    values: Array<number>;
}

/********************
 *PINIA STORE DATA
********************/

const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList } = storeToRefs(leaveTypeStore)

const timeoffRequestStore = useTimeoffRequestStore()
const { timeoffRequestList } = storeToRefs(timeoffRequestStore)

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

/********************
 *MOUNTED HOOKS
********************/

onMounted(() => {
    leaveTypeStore.fetchLeaveTypeList()
    departmentStore.fetchDepartmentList()
    timeoffRequestStore.loadTimeoffRequests()
    employeeStore.fetchEmployeeList()
})

/********************
 *RESPONSIVE DATA 
********************/

const currentDate = ref(new Date());
const search = ref('')
const current_department_id = ref(null)

//Timeoff Request Dialog Settings
const editedAttendanceRecord = ref({});
const attendanceRecordDialog = ref(false)
const updatingAttendanceRecord = ref(false)

/********************
 *COMPUTED PROPERTIES
********************/

const firstLoad = computed(() => {
    return !(employeeList.value || []).length && !(timeoffRequestList.value || []).length
})

const loading = computed(() => {
    return timeoffRequestStore.loading || employeeStore.loading
})

const timeOffRequests = computed(() => {
    return employeeList.value.map((item: EmployeeInfo) => {
        return {
            employee_info: item,
            timeoff_info: employeeTimeOffRequests(item.id as number)
        }
    })
})

const filteredTimeOffRequests = computed(() => {
    if (current_department_id.value) {
        return timeOffRequests.value.filter((item: any) => item.employee_info?.department_id == current_department_id.value)
    }
    return timeOffRequests.value
})

const headers = computed(() => {
    return [
        { title: '', key: 'department', width: '20%', minWidth: '200px', sortable: false, class: 'font-weight-bold fix' },
        ...daysInMonthHeaders.value
    ]
})

const daysInMonthCount = computed(() => {
    let year = currentDate.value.getFullYear()
    let month = currentDate.value.getMonth()
    // Get the number of days in the month
    return new Date(year, month + 1, 0).getDate();
})

const daysInMonthHeaders = computed(() => {
    return getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth()).map((item: DayOfWeek) => {
        return { title: getFirstLetter(item.dayOfWeek), isToday: item.isToday, width: 'auto', minWidth: '60px', key: item.day, sortable: false, align: 'center', class: 'font-weight-bold' }
    })
})

const inCurrentMonthAndYear = computed(() => {
    let thisDate = new Date()

    if (thisDate.getFullYear() == currentDate.value.getFullYear() && thisDate.getMonth() == currentDate.value.getMonth()) {
        return true
    }

    return false
})


/*********
 *METHODS
*********/

function getTimeofOption(option_id: number) {
    return leaveTypeList.value.find((item: any) => item.id == option_id)
}

function getColor(dayGroup: TimeoffGroup) {
    switch (dayGroup.status) {
        case 'pending':
            return 'grey';
        case 'rejected':
            return 'red';
        case 'accepted':
            return getTimeofOption(dayGroup.attendance_leave_type_id)?.color
    }
}

const updateAttendanceRecord = (value: any) => {
    attendanceRecordDialog.value = value
    editedAttendanceRecord.value = {}
    updatingAttendanceRecord.value = false
}

function getFirstLetter(str: string): string {
    if (str.length === 0) {
        return ''; // Return an empty string if the input string is empty
    }

    return str.charAt(0).toUpperCase() + str.charAt(1); // Retrieve the first two characters of the string
}

function capitalizeFirstLetter(str: string): string {
    if (str.length === 0) {
        return ''; // Return an empty string if the input string is empty
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()// Capitalize first letter of string
}

function updateCurrentDate(date: Date): void {
    currentDate.value = date
}

function getDaysInMonth(year: number, month: number): DayOfWeek[] {
    const daysInMonth: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Create a new Date object for the current date
    const today: Date = new Date();

    // Create a new Date object for the first day of the month
    const firstDayOfMonth: Date = new Date(year, month, 1);

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek: number = firstDayOfMonth.getDay();

    // Get the number of days in the month
    const numberOfDays: number = new Date(year, month + 1, 0).getDate();

    const days: { day: number; dayOfWeek: string; isToday: boolean }[] = [];

    // Loop through each day of the month
    for (let day = 1; day <= numberOfDays; day++) {
        const date: Date = new Date(year, month, day);
        const dayOfWeek: string = daysInMonth[(startingDayOfWeek + (day - 1)) % 7];
        const isToday: boolean = date.toDateString() === today.toDateString();
        days.push({ day, dayOfWeek, isToday });
    }

    return days;
}

function getNextMonth(date: Date): YearMonth {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    let nextYear: number = year;
    let nextMonth: number = month + 1;

    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
    }

    return { year: nextYear, month: nextMonth, date: new Date(nextYear, nextMonth, 1) };
}

function getPreviousMonth(date: Date): YearMonth {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    let previousYear: number = year;
    let previousMonth: number = month - 1;

    if (previousMonth < 0) {
        previousMonth = 11;
        previousYear--;
    }
    return { year: previousYear, month: previousMonth, date: new Date(previousYear, previousMonth, 1) };
}

const nextMonth = () => {
    currentDate.value = getNextMonth(currentDate.value).date
};

const previousMonth = () => {
    currentDate.value = getPreviousMonth(currentDate.value).date
};

const daysInMonth = computed<DayOfWeek[]>(() => {
    return getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth());
})

const placeValues = (arr1: TimeoffGroup[], arr2: number[]): (number | TimeoffGroup)[] => {
    const result: (number | TimeoffGroup)[] = [];

    let arr1Index = 0;
    let arr2Index = 0;

    while (arr1Index < arr1.length && arr2Index < arr2.length) {
        const obj1 = arr1[arr1Index];
        const value2 = arr2[arr2Index];

        const minValue1 = Math.min(...obj1.values);

        if (minValue1 < value2) {
            result.push(Object.assign({}, obj1));
            arr1Index++;
        } else {
            result.push(value2);
            arr2Index++;
        }
    }

    while (arr2Index < arr2.length) {
        result.push(arr2[arr2Index]);
        arr2Index++;
    }

    if (arr1Index < arr1.length) {
        result.push(arr1[arr1Index]);
    }

    return result;
}

function customTableFilter(value: any, query: any, item: any) {
    let full_name = `${item.raw.employee_info.first_name} ${item.raw.employee_info.last_name}`.toLowerCase()
    return item != null && query != null && typeof query == 'string' && full_name.includes(query.toString().toLowerCase());
}

function showEditTimeoff(timeoff_id: number) {
    let time_off = timeoffRequestList.value.find((item: TimeoffRequest) => item.id == timeoff_id)
    if (time_off) {
        editedAttendanceRecord.value = time_off
        updatingAttendanceRecord.value = true
        attendanceRecordDialog.value = true
    }
}

function addTimeoff(data: TimeoffRequest) {
    timeoffRequestStore.addTimeoffRequest(data)
}

function editTimeoff(data: TimeoffRequest) {
    timeoffRequestStore.updateTimeoffRequest(data)
}

// sort date ranges in ascending order
function sortNonOverlappingDateRanges(dateRanges: Array<any>) {
    dateRanges.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime() || new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    return dateRanges;
}

function employeeTimeOffRequests(employee_id: number) {

    let daysOfMonth = getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth()).map(item => item.day);

    let employee_days_off_in_month = sortNonOverlappingDateRanges(timeoffRequestList.value.filter((item: TimeoffRequest) => item.employee_id == employee_id)) || []

    if (employee_days_off_in_month.length > 0) {
        // let result: (number | number[])[] = [];
        let result: TimeoffGroup[] = [];

        let ungroupedValues: number[] = [...daysOfMonth]; // Copy the values array

        for (let i = 0; i < employee_days_off_in_month.length; i++) {
            const { start_date, end_date } = employee_days_off_in_month[i];

            var startDate = new Date(start_date as string);
            startDate.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms
            var endDate = new Date(end_date as string);
            endDate.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms

            const groupedValues = ungroupedValues.filter((value: number | null) => {
                if (value !== null) {
                    var today = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), value);
                    today.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms
                    return today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime();
                }
                return false;
            });

            if (groupedValues.length > 0) {
                result.push({ id: employee_days_off_in_month[i].id, status: employee_days_off_in_month[i].status, attendance_leave_type_id: employee_days_off_in_month[i].attendance_leave_type_id, values: groupedValues });
                ungroupedValues = ungroupedValues.filter(value => !groupedValues.includes(value));
            }
        }


        if (ungroupedValues.length > 0) {
            return placeValues(result, ungroupedValues)
        }
        else {
            return result
        }
    }

    return daysOfMonth
}

function getTooltipText(dayGroup: TimeoffGroup) {
    if (dayGroup.status != 'accepted') {
        return `${capitalizeFirstLetter(dayGroup.status)} : ${getTimeofOption(dayGroup.attendance_leave_type_id)?.name}`
    } else {
        return getTimeofOption(dayGroup.attendance_leave_type_id)?.name
    }
}

</script>

<template>
    <div>
        <div class="d-flex justify-space-between mb-2">
            <span class="text-primary text-h5">TimeOff Request Management</span>
            <div>
                <AttendanceAddTimeoffRequest :show="attendanceRecordDialog" @addInfo="addTimeoff" @editInfo="editTimeoff"
                    @update:show="updateAttendanceRecord" :updating="updatingAttendanceRecord"
                    :item="(editedAttendanceRecord as any)" :employees="employeeList" />
            </div>
        </div>
        <v-row class="my-3 px-3">
            <v-col cols="12" md="6">
                <v-row align="center">
                    <v-btn :disabled="inCurrentMonthAndYear" color="primary" variant="tonal" density="compact"
                        @click="currentDate = new Date()" class="mr-1">TODAY</v-btn>

                    <v-btn color="primary" density="compact" icon="mdi-chevron-left" variant="plain"
                        @click="previousMonth()"></v-btn>
                    <v-btn color="primary" icon="mdi-chevron-right" variant="plain" @click="nextMonth()"></v-btn>
                    <AttendanceYearAndMonthSelector :currentDate="currentDate" @update:current-date="updateCurrentDate" />
                </v-row>
            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field lebel="Search for Employee" v-model="search" density="compact" variant="solo" flat
                        placeholder="Search" prepend-inner-icon="mdi-magnify"></v-text-field>
                </v-row>
            </v-col>
        </v-row>
        <v-skeleton-loader :loading="loading && firstLoad" type="table-tbody">
            <v-responsive>
                <v-data-table :loading="loading" :items="filteredTimeOffRequests" :headers="(headers as Array<any>)"
                    id="timeoff" :search="search" :custom-filter="customTableFilter">
                    <template v-slot:headers="{ columns }">
                        <tr>
                            <th v-for="(header, i) in columns" :key="i" :class="[(header as any).class]"
                                :style="{ width: header.width, }" class="px-0 text-center">
                                <v-autocomplete class="mx-2" clearable hide-details v-model="current_department_id"
                                    v-if="header.key == 'department'" item-value="id" item-title="name" label="Department"
                                    density="compact" variant="outlined" flat :items="departmentList"></v-autocomplete>
                                <template v-else>
                                    <span v-if="(header as any).isToday"
                                        class="pa-2 text-primary font-weight-bold text-decoration-underline">{{
                                            header.title
                                        }}</span>
                                    <span v-else class="pa-2 text-caption font-weight-bold">{{
                                        header.title }}</span>
                                </template>
                            </th>
                        </tr>
                    </template>
                    <template v-slot:body="{ items }">
                        <tr v-for="item in  items " :key="(item.employee_info.id as number)">
                            <td class="fix px-0 text-primary ">
                                <AttendanceEmployeeDetailsPopup :employee="item.employee_info"
                                    :timeoffInfo="item.timeoff_info" :daysInMonthCount="daysInMonthCount" />
                            </td>
                            <template v-for="(dayGroup, i) in item.timeoff_info" :key="'dayGroup'+i">
                                <td :colspan="typeof dayGroup == 'number' ? 1 : dayGroup.values.length"
                                    class="px-0 text-center">
                                    <v-card elevation="0" v-if="(typeof dayGroup == 'number')"
                                        @click="attendanceRecordDialog = true">
                                        <div class="d-flex justify-space-between text-center">
                                            <span class="pa-2 flex-grow-1">{{ dayGroup }}</span>
                                        </div>
                                    </v-card>

                                    <v-card @click="showEditTimeoff(dayGroup.id)" v-else
                                        :color="getColor(dayGroup)?.toLowerCase()" class="px-0">
                                        <div class="d-flex justify-space-between text-center">
                                            <span v-for="(dayOff, j) in dayGroup.values" :key="'dayOff' + j"
                                                class="pa-2 flex-grow-1">{{
                                                    dayOff
                                                }}</span>
                                        </div>
                                        <v-tooltip activator="parent" location="bottom">
                                            {{ getTooltipText(dayGroup) }}
                                        </v-tooltip>
                                    </v-card>
                                </td>
                            </template>
                        </tr>
                    </template>

                    <!-- hide table footer by adding slot and passing no elementss -->
                    <template v-slot:tfoot="{ page }"></template>
                </v-data-table>
            </v-responsive>

        </v-skeleton-loader>
    </div>
</template>

<style scoped>
.fix {
    position: sticky;
    background: white;
    left: 0;
    z-index: 4
}

#timeoff.v-data-table :deep() table td {
    border-bottom: none !important;
}

#timeoff.v-data-table :deep() table th {
    border-bottom: thin solid rgba(var(--v-theme-primary), var(--v-border-opacity)) !important;
}

#timeoff.v-data-table :deep() table th {
    font-size: 10px !important;
}
</style>