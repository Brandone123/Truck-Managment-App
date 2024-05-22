<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { FrequentlyAskedQuestionInfo } from '~/types/store/frequently_asked_question';

const emit = defineEmits(['update:show'])

const frequentlyAskedQuestionStore = useFAQStore()

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

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

const FAQForm: Ref<HTMLFormElement | null> = ref(null);
const FAQ = ref<FrequentlyAskedQuestionInfo>({})

const title = computed(() => {
  return props.updating ? 'FAQ Info' : 'Add FAQ'
})

const saveButtonText = computed(() => {
  return props.updating ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = async () => {
  if (FAQForm.value) {
    const formStatus = await FAQForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.updating) {
      frequentlyAskedQuestionStore.updateFAQ(FAQ.value);
    } else {
      frequentlyAskedQuestionStore.createFAQ(FAQ.value)
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  if (FAQForm.value) {
    (FAQForm.value as HTMLFormElement).reset(); // Reset the form
  }
  FAQ.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    FAQ.value = props.item as FrequentlyAskedQuestionInfo
  } else {
    resetForm()
  }
})
</script>

<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add FAQ
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
        <v-form ref="FAQForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="FAQ.department_id" :items="departmentList" variant="solo" flat label="Department"
                density="compact" :rules="[rules.required]" item-title="name" item-value="id"
                :readonly="updating"></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Question" v-model="FAQ.question" variant="solo" flat density="compact"
                :rules="[rules.required]"></v-textarea>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Answer" v-model="FAQ.answer" variant="solo" flat density="compact"
                :rules="[rules.required]"></v-textarea>
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
</template>~/types/store/frequently_asked_question
