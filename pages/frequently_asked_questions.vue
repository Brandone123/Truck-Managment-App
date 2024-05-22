<script setup lang="ts">
import { ref, computed } from "vue"
import { storeToRefs } from "pinia";
import type { FrequentlyAskedQuestionInfo } from '@/types/store/frequently_asked_question';

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const frequentlyAskedQuestionStore = useFAQStore()
const { frequentlyAskedQuestionList, loading } = storeToRefs(frequentlyAskedQuestionStore)

onMounted(() => {
    departmentStore.fetchDepartmentList()
    frequentlyAskedQuestionStore.fetchFAQList()
})

const editedFaq = ref<FrequentlyAskedQuestionInfo>({})
const updatingFaq = ref(false)
const faqDialog = ref(false)

// const print = (selectedItems: any) => {
//     console.log(selectedItems)
// }

const editFaq = (faq: FrequentlyAskedQuestionInfo) => {
    editedFaq.value = Object.assign({}, faq)
    updatingFaq.value = true
    faqDialog.value = true
}

const deleteFaq = (faq_id: number) => {
    frequentlyAskedQuestionStore.deleteFAQ(faq_id)
}

const updateFaqDialog = (value: boolean) => {
    faqDialog.value = value
    editedFaq.value = {}
    updatingFaq.value = false
}

const selectedDepartmentId = ref<Number | null>(null)
const faqContainer = ref<HTMLElement | null>(null)
const searchQuestion = ref<String>('')

const filteredFrequentlyAskedQuestions = computed(() => {
    let fixedSearchQuestion = (searchQuestion.value || "").toLowerCase().trim()
    if (selectedDepartmentId.value || fixedSearchQuestion.length) {
        return frequentlyAskedQuestionList.value.filter((item: FrequentlyAskedQuestionInfo) => {
            let currentDepartment = selectedDepartmentId.value ? item.department_id == selectedDepartmentId.value : false
            let questionInSearch = fixedSearchQuestion.length ? item.question?.toLowerCase().includes(fixedSearchQuestion) : false

            if (selectedDepartmentId.value && fixedSearchQuestion.length) {
                return currentDepartment && questionInSearch
            }

            return currentDepartment || questionInSearch
        })
    }
    return frequentlyAskedQuestionList.value
})

const noSearchResults = computed(() => {
    return !loading.value && !filteredFrequentlyAskedQuestions.value.length && (searchQuestion.value.trim().length || selectedDepartmentId.value)
})

const noData = computed(() => {
    return !loading.value && !filteredFrequentlyAskedQuestions.value.length
})
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">FAQ / Frequently Asked Questions</span>
            <div>
                <FaqDialog :show="faqDialog" @update:show="updateFaqDialog"
                    :updating="updatingFaq" :item="editedFaq" />
            </div>

        </div>

        <v-row justify="center" align="center" class="my-4">
            <v-col cols="12" md="4" lg="3">
                <v-autocomplete clearable label="Department" :items="departmentList" v-model="selectedDepartmentId"
                    item-title="name" item-value="id" variant="solo" hide-details density="compact"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="8" lg="5">
                <v-text-field hide-details v-model="searchQuestion" clearable density="compact" placeholder="Search FAQ"
                    prepend-inner-icon="mdi-magnify" variant="solo"></v-text-field>
            </v-col>
        </v-row>

        <p class="text-center" v-if="noSearchResults">No results found which match your search query</p>
        <p class="text-center" v-else-if="noData">No FAQ's present at the moment</p>
        <div v-else-if="loading" class="d-flex justify-center align-center">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-expansion-panels v-else variant="inset" >
            <v-expansion-panel v-for="(faq, i) in filteredFrequentlyAskedQuestions" :key="i">
                <v-expansion-panel-title class="font-weight-bold text-capitalize">
                    <v-menu >
                        <template v-slot:activator="{ props  }">
                            <v-btn  v-bind="props" density="compact" icon variant="text">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-sheet rounded="md" width="200" elevation="5" class="mt-2">
                            <v-list class="py-0" lines="one" density="compact">
                                <v-list-item value="item1" color="primary"  @click="editFaq(faq)">
                                    <template v-slot:prepend>
                                        <v-icon color="primary">mdi-pencil</v-icon>
                                    </template>
                                    <v-list-item-title class="pl-4 text-body-1">Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item value="item2" color="primary" @click="deleteFaq(faq.id as number)">
                                    <template v-slot:prepend>
                                        <v-icon color="red">mdi-delete</v-icon>
                                    </template>
                                    <v-list-item-title class="pl-4 text-body-1">Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                    </v-menu>
                    {{ faq.question }}
                    <template v-slot:actions="{ expanded }">
                        <div>
                            <v-icon :color="!expanded ? 'primary' : ''"
                                :icon="expanded ? 'mdi-minus' : 'mdi-plus'"></v-icon>
                        </div>
                    </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>