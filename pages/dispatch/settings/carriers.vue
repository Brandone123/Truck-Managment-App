<script setup lang="ts">
import { ref } from 'vue';

var tab = ref(null);

</script>
<template>
    <div>
        <v-tabs v-model="tab" center-active color="primary" density="compact">
            <v-tab value="tab-1" density="compact">
                Carrier Types
            </v-tab>

            <v-tab value="tab-2" density="compact">
                Carrier Ranking
            </v-tab>
        </v-tabs>

        <v-window v-model="tab" style="overflow:visible;">
            <v-window-item value="tab-1">
                <SettingsDispatchCarrierTypes/>
            </v-window-item>
            <v-window-item value="tab-2">
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