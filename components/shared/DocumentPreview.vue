<template>
    <v-sheet>
        <SharedImagePreview v-model="imageDialog" :images="previewImages" />
        <v-progress-linear v-if="loading" color="primary" indeterminate />
        <v-row no-gutters style="height: 100%">
            <!-- LEFT PANEL: TREEVIEW -->
            <v-col cols="4" style="height:100%">
                <v-sheet class="d-flex flex-column" style="position:relative;height:100%">
                    <slot name="top"></slot>

                    <v-treeview class="flex-grow-1" :items="treeItems" v-model:opened="opened"
                        v-model:activated="activated" :item-title="itemTitle" item-value="id" :search="search"
                        :custom-filter="filterFunction" color="primary" activatable open-on-click transition mandatory
                        :item-children="itemChildren">
                        <!-- Folder/File icon logic -->
                        <template v-slot:prepend="{ item, isOpen }">
                            <v-icon v-if="item.originalItem && item.originalItem[itemType] === 'folder'">
                                {{ isOpen ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else-if="fileIcons && item.originalItem[itemType] === 'file'" :color="item.color">
                                {{ item.icon }}
                            </v-icon>
                        </template>

                        <!-- Extra Actions (slot passed in from parent) -->
                        <template v-slot:append="{ item }">
                            <slot name="treeview-actions" :item="item.originalItem ?? item"></slot>
                        </template>
                    </v-treeview>

                    <slot name="bottom"></slot>
                </v-sheet>
            </v-col>
            <!-- RIGHT PANEL: PREVIEW / DETAILS -->
            <v-col cols="8" style="height:100%">
                <v-card flat style="overflow-y:auto; height:100%">
                    <v-card-text>
                        <v-scroll-y-transition mode="out-in">
                            <div v-if="!loading && !items.length">NO ITEMS</div>

                            <div v-else-if="selected">
                                <!-- slot for custom details markup -->
                                <slot name="details" :selected="selected" :props="selectedProps"
                                    :viewDocument="viewDocument" :downloadDocument="downloadDocument"
                                    :canPreview="canPreviewDocument" :getIconAndColor="getFileIconAndColor" />
                            </div>
                        </v-scroll-y-transition>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { getFileExtension, getFileType, getFileIconAndColor } from '~/composables/fileManipulation';

const props = defineProps({
    items: {
        type: Array as PropType<Record<string, any>[]>,
        required: true,
    },
    itemSrc: {
        type: String,
        default: 'src'
    },
    itemTitle: {
        type: String,
        default: 'name'
    },
    itemType: {
        type: String,
        default: 'type'
    },
    itemChildren: {
        type: String,
        default: 'children'
    },
    loading: {
        type: Boolean,
        default: false
    },
    fileIcons: {
        type: Boolean,
        default: true
    },

    filterFunction: {
        type: Function,
        default: (value: string, search: string, item: any) => {
            return value.toLowerCase().includes(search.toLowerCase());
        }
    },
    search: {
        type: String,
        default: '',
    },
});

const emits = defineEmits(['edit', 'delete', 'addItemToFolder']);

const layoutStore = useLayoutStore();

/**
 * States for <v-treeview>
 */
const opened = ref<any[]>([]);
const activated = ref<any[]>([]);

/**
 * A fast lookup for "selected" items by ID (instead of recursive search).
 */
const itemMap = ref<Record<number | string, Record<string, any>>>({});

/**
 * Build the tree items for <v-treeview> while also populating `itemMap`.
 * This runs once each time `props.items` changes (due to `computed`).
 */
function transformItemsForTree(parentId: number, items: Record<string, any>[]): Record<string, any>[] {
    return items.map((item) => {
        // Always store a reference in our map for quick ID lookup
        const id = `${parentId}-${item[props.itemType]}-${item.id}`

        itemMap.value[id] = item;

        // If it's a folder, transform children recursively
        if (item[props.itemType] === 'folder' && Array.isArray(item[props.itemChildren])) {
            return {
                ...item,
                id,
                // store reference to original
                originalItem: item,
                [props.itemChildren]: transformItemsForTree(item.id, item[props.itemChildren]),
                // (optionally) you can compute an icon for folder here
            };
        }

        if (item[props.itemType] === 'file-group') {
            return {
                ...item,
                id,
                originalItem: item,
            };
        }

        if (item[props.itemType] == 'file') {
            // If not a folder, we don't want children in the tree
            const { icon, color } = getFileIconAndColor(item[props.itemSrc]);
            return {
                ...item,
                id,
                originalItem: item,  // keep reference
                icon,
                color,
                file_type: getFileType(item[props.itemSrc]),
                file_extension: getFileExtension(item[props.itemSrc]),
                [props.itemChildren]: undefined
            }
        }

        return {
            ...item,
            id,
            originalItem: item,
        }
    });
}

const treeItems = computed(() => {
    // Clear map each time to rebuild fresh
    itemMap.value = {};
    return transformItemsForTree(0, props.items);
});

/**
 * Return the currently "activated" item from the original array.
 * Because we set item-value="id", `activated.value[0]` is the item ID.
 */
const selected = computed(() => {
    const id = activated.value[0];
    if (!id) return undefined;
    return itemMap.value[id];
});

const selectedProps = computed(() => {
    if (!selected.value) return {};
    if (['folder', 'file-group'].includes(selected.value[props.itemType])) {
        return {}
    }
    if (selected.value[props.itemType] == 'file') {
        const { icon, color } = getFileIconAndColor(selected.value[props.itemSrc]);
        return {
            icon,
            color,
            file_type: getFileType(selected.value[props.itemSrc]),
            file_extension: getFileExtension(selected.value[props.itemSrc]),
        };
    }
    return {}
});

/**
 * IMAGE PREVIEW
 */
const imageDialog = ref(false);
const previewImages = ref<string[]>([]);
const previewExtensions = ref<string[]>(['png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']);

function canPreviewDocument(src: string) {
    const extension = getFileExtension(src);
    return previewExtensions.value.includes(extension)
}
/**
 * VIEW / PREVIEW DOCUMENT
 */
function viewDocument(document: Record<string, any>) {
    const extension = getFileExtension(document[props.itemSrc]);
    let baseSrc = '';
    let url = '';

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'gif':
        case 'jpeg':
            previewImages.value = [document[props.itemSrc]];
            imageDialog.value = true;
            break;
        case 'mp4':
        case 'avi':
            // Could open a video dialog, etc.
            break;
        case 'pdf':
            window.open(document[props.itemSrc], '_blank');
            break;
        case 'doc':
        case 'docx':
            baseSrc = 'https://docs.google.com/gview';
            url = `${baseSrc}?url=${document[props.itemSrc]}`;
            window.open(url, '_blank');
            break;
        case 'xls':
        case 'xlsx':
        case 'ppt':
        case 'pptx':
            baseSrc = 'https://view.officeapps.live.com/op/view.aspx';
            url = `${baseSrc}?src=${document[props.itemSrc]}`;
            window.open(url, '_blank');
            break;
        default:
            layoutStore.showErrorDialog('Cannot preview this file type');
            break;
    }
}

/**
 * DOWNLOAD DOCUMENT
 */
function downloadDocument(file: Record<string, any>) {
    layoutStore.setOverlay(true);

    fetch(file[props.itemSrc])
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${file[props.itemTitle]}.${getFileExtension(file[props.itemSrc])}`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error(error);
            layoutStore.showErrorDialog('Download failed');
        })
        .finally(() => {
            layoutStore.setOverlay(false);
        });
}
</script>

<style scoped>
/* Your custom styles here */
</style>