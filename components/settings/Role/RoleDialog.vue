<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Role
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
        <v-form ref="roleForm">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-text-field v-model="roleInfo.name" variant="solo" flat label="Role Name" density="compact"
                    :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="12" class="pb-0">
                  <v-textarea v-model="roleInfo.description" variant="solo" flat label="Role Description"
                    density="compact" :rules="[rules.required]"></v-textarea>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item :value="2">
              <v-card flat>
                <v-row>
                  <v-col cols="4">
                    <v-card-title>Module</v-card-title>
                    <v-divider></v-divider>
                    <div style="overflow-y: auto; max-height:400px;">
                      <div class="d-flex align-center" v-for="(item, i) in Object.keys(roleInfo.permissions)" :key="i">
                        <v-checkbox-btn hide-details color="primary"
                          v-model="roleInfo.permissions[item].value"></v-checkbox-btn>
                        <v-btn :color="selectedModule == item ? 'primary' : ''" density="compact" variant="text"
                          class="text-none" :disabled="!roleInfo.permissions[item].value"
                          @click="selectedModule = item">{{
                            roleInfo.permissions[item].title }}</v-btn>
                      </div>
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col cols="8">
                    <v-card-title>{{ roleInfo.permissions[selectedModule]?.title }} Permissions</v-card-title>
                    <v-divider></v-divider>
                    <SharedTreeView style="overflow-y: auto; max-height:400px;" v-if="selectedModule != null"
                      :items="roleInfo.permissions[selectedModule]?.permissions"
                      :activated="roleInfo.permissions[selectedModule].value" />
                    <div v-else class="text-center">Click on an active module to set its permissions</div>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>
          </v-window>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="dialog = false">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 2" color="primary" @click="step += 1">Next<v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>
        <v-btn v-if="step == 2" color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, computed, toRefs, watch } from 'vue'
import type { RoleInfo } from '@/types/store/role'
import { useRoleStore } from '~/stores/role';
import { userPermissions } from "~/data/permissions";

const emit = defineEmits(['update:show', 'addRole', 'editRole'])

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
  updating: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: false
  },
});

const step = ref(1)

const selectedModule = ref<string | null>(null)

const roleForm = ref(null)

const roleListStore = useRoleStore()

const defaultRole = ref<RoleInfo>({
  id: null,
  name: null,
  description: null,
  permissions: deepCopy(userPermissions)
})

const roleInfo = ref<RoleInfo>(deepCopy(defaultRole.value))

const title = computed(() => {
  return props.updating ? 'Role Info' : 'Create Role'
})

function deepCopy(item: Object): Object {
  return JSON.parse(JSON.stringify(item))
}

const dialog = computed({
  get() {
    return props.show
  },
  set(newValue) {
    emit('update:show', newValue);
  }
})

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Save'
})

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = () => {
  if (props.updating) {
    roleListStore.updateRole(roleInfo.value);
  } else {
    roleListStore.createRole(roleInfo.value)
  }
  dialog.value = false;
};


const resetForm = () => {
  if (roleForm.value) {
    (roleForm.value as HTMLFormElement).reset(); // Reset the form
  }
  roleInfo.value = deepCopy(defaultRole.value)
  step.value = 1
}

watch(dialog, (val) => {
  if (val && props.updating) {
    roleInfo.value = props.item
  } else {
    // stopInfo.value = defaultRole.value
    resetForm()
  }
})
</script>

<style scoped>
</style>