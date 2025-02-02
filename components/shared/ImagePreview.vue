<template>
  <v-overlay :model-value="modelValue" @update:model-value="updateModelValue" fullscreen persistent opacity="0.8">
    <v-btn variant="text" icon color="white" @click="close" style="position: absolute; top: 0; right: 30px;">
      <v-icon class="close">mdi-close</v-icon>
    </v-btn>
    <div class="d-flex align-center justify-center" style="height: 100vh; width: 100vw">
      <v-btn variant="text" icon color="white" @click="prevImage" :disabled="currentIndex === 0" class="nav-btn">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-img :src="images[currentIndex]" max-width="80%" max-height="80%" contain></v-img>
      <v-btn variant="text" icon color="white" @click="nextImage" :disabled="currentIndex === images.length - 1"
        class="nav-btn">
        <v-icon size="x-large">mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  images: {
    type: Array as any,
    required: true
  },
  initialIndex: {
    type: Number,
    required: true,
    default: 0,
  }

});

const emit = defineEmits(['update:modelValue']);


const currentIndex = ref(props.initialIndex);

const { modelValue, images } = toRefs(props);

const close = () => {
  emit('update:modelValue', false);
}

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

function nextImage() {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
}

function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

watch(() => props.modelValue, (value) => {
  modelValue.value = value;
  currentIndex.value = props.initialIndex
});

</script>

<style scoped>
.nav-btn:first-of-type {
  left: 10px;
}

.nav-btn:last-of-type {
  right: 10px;
}
</style>