<template>
    <v-card variant="tonal" :color="isDragging ? 'primary' : ''" class="drop-zone d-flex justify-center align-center"
        :class="{ 'drop-zone--over': isDragging }" @click="onClick" @dragenter="isDragging = true"
        @dragleave="isDragging = false" @drop.prevent="handleDrop">
        <span class="d-flex justify-center align-center">
            <v-icon size="50" color="grey">mdi-file-plus</v-icon>
            <div>
                <span class="text-body text-deep-grey">Drag and drop files to upload</span><br>
                <span class="text-caption text-grey">or click to pick file</span>
            </div>
        </span>
        <input multiple ref="fileInput" @change="storeFiles" :accept="acceptedTypes" class="drop-zone__input"
            type="file" name="" id="">
    </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

// Define props
const props = defineProps<{
    acceptedTypes?: string;
}>();

const emit = defineEmits<{ (e: 'filesSelected', files: File[]): void, (e: 'invalidFileType', invalid: boolean): boolean }>();
// Local state
const fileInput = ref<HTMLInputElement | null>(null);
// const isDragging = ref(false);

// Event handlers
const onClick = () => {
    fileInput.value?.click();
};

// const isValidFileType = (file: File) => {
//     if (!props.acceptedTypes) return true;
//     const acceptedTypesArray = props.acceptedTypes.split(',').map(type => type.trim().toLowerCase());
//     const fileExtension = file.name.split('.').pop()?.toLowerCase();

//     return acceptedTypesArray.includes(fileExtension ?? '');
// };
const isValidFileType = (file: File) => {
    if (!props.acceptedTypes) return true;

    // Convert accepted types to an array of lowercase MIME types
    const acceptedTypesArray = props.acceptedTypes.split(',').map(type => type.trim().toLowerCase());

    // Check if the file's MIME type is in the accepted types array
    return acceptedTypesArray.includes(file.type.toLowerCase());
};


const isDragging = ref(false)
const events = ['dragenter', 'dragleave', 'dragover', 'drop']

const handleDrop = (e: DragEvent): void => {
    const files = e.dataTransfer?.files as FileList
    const fileArray = Array.from(files).filter(isValidFileType);
    if (fileArray.length > 0) {
        emit("filesSelected", fileArray);
    }
    else {
        emit('invalidFileType', true)
    }
}

const storeFiles = (e: Event): void => {
    const files = (e.target as HTMLInputElement).files as FileList
    const fileArray = Array.from(files).filter(isValidFileType);

    if (fileArray.length > 0) {
        emit("filesSelected", fileArray);
    }
    else {
        emit('invalidFileType', true)
    }
    if (e.target) {
        (e.target as HTMLFormElement).value = null
    }

}

onMounted(() => {
    events.forEach(event => document.body.addEventListener(event, (e) => e.preventDefault()))
})
onUnmounted(() => {
    events.forEach(event => document.body.removeEventListener(event, (e) => e.preventDefault()))
})
</script>

<style scoped>
.drop-zone {
    height: 80px;
    cursor: pointer;
}

.drop-zone--over {
    border-style: solid;
}

.drop-zone__input {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    width: auto;
}
</style>