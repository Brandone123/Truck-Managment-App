<template>
    <div>
        <DocumentEditDialog :modelValue="documentEditDialog" :document="selectedDocument"
            @update:modelValue="documentEditDialog = $event" @save="saveDocument" />

        <SharedDocumentPreview style="height: calc(100vh - (48px + 98px))" :loading="loading"
            :items="orientationDocuments" @edit="editDocument" @delete="deleteDocument"
            @addItemToFolder="addItemToFolder" :search="search">

            <template v-slot:top>
                <v-sheet style="position:sticky; top:0;" class="pa-1">
                    <v-text-field label="Search" v-model="search" density="compact" variant="outlined" single-line
                        hide-details append-inner-icon="mdi-magnify" clearable />
                </v-sheet>
            </template>

            <template v-slot:treeview-actions="{ item }">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-icon color="primary" v-bind="props">mdi-dots-vertical</v-icon>
                    </template>
                    <v-list density="compact">
                        <v-list-item @click="addItemToFolder(item.id)" v-if="item.type == 'folder'">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Add File/Folder</span>
                                <v-icon color="primary">mdi-plus</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="editDocument(item)">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Edit</span>
                                <v-icon color="secondary">mdi-pencil</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteDocument(item)">
                            <v-list-item-title class="d-flex">
                                <span class="flex-grow-1">Delete</span>
                                <v-icon color="error">mdi-delete</v-icon>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template v-slot:details="{ selected, props, viewDocument, downloadDocument, canPreview }">
                <div>
                    <v-sheet class="pt-1" style="position:sticky; top:0; z-index:1;">
                        <div class="d-flex justify-space-between">
                            <v-icon size="40" v-if="selected.type === 'folder'">mdi-folder</v-icon>
                            <v-icon v-else size="40" :color="props.color">
                                {{ props.icon }}
                            </v-icon>

                            <!-- ACTIONS: Download, Edit, Delete -->
                            <div>
                                <!-- Download -->
                                <span v-if="selected.type === 'file'">
                                    <v-btn icon density="compact" color="tertiary" variant="tonal"
                                        @click="downloadDocument(selected)">
                                        <v-icon>mdi-download</v-icon>
                                    </v-btn>
                                    <v-tooltip activator="parent" location="top">Download</v-tooltip>
                                </span>

                                <!-- Edit -->
                                <span>
                                    <v-btn icon density="compact" color="secondary" variant="tonal"
                                        @click="editDocument(selected as any)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </span>

                                <!-- Delete -->
                                <span>
                                    <v-btn icon density="compact" color="error" variant="tonal"
                                        @click="deleteDocument(selected as any)">
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
                    <v-divider class="my-3"></v-divider>

                    <!-- PREVIEW: Image / Video / Document -->
                    <div class="d-flex justify-center">
                        <!-- IMAGE -->
                        <v-img v-if="props.file_type === 'image'" :src="selected.src" max-width="50%" max-height="50%"
                            contain @click="viewDocument(selected)">
                            <template #placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="primary" indeterminate />
                                </div>
                            </template>
                        </v-img>

                        <!-- VIDEO -->
                        <video v-else-if="props.file_type === 'video'" :src="selected.src" controls
                            disablepictureinpicture controlsList="nodownload noremoteplayback"
                            style="max-width: 50%; max-height: 50%;">
                            <source :src="selected.src" :type="'video/' + selected.file_extension" />
                            Your browser does not support HTML5 video.
                        </video>

                        <!-- DOCUMENT (PDF, etc.) -->
                        <div v-else-if="props.file_type === 'document'" class="d-flex flex-column align-center">
                            <span>Preview Not Available</span>
                            <v-btn class="text-none" density="compact" color="primary" @click="viewDocument(selected)">
                                View File
                            </v-btn>
                        </div>

                        <!-- UNSUPPORTED -->
                        <span v-else class="text-error">
                            Unsupported file extension. Cannot View or Preview.
                        </span>
                    </div>
                </div>
            </template>
        </SharedDocumentPreview>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { DefaultDocumentStore } from '@/stores/recruiting/onboardingOrientation/defaultDocumentStore';
import type { OrientationDocument } from '@/types/recruiting/onboardingOrientation';
import DocumentEditDialog from '@/components/recruiting/onboardingManagement/DocumentEditDialog.vue';

const layoutStore = useLayoutStore();
const defaultDocumentStore = DefaultDocumentStore();
const { orientationDocuments, loading } = storeToRefs(defaultDocumentStore);

const documentEditDialog = ref(false);
const selectedDocument = ref<OrientationDocument | null>(null);
const search = ref<string>('');

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

const saveDocument = async (document: Partial<OrientationDocument>) => {
    documentEditDialog.value = false;
    if (document.id) {
        await defaultDocumentStore.updateOrientationDocument(document.id, document);
    } else {
        await defaultDocumentStore.createOrientationDocument(document);
    }
    defaultDocumentStore.fetchOrientationDocuments()
};

const deleteDocument = async (document: OrientationDocument) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete document "${document.name}"?`);
    if (confirm) {
        await defaultDocumentStore.deleteOrientationDocument(document.id);
        defaultDocumentStore.fetchOrientationDocuments()
    }
};

onMounted(() => {
    defaultDocumentStore.fetchOrientationDocuments()
});

defineExpose({
    addDocument
})
</script>

<style scoped>
/* Add your styles here */
</style>