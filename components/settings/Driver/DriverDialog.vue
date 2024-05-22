<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { DriverInfo } from '~/types/store/driver';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const driverStore = useDriverStore()
const { driverList } = storeToRefs(driverStore)

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
  updating: {
    type: Boolean,
    default: false
  },
  bulkUpdating: {
    type: Boolean,
    default: false,
  },
  bulkUpdateIds: {
    type: Array<number>,
    default: []
  },
  show: {
    type: Boolean,
    default: false
  }
});

const dialog = computed({
  get() {
    return props.show
  },
  set(newValue) {
    emit('update:show', newValue);
  }
})

const driverForm: Ref<HTMLFormElement | null> = ref(null);
const driver = ref<DriverInfo>({
    id: null,
    user_id: null,
    name: null,
    phone: null,
    email: null,
    license_number: null,
    license_state: null,
    samsara_status: null,
    category: null,
    cdl_expiration: null,
    mvr_due: null,
    hazmat_expiration: null,
    physical_due: null,
})

const driverWithEmail = computed(() => {
  const driverId = driver.value.id;
  const driverItem = driverList.value.find(driver => driver.id === driverId);
  return driverItem && driverItem.user ? driverItem.user.email : null;
});

const title = computed(() => {
  if (props.bulkUpdating) {
    return "Bulk Update Drivers"
  }

  return props.updating ? 'Driver Info' : 'Add Driver'
})

const saveButtonText = computed(() => {
  return (props.updating || props.bulkUpdating) ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = async () => {
  if (driverForm.value) {
    const formStatus = await driverForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from sop
      let updateData = Object.fromEntries(
        Object.entries(driver.value).filter(([key,value])=>value !== null)
      )

      driverStore.bulkUpdatedriver({ ids: props.bulkUpdateIds, data: updateData })
      // if (data) {
        emit('bulkActionSuccess')
      // }
    }
    else {
      if (props.updating) {
        driverStore.updateDriver(driver.value);
      } else {
        driverStore.createDriver(driver.value)
      }
    }

    dialog.value = false;
  }
};

const resetForm = () => {
  if (driverForm.value) {
    (driverForm.value as HTMLFormElement).reset(); // Reset the form
  }
}

watch(dialog, (val) => {
  if (val && props.updating) {
    driver.value = props.item as DriverInfo
    driver.value.email = driverWithEmail.value
  } else {
    resetForm()
  }
})

watch(() => driver.value.email, (newEmail, oldEmail) => {
  driver.value.email = newEmail;
});

</script>

<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Driver
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" :title="title" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="driverForm">
          <v-row>
            <v-col cols="12" md="8" class="pb-0">
              <v-text-field label="Name" v-model="driver.name" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-select label="Status" v-model="driver.samsara_status" :items='[{text:"Active",value: "active"},{text:"Inactive",value: "inactive"}]' item-title="text" item-value="value" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-select>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="Phone" v-model="driver.phone" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-select label="Category" v-model="driver.category" :items='["Employee","Independent Contractor"]' variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] :[rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-select>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="Email" v-model="driver.email" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="License Number" v-model="driver.license_number" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="License State" v-model="driver.license_state" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-text-field  type="date" label="CDL Expiration" v-model="driver.cdl_expiration" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-text-field  type="date" label="MVR Due" v-model="driver.mvr_due" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-text-field  type="date" label="Hazmat Expiration " v-model="driver.hazmat_expiration" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-text-field type="date" label="Physical Due" v-model="driver.physical_due" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
