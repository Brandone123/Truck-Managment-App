<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="serviceTaskForm">
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="localServiceTask.name" label="Name" variant="outlined" flat
                            density="compact" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea v-model="localServiceTask.description" label="Description" variant="outlined" flat
                            density="compact" required hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-checkbox v-model="localServiceTask.is_group" label="Service Task Group" color="primary"></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-card class="mt-5 py-5">
                    <v-card-title class="font-weight-bold">Expected Labour Hours</v-card-title>
                    <v-card-text>
                      <v-text-field v-model="localServiceTask.expected_labor_hours" variant="outlined" density="compact"
                        type="search" placeholder="0" suffix="hr" color="success">{{
                        }}</v-text-field>
                      <v-row class="ga-2 ml-1">
                        <v-chip @click="selectExpectedLabourHours(labor_hour.value)"
                          v-for="(labor_hour, index) in labor_hours" :key="index" class="grey" style="cursor: pointer"
                          density="comfortable">{{ labor_hour.title }}</v-chip>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card v-if="localServiceTask.is_group">
                <v-card-title>Sub Tasks</v-card-title>
                <v-card-text>
                  <v-col cols="12">
                    <SharedInputServiceTaskAutoCompleteInput chips closable-chips multiple variant="outlined" flat
                      v-model="localServiceTask.subtask_ids" label="Sub Tasks" />
                  </v-col>
                </v-card-text>
              </v-card>
              <v-card v-else>
                <v-card-title class="font-weight-bold">Parts</v-card-title>
                <v-card-text>
                  <SharedInputPartNumberAutoCompleteInput variant="outlined" flat density="compact"
                    label="Select A Part*" @selection="updateSelectedPart" />
                  <v-col v-if="serviceTaskPartList?.length > 0" cols="12">
                    <v-row>
                      <v-col cols="12" sm="3">Part</v-col>
                      <v-col cols="12" sm="4">Location</v-col>
                      <v-col cols="12" sm="4">Quantity</v-col>
                      <v-col cols="12" sm="1">{{}}</v-col>
                    </v-row>
                    <v-row v-for="(part, index) in serviceTaskPartList" :key="index">
                      <v-col cols="12" sm="3">
                        <div class="d-flex">
                          <v-col cols="12" sm="3">
                            <div class="rounded position-relative" style="
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 28px;
                                height: 28px;
                                background-color: grey;
                                color: white;
                                text-align: center;
                                position: relative;
                              ">
                              <span style="font-size: xx-small">
                                {{
                                  part?.part_number
                                    ?.slice(0, 4)
                                    .toUpperCase()
                                }}
                              </span>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="5">
                            <span @click="viewDetails(part?.id)" class="text-primary mr-5" style="
                                cursor: pointer;
                                border-bottom: 1px dotted;
                                justify-content: center;
                                align-items: center;
                                text-align: center;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                              ">
                              {{ part?.part_number }}
                            </span>
                          </v-col>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-select :items="part.locations" v-model="part.part_location_id" item-title="location_name"
                          item-value="location_id" label="Part Location" variant="outlined" flat density="compact"
                          :rules="[validation.required]"></v-select>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field label="Quantity" variant="outlined" v-model="part.quantity" flat density="compact"
                          type="number" :rules="[validation.required, validation.minNumber(1)]"></v-text-field>
                      </v-col>
                      <v-col @click="removePart(index)" cols="12" sm="1" class="justify-center text-center">
                        <v-btn variant="tonal" dark color="red" class="ml-1" icon="mdi-trash-can-outline"></v-btn>
                      </v-col>
                      <v-divider></v-divider>
                    </v-row>
                  </v-col>
                </v-card-text>
              </v-card>

            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveServiceTask">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { defineProps, defineEmits } from "vue";
import type { ServiceTask } from "~/types/maintenance/serviceTaskTypes";
import { useValidation } from "~/composables/formValidation";
import type { Part } from "~/types/maintenance/workOrder";
import type { Location } from "~/types/maintenance/partSupplyTypes";

const props = defineProps({
  modelValue: Boolean,
  serviceTask: {
    type: Object as PropType<Partial<ServiceTask>>,
    required: true,
  },
});

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const serviceTaskForm = ref<HTMLFormElement | null>(null);
const selectedPart = ref<Partial<Part>>({});
const serviceTaskPartList = ref<Part[]>([])
const selectedLocations = ref<Location[]>([]);

const validation = useValidation();
const router = useRouter();

const emit = defineEmits(["update:modelValue", "save"]);

const localServiceTask = ref<Partial<ServiceTask>>(
  JSON.parse(JSON.stringify(props.serviceTask || {}))
);

watch(
  () => props.serviceTask,
  (newServiceTask) => {
    localServiceTask.value = { ...newServiceTask };
    localServiceTask.value.subtask_ids = newServiceTask?.subtasks?.map((subtask: ServiceTask) => subtask.id) as number[];
    serviceTaskPartList.value = newServiceTask?.parts?.length > 0 ? newServiceTask?.parts?.map((part) => { return { ...part, part_location_id: part.pivot.part_location_id, quantity: part.pivot.quantity } }) as any[] : []
  }
);

const title = computed(() =>
  props.serviceTask && props.serviceTask.id
    ? "Edit Service Task"
    : "Add Service Task"
);

const updateModelValue = (value: boolean) => {
  emit("update:modelValue", value);
};

const closeDialog = () => {
  emit("update:modelValue", false);
  serviceTaskPartList.value = []
};

const saveServiceTask = async () => {

  const formStatus = await serviceTaskForm.value?.validate();
  if (!formStatus.valid) {
    return
  }

  const task_part_data = serviceTaskPartList.value.map((part) => {
    return { part_id: part.id, part_location_id: part.part_location_id, quantity: part.quantity }
  })
  const payload = {
    id: localServiceTask.value.id,
    description: localServiceTask.value.description,
    expected_labor_hours: localServiceTask.value.expected_labor_hours,
    name: localServiceTask.value.name,
    is_group: localServiceTask.value.is_group ? true : false,
    subtask_ids: localServiceTask.value.is_group ? localServiceTask.value.subtask_ids : undefined,
    task_part_data: localServiceTask.value.is_group ? undefined : task_part_data

  }
  emit("save", payload);
  closeDialog()
};

const selectExpectedLabourHours = (time: any) => {
  localServiceTask.value.expected_labor_hours = time / 60;
};

const updateSelectedPart = (part: Part) => {
  selectedPart.value = part;
  selectedLocations.value = part.locations as Location[];

  serviceTaskPartList.value?.unshift(part)

};

const removePart = (partIndex: number) => {
  serviceTaskPartList.value?.splice(partIndex, 1)
}
const viewDetails = (partId: number) => {
  router.push(`PartSupplyTrackingPage/${partId}`);
};
const labor_hours = [
  { title: "15m", value: 15 },
  { title: "30m", value: 30 },
  { title: "45m", value: 45 },
  { title: "1h", value: 60 },
  { title: "2h", value: 120 },
  { title: "3h", value: 180 },
  { title: "4h", value: 240 },
];
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>
