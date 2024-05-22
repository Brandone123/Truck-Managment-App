<template>
  <v-card flat>
    <v-card-title>{{ moduleContent.title }}</v-card-title>
    <v-card-text>
      <p>This is an <strong>example</strong> of module content. It can include any HTML content such as</p>

      <ul class="px-5">
        <li><a href="#">Links</a></li>
        <li>Lists</li>
        <li>Images</li>
        <li>
          Videos
          <div>
            <video v-if="moduleContent.videoUrl" controls style="width:100%;">
              <source :src="moduleContent.videoUrl" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>

        </li>

        <li>
          Audio
          <div>
            <audio v-if="moduleContent.audioUrl" controls style="width:100%">
              <source :src="moduleContent.audioUrl" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ModuleContent {
  title: string;
  content: string; // This will be HTML content
  videoUrl?: string;
  audioUrl?: string;
}

// Sample data for the module content
const moduleContent = ref<ModuleContent>({
  title: 'Introduction to Module',
  content: '<p>This is an <strong>example</strong> of module content. It can include any HTML content such as <a href="#">links</a>, lists, images, etc.</p>',
  videoUrl: 'https://tekeye.uk/html/images/Joren_Falls_Izu_Jap.mp4', //path-to-your-video.mp4
  audioUrl: 'https://www.w3schools.com/tags/horse.mp3', //path-to-your-audio.mp3',
});
</script>

<style scoped>
.text-content p {
  margin-bottom: 1rem;
}
</style>