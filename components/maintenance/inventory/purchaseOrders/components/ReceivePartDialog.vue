<template>
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
        <v-card>
            <v-toolbar color="primary" dark density="compact">
                <v-toolbar-title>Receive items from PO #{{ purchaseOrder.id }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <p>Check the box to receive parts into inventory.</p>
                <v-form ref="purchasOrderPartsForm">
                    <v-table>
                        <thead>
                            <tr>
                                <th>
                                    <v-checkbox color="primary" v-model="acceptAllItems" hide-details></v-checkbox>
                                </th>
                                <th>Item</th>
                                <th>Total Received</th>
                                <th>Total Ordered</th>
                                <th>Receive</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in localPurchaseOrderParts" :key="index"
                                :class="inventoryItems[item!.id] ? '' : 'grey-background'">
                                <td>
                                    <v-checkbox color="primary" v-model="inventoryItems[item!.id]"
                                        hide-details></v-checkbox>
                                </td>
                                <td variant="outlined" flat density="compact">{{ item?.id }}</td>
                                <td variant="outlined" flat density="compact" type="number">
                                    {{ item?.purchase_details.quantity_received ?? 0 }}
                                </td>
                                <td variant="outlined" flat density="compact" type="number">
                                    {{ item?.purchase_details.quantity_ordered ?? 0 }}
                                </td>
                                <td>
                                    <v-text-field v-model.number="inventoryValues[item!.id]" type="number" class="mt-4"
                                        variant="outlined" flat density="compact" :max="getMaxQuantity(item)"
                                        :min="[validator.minNumber(1)]" :disabled="!inventoryItems[item!.id]"
                                        :rules="[validator.maxNumber(getMaxQuantity(item))]">
                                    </v-text-field>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn text @click="dialog = false">Close</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submitReceive">Receive</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { PurchaseOrder, PurchasePart } from '~/types/maintenance/purchaseOrderTypes';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
    purchaseOrder: {
        type: Object as PropType<Partial<PurchaseOrder>>,
        required: true,
        default: () => ({}),
    },
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const validator = useValidation();
const inventoryItems = ref<Record<string, any>>({});
const inventoryValues = ref<Record<string, any>>({});

const acceptAllItems = ref<boolean>(false);
const emit = defineEmits(['close', 'save', 'update:modelValue']);

const dialog = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});

const localPurchaseOrderParts = ref<Partial<PurchasePart[]>>(JSON.parse(JSON.stringify(props.purchaseOrder?.parts ?? [])));

watch(() => dialog.value, (newValue) => {
    if (newValue) {
        localPurchaseOrderParts.value = JSON.parse(JSON.stringify(props.purchaseOrder?.parts ?? []));
        localPurchaseOrderParts.value.forEach((item) => {
            item.inputQuantity = 0;
            inventoryItems.value = {};
            inventoryValues.value = {};
        });
    }
});


const getMaxQuantity = (item: PurchasePart) => {
    if (!item.purchase_details) {
        return 0;
    }
    return item.purchase_details.quantity_ordered - (item.purchase_details.quantity_received ?? 0);
};

watch(() => inventoryItems.value, (newValue) => {
    Object.keys(newValue).forEach((key) => {
        if (newValue[key]) {
            // Add to inventoryValues when selected
            inventoryValues.value[key] = null
        } else {
            delete inventoryValues.value[key];
        }
    });
});

watch(() => acceptAllItems.value, (value) => {
    localPurchaseOrderParts.value.forEach((item) => {
        inventoryItems.value[item.id] = value;
        if (!value) {
            delete inventoryValues.value[item.id];
        } else {
            inventoryValues.value[item.id] = null;
        }
    });
});

const purchasOrderPartsForm = ref<HTMLFormElement | null>(null);

const submitReceive = async () => {
    const formStatus = await purchasOrderPartsForm.value?.validate();
    if (!formStatus.valid && Object.keys(inventoryValues.value).length === 0) {
        return;
    }

    const payload = {
        id: props.purchaseOrder.id,
        purchase_details: Object.entries(inventoryValues.value).map(([key, value]) => {
            return {
                part_id: parseInt(key),
                quantity_received: value,
            }
        }),
    };

    emit('save', payload);
    dialog.value = false;
};
</script>
