<template>
    <div class="d-flex flex-grow-1" id="form-builder" :style="{ height: height }">
        <div id="form-content">
            <div class="d-flex justify-center pt-10" v-if="!form.length">
                <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                        <v-icon size="80" color="grey">mdi-format-list-bulleted</v-icon>
                        <p>Start building your quiz form by selecting items from the panel on the
                            right.</p>
                        <p>Atleast one form item is required to proceed</p>
                    </v-card-text>
                </v-card>
            </div>
            <div v-else class="pb-5 px-10" style="height:100%; overflow-y:scroll;">
                <v-sheet style="position:sticky; top:0px;z-index: 1" class="grey-background">
                    <v-tabs v-model="currentTab" align-tabs="center" color="primary">
                        <v-tab value="design">Design</v-tab>
                        <v-tab value="preview">Preview</v-tab>
                    </v-tabs>
                </v-sheet>

                <v-window v-model="currentTab">
                    <!-- DESIGN WINDOW -->
                    <v-window-item value="design">
                        <div class="d-flex py-5 grey-background mx-n10 px-10"
                            style="z-index: 1; position: sticky;top:0;">
                            <v-btn @click="expandAll" class="trigger-btn mr-5" density="comfortable" variant="text"
                                size="medium">
                                <v-icon>mdi-arrow-expand-vertical</v-icon>
                                <v-tooltip activator="parent" location="top">Expand All</v-tooltip>
                            </v-btn>
                            <v-btn @click="collapseAll" class="trigger-btn" density="comfortable" variant="text"
                                size="medium">
                                <v-icon>mdi-arrow-collapse-vertical</v-icon>
                                <v-tooltip density="compact" activator="parent" location="top">Collapse All</v-tooltip>
                            </v-btn>
                        </div>
                        <draggable v-model="form" handle=".handle">
                            <div class="list-group-item" v-for="(component, i) in form" :key="i">
                                <div class="d-flex">
                                    <v-btn class=" handle grabbable mr-3" icon="mdi-dots-grid" size="small"
                                        variant="text"></v-btn>
                                    <div class="flex-grow-1">
                                        <Dropdowm v-if="component.type == 'dropdown'" :modelValue="component"
                                            @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                            @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                            @update:expanded="updateExpand(component.id)" />
                                        <CheckBox v-else-if="component.type == 'checkbox'" :modelValue="component"
                                            @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                            @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                            @update:expanded="updateExpand(component.id)" />
                                        <Radio v-else-if="component.type == 'radio'" :modelValue="component"
                                            @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                            @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                            @update:expanded="updateExpand(component.id)" />
                                    </div>
                                </div>

                            </div>
                        </draggable>
                    </v-window-item>

                    <!-- PREVIEW WINDOW -->
                    <v-window-item value="preview" class="mt-2">
                        <!-- Render the dynamic HTML content safely -->
                        <v-card>
                            <v-card-text>
                                <v-row class="mt-2">
                                    <v-col cols="12" v-for="(item, index) in (form as any[])" :key="index" class="pt-0">
                                        <div v-if="item.type == 'free_text'">
                                            <h3 class="text-h5 py-0">{{ item.text }}</h3>
                                            <QuillPreview :html="item.description || ''" />
                                        </div>
                                        <!-- En-tête de chaque élément -->
                                        <!-- Affichage des différents types d'éléments -->
                                        <!-- Section -->
                                        <div v-else-if="item.type === 'section'" class="py-0">
                                            <h3 class="text-h5 py-0">{{ item.text }}</h3>
                                            <v-divider></v-divider>
                                            <p class="text-grey text-caption py-0">{{ item.description }}</p>
                                        </div>

                                        <!-- Radio -->
                                        <v-radio-group v-else-if="item.type === 'radio'" density="comfortable"
                                            :label="`${item.text} ${item.required ? ' *' : ''}`"
                                            :rules="item.required ? [validation.required] : []"
                                            :required="item.required" class="mt-0 mb-1">
                                            <p class="text-grey text-caption py-0">{{ item.description }}</p>
                                            <v-radio v-for="(option, i) in item.options" :key="i" :label="option.text"
                                                :value="option.text" color="primary" />
                                        </v-radio-group>

                                        <!-- Checkbox -->
                                        <div v-else-if="item.type === 'checkbox'">
                                            <h3> {{ `${item.text} ${item.required ? ' *' : ''}` }}</h3>
                                            <p class="text-grey text-caption py-0">{{ item.description }}</p>
                                            <v-checkbox v-for="(option, index) in item.options" :key="index"
                                                :label="option.text" :value="option.text" color="primary"
                                                density="compact" hide-details />
                                        </div>

                                        <!-- Dropdown -->
                                         <div  v-else-if="item.type === 'dropdown'">
                                            <p class="text-grey text-caption py-0">{{ item.description }}</p>
                                            <v-select
                                                :rules="item.required ? [validation.required] : []"
                                                :items="item.options.map((option: any) => option.text)"
                                                :label="`${item.text} ${item.required ? ' *' : ''}`" variant="outlined"
                                                density="comfortable" class="mt-0 mb-1"></v-select>
                                         </div>
                                       
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-window-item>
                </v-window>
            </div>
        </div>
        <v-card flat id="form-components-container">
            <v-card-text class="d-flex flex-column">
                <v-btn @click="addComponent(item.json)" @mouseenter="setHovering(i)" @mouseleave="removeHovering(i)"
                    class="mb-3 text-none justify-start" v-for="(item, i) in formComponents" variant="outlined">
                    <v-icon class="mr-3">{{ item.icon }}</v-icon>
                    {{ item.title }}
                    <span class="text-primary ml-3" v-if="isHovering[i]">Add</span>
                </v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref, provide, type PropType, watch } from 'vue';
import Dropdowm from './components/Dropdowm.vue';
import { v4 as uuidv4 } from 'uuid';
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import CheckBox from './components/CheckBox.vue';
import Radio from './components/Radio.vue';

const props = defineProps({
    modelValue: {
        type: Array as PropType<any[]>,
        required: true,
        default: [],
    },
    height: {
        required: false,
        default: 'calc(100vh - (48px + 72px + 52px))'
    }
})

const emit = defineEmits(['update:modelValue', 'update:validity'])

interface NumberBooleanMap {
    [key: number]: boolean;
}

const currentTab = ref<string>('design');
const validation = useValidation();

const form = ref<any[]>(props.modelValue)
const formValidity = ref<any>(false)

const isExpanded = ref<Record<string, boolean>>(
    props.modelValue.reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
    }, {} as { [key: string]: boolean })
)

watch(form, (newVal) => {
    emit('update:modelValue', newVal)
}, { deep: true });

// update parent with form validity status
watch(() => formValidity.value, (newVal) => {
    emit('update:validity', newVal)
})

const expandAll = () => {
    Object.keys(isExpanded.value).forEach((key: string) => {
        isExpanded.value[key] = true
    })
};

const collapseAll = () => {
    Object.keys(isExpanded.value).forEach((key: string) => {
        isExpanded.value[key] = false
    })
};

const updateExpand = (id: string) => {
    isExpanded.value[id] = !isExpanded.value[id]
}


const formComponents = ref([
    {
        title: 'Dropdown',
        icon: 'mdi-format-list-bulleted',
        json: {
            type: 'dropdown',
            text: '',
            required: true,
            description: '',
            instructions: '',
            options: [] as { text: string, is_correct: boolean }[],
        },
        default: false
    },
    {
        title: 'Checkbox',
        icon: 'mdi-checkbox-marked',
        json: {
            id: '',
            type: 'checkbox',
            text: '',
            required: true,
            description: '',
            options: [] as { text: string, is_correct: boolean }[],
        },
        default: false
    },
    {
        title: 'Radio',
        icon: 'mdi-radiobox-marked',
        json: {
            id: '',
            type: 'radio',
            text: '',
            required: true,
            description: '',
            options: [] as { text: string, is_correct: boolean }[],
        },
        default: false
    },
])

const isHovering = ref<NumberBooleanMap>({})

const setHovering = (index: number) => {
    isHovering.value[index] = true;
}

const removeHovering = (index: number) => {
    isHovering.value[index] = false;
}

const addComponent = (json: any) => {
    let payload = JSON.parse(JSON.stringify({ ...json, id: uuidv4() }))
    isExpanded.value[payload.id] = true
    form.value.push(payload)
}

const updateForm = (json: any, index: number) => {
    form.value[index] = json
}

const deleteComponent = (index: number) => {
    let componentId = form.value[index]?.id
    form.value.splice(index, 1)
    delete isExpanded.value[componentId]
}

const copyComponent = (index: number) => {
    let newComponent = JSON.parse(JSON.stringify(form.value[index]))
    newComponent.id = uuidv4()
    newComponent.text = 'Copy of ' + newComponent.text
    newComponent.default = false;
    isExpanded.value[newComponent.id] = true
    form.value.splice(index + 1, 0, newComponent);
}
</script>

<style scoped>
#form-builder {
    flex-direction: row;
    position: relative;
    flex: 1 1;
    overflow-x: hidden;
    min-height: 0;
    width: 100%;
}

#form-content {
    width: calc(100% - 284px);
    height: 100%;
    position: relative;
}

#form-components-container {
    overflow-y: auto;
    max-width: 284px;
    width: 100%;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
}


.grabbable {
    cursor: grab
}

.grabbavle:active {
    cursor: grabbing !important
}
</style>