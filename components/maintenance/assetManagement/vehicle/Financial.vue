<template>
    <v-col cols="12" sm="6">
        <div>
            <v-card>
                <v-card-title class="d-flex justify-space-between">
                    <span class="text-h7 font-weight-bold text-primary">Lifecycle Details</span>
                    <v-btn color="primary" density="comfortable" variant="tonal" @click="saveLifeCycle">Save</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form ref="lifeCycleForm">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.in_service_date" :rules=[validation.required]
                                    variant="outlined" density="compact" label="In-Service Date*"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.in_service_odometer" :rules=[validation.required]
                                    variant="outlined" density="compact" label="In-Service Odometer*"
                                    type="number"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.estimated_service_life_in_months"
                                    :rules=[validation.required] variant="outlined" density="compact"
                                    label="Estimated Service Life*" type="number">
                                    <template v-slot:append-inner>
                                        <span class="font-weight-bold" style="font-size: 12px">Months</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.estimated_service_life_in_miles" variant="outlined"
                                    density="compact" label="Estimated Service Life*" :rules=[validation.required]
                                    type="number">
                                    <template v-slot:append-inner>
                                        <span class="font-weight-bold" style="font-size: 12px">Miles</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.estimated_resale_value" variant="outlined"
                                    density="compact" label="Estimated Resale Value" type="number">
                                    <template v-slot:prepend-inner>
                                        <span class="font-weight-bold">$</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.out_of_service_odometer" variant="outlined"
                                    density="compact" label="Out-of-Service Odometer" type="number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="lifecycle.out_of_service_date" variant="outlined"
                                    density="compact" label="Out-of-Service Date"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>

                </v-card-text>
            </v-card>

            <v-card class="mt-3">
                <v-card-title class="d-flex justify-space-between">
                    <span class="text-h7 font-weight-bold text-primary">Purchase Details</span>
                    <v-btn color="primary" density="comfortable" variant="tonal"
                        @click="savePurchaseDetails">Save</v-btn>
                </v-card-title>

                <v-card-text>
                    <v-form ref="purchaseDetailsForm">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.acquisition_type" :rules=[validation.required]
                                    variant="outlined" density="compact" label="Acquisition Type*"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.acquisition_vendor_name" variant="outlined"
                                    density="compact" label="Acquisition Vendor Name*" :rules=[validation.required]>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.acquisition_date" :rules=[validation.required]
                                    variant="outlined" density="compact" label="Acquisition Date*"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.acquisition_end_date"
                                    :rules=[validation.required] variant="outlined" density="compact"
                                    label="Acquisition End Date*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="purchaseDetails.acquisition_notes" :rules=[validation.required]
                                    variant="outlined" density="compact" label="Acquisition Notes*">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.purchase_vendor_name"
                                    :rules=[validation.required] variant="outlined" density="compact"
                                    label="Purchase Vendor Name*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.purchase_date" :rules=[validation.required]
                                    variant="outlined" density="compact" label="Purchase Date*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.purchase_price" :rules=[validation.required]
                                    variant="outlined" density="compact" label="Purchase Price*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.purchase_meter_value"
                                    :rules=[validation.required] variant="outlined" density="compact"
                                    label="Purchase Meter Value*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.warranty_expiration_date"
                                    :rules=[validation.required] variant="outlined" density="compact"
                                    label="Waranty Expiration Date*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="purchaseDetails.warranty_expiration_meter_value"
                                    :rules=[validation.required] variant="outlined" density="compact"
                                    label="Waranty Expiration Meter Value*">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="purchaseDetails.purchase_comment" :rules=[validation.required]
                                    variant="outlined" density="compact" label="Purchase Comment*">
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

            </v-card>
        </div>
    </v-col>

    <v-col cols="12" sm="6">
        <v-card>
            <v-card-title class="d-flex justify-space-between">
                <span class="text-h7 font-weight-bold text-primary">Loan/Lease Details</span>
                <v-btn color="primary" density="comfortable" variant="tonal" @click="saveLoanLease">Save</v-btn>
            </v-card-title>

            <v-card-text>
                <v-form ref="loanLeaseForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.loan_amount" :rules=[validation.required]
                                variant="outlined" density="compact" label="Loan Amount*"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.monthly_cost" variant="outlined" density="compact"
                                label="Monthly Cost*" :rules=[validation.required]>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.annual_percentage_rate" :rules=[validation.required]
                                variant="outlined" density="compact" label="Annual Percentage Rate*"></v-text-field>
                        </v-col>


                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.capitalized_cost" :rules=[validation.required]
                                variant="outlined" density="compact" label="Capitalized Cost*">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.down_payment_amount" :rules=[validation.required]
                                variant="outlined" density="compact" label="Down Payment Amount*">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.first_payment_date" :rules=[validation.required]
                                variant="outlined" density="compact" label="First Payment Date*">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.number_of_payments" :rules=[validation.required]
                                variant="outlined" density="compact" label="Number Of Payments*">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.residual_value" :rules=[validation.required]
                                variant="outlined" density="compact" label="Residential Value*">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="loanLease.acquisition_lender_name" :rules=[validation.required]
                                variant="outlined" density="compact" label="Acquisition Lender Name*">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>


        </v-card>
    </v-col>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import 'apexcharts/dist/apexcharts.css';

import type { Asset, LifeCycleDetails, Purchase, LoanLease } from '~/types/maintenance/assetTypes';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
    item: {
        type: Object as PropType<Asset>,
        require: true,
        default: {} as Asset
    }
})

const emit = defineEmits(['save'])

const lifeCycleForm = ref<HTMLFormElement | null>(null)
const purchaseDetailsForm = ref<HTMLFormElement | null>(null)
const loanLeaseForm = ref<HTMLFormElement | null>(null)

const lifecycle = ref<Partial<LifeCycleDetails>>(JSON.parse(JSON.stringify(props.item.lifecycle_details || {})) as Partial<LifeCycleDetails>)

const purchaseDetails = ref<Partial<Purchase>>(JSON.parse(JSON.stringify(props.item.purchase_details || {})) as Partial<Purchase>)

const loanLease = ref<Partial<LoanLease>>(JSON.parse(JSON.stringify(props.item.loan_lease_details || {})) as Partial<LoanLease>)

const saveLifeCycle = async () => {
    const formStatus = await lifeCycleForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { lifecycle_details: lifecycle.value });
};

const savePurchaseDetails = async () => {
    const formStatus = await purchaseDetailsForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { purchase_details: purchaseDetails.value });
};


const saveLoanLease = async () => {
    const formStatus = await loanLeaseForm.value?.validate() || false
    if (!formStatus.valid) {
        return
    }
    emit('save', { loan_lease_details: loanLease.value });
};

</script>