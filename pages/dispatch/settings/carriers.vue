<script setup lang="ts">
import { ref } from 'vue';
import {useCarrierStore} from '@/stores/settings/dispatch/carrier'
import type { CarrierInfo } from '~/types/dispatch/carrier';

var tab = ref(null);

const carrierListStore = useCarrierStore()
const {carrierList} = storeToRefs(carrierListStore)

const updatingCarrier = ref(false)
const carrierDialog = ref(false)

const layoutStore = useLayoutStore()

const carrierHeaders = ref([
    { title: 'CARRIER ID', key: 'id', class: "no-wrap" },
    { title: 'CARRIER NAME', key: 'name', class: "no-wrap"},
    { title: 'CARRIER EMAIL', key: 'contact_email', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const defaultCarrier = ref<CarrierInfo>({
    id: null,
    name: null,
    contact_email: null,
});

const editedCarrier = ref(defaultCarrier.value)

const editCarrier = (carrier: CarrierInfo) => {
    editedCarrier.value = Object.assign({}, carrier)
    updatingCarrier.value = true
    carrierDialog.value = true
}

const updateCarriersDialog = (value: boolean) => {
    carrierDialog.value = value
    editedCarrier.value = defaultCarrier.value as CarrierInfo
    updatingCarrier.value = false
}

const deleteCarrier = async (carrier_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
      carrierListStore.deleteCarrier(carrier_Id)
    }
}

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

</script>
<template>
    <div>
        <v-tabs v-model="tab" center-active color="primary" density="compact">
          <v-tab value="tab-1" density="compact">
                Carriers
            </v-tab>
            <v-tab value="tab-2" density="compact">
                Carrier Types
            </v-tab>

            <v-tab value="tab-3" density="compact">
                Carrier Ranking
            </v-tab>
        </v-tabs>

        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="tab-1">
              <template>
                <div>
                    <div class="d-flex justify-space-between">
                        <SettingsDriverDialog :show="carrierDialog"
                            @update:show="updateCarriersDialog" :updating="updatingCarrier" :item="editedCarrier" />
                    </div>
                    <div>
                        <SharedUiCustomTable ref="carrierTable" show-select return-object :headers="carrierHeaders" :items="carrierList"
                            >
                            <!-- Slot to capture bulk actions -->
                            <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                                <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                                    <v-icon>mdi-printer</v-icon> Print
                                </v-btn>
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <div>
                                    <v-icon color="primary" dense @click="editCarrier(item)">mdi-pencil</v-icon>
                                    <v-icon color="red" dense @click="deleteCarrier(item.id)">mdi-delete</v-icon>
                                </div>
                            </template>
                        </SharedUiCustomTable>
                    </div>
                </div>
            </template>
            </v-window-item>
            <v-window-item value="tab-2">
                <SettingsDispatchCarrierTypes/>
            </v-window-item>
            <v-window-item value="tab-3">
                <SettingsDispatchCarrierRanking/>
            </v-window-item>
        </v-window>
    </div>

    <!-- <div>
    <h1>Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
        <button @click="editPost(post)">Edit</button>
        <button @click="deletePost(post.id)">Delete</button>
      </li>
    </ul>

    <form @submit.prevent="createPost">
      <label for="postTitle">New Post Title:</label>
      <input v-model="newPostTitle" type="text" id="postTitle" required />
      <button type="submit">Create Post</button>
    </form>
  </div> -->
</template>

<!-- <script>
export default {
    
  data() {
    return {
      posts: [],
      newPostTitle: '',
      post: {
        id: 1,
        content: 'Post content goes here',
      },
    };
  },
  created() {
    // Fetch data from the server when the component is created
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      // Make a GET request to fetch posts from the server
      // Update the 'posts' data property with the retrieved data
    },
    async createPost() {
      // Make a POST request to create a new post
      // Use the 'newPostTitle' data property to get the new post title
      // Refresh the list of posts after creating the new post
    },
    async editPost(post) {
      // Allow users to edit a post and make a PUT request to update the server
      // Refresh the list of posts after editing
    },
    async deletePost(postId) {
      // Make a DELETE request to delete a post
      // Refresh the list of posts after deletion
    },
  },
};
</script> -->