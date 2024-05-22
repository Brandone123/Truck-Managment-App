<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { defineProps, getCurrentInstance, defineEmits } from 'vue'
import { useTheme } from "vuetify";
import type { PropType } from 'vue';

import type { filterItem, filterItemOptionObject } from '@/types/layout/table'
import type { VDataTable } from 'vuetify/components'

type Headers = InstanceType<typeof VDataTable>['headers']

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
    }
});

// const theme = useTheme();
const primary = 'blue'; // theme.current.value.colors.primary;

// const instance = getCurrentInstance();
// defineEmits(['selectedItems']);
const selectedItems = ref([])

// const isSticky = ref<boolean>(false);
const search = ref<string>('');


//store selected filter values
const selectedFilterValues = ref<{ [key: string]: string | null }>({});

const filteredHeaders = computed(() => {
    return props.headers
})

const selectedDate = computed(() => {
    return new Date()
})

const filteredItems = computed(() => {
    // if (!props.dateSelectorKey) {
    //     return props.items
    // }

    return props.items.filter((item: any) => {
        let dateMatch = true
        if (!!props.dateSelectorKey) {
            // Check if the date key on item matches the selected date
            let datePath = props.dateSelectorKey.split(".")
            let dateItem = item
            datePath.forEach(datePathItem => {
                if(item && datePathItem in item){
                     dateItem = item[datePathItem]
                }
            })
            // dateMatch = item[props.dateSelectorKey] == selectedDate
            dateMatch = dateItem == selectedDate
        }

        return Object.entries(selectedFilterValues.value).every(([key, value]) => {
            // Use the dynamic key and value to filter the array
            if (typeof key == 'string' && value != null) {
                let path = key?.split('.')
                let result = item
                path?.forEach(pathItem => {
                    if(result && pathItem in result){
                         result =  result[pathItem]
                    }
                })
                return result == value
            }
            return true
            // return value != null ? item[key] === value : true
        }) && dateMatch
    })
})

// const handleSticky = () => {
//     const element = document.querySelector('.sticky-element thead tr') as HTMLElement | null;
//     if (element) {
//         isSticky.value = Math.round(element.offsetTop - window.scrollY) == 48
//     }
// }

// const bulkSelection = () => {
//     if (instance) {
//         instance.emit('selectedItems', selectedItems.value)
//     }
// }

const stickyPositions = () => {
    const stickyPageTop = document.querySelector('.sticky-page-top') as HTMLElement | null;
    const stickyPageTopHeight = stickyPageTop ? window.getComputedStyle(stickyPageTop)?.height : '0';

    const topContentElement = document.querySelector('.top-content') as HTMLElement | null;
    const topContentHeight = topContentElement ? window.getComputedStyle(topContentElement)?.height : '0';

    if (topContentElement) {
        topContentElement.style.top = `${48 + parseFloat(stickyPageTopHeight)}px`
    }

    const tableElementHeader = document.querySelector('.v-table.v-data-table thead tr ') as HTMLElement | null;
    if (tableElementHeader) {
        // tableElementHeader.style.top = topContentHeight ? `${48 + parseFloat(stickyPageTopHeight) + parseFloat(topContentHeight)}px` : '48px';
        tableElementHeader.style.top = '0';
    }

}

onMounted(() => {
    if (window) {
        window.addEventListener('mousemove', stickyPositions);
    }
    // window.addEventListener('scroll', handleSticky);
});

onUnmounted(() => {
    // window.removeEventListener('scroll', handleSticky);
});

defineExpose({
  selectedItems
})
</script>

<template>
    <!-- <v-data-table :search="search" :hover="true" v-bind="{ ...$props, headers: filteredHeaders, items: filteredItems }" -->
    <v-data-table :search="search" v-model="selectedItems" :hover="true" :headers="(filteredHeaders as Array<any>)"
        :items="(filteredItems as Array<any>)" density="compact" class="sticky-element" :loading="props.loading">
        <!-- 
        <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template> -->

        <template v-if="!$slots['top']" v-slot:top>
            <div class="top-content" style="background-color: #EEEEEE">
                <div class="d-flex my-2 align-center justify-space-between">
                    <div class="d-flex">

                        <!-- slot activated when items selected -->
                        <slot v-if="selectedItems.length" name="bulkActions" :selectedItems="selectedItems"></slot>

                        <!-- Define Filters In Parent Component -->
                        <slot v-else-if="$slots['filters']" name="filters"></slot>

                        <!-- Let Table Render Filters (Select Fields Only) -->
                        <template v-else-if="filters.length" v-for="filter in (filters as Array<filterItem>)">
                            <v-autocomplete v-if="typeof filter.items[0] == 'string'" clearable flat class="mr-1"
                                :label="filter.title" :items="filter.items" :style="{ width: filter.width || '150px' }"
                                variant="solo" density="compact" hide-details
                                v-model="selectedFilterValues[filter.key]"></v-autocomplete>

                            <v-autocomplete v-else clearable flat class="mr-1" :label="filter.title" :items="filter.items"
                                :style="{ width: filter.width || '150px' }" variant="solo" density="compact"
                                hide-details item-title="text" item-value="value"
                                v-model="selectedFilterValues[filter.key]"></v-autocomplete>
                        </template>
                    </div>
                    <div>
                        <v-text-field flat style="width:300px" variant="solo" prepend-inner-icon="mdi-magnify"
                            hide-details density="compact" v-model="search" placeholder="Search"></v-text-field>
                    </div>
                </div>
                <v-card class="rounded-0" flat style="width:100%" v-if="$props.showFooterInHead">
                    <v-data-table-footer items-per-page-text="$vuetify.dataTable.itemsPerPageText">
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
            </div>
        </template>
        <template v-if="!$slots['bottom']" v-slot:bottom>
            <v-divider></v-divider>
            <v-card class="rounded-0" flat>
                <v-data-table-footer items-per-page-text="$vuetify.dataTable.itemsPerPageText" />
                <v-divider></v-divider>
            </v-card>
        </template>

        <!--Default slots here -->
        <template v-for="(  _, slot ) in $slots" v-slot:[slot]="slotProps">
            <slot :name="slot" v-bind="slotProps" v-if="slot != 'loading'"></slot>
        </template>
    </v-data-table>
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

/* .top-content {
    position: sticky; */
/* Make sticky below app-bar of height 50px */
/* top: 48px; */
/* z-index: 2; */
/* }  */

.v-table.v-data-table:deep() thead tr {
    position: sticky;
    /* top: 48px; */
    /* Make sticky below app-bar of height 50px */
    /* z-index: 2; */
}

.v-table.v-data-table :deep() .v-table__wrapper {
    /* overflow: unset; */
    overflow-y: auto;
}

/* .v-table.v-data-table {
  transform: scale(0.8);
  width: calc(100% / 0.8) !important; 
  transform-origin: top left;
} */

.v-table.v-data-table :deep() th  {
  white-space: nowrap !important;
}
</style>