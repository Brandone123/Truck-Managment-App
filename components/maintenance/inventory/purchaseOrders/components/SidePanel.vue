<template>
    <v-expand-x-transition>
        <div v-if="showSidePanel" style="height: calc(100vh - (48px + 60px));width:400px">
            <!-- Side Pannel Window Items -->
            <v-window v-model="currentStep" style="height: calc(100vh - (48px + 60px));">
                <!-- Message Window -->
                <v-window-item :value="1"
                    style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                    <v-sheet flat class="d-flex flex-column fill-height">
                        <v-card-title>Comments</v-card-title>
                        <div class="flex-grow-1">
                            <div v-if="purchaseorder.comments">
                                <v-list>
                                    <v-list-item v-for="(comment, index) in purchaseOrder.comments" :key="index">
                                        <div class="d-flex align-center">
                                            <div>
                                                <span>
                                                    <v-avatar size="30" class="rounded-bg bg-grey">
                                                        <v-icon dark>mdi-account</v-icon>
                                                    </v-avatar>
                                                    {{ comment.user }}
                                                </span>
                                            </div>
                                            <div class="ml-auto">
                                                <span style="cursor: pointer;" @click="deleteComment(index)">
                                                    <v-icon color="red">mdi-delete</v-icon>
                                                </span>
                                            </div>
                                        </div>
                                        <v-list-item-title>
                                            <v-card-text>
                                                <v-list-item-subtitle>{{ comment.date }}</v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    <v-textarea :rows="2" v-model="comment.text" density="compact"
                                                        variant="outlined" readonly>

                                                    </v-textarea>
                                                </v-list-item-subtitle>
                                            </v-card-text>
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </div>
                            <div v-else class="text-center">No Comments Yet</div>
                        </div>
                        <div style="position:sticky; bottom: 0;" class="px-2">
                            <v-text-field v-model="newComment" @keydown.enter="saveComment" variant="outlined"
                                placeholder="Add Comment"></v-text-field>
                        </div>
                    </v-sheet>
                </v-window-item>

                <!-- Photo Window -->
                <v-window-item :value="2"
                    style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                    <v-sheet flat class="d-flex flex-column fill-height">
                        <v-card-title>Photos <span v-if="purchaseOrder.photos">({{ purchaseOrder.photos.length }})</span></v-card-title>
                        <div class="flex-grow-1">
                            <v-list v-if="purchaseOrder.photos">
                                <!-- <v-list-subheader>New Photos ({{ purchaseOrder.photos.length }})</v-list-subheader> -->

                                <template v-for="(photo, index) in purchaseOrder.photos" :key="index">
                                    <v-list-item class="d-flex align-items-center">
                                        <v-img :src="photo.url" :alt="photo.name" class="mb-2" max-width="200"></v-img>
                                        <v-list-item-title>{{ photo.name }}</v-list-item-title>
                                        <!-- <v-btn text size="small" color="error" icon="mdi-delete" @click="removeNewPhoto(index)">
                            </v-btn> -->
                                    </v-list-item>
                                    <v-divider v-if="index + 1 < purchaseOrder.photos.length"></v-divider>
                                </template>
                            </v-list>
                            <div class="text-center" v-else>No Images Found</div>
                        </div>
                        <div style="position:sticky; bottom: 0;" class="px-2">
                            <!-- <WorkOrderCamera @savephoto="SavePhotos"/> -->

                            <v-btn color="primary" class="mb-1">
                                <v-icon>mdi-plus</v-icon>
                                <span class="ml-2" style="cursor: pointer;" @click="addPhoto">Add Photos</span>
                            </v-btn>

                            <input ref="fileInput" type="file" multiple accept="image/*" @change="storeNewPhoto"
                                style="display: none;" />
                        </div>
                    </v-sheet>
                </v-window-item>

                <!-- Document Window -->
                <v-window-item :value="3"
                    style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                    <v-sheet flat class="d-flex flex-column fill-height">
                        <v-card-title>Documents</v-card-title>
                        <div class="flex-grow-1">
                            <v-list v-if="purchaseOrder.documents">
                                <v-list-subheader v-if="purchaseOrder.documents.length > 0">New Documents ({{
                                    purchaseOrder.documents.length
                                }})</v-list-subheader>

                                <template v-for="(document, index) in purchaseOrder.documents" :key="index">
                                    <v-list-item>
                                        <v-list-item-title>
                                            <a :href="document.url" target="_blank">{{ document.name }}</a>
                                        </v-list-item-title>
                                        <template v-slot:append>
                                            <v-btn text size="small" color="error" icon="mdi-delete"
                                                @click="removeNewDocument(index)">
                                            </v-btn>
                                        </template>
                                    </v-list-item>
                                    <v-divider v-if="index + 1 < purchaseOrder.documents.length"></v-divider>
                                </template>
                            </v-list>
                            <div v-else class="text-center">No Documents</div>
                        </div>
                        <div style="position:sticky; bottom: 0;" class="px-2">
                            <v-card-text>
                                <v-btn color="primary" class="mb-1" @click="addDocument">
                                    <v-icon>mdi-plus</v-icon>
                                    <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                                </v-btn>

                                <input ref="documentfile" type="file" multiple
                                    accept="application/pdf, application/msword, application/vnd.ms-excel"
                                    @change="storeNewDocument" style="display: none;" />
                            </v-card-text>
                        </div>
                    </v-sheet>
                </v-window-item>
            </v-window>
        </div>
    </v-expand-x-transition>

    <v-sheet id="side-panel">
        <div class="d-flex flex-column">

            <!-- Toggle Show/Hide Side Bar -->
            <v-tooltip :text="showSidePanel ? 'Close Sidebar' : 'Open Sidebar'">
                <template v-slot:activator="{ props }">
                    <v-sheet v-bind="props" @click="toggleButtonPress"
                        class="d-flex justify-center align-center side-button">
                        <v-icon size="x-small">{{ showSidePanel ? 'mdi-arrow-expand-right' :
                            'mdi-arrow-expand-left' }}</v-icon>
                    </v-sheet>
                </template>
            </v-tooltip>

            <!-- Toggle Show Comments -->
            <v-tooltip text="Comments">
                <template v-slot:activator="{ props }">
                    <v-sheet @click="toggleSidePanel(1)" :color="currentStep == 1 ? 'primary' : ''" v-bind="props"
                        class="d-flex justify-center align-center side-button" style="height:50px">
                        <v-icon size="x-small">mdi-message-text</v-icon>
                    </v-sheet>
                </template>
            </v-tooltip>

            <v-tooltip text="Photos">
                <template v-slot:activator="{ props }">
                    <v-sheet @click="toggleSidePanel(2)" :color="currentStep == 2 ? 'primary' : ''" v-bind="props"
                        class="d-flex justify-center align-center side-button" style="height:50px">
                        <v-icon size="x-small">mdi-image</v-icon>
                    </v-sheet>

                </template>
            </v-tooltip>

            <v-tooltip text="Documents">
                <template v-slot:activator="{ props }">
                    <v-sheet @click="toggleSidePanel(3)" :color="currentStep == 3 ? 'primary' : ''" v-bind="props"
                        class="d-flex justify-center align-center side-button" style="height:50px">
                        <v-icon size="x-small">mdi-file</v-icon>
                    </v-sheet>
                </template>
            </v-tooltip>

        </div>
    </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showSidePanel = ref(false)
const currentStep = ref(0)
const lastStep = ref(0)

const localPurchaseOrder = ref(JSON.parse(JSON.stringify(props.purchaseOrder)))

const toggleButtonPress = () => {
    if (!showSidePanel) {
        currentStep.value = lastStep.value == 0 ? 1 : lastStep.value

    } else {
        lastStep.value = currentStep.value
        currentStep.value = 0
    }
    showSidePanel.value = !showSidePanel.value;
}

const toggleSidePanel = (stepVal: number) => {
    if (currentStep.value == stepVal && showSidePanel.value) {

        lastStep.value = stepVal
        currentStep.value = 0
        showSidePanel.value = !showSidePanel.value;
    } else {
        if (currentStep.value = 0) {
            lastStep.value = stepVal
        }
        lastStep.value = currentStep.value
        currentStep.value = stepVal
        showSidePanel.value = !showSidePanel.value;
    }
}

const auth = useAuthStore()

const comments = ref<{ id: number; text: string; date: string; user: string }[]>([]);
const newComment = ref('');

const saveComment = () => {
    if (newComment.value.trim() !== '') {
        comments.value.push({ id: comments.value.length + 1, text: newComment.value, date: new Date().toLocaleString(), user: (auth.user?.name as string) });
        localPurchaseOrder.value.comments = comments.value
        newComment.value = '';
    }
};

const deleteComment = (index: number) => {
    props.purchaseOrder.comments?.splice(index, 1);
};

const saveFIle = async (purchaseOrderId: number) => {
    await purchaseOrderStore.updatepurchaseOrder({
        id: purchaseOrderId,
        photos: props.purchaseOrder.photos,
        documents: props.purchaseOrder.documents,
        comments: props.purchaseOrder.comments
    } as any);
    emit('update:modelValue', false);
};

const newPhotos = ref<{ name: string; url: string }[]>([]);

function SavePhotos(photo: { name: string, url: string }) {
    newPhotos.value.push(photo);
    props.purchaseOrder.photos = newPhotos.value
}

const fileInput = ref<HTMLInputElement | null>(null);

function addPhoto() {
    if (fileInput.value) {
        fileInput.value.click();
    }
}

function storeNewPhoto(event: any) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        newPhotos.value.push(files[i])
    }

    event.target.value = null;
}

function removePhoto(index: any) {
    props.purchaseOrder.photos?.splice(index, 1);
}

function removeNewPhoto(index: number) {
    props.purchaseOrder.photos?.splice(index, 1);
}

const documentfile = ref<HTMLInputElement | null>(null);
const newDocuments = ref<{ name: string, url: string }[]>([]);

function addDocument() {
    documentfile.value?.click();
}

function removeNewDocument(index: number) {
    props.purchaseOrder.documents?.splice(index, 1);
}

function storeNewDocument(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            newDocuments.value.push({ name: file.name, url: url });
            props.purchaseOrder.documents = newDocuments.value
        }
        (event.target as HTMLInputElement).value = '';
    }
}

</script>

<style scoped>
.custom-timeline :deep(.v-timeline--item__body) {
    width: 100%;
}

.side-button {
    height: 50px;
    cursor: pointer;
}

.side-button:hover {
    background-color: #eeeeee;
}

#side-panel {
    height: 100%;
    width: 50px;
    border-left: 1px solid grey;
}
</style>