<template>
    <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
        <v-card>
            <div class="d-flex">
                <v-sheet id="side-panel">
                    <div class="d-flex flex-column">
                        <v-tooltip text="Crop">
                            <template v-slot:activator="{ props }">
                                <v-card v-bind="props" @click="toggleAction('crop')"
                                    :color="activeAction == 'crop' ? 'primary' : ''"
                                    class="action-button ma-1 d-flex justify-center align-center side-button">
                                    <v-icon size="x-small">mdi-crop</v-icon>
                                </v-card>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Rotate">
                            <template v-slot:activator="{ props }">
                                <v-card v-bind="props" @click="toggleAction('rotate')"
                                    :color="activeAction == 'rotate' ? 'primary' : ''"
                                    class="action-button ma-1 d-flex justify-center align-center side-button">
                                    <v-icon size="x-small">mdi-rotate-3d-variant</v-icon>
                                </v-card>
                            </template>
                        </v-tooltip>
                    </div>
                </v-sheet>
                <v-divider vertical></v-divider>
                <div style="width: calc(100% - 50px)" class="flex-grow-1">
                    <!-- <Cropper ref="cropper" class="cropper" :src="image" :stencilProps="stencilProps"
                        :move-image="!preview" :resize-image="!preview" :foreground-class="{
                            cropper__foreground: true,
                            'cropper__foreground--hidden': preview,
                        }" :autoZoom="preview ? zoomCoordinates : undefined" /> -->
                        <div class="grey-background d-flex justify-end pa-1">
                            <v-btn color="red" size="small" icon variant="tonal" @click="dialog=false"><v-icon>mdi-window-close</v-icon></v-btn>
                        </div>
                    <div class="cropper-container d-flex flex-grow-1 align-center grey-background pa-1"
                        :class="{ 'justify-space-between': activeAction == 'rotate', 'justify-center': activeAction == 'crop' }">
                        <v-btn icon class="custom-button" v-if="activeAction == 'rotate'"
                            @click="rotateImageLeft"><v-icon>mdi-rotate-left</v-icon></v-btn>
                        <Cropper ref="cropper" class="cropper" :src="src" aspect-ratio="1"
                            :stencilProps="stencilProps" :foreground-class="{
                                cropper__foreground: !preview,
                                'cropper__foreground--hidden': preview
                            }"  @change="onChange"/>
                        <v-btn icon class="custom-button" v-if="activeAction == 'rotate'"
                            @click="rotateImageRight"><v-icon>mdi-rotate-right</v-icon></v-btn>
                    </div>
                    <v-spacer></v-spacer>

                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn @click="resetCropper" class="text-none" color="primary" variant="text">
                            Reset
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-if="getFullRotatedImage" @click="get" class="text-none" color="primary">
                            Update
                        </v-btn>
                        <v-btn v-else @click="save" class="text-none" color="primary" variant="text">
                            Save
                        </v-btn>
                    </v-card-actions>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Cropper, type CropperResult } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: true,
    }
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
    get() {
        return props.modelValue;
    }, set(value) {
        emit('update:modelValue', value)
    }
});

const activeAction = ref<string>('crop')
const src = ref<string | null>(null)
const cropper = ref<InstanceType<typeof Cropper> | null>(null);
    const uploadData = ref<Blob|null>(null)

watch(() => dialog.value, (val) => {
    if (val) {
        src.value = props.image
    }else{
        reset()
    }
})

const reset = () => {
    uploadData.value = null
    activeAction.value = 'crop'
    src.value = null
}

const preview = computed(()=>{
    return activeAction.value == 'crop' ? false : true
})

const stencilProps = computed(() => {
    if (preview.value) {
        return {
            handlers: {},
            lines: {},
            movable: false,
            resizable: false,
        };
    }
    return {};
})

const update = () => {
    emit('save',uploadData.value)
    dialog.value = false;
}

const save = () => {
    switch(activeAction.value){
        case 'crop':
        getCroppedImage()
            break;
        case 'rotate':
            getRotatedImage()
            break;
    }
}

// const setCropperBoundaries = () => {
//     const { width, height } = cropper.value?.getCanvasSize() || {};
//     cropper.value?.setCoordinates({
//         left: 0,
//         top: 0,
//         width: width || 0,
//         height: height || 0,
//     });
// };

const toggleAction =  (action: string) => {
    if(action == 'rotate'){
        cropper.value?.reset();
    }
    activeAction.value = action as any;
    uploadData.value = null
}

const rotateImageLeft = async () => {
    cropper.value?.rotate(-90);
    uploadData.value = null
}

const rotateImageRight = () => {
    cropper.value?.rotate(90);
    uploadData.value = null
}

const rotateImage = async (angle, imageSrc) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Convert degrees to radians and pre-calculate cosine and sine
      const radians = (angle * Math.PI) / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);

      const width = image.width;
      const height = image.height;

      // Set canvas dimensions based on the rotated image size
      if (angle % 180 === 0) {
        // No change in dimensions for 0, 180, 360 degrees
        canvas.width = width;
        canvas.height = height;
      } else {
        // Calculate the new width and height for odd angles
        canvas.width = Math.abs(width * cos) + Math.abs(height * sin);
        canvas.height = Math.abs(height * cos) + Math.abs(width * sin);
      }

      // Move the origin to the center of the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(image, -width / 2, -height / 2); // Draw image centered on canvas

      // Convert canvas to Blob and then to Data URL
      canvas.toBlob((blob) => {
        if (blob) {
          dataUrl = canvas.toDataURL(); // Set data URL after blob is created
          resolve({blob, dataUrl}); // Resolve the promise
        } else {
          reject(new Error("Blob creation failed."));
        }
      });
    };

    image.onerror = () => {
      reject(new Error("Image loading failed."));
    };
  });
};


const getRotatedImage = async () => {
    const {image} = cropper.value?.canvas as HTMLCanvasElement;
    if (image) {
        try{
            const {blob, dataUrl} = await rotateImage(image.transforms.rotate, image.src)
            src.value = dataUrl
            uploadData.value = blob
        }catch(error){
            console.log('an error occured')
            console.log(error)
        }
    }
    
    
  // Get the original canvas including rotation
//   const canvas = cropper.value?.getCroppedCanvas();
//   const rotatedCanvas = document.createElement('canvas');
//   const context = rotatedCanvas.getContext('2d');

//   // Set the rotated canvas size to the original image size
//   rotatedCanvas.width = cropper.image.naturalWidth;
//   rotatedCanvas.height = cropper.image.naturalHeight;

//   // Rotate the context
//   const rotation = cropper.image.rotation;
//   context.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
//   context.rotate((rotation * Math.PI) / 180);
//   context.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

//   // Convert to image URL
//   const fullImageUrl = rotatedCanvas.toDataURL('image/png');

//   // Open the image in a new tab
//   const newTab = window.open();
//   newTab.document.body.innerHTML = `<img src="${fullImageUrl}" alt="Rotated Image" style="width: 100%; height: auto;">`;

};

const getCroppedImage = () => {
    // const { canvas } = cropper.value?.getResult() as CropperResult;
    // if (canvas) {
    //     const dataUrl = canvas.toDataURL("image/png"); // Use image/png or your preferred format
    //     src.value = dataUrl;
    //     console.log("Cropped Image Data URL:", dataUrl); // For debugging or further processing
    // }


    const { canvas } = cropper.value?.getResult() as CropperResult;

    if (canvas) {
        // Convert canvas to a Blob in JPEG format with quality compression
        const quality = 0.7; // Adjust this value (0.5 - 0.8) for balance between quality and size
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    // Convert Blob to data URL if needed
                    const reader = new FileReader();
                    reader.onload = () => {
                        src.value = reader.result as string; // Set compressed data URL to src
                        uploadData.value = blob;
                    };
                    reader.readAsDataURL(blob);
                    // Optionally, you could upload the blob directly or download it.
                }
            },
            'image/jpeg', // Use JPEG format
            quality // Compression quality (lower means smaller size)
        );
    }
}

const resetCropper = () => {
    cropper.value?.reset();
    uploadData.value = null
}

</script>

<style scoped>
.cropper-container {
    height: 60vh;
    /* Adjusts maximum height */
    margin: 0 auto;
    width: 100%;
    /* Centers the cropper horizontally */
}

/* .cropper {
    border: solid 1px #eee;
    width: 100%;
    height: 90%;
    max-height: 90%;
    object-fit: contain;
} */
vue_cr
#side-panel {
    height: 100%;
    width: 50px;
    min-width: 50px;
    border-left: 1px solid grey;
}

.action-button {
    height: 40px;
    width: 40px;
}

.custom-button {
    min-width: 0;
}
</style>




<style scoped lang="scss">
.cropper {
    height: 80vh;
    width: calc(100% - 110px);

    &__foreground {
        opacity: 0.5;
        transition: opacity 0.35s;

        &--hidden {
            opacity: 0;
            display:none;
        }
    }
}

.vue-preview{

}
</style>
