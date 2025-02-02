<template>
    <div>
        <ApplicantDocumentCategoryEditDialog v-model="documentCategoryDialog" :applicantDocument="applicantDocument"
            @save="saveApplicantDocument" />

        <input type="file" ref="applicationDocumentfileInputRef" style="display: none"
            @change="submitApplicationDocument" accept="*" />

        <SharedDocumentPreview style="height: calc(100vh - (48px + 98px))" :loading="loading"
            :items="applicantDocuments" @edit="editDocument" @delete="deleteDocument" @addItemToFolder="addItemToFolder"
            item-children="documents">

            <template v-slot:top>
                <v-sheet style="position:sticky; top:0;" class="pa-1">
                    <v-text-field label="Search" v-model="search" density="compact" variant="outlined" single-line
                        hide-details append-inner-icon="mdi-magnify" placeholder="Search for Applicant" clearable
                        @input="searchTableDynamic" @keydown.enter="searchTableDynamic"
                        @click:clear="searchTableDynamic" />
                </v-sheet>
            </template>

            <template v-slot:bottom>
                <v-sheet v-if="total_pages > 1" style="position:sticky; bottom: 0;" class="elevation-1">
                    <v-pagination :length="total_pages" v-model="currentPage" density="comfortable"
                        color="primary"></v-pagination>
                </v-sheet>
            </template>

            <template v-slot:treeview-actions="{ item }">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-icon color="primary" v-bind="props">mdi-dots-vertical</v-icon>
                    </template>
                    <v-list density="compact">
                        <v-list-item @click="addApplicantDocumentCategory(item.id)" v-if="item.type == 'folder'">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Add Document Category</span>
                                <v-icon color="primary">mdi-plus</v-icon>
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="editApplicantDocumentCategory(item)" v-if="item.type == 'file-group'">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Edit Category</span>
                                <v-icon color="secondary">mdi-pencil</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="item.type == 'file-group'" @click="selectDocumentToSubmit(item.id)">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Submit Document</span>
                                <v-icon color="secondary">mdi-upload</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="item.type == 'file'" @click="deleteApplicantDocumentCategory(item.id)">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Delete Category</span>
                                <v-icon color="error">mdi-delete</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>

            <template v-slot:details="{ selected, props, viewDocument, downloadDocument, canPreview, getIconAndColor }">
                <div>
                    <v-sheet class="pt-1" style="position:sticky; top:0; z-index:1;">
                        <div class="d-flex justify-space-between">
                            <v-icon size="40" v-if="selected.type === 'folder'" color="grey">mdi-folder</v-icon>
                            <v-icon size="40" v-else-if="selected.type === 'file-group'" color="grey">mdi-folder</v-icon>
                            <v-icon v-else size="40" :color="props.color">
                                {{ props.icon }}
                            </v-icon>

                            <!-- ACTIONS: Download, Edit, Delete -->
                            <div>
                                <!-- Edit -->
                                <span>
                                    <v-btn icon density="compact" color="secondary" variant="tonal"
                                        @click="editApplicantDocumentCategory(selected as any)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </span>

                                <!-- Delete -->
                                <span>
                                    <v-btn icon density="compact" color="error" variant="tonal"
                                        @click="deleteApplicantDocumentCategory(selected.id)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </span>
                            </div>
                        </div>
                        <v-divider />
                    </v-sheet>
                    <v-row>
                        <v-col cols="12" md="6">Name</v-col>
                        <v-col cols="12" md="6">{{
                            selected.name
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Description</v-col>
                        <v-col cols="12" md="6">{{
                            selected.description
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Type</v-col>
                        <v-col cols="12" md="6" class="text-capitalize">{{
                            selected.type
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Created At</v-col>
                        <v-col cols="12" md="6">{{
                            selected.created_at?.substring(0, 10)
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3" v-if="selected.template_id"></v-divider>
                    <v-row v-if="selected.template_id">
                        <v-col cols="12" md="6">Template</v-col>
                        <v-col cols="12" md="6"><v-btn density="compact" color="primary"
                                @click="downloadDocument({ src: selected.template.src, name: selected.template.name })">Download</v-btn></v-col>
                    </v-row>

                    <div>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" class="text-primary">
                                <div class="d-flex justify-space-between">
                                    <span class="text-h6">Submissions</span>
                                    <v-btn prepend-icon="mdi-plus" color="primary" variant="outlined"
                                        density="comfortable" @click="selectDocumentToSubmit(selected.id)"
                                        class="ml-2 text-none">Add</v-btn>
                                </div>
                            </v-col>
                            <template v-for="(submission, i) in selected.submissions" :key="i">
                                <v-col class="py-0" cols="12">
                                    <div class="d-flex justify-space-between">
                                        <span class="mr-2">
                                            <v-icon :color="getIconAndColor(submission.src).color">{{
                                                getIconAndColor(submission.src).icon }}</v-icon>
                                            <span
                                                style="text-decoration:none;cursor: pointer; border-bottom: 1px dotted;"
                                                v-if="canPreview(submission.src)" @click="viewDocument(submission)"
                                                color="primary">{{ submission.name }}
                                                <v-tooltip activator="parent" location="top">CLick to View</v-tooltip>
                                            </span>
                                            <span v-else color="grey">{{ submission.name }}</span>
                                        </span>

                                        <div>
                                            <span>
                                                <v-icon color="primary"
                                                    @click="downloadDocument({ src: submission.src, name: selected.name + '_' + submission.created_at?.substring(0, 10) })"
                                                    density="compact">mdi-download</v-icon>
                                                <v-tooltip activator="parent" location="top">Download</v-tooltip>
                                            </span>
                                        </div>
                                    </div>
                                    <v-divider class="my-2" v-if="i < selected.submissions.length - 1"></v-divider>
                                </v-col>
                            </template>
                        </v-row>
                    </div>

                </div>

            </template>
        </SharedDocumentPreview>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ApplicantDocumentCategoryEditDialog from '@/components/recruiting/onboardingManagement/components/ApplicantDocumentCategoryEditDialog.vue';
import type { ApplicantDocument } from '@/types/recruiting/applicantApplication';
import type { OrientationDocument } from '@/types/recruiting/onboardingOrientation';

const mediaStore = useMediaStore()
const layoutStore = useLayoutStore();
const applicantDocumentStore = ApplicantDocumentStore();
const { applicantDocuments, loading, total_pages, pagination } = storeToRefs(applicantDocumentStore);

const documentCategoryDialog = ref<boolean>(false);
const applicantDocument = ref<Partial<ApplicantDocument>>({})
const applicationDocumentfileInputRef = ref<HTMLFormElement | null>(null)
const selectedDocumentId = ref<number | null>(null);


const currentPage = computed({
    get() { return pagination.value.page },
    set(val) { pagination.value.page = val }
})

const search = ref<string>('')
const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null)


const searchQuery = computed(() => {
    let payload: Record<string, any> = {
        page: pagination.value.page,
        items_per_page: pagination.value.itemsPerPage,
    };

    //   if (pagination.value.sortBy.length > 0) {
    //     payload['sort_by'] = pagination.value.sortBy[0];
    //   }

    if (Boolean(pagination.value.search)) {
        payload['search'] = pagination.value.search;
    }

    //   payload['filters'] = {};

    //   if (Object.keys(selectedFilters.value).length > 0) {
    //     payload['filters'] = selectedFilters.value;
    //   }

    return payload;
});

const searchTableDynamic = () => {
    // 1) Clear any previously scheduled timer
    if (typingTimer.value) {
        clearTimeout(typingTimer.value)
    }

    // 2) Start a new timer (e.g., 500ms)
    typingTimer.value = setTimeout(() => {
        // The user hasn't typed for 500ms
        pagination.value.search = (search.value || "").trim().toLowerCase();
    }, 500)
}

// Application Document Category Methods
const addApplicantDocumentCategory = (applicantId: number) => {
    applicantDocument.value = { applicant_id: applicantId }
    documentCategoryDialog.value = true
}

const editApplicantDocumentCategory = (document: ApplicantDocument) => {
    applicantDocument.value = document
    documentCategoryDialog.value = true
}

const deleteApplicantDocumentCategory = async (id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this document category?`);
    if (confirm) {
        await applicantDocumentStore.deleteApplicantDocument(id);
        applicantDocumentStore.fetchApplicantDocuments(searchQuery.value)
    }
}


// Application Document Submission Methods

const selectDocumentToSubmit = (documentId: number) => {
    selectedDocumentId.value = documentId
    applicationDocumentfileInputRef.value?.click();
};

const submitApplicationDocument = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target?.files ? target.files[0] : null;
    if (!file) return

    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
        await applicantDocumentStore.submitApplicantDocument({
            applicant_document_id: selectedDocumentId.value as number,
            name: file.name,
            src: data.src,
            key: data.key
        })
        await applicantDocumentStore.fetchApplicantDocuments(searchQuery.value)
    }

    // Clear input value
    target.value = '';
}


const documentEditDialog = ref(false);
const selectedDocument = ref<OrientationDocument | null>(null);


const addDocument = () => {
    selectedDocument.value = { parent_id: null, type: 'file' } as OrientationDocument
    documentEditDialog.value = true;
};

const addItemToFolder = (parentId: number) => {
    selectedDocument.value = { parent_id: parentId, type: 'file' } as OrientationDocument
    documentEditDialog.value = true
}

const editDocument = (document: OrientationDocument) => {
    selectedDocument.value = document;
    documentEditDialog.value = true;
};

const saveApplicantDocument = async (applicantDocument: ApplicantDocument) => {
    if (applicantDocument.id) {
        await applicantDocumentStore.updateApplicantDocument(applicantDocument.id, applicantDocument);
    } else {
        await applicantDocumentStore.createApplicantDocument(applicantDocument);
    }

    applicantDocumentStore.fetchApplicantDocuments(searchQuery.value)
}
const saveDocument = async (document: Partial<OrientationDocument>) => {
    // documentEditDialog.value = false;
    // if (document.id) {
    //     await applicantDocumentStore.updateOrientationDocument(document.id, document);
    // } else {
    //     await applicantDocumentStore.createOrientationDocument(document);
    // }
    // applicantDocumentStore.fetchOrientationDocuments()
};

const deleteDocument = async (document: OrientationDocument) => {
    // const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete document "${document.name}"?`);
    // if (confirm) {
    //     await applicantDocumentStore.deleteApplicationDocument(document.id);
    //     applicantDocumentStore.fetchApplicantDocuments()
    // }
};

onMounted(() => {
    applicantDocumentStore.fetchApplicantDocuments(searchQuery.value)
});


watch(() => searchQuery.value, () => {
    applicantDocumentStore.fetchApplicantDocuments(searchQuery.value)
})
</script>

<style scoped>
/* Add your styles here */
</style>