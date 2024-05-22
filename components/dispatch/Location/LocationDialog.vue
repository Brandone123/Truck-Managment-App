<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { DispatchLocationInfo } from '~/types/dispatch/location';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const dispatchLocationStore = useDispatchLocationStore()


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
    type: Array<Number>,
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

const dispatchLocationForm: Ref<HTMLFormElement | null> = ref(null);
const dispatchLocation = ref<DispatchLocationInfo>({})

const title = computed(() => {
  if (props.bulkUpdating) {
    return "Bulk Update Locations"
  }

  return props.updating ? 'Location Info' : 'Add Location'
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
  if (dispatchLocationForm.value) {
    const formStatus = await dispatchLocationForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from sop
      let updateData = Object.fromEntries(
        Object.entries(dispatchLocation.value).filter(([key,value])=>value !== null)
      )

      const { success, error } = await dispatchLocationStore.bulkUpdatedispatchLocation({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        dispatchLocationStore.updateDispatchLocation(dispatchLocation.value);
      } else {
        dispatchLocationStore.createDispatchLocation(dispatchLocation.value)
      }
    }

    dialog.value = false;
  }
};

const resetForm = () => {
  if (dispatchLocationForm.value) {
    (dispatchLocationForm.value as HTMLFormElement).reset(); // Reset the form
  }
  dispatchLocation.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    dispatchLocation.value = props.item as DispatchLocationInfo
  } else {
    resetForm()
  }
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Location
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
        <v-form ref="dispatchLocationForm">
          <v-row>
            <v-col cols="12" md="8" class="pb-0">
              <v-text-field label="Name" v-model="dispatchLocation.Name" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Location Code" v-model="dispatchLocation.LocationCode" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="City" v-model="dispatchLocation.City" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="State" v-model="dispatchLocation.State" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Country Code" v-model="dispatchLocation.CountryCode" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Address Line" v-model="dispatchLocation.AddressLine" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Address Line 2" v-model="dispatchLocation.AddressLine_2" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Postal Code" v-model="dispatchLocation.PostalCode" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="Contact " v-model="dispatchLocation.contact" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="Phone" v-model="dispatchLocation.phone" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="Longitude" v-model="dispatchLocation.longitude" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : []"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field label="Latitude" v-model="dispatchLocation.latitude" variant="solo" flat density="compact"
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
