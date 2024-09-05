<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" variant="text" icon color="primary" size="x-small">
              <v-icon>mdi-help</v-icon>
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="title">
                <v-card-text>
                    {{ texts }}
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script>

export default {
    name: 'DisplayModal',
    props: {
        texts: {
            type: String,
            required: true
        },
        title: {
          type: String,
          required: true
        }
    }
}
</script>