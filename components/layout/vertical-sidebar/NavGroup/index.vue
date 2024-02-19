<script setup type="ts">
import Icon from '../Icon.vue';
const props = defineProps({ 
    item: {
        type: Object, 
        required: true
    },
    showIcon: { type: Boolean, default: true }, 
    rail: { type: Boolean, default: false },
    // level:{
    //     type: Number,
    //     required: false,
    //     default: 0
    // }
    });
</script>

<template>
    <v-list-group>
        <template v-slot:activator="{ props }">
            <v-list-item :key="item.title" v-bind="props" :title="item.title">
                <!---If icon-->
                <template v-slot:prepend v-if="showIcon">
                    <v-tooltip location="right" v-if="rail">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props">
                                <Icon :item="item.icon" :level="0" />
                            </v-icon>
                        </template>
                        <span>{{ item.title }}</span>
                    </v-tooltip>
                    <v-icon v-else>
                        <Icon :item="item.icon" :level="0" />
                    </v-icon>
                </template>
            </v-list-item>
        </template>

        <template v-for="itemChild in item.children" v-if="!rail">
            <LayoutVerticalSidebarNavItem :item="itemChild" :level="1" />
        </template>
    </v-list-group>
</template>
