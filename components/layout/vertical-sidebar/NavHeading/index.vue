<script setup type="ts">
const props = defineProps({
    item: { type: Object, required: true }
});
</script>

<template>
    <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold">
        {{ item.header }}
    </v-list-subheader>
    <!-- <v-list density="compact">
        <v-list-group v-model="item.active" v-for="menu in menuItems">
            <template v-slot:activator="{ props }">
                <v-list-item :key="item.title" v-bind="props" :title="item.title"></v-list-item>
            </template>
            <v-list-item v-for="subMenu in item.subMenuItems" :key="subMenu" :title="subMenu"></v-list-item>
        </v-list-group>
    </v-list> -->
</template>
