<template>
  <div>
    <!-- Message si aucun formulaire n'est disponible -->
    <div v-if="!form || form.length === 0" class="text-center">
      <v-card>
        <v-card-text>
          <v-icon size="60" color="grey">mdi-file-document-outline</v-icon>
          <p>No form elements available for this job.</p>
        </v-card-text>
      </v-card>
    </div>

    <!-- Affichage du formulaire -->

    <v-card v-else>
      <v-card-text>
        <v-form ref="applicationForm">
          <v-row>
            <v-col cols="12" v-for="(item, index) in (form as any[])" :key="index" class="pt-0">
              <div v-if="item.type == 'free_text'">
                <h3 class="text-h5 py-0">{{ item.label }}</h3>
                <QuillPreview :html="item.description || ''" />
              </div>
              <!-- En-tête de chaque élément -->
              <!-- Affichage des différents types d'éléments -->
              <!-- Section -->
              <div v-else-if="item.type === 'section'" class="py-0">
                <h3 class="text-h5 py-0">{{ item.label }}</h3>
                <v-divider></v-divider>
                <p class="text-grey text-caption py-0">{{ item.description }}</p>
              </div>
              <!-- <div> -->
              <!-- Texte libre -->
              <v-text-field v-else-if="item.type === 'text_input'" v-model="responses[item.id]"
                :label="`${item.label} ${item.required ? ' *' : ''}`"
                :rules="item.required ? [validation.required] : []" :required="item.required" variant="outlined"
                density="comfortable" class="py-0" />

              <!-- Nombre -->
              <v-text-field v-else-if="item.type === 'number'" v-model="responses[item.id]"
                :label="`${item.label} ${item.required ? ' *' : ''}`" :placeholder="item.placeholder || 'Tipe a number'"
                type="number" :rules="item.required ? [validation.required] : []" :required="item.required"
                variant="outlined" density="comfortable" class="mt-0 mb-1" />

              <!-- Radio -->
              <v-radio-group v-else-if="item.type === 'radio'" v-model="responses[item.id]" density="comfortable"
                :label="`${item.label} ${item.required ? ' *' : ''}`"
                :rules="item.required ? [validation.required] : []" :required="item.required" class="mt-0 mb-1">
                <v-radio v-for="(option, i) in item.options" :key="i" :label="option.text" :value="option.text"
                  color="primary" />
              </v-radio-group>

              <!-- Checkbox -->
              <div v-else-if="item.type === 'checkbox'">
                <h3> {{ `${item.label} ${item.required ? ' *' : ''}` }}</h3>
                <v-checkbox v-model="responses[item.id]" v-for="(option, index) in item.options" :key="index"
                  :label="option.text" :value="option.text" color="primary" density="compact" hide-details />
              </div>

              <!-- Dropdown -->
              <v-select v-else-if="item.type === 'dropdown'" v-model="responses[item.id]"
                :rules="item.required ? [validation.required] : []"
                :items="item.choices.map((choice: any) => choice.text)"
                :label="`${item.label} ${item.required ? ' *' : ''}`" variant="outlined" density="comfortable"
                class="mt-0 mb-1"></v-select>

              <!-- Date/Heure -->
              <v-text-field v-else-if="item.type === 'date'" v-model="responses[item.id]"
                :label="`${item.label} ${item.required ? ' *' : ''}`"
                :rules="item.required ? [validation.required] : []" :required="item.required" :date="item.date"
                type="date" class="mt-0 mb-1" variant="outlined" density="comfortable" />

              <!-- Date/Heure -->
              <v-text-field v-else-if="item.type === 'time'" v-model="responses[item.id]"
                :label="`${item.label} ${item.required ? ' *' : ''}`"
                :rules="item.required ? [validation.required] : []" :required="item.required" :time="item.time"
                type="time" class="mt-0 mb-1" variant="outlined" density="comfortable" />

              <!-- Grille à choix multiple -->
              <div v-else-if="item.type === 'multiple_choice_grid'" class="d-flex flex-wrap">
                <p class="text-grey text-caption mb-1">
                  {{ item.label }}
                </p>
                <div class="d-flex flex-column">
                  <template v-for="(option, i) in item.options" :key="i">
                    <v-checkbox v-model="responses[item.id]" :label="option" :value="option" density="comfortable" />
                  </template>
                </div>
              </div>

              <!-- Échelle linéaire -->
              <v-slider v-else-if="item.type === 'linear_scale'" density="comfortable" v-model="responses[item.id]"
                :label="`${item.label} ${item.required ? ' *' : ''}`" :min="item.min || 1" :max="item.max || 5"
                show-ticks :rules="item.required ? [validation.required] : []" :required="item.required" color="primary"
                thumb-label />




              <!-- file upload -->
              <div v-else-if="item.type == 'file_upload'">
                <div>{{ `${item.label} ${item.required ? ' *' : ''}` }} </div>
                <v-btn color="primary" class="ma-1" @click="triggerFileInput(item.id)">Upload
                  File</v-btn>
                <input type="file" :ref="setFileInputRef(item.id)" style="display: none"
                  @change="(event) => handleFileChange(item.id, event)" :accept="item.accept.join(',')" />

                <v-list>
                  <v-list-item v-for="(file, i) in (responses[item.id] || [])" :title="((file.name || file) as string)"
                    :key="i">
                    <template v-slot:prepend>
                      <v-btn icon size="x-small" @click="responses[item.id]?.splice(i, 1)" flat color="error"
                        variant="tonal" class="mr-2"><v-icon>mdi-window-close</v-icon></v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </div>

            </v-col>
          </v-row>
        </v-form>

      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  form: {
    type: Array,
    required: true,
  },
  existingResponses: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:responses']);

const mediaStore = useMediaStore();

const responses = ref({ ...props.existingResponses });

const applicationForm = ref<HTMLFormElement | null>(null)

const fileInputRefs = ref<Record<string, HTMLInputElement | null>>({});

const setFileInputRef = (index: number) => {
  return (el: any) => {
    fileInputRefs.value[index] = el;
  };
};

const triggerFileInput = (index: string) => {
  const fileInput = fileInputRefs.value[index];
  if (fileInput) {
    fileInput.click();
  } else {
    console.error(`fileInput ref for index ${index} is not bound to the input element`);
  }
};

const handleFileChange = async (index: string, event: any) => {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    const files = Array.from(target.files);

    for (const file of files) {
      const { data, error } = await mediaStore.uploadFile(file);
      if (data) {
        if (!Array.isArray(responses.value[index])) {
          responses.value[index] = [];
        }
        responses.value[index].push(data);
      }
    }
  }

  // Clear input value
  target.value = '';
}

watch(
  () => responses.value,
  (newResponses) => emit('update:responses', newResponses),
  { deep: true }
);

defineExpose({
  applicationForm
})
</script>

<style scoped></style>