<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, computed, defineExpose, watch, nextTick } from 'vue';
import { defineProps, getCurrentInstance, defineEmits } from 'vue'
import { useTheme } from "vuetify";
import type { PropType } from 'vue';

import type { filterItem, filterItemOptionObject } from '@/types/layout/table'
import type { VDataTable } from 'vuetify/components'

import { useFixedScrollbar } from '@/composables/fixedScrollbar';
import Index from '~/pages/index.vue';

type Headers = InstanceType<typeof VDataTable>['headers']
const emit = defineEmits(['update:selectedValue', 'update:selectedFilters', 'update:modelValue', 'hoveredRow']);

interface SlotProps {
    [key: string]: any; // You can define more specific types for your props
}

const props = defineProps({
    headers: [Array] as PropType<Headers>,
    items: {
        type: Array,
        required: true,
    },
    filters: {
        type: Array<filterItem>,
        default: [],
    },
    dateSelectorKey: {
        type: [String, null] as PropType<string | null>,
        required: false,
        default: null
    },
    loading: {
        type: Boolean,
        default: false,
    },
    showFooterInHead: {
        type: Boolean,
        required: false,
        default: true,
    },
    stickyTop: {
        type: Boolean,
        default: false,
        required: false,
    },
    stickyTopOffset: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: false
    },
    searchable: {
        type: Boolean,
        default: true,
        required: false
    },
    sortBy: {
        type: Array,
        default: [],
        required: false,
    },
    modelValue: {
        type: Array,
        default: [],
        required: false,
    },
    hideTopbar: {
        type: Boolean,
        default: false
    },
    dynamicSearch: {
        type: Boolean,
        default: false
    }
});

const classname = ref(`table-${Math.random().toString(36).substring(2, 8)}`)

// create custom sticky horizontal scrollbar in the custom table
const { updateShowOverflowParent } = useFixedScrollbar({
    fixedScrollbarSelector: `.${classname.value} .v-table__wrapper`,
    isActive: props.isActive
})


const tableItems = ref<any[]>([])

// Watch the prop 'isActive' and call 'updateShowOverflowParent' with the new value
watch(() => props.isActive, (newVal, oldVal) => {
    updateShowOverflowParent(newVal);
})

const theme = useTheme();
const primary = theme.current.value.colors.primary;

// const instance = getCurrentInstance();
// defineEmits(['bulkSelection']);
// const bulkSelection = ref<any[]>(JSON.parse(JSON.stringify(props.selectedItems)))

// watch(() => props.selectedItems, (newVal) => {
//     bulkSelection.value = JSON.parse(JSON.stringify(newVal))
// })

// const isSticky = ref<boolean>(false);

const bulkSelection = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
const search = ref<string>('');

const searchField = ref<string>('');

// const tableRows = ref<NodeListOf<Element> | null>(null)

const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isTyping = ref<boolean>(false)

const searchTable = () => {
    search.value = (searchField.value || "").trim() //.toLowerCase();
}

const searchTableDynamic = () => {
    if (props.dynamicSearch) {
        isTyping.value = true

        // 1) Clear any previously scheduled timer
        if (typingTimer.value) {
            clearTimeout(typingTimer.value)
        }

        // 2) Start a new timer (e.g., 500ms)
        typingTimer.value = setTimeout(() => {
            // The user hasn't typed for 500ms
            isTyping.value = false
            search.value = (searchField.value || "").trim() //.toLowerCase();
        }, 500)
    }
}

//auto clear search parameters when search field is empty
watch(() => searchField.value, (newVal) => {
    if ((newVal || "").length == 0) {
        search.value = ''
    }
})

const tableRows = ref<NodeListOf<HTMLTableRowElement> | null>(null);
const listenerMap = new Map<Element, { mouseOver: EventListener; mouseLeave: EventListener }>();

const mouseOver = (index: number) => {
    emit('hoveredRow', index); // Set the hovered row index
};

const mouseLeave = () => {
    emit('hoveredRow', null); // Reset hovered row index
};


// const mouseOverHandler = (event: Element) => {
//     const rowIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
//     emit('hoveredRow', rowIndex) // Set the hovered row index
// }
// const mouseLeaveHandler = () => {
//     emit('hoveredRow', null) // Reset hovered row index
// }

//store selected filter values
const selectedFilterValues = ref<{ [key: string]: string | null | string[] }>({});

const filteredHeaders = computed(() => {
    return props.headers
})

// const selectedDate = computed(() => {
//     return new Date()
// })

const updateFilters = () => {
    let payload = JSON.parse(JSON.stringify(selectedFilterValues.value))
    for (const key in payload) {
        if (payload[key] === null || payload[key] === "") {
            delete payload[key];
        }
    }
    emit('update:selectedFilters', payload)
}

// const handleSticky = () => {
//     const element = document.querySelector('.sticky-element thead tr') as HTMLElement | null;
//     if (element) {
//         isSticky.value = Math.round(element.offsetTop - window.scrollY) == 48
//     }
// }

// const bulkSelection = () => {
//     if (instance) {
//         instance.emit('bulkSelection', bulkSelection.value)
//     }
// }

// const stickyPositions = () => {
//     const stickyPageTop = document.querySelector('.sticky-page-top') as HTMLElement | null;
//     const stickyPageTopHeight = stickyPageTop ? window.getComputedStyle(stickyPageTop)?.height : '0';

//     const topContentElement = document.querySelector('.top-content') as HTMLElement | null;
//     const topContentHeight = topContentElement ? window.getComputedStyle(topContentElement)?.height : '0';

//     if (topContentElement) {
//         topContentElement.style.top = `${48 + parseFloat(stickyPageTopHeight)}px`
//     }

//     const tableElementHeader = document.querySelector('.v-table.v-data-table thead') as HTMLElement | null;
//     if (tableElementHeader) {
//         // tableElementHeader.style.top = topContentHeight ? `${48 + parseFloat(stickyPageTopHeight) + parseFloat(topContentHeight)}px` : '48px';
//         tableElementHeader.style.top = '0';
//     }

// }

const stickyTopStyle = computed(() => {
    return props.stickyTop ? {
        position: 'sticky',
        top: `${48 + props.stickyTopOffset}px`,
        zIndex: 2
    } : {}
    // return {}
})


const addRowHoverListeners = () => {
    nextTick(() => {
        // Get all the rows in the table after rendering
        tableRows.value = document.querySelectorAll('.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading)');

        tableRows.value?.forEach((row, index) => {
            // Create and store event listeners for this row
            const mouseOverListener = () => mouseOver(index);
            const mouseLeaveListener = mouseLeave;

            listenerMap.set(row, { mouseOver: mouseOverListener, mouseLeave: mouseLeaveListener });

            // Add mouse event listeners to the row
            row.addEventListener('mouseover', mouseOverListener);
            row.addEventListener('mouseleave', mouseLeaveListener);
        });
    });
};

const removeRowHoverListeners = () => {
    // Remove mouse event listeners from each row
    tableRows.value?.forEach((row) => {
        const listeners = listenerMap.get(row);

        if (listeners) {
            row.removeEventListener('mouseover', listeners.mouseOver);
            row.removeEventListener('mouseleave', listeners.mouseLeave);

            // Remove the listener reference from the map
            listenerMap.delete(row);
        }
    });

    mouseLeave(); // Ensure hover state is reset
};

onMounted(async () => {
    removeRowHoverListeners()
    addRowHoverListeners(); // Add listeners on initial mount for row hover listener
});

onUnmounted(() => {
    removeRowHoverListeners()
});

const onRowClick = (event: any, item: any) => {
    //item.internalItem contains the clicked row
    // console.log(item) 
}



watch(() => props.items, (newVal) => {
    removeRowHoverListeners(); // Remove old listeners
    nextTick(() => {
        tableItems.value = newVal
        addRowHoverListeners(); // Add new listeners
    })

}, { deep: true, immediate: true })

</script>

<template>
    <!-- <v-data-table :search="search" :hover="true" v-bind="{ ...$props, headers: filteredHeaders, items: filteredItems }" -->
    <v-data-table-server v-model="bulkSelection" @click:row="onRowClick" :search="search" :hover="true"
        :headers="(filteredHeaders as Array<any>)" :items="tableItems as Array<any>" density="compact"
        :class="classname" class="sticky-element" :loading="props.loading" :sort-by="$props.sortBy">
        <!-- 
        <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template> -->

        <template v-if="!$slots['top'] && !hideTopbar" v-slot:top>
            <div class="top-content sticky-top" style="background-color: #EEEEEE" :style="stickyTopStyle">
                <div class="d-flex my-2 align-center justify-space-between">

                    <div class="d-flex">

                        <!-- slot activated when items selected
                          -->
                        <slot v-if="bulkSelection.length" name="bulkActions" :selectedItems="bulkSelection"></slot>

                        <div class="d-inline-flex" v-else>
                            <!-- Define and manage Filters In Parent Component -->
                            <slot name="filters" class="d-flex flex-grow-1"></slot>

                            <!-- Let Table Render Filters (Select Fields Only) -->
                            <template v-if="filters.length" v-for="filter in (filters as Array<filterItem>)">
                                <v-text-field v-if="typeof filter.type != 'undefined'" clearable flat class="mr-1"
                                    :type="filter.type" :label="filter.title"
                                    :style="{ width: filter.width || '150px' }" variant="solo" density="compact"
                                    hide-details v-model="selectedFilterValues[filter.key]"
                                    @update:modelValue="updateFilters" />

                                <v-autocomplete v-else-if="typeof filter.items[0] == 'string'" clearable flat
                                    class="mr-1" :label="filter.title" :items="filter.items"
                                    :style="{ width: filter.width || '150px' }" variant="solo" density="compact"
                                    hide-details v-model="selectedFilterValues[filter.key]"
                                    @update:modelValue="updateFilters"></v-autocomplete>

                                <v-autocomplete v-else clearable flat class="mr-1" :label="filter.title"
                                    :items="filter.items" :style="{ width: filter.width || '150px' }" variant="solo"
                                    density="compact" hide-details item-title="text" item-value="value"
                                    v-model="selectedFilterValues[filter.key]"
                                    @update:modelValue="updateFilters"></v-autocomplete>
                            </template>
                        </div>

                    </div>

                    <div v-if="searchable">
                        <v-text-field flat style="width:350px" clearable variant="solo" hide-details density="compact"
                            v-model="searchField" placeholder="Search" @input="searchTableDynamic"
                            @keydown.enter="searchTableDynamic">
                            <template v-slot:append-inner>
                                <v-btn v-if="!dynamicSearch" flat color="primary" class="mr-n2"
                                    @click="searchTable"><v-icon>mdi-magnify</v-icon></v-btn>
                            </template>
                        </v-text-field>
                    </div>
                </div>
                <v-card class="rounded-0" flat style="width:100%" v-if="$props.showFooterInHead">
                    <v-data-table-footer items-per-page-text="$vuetify.dataTable.itemsPerPageText"
                        :itemsPerPageOptions="[50, 100, 200]">
                        <template v-slot:prepend>
                            <div v-if="dateSelectorKey">
                                <v-icon :color="primary">mdi-chevron-left</v-icon>
                                <span class="mx-2">Today</span>
                                <v-icon :color="primary">mdi-chevron-right</v-icon>
                            </div>
                            <v-spacer></v-spacer>
                        </template>
                    </v-data-table-footer>
                    <v-divider></v-divider>
                </v-card>
                <!-- <div class="custom-header">
                    <table>
                        <thead>
                            <v-data-table-headers></v-data-table-headers>
                        </thead>

                    </table>
                </div> -->
            </div>
        </template>
        <template v-if="!$slots['bottom']" v-slot:bottom>
            <v-divider></v-divider>
            <v-card class="rounded-0" flat>
                <v-data-table-footer items-per-page-text="$vuetify.dataTable.itemsPerPageText"
                    :itemsPerPageOptions="[50, 100, 200]" />
                <v-divider></v-divider>
            </v-card>
        </template>

        <!--Default slots here -->
        <template v-for="(_, slot) in $slots" v-slot:[slot]="slotProps">
            <slot :name="slot" v-bind="slotProps" v-if="slot && slot != 'loading'"></slot>
        </template>
    </v-data-table-server>
</template>


<style scoped>
.v-table.v-data-table {
    background-color: transparent !important;
}

.v-table.v-data-table :deep() td,
.v-table.v-data-table :deep() th {
    background-color: white;
}

.v-table.v-data-table,
.v-table.v-data-table :deep() tr {
    /* background-color: transparent !important; */
    margin-bottom: 3px #EEEEEE !important;
}

/* .v-table.v-data-table :deep() tr th:first-child */
.v-table.v-data-table :deep() tr td:first-child {
    border-top-left-radius: 4px !important;
    border-bottom-left-radius: 4px !important;
}

/* .v-table.v-data-table :deep() tr th:last-child, */
.v-table.v-data-table :deep() tr td:last-child {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
}

/* color for header line when not sticky */
.v-table.v-data-table:not(.sticky-active) :deep() thead tr th {
    /* border-bottom: 2px solid rgb(var(--v-theme-primary)) !important; */

    background-image: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 2px, transparent 2px);
    background-position: bottom;
    background-size: 100% 2px;
    background-repeat: no-repeat;
}

/* color for header line when sticky  */
.v-table.v-data-table.sticky-active :deep() thead tr th {
    background-image: linear-gradient(to bottom, blue 2px, transparent 2px);
    background-position: bottom;
    background-size: 100% 2px;
    background-repeat: no-repeat;
}

.v-table.v-data-table :deep() .v-table__wrapper {
    overflow-y: visible;
}

/* .v-table.v-data-table :deep() th {
    white-space: nowrap !important;
} */

.custom-header {
    overflow-x: auto;
    width: 100%;
}

.custom-header table {
    width: 100%;
    table-layout: auto;
    /* Ensures the header columns match the body columns */
}
</style>