<template>
    <div class="d-flex flex-grow-1" id="form-builder">
        <div id="form-content">
            <div class="d-flex justify-center pt-10" v-if="!form.length">
                <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                        <v-icon size="80" color="grey">mdi-format-list-bulleted</v-icon>
                        <p>Start building your inspection form by selecting items from the panel on the
                            right.</p>
                        <p>Atleast one form item is required to proceed</p>
                    </v-card-text>
                </v-card>
            </div>
            <div v-else class="pb-5 px-10" style="height:100%; overflow-y:scroll;">
                <div class="d-flex py-5 grey-background mx-n10 px-10" style="z-index: 1; position: sticky;top:0;">
                    <v-btn @click="expandAll" class="trigger-btn mr-5" density="comfortable" variant="text"
                        size="medium">
                        <v-icon>mdi-arrow-expand-vertical</v-icon>
                        <v-tooltip activator="parent" location="top">Expand All</v-tooltip>
                    </v-btn>
                    <v-btn @click="collapseAll" class="trigger-btn" density="comfortable" variant="text" size="medium">
                        <v-icon>mdi-arrow-collapse-vertical</v-icon>
                        <v-tooltip density="compact" activator="parent" location="top">Collapse All</v-tooltip>
                    </v-btn>
                </div>
                <!-- <div v-for="(component, i) in form" :key="i" draggable="true" >
                    <DateTime v-if="component.type == 'date_time'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <Dropdowm v-else-if="component.type == 'dropdown'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <FreeText v-else-if="component.type == 'free_text'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <MeterEntry v-else-if="component.type == 'meter_entry'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <Number v-else-if="component.type == 'number'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <PassFail v-else-if="component.type == 'pass_fail'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <Photo v-else-if="component.type == 'photo'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <Signature v-else-if="component.type == 'signature'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                    <Section v-else-if="component.type == 'section'" :modelValue="component"
                        @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)" @copy="copyComponent(i)"
                        class="mb-3" />
                </div> -->

                <draggable v-model="form" handle=".handle">
                    <div class="list-group-item" v-for="(component, i) in form" :key="i">
                        <div class="d-flex">
                            <v-btn class=" handle grabbable mr-3" icon="mdi-dots-grid" size="small"
                                variant="text"></v-btn>
                            <div class="flex-grow-1">
                                <DateTime v-if="component.type == 'date_time'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <Dropdowm v-else-if="component.type == 'dropdown'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <FreeText v-else-if="component.type == 'free_text'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <MeterEntry v-else-if="component.type == 'meter_entry'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <Number v-else-if="component.type == 'number'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <PassFail v-else-if="component.type == 'pass_fail'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <Photo v-else-if="component.type == 'photo'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <Signature v-else-if="component.type == 'signature'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                                <Section v-else-if="component.type == 'section'" :modelValue="component"
                                    @update:modelValue="updateForm($event, i)" @delete="deleteComponent(i)"
                                    @copy="copyComponent(i)" class="mb-3" :expanded="isExpanded[component.id]"
                                    @update:expanded="updateExpand(component.id)" />
                            </div>
                        </div>

                    </div>
                </draggable>
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
import { ref, provide, type PropType, watch } from 'vue'
import DateTime from './components/DateTime.vue';
import Dropdowm from './components/Dropdowm.vue';
import FreeText from './components/FreeText.vue';
import MeterEntry from './components/MeterEntry.vue';
import Number from './components/Number.vue';
import PassFail from './components/PassFail.vue';
import Photo from './components/Photo.vue';
import Signature from './components/Signature.vue';
import Section from './components/Section.vue';
import { v4 as uuidv4 } from 'uuid';
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const props = defineProps({
    modelValue: {
        type: Array as PropType<any[]>,
        required: true,
        default: [],
    },
})

const emit = defineEmits(['update:modelValue', 'update:validity'])

// Create a simple event bus using EventTarget
// const eventBus = new EventTarget();

// const expandAll = () => {
//     console.log('expanding all')
//     const event = new Event('expandAll');
//     eventBus.dispatchEvent(event);
// };

// const collapseAll = () => {
//     const event = new Event('collapseAll');
//     eventBus.dispatchEvent(event);
// };

// provide('eventBus', eventBus);

interface NumberBooleanMap {
    [key: number]: boolean;
}

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
        title: 'Date / Time',
        icon: 'mdi-calendar-minus',
        json: {
            type: 'date_time',
            label: '',
            required: true,
            description: '',
            instructions: '',
            date_only: false,
        }
    },
    {
        title: 'Dropdown',
        icon: 'mdi-format-list-bulleted',
        json: {
            type: 'dropdown',
            label: '',
            required: true,
            description: '',
            instructions: '',
            choices: [{ text: '', invalid: false }] as { text: string, invalid: boolean }[],
            pass_require_photo_or_comment: false,
            fail_require_photo_or_comment: false,
        }
    },
    {
        title: 'Free Text',
        icon: 'mdi-message-text-outline',
        json: {
            type: 'free_text',
            label: '',
            required: true,
            description: '',
            instructions: '',
        }
    },
    {
        title: 'Meter Entry',
        icon: 'mdi-gauge',
        json: {
            type: 'meter_entry',
            label: '',
            required: true,
            description: '',
            require_secondary_meter: true,
            require_photo_verification: true,
        }
    },
    {
        title: 'Number',
        icon: 'mdi-pound',
        json: {
            type: 'number',
            label: '',
            required: true,
            description: '',
            instructions: '',
            minimum_pass_range: '',
            maximum_pass_range: '',
            pass_require_photo_or_comment: false,
            fail_require_photo_or_comment: false,
        }
    },
    {
        title: 'Pass / Fail',
        icon: 'mdi-check-circle-outline',
        json: {
            type: 'pass_fail',
            label: '',
            required: true,
            description: '',
            instructions: '',
            pass_label: 'Pass',
            fail_label: 'Fail',
            enable_na_options: false,
            pass_require_photo_or_comment: false,
            fail_require_photo_or_comment: false,
        }
    },
    // {
    //     title: 'Photo',
    //     icon: 'mdi-image-outline',
    //     json: {
    //         type: 'photo',
    //         label: '',
    //         required: true,
    //         description: '',
    //         instructions: ''
    //     }
    // },
    {
        title: 'Signature',
        icon: 'mdi-feather',
        json: {
            type: 'signature',
            label: '',
            required: true,
            description: ''
        }
    },
    {
        title: 'Section',
        icon: 'mdi-align-vertical-distribute',
        json: {
            type: 'section',
            label: '',
            required: true,
        }
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
    newComponent.label = 'Copy of ' + newComponent.label
    isExpanded.value[newComponent.id] = true
    form.value.splice(index + 1, 0, newComponent);
}
</script>

<style scoped>
#form-builder {
    height: calc(100vh - (48px + 72px + 52px));
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