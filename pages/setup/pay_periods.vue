<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePayPeriodStore } from '@/stores/settings/attendance/pay_period';
import type { PayPeriodInfo } from '@/types/attendance/pay_period';

const payPeriodStore = usePayPeriodStore();
const { payPeriodList, loading } = storeToRefs(payPeriodStore);

onMounted(() => {
    payPeriodStore.fetchPayPeriodList();
});
const layoutStore = useLayoutStore()

const payPeriodHeaders = ref([
    { title: 'ID', key: 'id' },
    { title: 'Start Date', key: 'start_date' },
    { title: 'End Date', key: 'end_date' },
    { title: 'Actions', key: 'actions', sortable: false },
]);

const editedPayPeriod = ref<PayPeriodInfo>({});
const updatingPayPeriod = ref(false);
const PayPeriodDialog = ref(false);
const IncrementPeriodDialog = ref(false);
const selectedIncrementUntil = ref<string | null>(null);

const editPayPeriod = (pay_period: PayPeriodInfo) => {
    editedPayPeriod.value = { ...pay_period };
    updatingPayPeriod.value = true;
    PayPeriodDialog.value = true;
};

const deletePayPeriod = async (pay_period_id: number) => {
  const payPeriod = payPeriodList.value.find(p => p.id === pay_period_id);
  if (payPeriod && Date.parse(payPeriod.end_date ?? '') < new Date().getTime()) {
    // The period has already passed, refusing to delete
    layoutStore.showErrorDialog("Impossible to delete a pay period that has already passed.");
    return;
  }
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this pay period ?");
  if (confirm) {
    payPeriodStore.deletePayPeriod(pay_period_id);
  }
}

const updatepayPeriodDialog = (value: boolean) => {
    PayPeriodDialog.value = value;
    editedPayPeriod.value = {};
    updatingPayPeriod.value = false;
};

const openIncrementPeriodDialog = (incrementUntil: string) => {
    selectedIncrementUntil.value = incrementUntil;
    IncrementPeriodDialog.value = true;
};

const formatDateTime = (dateTimeStr: string | null): string => {
    if (!dateTimeStr) {
        return 'N/A';
    }

    const dateParts = dateTimeStr.split('-');
    const date = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10)
    );

    if (isNaN(date.getTime())) {
        return 'Invalid date-time value';
    }

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
};

const periodsByIncrementUntil = computed(() => {
    return payPeriodList.value.filter(
        period => period.increment_until === selectedIncrementUntil.value
    );
});
</script>

<template>
    <div>
        <AttendanceSettingsPayPeriodDialog :show="PayPeriodDialog" @update:show="updatepayPeriodDialog"
            :updating="updatingPayPeriod" :item="editedPayPeriod" />
        <SharedUiCustomTable return-object :show-footer-in-head="false" :headers="payPeriodHeaders"
            :items="payPeriodList" :loading="loading">
            <template v-slot:item.actions="{ item }">
                <div>
                    <!-- <v-icon color="primary" dense @click="editPayPeriod(item)">mdi-pencil</v-icon> -->
                    <v-icon color="red" dense @click="deletePayPeriod(item.id)">mdi-delete</v-icon>
                </div>
            </template>
            <template v-slot:item.start_date="{ item }">
                {{ formatDateTime(item.start_date) }}
            </template>
            <template v-slot:item.end_date="{ item }">
                {{ formatDateTime(item.end_date) }}
            </template>
        </SharedUiCustomTable>

        <!-- <v-dialog v-model="IncrementPeriodDialog" persistent max-width="800px">
            <v-card>
                <v-toolbar color="primary" :title="`${'Periods until ' + selectedIncrementUntil}`" density="compact">
                    <v-spacer></v-spacer>
                    <v-btn icon @click="IncrementPeriodDialog = false">
                        <v-icon>mdi-window-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-data-table :items="periodsByIncrementUntil" :headers="payPeriodHeaders" />
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" text @click="IncrementPeriodDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
    </div>
</template>

<style scoped></style>