<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { TrailerInfo } from '~/types/dispatch/trailer';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const trailerStore = useTrailerStore()


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

const trailerForm: Ref<HTMLFormElement | null> = ref(null);
const trailer = ref<TrailerInfo>({})

const title = computed(() => {
  if (props.bulkUpdating) {
    return "Bulk Update Trailers"
  }

  return props.updating ? 'Trailer Info' : 'Add Trailer'
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
  if (trailerForm.value) {
    const formStatus = await trailerForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from sop
      let updateData = Object.fromEntries(
        Object.entries(trailer.value).filter(([key,value])=>value !== null)
      )

      const { success, error } = await trailerStore.bulkUpdateTrailer({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        trailerStore.updateTrailer(trailer.value);
      } else {
        trailerStore.createTrailer(trailer.value)
      }
    }

    dialog.value = false;
  }
};

const resetForm = () => {
  if (trailerForm.value) {
    (trailerForm.value as HTMLFormElement).reset(); // Reset the form
  }
  trailer.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    trailer.value = props.item as TrailerInfo
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
        Add Trailer
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
        <v-form ref="trailerForm">
          <v-row>
            <v-col cols="12" md="8" class="pb-0">
              <v-text-field label="Name" v-model="trailer.name" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="License Plate" v-model="trailer.license_plate" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Make" v-model="trailer.make" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Model" v-model="trailer.model" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Year" v-model="trailer.year" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="VIN" v-model="trailer.vin" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field label="Serial" v-model="trailer.serial" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
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
