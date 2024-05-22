<script setup lang="ts">
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
import type { LeaveApproverInfo } from '~/types/attendance/leave_approver';
import type { LeavePolicyInfo } from '~/types/attendance/leave_policy';

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

interface TimeoffGroup {
    id: number;
    status: string;
    attendance_leave_type_id: number;
    values: Array<number>;
}

/********************
 *PINIA STORE DATA
********************/

const auth = useAuthStore()
const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList, loading: loadingTimeoffOptionList } = storeToRefs(leaveTypeStore)

const employeeTimeoffRequestStore = useEmployeeTimeoffRequestStore()
const { employeeTimeoffRequestList, loading: loadingEmployeeTimeoffRequestList } = storeToRefs(employeeTimeoffRequestStore)

const leaveApproverStore = useLeaveApproverStore()
const { leaveApproverList } = storeToRefs(leaveApproverStore)

const leavePolicyStore = useLeavePolicyStore()
const { leavePolicyList } = storeToRefs(leavePolicyStore)

/********************
 *MOUNTED HOOKS
********************/

onMounted(() => {
    if(auth.user?.employee?.id){
        leavePolicyStore.getEmployeeLeaveStatus(auth.user.employee.id)
    }

    leavePolicyStore.fetchLeavePolicyList()
    leaveApproverStore.fetchLeaveApproverList()

    leaveTypeStore.fetchLeaveTypeList()
    employeeTimeoffRequestStore.fetchEmployeeTimeoffRequests()
})

/********************
 *RESPONSIVE DATA 
********************/

const layoutType = ref('grid')  // ['grid','table']

const months = ref([
    { id: 0, text: 'January' },
    { id: 1, text: 'February' },
    { id: 2, text: 'March' },
    { id: 3, text: 'April' },
    { id: 4, text: 'May' },
    { id: 5, text: 'June' },
    { id: 6, text: 'July' },
    { id: 7, text: 'August' },
    { id: 8, text: 'September' },
    { id: 9, text: 'October' },
    { id: 10, text: 'November' },
    { id: 11, text: 'December' }
])

const daysOfWeek = ref(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])

const editedAttendanceRecord = ref({});

const attendanceRecordDialog = ref(false)

const updatingAttendanceRecord = ref(false)

//Incomplete Employee Profile 
const showIncompleteTimeoffProfile = ref<boolean>(false)
const incompleteProfileMessageList = ref<string[]>([]);

const selectedDate = ref<string | null>(null)

/********************
 *COMPUTED PROPERTIES
********************/

const firstLoad = computed(() => {
    return employeeTimeoffRequestList.value.length == 0 && loadingEmployeeTimeoffRequestList.value
        // && (leaveTypeList.value.length == 0 || loadingTimeoffOptionList.value)
        && (layoutType.value == 'grid' ? !annualCalendarGrid.value.length : !annualCalendarTable.value)
})

const loading = computed(() => {
    return loadingEmployeeTimeoffRequestList.value && loadingTimeoffOptionList.value
})

const annualCalendarGrid = computed(() => {
    return annualCalendarGridLayout()
})

const annualCalendarTable = computed(() => {
    return annualCalendarTableLayout()
})

const inCurrentYear = computed(() => {
    let thisDate = new Date()
    if (thisDate.getFullYear() == currentYear.value) {
        return true
    }
    return false
})

// sort date ranges in ascending order
const sortNonOverlappingDateRanges = computed(() => {
    return employeeTimeoffRequestList.value.sort((a: TimeoffRequest, b: TimeoffRequest) => new Date(a.start_date as string).getTime() - new Date(b.start_date as string).getTime() || new Date(a.end_date as string).getTime() - new Date(b.end_date as string).getTime());
})

const layoutIcon = computed(() => {
    return layoutType.value == 'grid' ? 'mdi-view-module' : 'mdi-view-sequential'
})

const isMobile = computed(() => {
    return mobile.value
})


/*********
 *METHODS
*********/

function getTimeofOption(option_id: number) {
    return leaveTypeList.value.find(item => item.id == option_id)
}

function getColor(dayGroup: TimeoffGroup) {
    switch (dayGroup.status) {
        case 'pending':
            return 'grey';
        case 'rejected':
            return 'red';
        case 'accepted':
            return getTimeofOption(dayGroup.attendance_leave_type_id)?.color?.toLowerCase()
    }
}

function getFirstLetter(str: string): string {
    if (str.length === 0) {
        return ''; // Return an empty string if the input string is empty
    }

    return str.charAt(0).toUpperCase() + str.charAt(1); // Retrieve the first two characters of the string
}

const placeValues = (arr1: TimeoffGroup[], arr2: (number | null)[]): (number | { id: number, values: number[] } | null)[] => {
    const result: (number | { id: number, values: number[] } | null)[] = [];

    let arr1Index = 0;
    let arr2Index = 0;

    while (arr1Index < arr1.length && arr2Index < arr2.length) {
        const obj1 = arr1[arr1Index];
        const value2 = arr2[arr2Index];

        const minValue1 = Math.min(...obj1.values as number[]);
        if (value2 == null || minValue1 > value2) {
            result.push(value2);
            arr2Index++;
        } else {
            result.push(Object.assign({}, obj1) as TimeoffGroup);
            arr1Index++;
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

const updateTimeoffRequestRecord = (value: boolean) => {
    attendanceRecordDialog.value = value
    editedAttendanceRecord.value = {}
    updatingAttendanceRecord.value = false
}

// const editTimeoffRequest = (value: boolean) => {
//     editedAttendanceRecord.value = value
//     updatingAttendanceRecord.value = true
//     attendanceRecordDialog.value = true
// }

const currentYear = ref(new Date().getFullYear())

function switchLayout() {
    layoutType.value == 'grid' ? layoutType.value = 'table' : layoutType.value = 'grid'
}

function annualCalendarGridLayout() {
    let calendar = []
    let month = 1

    const firstDayOfWeek = 1; // Sunday:0 , Monday:1, ... , Saturday:6. Thus 1 represents Monday
    while (month <= 12) {
        let data = getMonthGridCalendar(currentYear.value, month, firstDayOfWeek);
        calendar.push({ headers: formatHeaders(data.headers), calendar: data.calendar, month: months.value[month - 1].text })
        month += 1
    }

    // return calendar
    let responses: any = []

    calendar.forEach((monthData, monthIndex) => {
        const currentDate = new Date(currentYear.value, monthIndex + 1, 0)
        const numberOfDays: number = currentDate.getDate();
        // Loop through each day of the month
        let daysOfMonth = []
        for (let day = 1; day <= numberOfDays; day++) {
            daysOfMonth.push(day);
        }

        // if (sortNonOverlappingDateRanges.value.length > 0) {
        let ungroupedValues: (number | null)[][] = [...monthData.calendar]; // Copy the values array

        let response: any = []

        ungroupedValues.forEach((group, groupIndex) => {
            let data: (number | { id: number, values: number[] } | null)[] = []

            let result: TimeoffGroup[] = [];
            for (let i = 0; i < sortNonOverlappingDateRanges.value.length; i++) {
                const { start_date, end_date } = sortNonOverlappingDateRanges.value[i];

                var startDate = new Date(start_date as string);
                startDate.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms
                var endDate = new Date(end_date as string);
                endDate.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms

                const groupedValues = group.filter(value => {
                    if (value !== null) {
                        var today = new Date(currentYear.value, monthIndex, value);
                        today.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms
                        return today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime();
                    }
                    return false;
                });

                if (groupedValues.length > 0) {
                    result.push({ id: sortNonOverlappingDateRanges.value[i].id as number, status: sortNonOverlappingDateRanges.value[i].status as string, attendance_leave_type_id: sortNonOverlappingDateRanges.value[i].attendance_leave_type_id as number, values: groupedValues as number[] });
                    ungroupedValues[groupIndex] = ungroupedValues[groupIndex].filter(value => !groupedValues.includes(value));
                }
            }


            if (ungroupedValues[groupIndex].length > 0) {
                data = placeValues(result, ungroupedValues[groupIndex])
            }
            else {
                data = result
            }

            response.push(data)
        })

        responses.push({ headers: monthData.headers, calendar: response, month: monthData.month })
        // }
    })

    return responses
}

function getMonthGridCalendar(year: number, month: number, firstDayOfWeek: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const headers = [];

    // Sort the days of the week based on the first day of the week
    for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
        const index = i % 7;
        headers.push(daysOfWeek.value[index]);
    }

    const calendar = [];
    let week = [];

    // Fill in empty days before the start of the month
    const startDayOfWeek = (startDate.getDay() - firstDayOfWeek + 7) % 7;
    for (let i = 0; i < startDayOfWeek; i++) {
        week.push(null);
    }

    // Loop through each day of the month
    for (let day = 1; day <= endDate.getDate(); day++) {
        week.push(day);

        // If it's the last day of the week, start a new row
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }

    // Fill in empty days after the end of the month
    // const endDayOfWeek = (7 - (endDate.getDay() - firstDayOfWeek)) % 7;
    // for (let i = 0; i < endDayOfWeek; i++) {
    //     week.push(null);
    // }

    // Add the last week to the calendar
    calendar.push(week);


    return { headers, calendar };
}

function annualCalendarTableLayout() {
    const firstDayOfWeek = 1; // 1 represents Monday, 2 represents Tuesday, and so on

    let data = getYearTableCalendar(currentYear.value, firstDayOfWeek);

    let calendar: (number | { id: number, values: number[] } | null)[][] = []
    data.calendar.forEach((monthData, monthIndex) => {
        const currentDate = new Date(currentYear.value, monthIndex + 1, 0)
        const numberOfDays: number = currentDate.getDate();
        // Loop through each day of the month
        let daysOfMonth = []
        for (let day = 1; day <= numberOfDays; day++) {
            daysOfMonth.push(day);
        }

        // if (sortNonOverlappingDateRanges.value.length > 0) {

        let ungroupedValues: (number | null)[] = [...monthData]; // Copy the values array

        let data: (number | { id: number, values: number[] } | null)[] = []

        let result: TimeoffGroup[] = [];
        for (let i = 0; i < sortNonOverlappingDateRanges.value.length; i++) {
            const { start_date, end_date } = sortNonOverlappingDateRanges.value[i];
            var startDate = new Date(start_date as string);
            startDate.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms
            var endDate = new Date(end_date as string);
            endDate.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms

            const groupedValues = monthData.filter(value => {
                if (value !== null) {
                    var today = new Date(currentYear.value, monthIndex, value);
                    today.setHours(0, 0, 0, 0); //reset HH-mm-ss-ms
                    return today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime();
                }
                return false;
            });

            if (groupedValues.length > 0) {
                result.push({ id: sortNonOverlappingDateRanges.value[i].id as number, status: sortNonOverlappingDateRanges.value[i].status as string, attendance_leave_type_id: sortNonOverlappingDateRanges.value[i].attendance_leave_type_id as number, values: groupedValues as number[] });
                ungroupedValues = ungroupedValues.filter(value => !groupedValues.includes(value));
            }
        }


        if (ungroupedValues.length > 0) {
            data = placeValues(result, ungroupedValues)
        }
        else {
            data = result
        }

        calendar.push(data)
        // }
    })

    return { headers: formatHeaders(data.headers), calendar: calendar }
}

function getYearTableCalendar(year: number, firstDayOfWeek: number) {

    var headers = [];

    // Sort the days of the week based on the first day of the week
    for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
        const index = i % 7;
        headers.push(daysOfWeek.value[index]);
    }

    headers = [...headers, ...headers, ...headers, ...headers, ...headers, headers[0], headers[1]]

    const calendar = [];
    for (var month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        let week = [];

        // Fill in empty days before the start of the month
        const startDayOfWeek = (startDate.getDay() - firstDayOfWeek + 7) % 7;
        for (let i = 0; i < startDayOfWeek; i++) {
            week.push(null);
        }

        // Loop through each day of the month
        for (let day = 1; day <= endDate.getDate(); day++) {
            week.push(day);
        }

        //save month days in calendar
        calendar.push(week)
    }


    // // Add the last week to the calendar
    // calendar.push(week);


    return { headers, calendar };
}


function formatHeaders(headers: Array<string>) {
    return headers.map(item => {
        return { key: item, title: getFirstLetter(item), sortable: false, align: 'center' };
    })
}

function showEditTimeoff(timeoff_id: number) {
    let time_off = employeeTimeoffRequestList.value.find((item: TimeoffRequest) => item.id == timeoff_id)
    if (time_off) {
        editedAttendanceRecord.value = time_off
        updatingAttendanceRecord.value = true
        attendanceRecordDialog.value = true
    }
}

function addTimeoff(event: TimeoffRequest) {
    employeeTimeoffRequestStore.addEmployeeTimeoffRequest(event)
}

function editTimeoff(event: TimeoffRequest) {
    employeeTimeoffRequestStore.updateEmployeeTimeoffRequest(event)
}

function updateCurrentYear(event: number) {
    currentYear.value = event
}

function addAttendance(monthDay: number, monthNumber: number) {
    let employee = auth.user?.employee
    if (employee) {
        //validate employeeInfo
        const errorList = employeeProfileErrors()
        if (errorList.length) {
            incompleteProfileMessageList.value = errorList
            showIncompleteTimeoffProfile.value = true
            useLayoutStore().setStatusMessage('Incomplete Employee Profile', 'error')
            return
        }

        let date = new Date(currentYear.value, monthNumber, monthDay,0,0,0)
        var today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

        if (date.getTime() < today.getTime()) {
            useLayoutStore().setStatusMessage('Select a date greater than or equal to today', 'error')
            return
        }

        //validate leave policy delay period
        let waitPeriodEnd = today;
        let min_notice_period = getLeavePolicy(employee.leave_policy_id as number)?.min_notice_period || 0

        let delay_period = min_notice_period
        if (delay_period > 0) {
            delay_period -= 1
        }

        waitPeriodEnd.setDate(waitPeriodEnd.getDate() +  delay_period)

        // check if current date meets the minimum wait time
        if (date.getTime() <= waitPeriodEnd.getTime()) {
            let requestValidFrom = new Date()
            if(delay_period  > 0){
                requestValidFrom.setDate(requestValidFrom.getDate() + min_notice_period)
            }

            useLayoutStore().setStatusMessage(`Requests Available from ${requestValidFrom.toISOString().substring(0, 10)}`, 'error')
            return
        }

        selectedDate.value = date.toISOString().substring(0, 10)
        attendanceRecordDialog.value = true
    }
}

function employeeProfileErrors() {
    let response = []

    const employee = auth.user?.employee
    if (employee && !leaveApproverList.value.some((item: LeaveApproverInfo) => item.id == employee.approver_id)) {
        response.push('No Valid Leave Approver Assigned for this employee')
    }
    if (employee && !leavePolicyList.value.some((item: LeavePolicyInfo) => item.id == employee.leave_policy_id)) {
        response.push('No Valid Leave Policy Assigned for this employee')
    }

    return response
}

function getLeavePolicy(leave_policy_id: number) {
    return leavePolicyList.value.find((item: LeavePolicyInfo) => item.id == leave_policy_id)
}

</script>

<template>
    <div>
        <v-row class="my-3 px-3">
            <v-col cols="12" md="6">
                <v-row align="center">
                    <v-btn :disabled="inCurrentYear" color="primary" variant="tonal" density="compact"
                        @click="currentYear = new Date().getFullYear()" class="mr-1">Current Year</v-btn>
                    <v-btn color="primary" density="compact" icon="mdi-chevron-left" variant="plain"
                        @click="currentYear -= 1"></v-btn>
                    <v-btn color="primary" icon="mdi-chevron-right" variant="plain" @click="currentYear += 1"></v-btn>

                    <AttendanceYearSelector :currentYear="currentYear" @update:currentYear="updateCurrentYear" />

                </v-row>
            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-spacer></v-spacer>
                    <AttendanceEmployeeAddTimeoffRequest :employeeProfileErrors="employeeProfileErrors" :show="attendanceRecordDialog" @update:addInfo="addTimeoff"
                        @update:editInfo="editTimeoff" @update:show="updateTimeoffRequestRecord"
                        :updating="updatingAttendanceRecord" :item="(editedAttendanceRecord as any)"
                        :employee="auth?.user?.employee" :selectedDate="(selectedDate as any)" />
                </v-row>
            </v-col>
        </v-row>
        <v-row no-gutters v-if="!isMobile">
            <v-spacer></v-spacer>
            <v-btn @click="switchLayout()" class="text-none" variant="text" :disabled="firstLoad">
                Layout
                <v-icon>{{ layoutIcon }}</v-icon>
            </v-btn>
        </v-row>

        <!-- Grid Layout -->
        <v-row v-if="layoutType == 'grid' || isMobile">
            <v-col v-if="firstLoad" v-for="(month, i) in months" cols="12" md="3" :key="'skeletion-' + i">
                <v-card>
                    <v-card-title density="compact" color="primary">
                        <div class="text-center">
                            {{ month.text }}
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-skeleton-loader elevation="0" type="image"></v-skeleton-loader>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col v-else cols="12" md="3" v-for="(item, j) in annualCalendarGrid" :key="'month-' + j">
                <v-card>
                    <v-card-title density="compact" color="primary">
                        <div class="text-center">
                            {{ item.month }}
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :loading="loading" class="timeoff timeoff-display" :items="item.calendar"
                            :headers="item.headers">
                            <template v-slot:body="{ items }">
                                <tr v-for="(item, k) in  items" :key="'row-' + k">
                                    <td v-for="(dayGroup, l) in item" :key="'row-' + l"
                                        :colspan="(typeof dayGroup === 'number' || dayGroup === null) ? 1 : (dayGroup as TimeoffGroup).values.length"
                                        class="px-0 text-center">
                                        <v-card elevation="0" v-if="(typeof dayGroup == 'number' || dayGroup == null)"
                                            @click="dayGroup != null ? addAttendance(dayGroup, j) : ''">
                                            <div class="d-flex justify-space-between text-center">
                                                <span class="pa-2 flex-grow-1">{{ dayGroup }}</span>
                                            </div>
                                        </v-card>

                                        <v-card v-else @click="showEditTimeoff((dayGroup as TimeoffGroup).id)"
                                            :color="getColor(dayGroup)" class="px-0">
                                            <div class="d-flex justify-space-between text-center">
                                                <span v-for="(dayOff, m) in (dayGroup as TimeoffGroup).values"
                                                    :key="'dayOff' + m" class="pa-2 flex-grow-1">{{
                        dayOff
                    }}</span>
                                            </div>
                                            <v-tooltip activator="parent" location="bottom">{{
                        getTimeofOption((dayGroup as
                            TimeoffGroup).attendance_leave_type_id)?.name
                    }}</v-tooltip>
                                        </v-card>
                                    </td>
                                </tr>
                            </template>

                            <!-- hide footer -->

                            <template #bottom></template>
                        </v-data-table>
                    </v-card-text>

                </v-card>
            </v-col>
        </v-row>

        <!-- Table Layout -->
        <v-row v-else>
            <v-col v-if="firstLoad">
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
            </v-col>
            <v-col v-else>
                <v-card>
                    <v-card-text>
                        <v-data-table :loading="loading" items-per-page="12" :items="annualCalendarTable.calendar"
                            :headers="(annualCalendarTable.headers as any)" id="timeoffTable" class="timeoff-display">

                            <template v-slot:headers="{ columns }">
                                <tr>
                                    <th><!-- Month Column --></th>
                                    <th v-for="(header, i) in columns" :key="i" :class="[(header as any).class]"
                                        :style="{ width: header.width, }" class="px-0 text-center">
                                        <span class="pa-2 font-weight-bold">{{
                        header.title }}</span>
                                    </th>
                                </tr>
                            </template>

                            <template v-slot:body="{ items }">
                                <tr v-for="(item, i) in  items " :key="i">
                                    <td class="fix px-0 font-weight-bold">
                                        {{ months[i].text }}
                                    </td>
                                    <template v-for="(dayGroup, j) in item" :key="'dayGroup'+j">
                                        <td :colspan="(typeof dayGroup == 'number' || dayGroup == null) ? 1 : (dayGroup as TimeoffGroup).values.length"
                                            class="px-0 text-center">
                                            <v-card elevation="0"
                                                v-if="(typeof dayGroup == 'number' || dayGroup == null)"
                                                @click="dayGroup != null ? addAttendance(dayGroup, i) : ''">
                                                <div class="d-flex justify-space-between text-center">
                                                    <span class="pa-2 flex-grow-1">{{ dayGroup }}</span>
                                                </div>
                                            </v-card>

                                            <v-card v-else @click="showEditTimeoff((dayGroup as TimeoffGroup).id)"
                                                :color="getColor(dayGroup as TimeoffGroup)" class="px-0">
                                                <div class="d-flex justify-space-between text-center">
                                                    <span v-for="(dayOff, k) in (dayGroup as TimeoffGroup).values"
                                                        :key="'dayOff' + k" class="pa-2 flex-grow-1">{{
                        dayOff
                    }}</span>
                                                </div>
                                                <v-tooltip activator="parent" location="bottom">{{
                                                    getTimeofOption((dayGroup as
                                                    TimeoffGroup).attendance_leave_type_id)?.name
                                                    }}</v-tooltip>
                                            </v-card>
                                        </td>
                                    </template>
                                </tr>
                            </template>

                            <!-- hide footer -->

                            <template #bottom></template>
                        </v-data-table>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.fix {
    position: sticky;
    background: white;
    left: 0;
    z-index: 4;
    border-right: thin solid rgba(var(--v-theme-primary), var(--v-border-opacity)) !important;
}

#timeoffTable.v-data-table :deep() table th {
    border-bottom: thin solid rgba(var(--v-theme-primary), var(--v-border-opacity)) !important;
}

.timeoff.v-data-table :deep() table td {
    border-bottom: none !important;
}

.timeoff.v-data-table :deep() table td,
.timeoff.v-data-table :deep() table th {
    padding: 0 0 !important;
}

.timeoff-display.v-data-table :deep() table th {
    font-size: 10px !important;
}
</style>