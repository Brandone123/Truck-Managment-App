<template>
    <v-sheet flat class="d-flex flex-column fill-height">

        <div style="overflow-y:auto;" class="pa-2 d-flex flex-column flex-grow-1">
            <div class="font-weight-bold pa-2">Photos</div>
            <div class="d-flex flex-wrap" no-gutters>
                <v-col cols="6" v-for="(photo, index) in photos" :key="index" class="pa-1">
                    <v-card @click="showImage(index)" flat>
                        <v-img class="mx-auto" :src="photo.src" aspect-ratio="16/9" :alt="photo.name" cover height="100"
                            style="position:relative;">
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                </div>
                            </template>
                            <!-- <v-chip color="primary" density="compact" style="position:fixed;bottom:10;right:10">{{
                                getSource(photo.uploader_category)
                                }}</v-chip> -->
                        </v-img>
                    </v-card>
                    <div class="d-flex justify-space-between mt-1">
                        <span class="truncate text-caption" style="max-width:70%;">{{ photo.name }}</span>
                        <v-menu>
                            <template v-slot:activator="{ props: menu }">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props: tooltip }">
                                        <v-hover>
                                            <template v-slot:default="{ isHovering, props: hover }">
                                                <v-card class="custom-button d-flex justify-center align-center"
                                                    :variant="isHovering ? 'tonal' : 'flat'" density="compact" flat
                                                    v-bind="mergeProps(menu, tooltip, hover)">
                                                    <v-icon size="small">mdi-dots-horizontal</v-icon>
                                                </v-card>
                                            </template>
                                        </v-hover>
                                    </template>
                                    <span>More Actions</span>
                                </v-tooltip>
                            </template>
                            <v-list density="compact">
                                <v-list-item append-icon="mdi-arrow-right" @click="previewInNewTab(photo.src)">Open
                                    in
                                    New
                                    Tab</v-list-item>
                                <v-list-item append-icon="mdi-crop-rotate"
                                    @click="cropImage(photo)">Crop/Rotate</v-list-item>
                                <v-list-item append-icon="mdi-pencil" @click="">Edit</v-list-item>
                                <v-list-item append-icon="mdi-delete"
                                    @click="deletePhoto(photo.id)">Delete</v-list-item>
                                <v-list-item append-icon="mdi-tray-arrow-down"
                                    @click="downloadImage(photo.src, photo.name)">Download</v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </v-col>
            </div>
        </div>
        <v-divider></v-divider>
        <div class="flex-shrink-1 pa-1">
            <DropZone acceptedTypes="image/jpg, image/png, image/jpeg, image/gif" @filesSelected="uploadPhotos"
                @invalidFileType="invalidFileType" />
        </div>
        <ImagePreview :images="photos?.map(photo => photo.src)" :initialIndex="selectedIndex"
            :modelValue="ImagePreviewDialog" @update:modelValue="ImagePreviewDialog = $event"
            @close="closeImagePreview" />


        <ImageCropRotate :image="selectedImageSrc" v-model="cropRotateDialog" />
    </v-sheet>
</template>

<script setup lang="ts">
import { ref, mergeProps } from 'vue'
import type { File } from "~/types/shared/file";
import ImagePreview from '~/components/shared/ImagePreview.vue';
import DropZone from './DropZone.vue'
import ImageCropRotate from './ImageCropRotate.vue'

const props = defineProps({
    photos: {
        type: Array as PropType<File[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits(['uploadPhotos', 'deletePhoto', 'invalidFileType'])

const ImagePreviewDialog = ref<boolean>(false);
const cropRotateDialog = ref<boolean>(false);
const selectedImageSrc = ref<string>('');

const selectedIndex = ref(0);

function cropImage(image: File) {
    selectedImageSrc.value = 'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg' //image.src
    cropRotateDialog.value = true
}

function showImage(index: number) {
    selectedIndex.value = index;
    ImagePreviewDialog.value = true;
}

const closeImagePreview = () => {
    ImagePreviewDialog.value = false;
}


const uploadPhotos = (event: File[]) => {
    emit('uploadPhotos', event)
}


// const downloadImage = (src: string, filename: string) => {
//     const link = document.createElement('a');
//     link.href = src;
//     link.download = filename; // Specify the file name for download
//     document.body.appendChild(link); // Append to the document
//     link.click(); // Trigger the download
//     document.body.removeChild(link); // Clean up
// }

function downloadImage(src: string, filename: string) {
    fetch(src)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob(); // Convert the response to a Blob
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
            const link = document.createElement('a');
            link.href = url;
            link.download = filename; // Specify the file name for download
            document.body.appendChild(link); // Append to the document
            link.click(); // Trigger the download
            document.body.removeChild(link); // Clean up
            window.URL.revokeObjectURL(url); // Release the object URL
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

const previewInNewTab = (src: string) => {
    window.open(src, " _blank");
}

const deletePhoto = (photoId: number) => {
    emit('deletePhoto', photoId)
}

const invalidFileType = (status: boolean) => {
    emit('invalidFileType', status)
}

const getSource = (uploaderCategory: string) => {
    switch (uploaderCategory) {
        case 'App\\Domains\\Maintenance\\Workorder':
            return 'work orders';
        case 'App\\Domains\\Maintenance\\Issue':
            return 'issues';
        case 'App\\Domains\\Maintenance\\Inspection':
            return 'inspections';
        case 'App\\Domains\\Maintenance\\ItemFailure':
            return 'item failures';
        case 'App\\Domains\\Maintenance\\Vehicle':
            return 'Vehicles';
        default:
            return 'unknown';
    }
}
</script>

<style scoped>
.small-text {
    font-size: 0.6rem;
    /* Adjust as needed */
}

.truncate {
    white-space: nowrap;
    /* Prevents the text from wrapping to a new line */
    overflow: hidden;
    /* Hides the overflow text */
    text-overflow: ellipsis;
    /* Displays ellipsis (...) when text overflows */
}


/* Optional styling */
.custom-button {
    width: 20px;
    height: 20px;
}
</style>
