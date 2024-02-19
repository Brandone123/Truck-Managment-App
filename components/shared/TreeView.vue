<template>
    <v-list density="compact">
        <template v-for="(item, i) in Object.keys(items)" :key="i">
            <v-list-item density="compact" :class="[`pl-${indentLevel}0`]">
                <template v-slot:prepend>
                    <v-list-item-action start>
                        <v-icon v-if="items[item].children" @click="toggleItem(items[item])">
                            {{ isOpen(items[item]) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                        </v-icon>
                        <v-checkbox-btn color="primary" :update:modelValue="toggleChildren(items[item])"
                            v-model="items[item].value" :disabled="!activated"></v-checkbox-btn>
                    </v-list-item-action>
                </template>
                <v-list-item-title @click="toggleItem(items[item])">{{ items[item].name }}</v-list-item-title>
            </v-list-item>
            <v-slide-y-transition>
                <shared-tree-view :activated="activated" :class="[`pl-${indentLevel}0`]"
                    v-if="isOpen(items[item]) && items[item].children" :items="items[item].children"
                    :indent-level="indentLevel + 1"></shared-tree-view>
            </v-slide-y-transition>
        </template>
    </v-list>
</template>
  
<script lang="ts">
import { ref } from 'vue';

export default {
    name: 'SharedTreeView',
    props: {
        items: {
            type: Array,
            required: true,
        },
        indentLevel: {
            type: Number,
            default: 0,
        },
        activated: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const openItems = ref([]);

        const toggleItem = (item: any) => {
            if (item.value) {
                if (isOpen(item)) {
                    // openItems.value = openItems.value.filter((name) => name !== item.name);
                    closeItem(item)
                } else {
                    openItems.value.push(item.name);
                }
            }

        };

        const toggleChildren = (item: any) => {
            if (item.value) {
                if (!isOpen(item)) {
                    toggleItem(item)
                }
            } else {
                if (isOpen(item)) {
                    closeItem(item)
                }
            }
        }

        const closeItem = (item: any) => {
            openItems.value = openItems.value.filter((name) => name !== item.name);
        }

        const isOpen = (item: any) => {
            return openItems.value.includes(item.name);
        };

        return {
            toggleItem,
            isOpen,
            toggleChildren
        };
    },
};
</script>