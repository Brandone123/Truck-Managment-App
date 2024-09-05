<template>
  <TireAddDialog :modelValue="TireDialog" :selectedTire="selectedTire" @update:modelValue="TireDialog = $event"
    @close="closeTireDialog"/>

    <v-col cols="12" sm="6">
        <v-card height="400" style="overflow-y:auto;">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Axle Configuration</v-card-title></div>
                <div class="text-primary ml-auto mr-2 mt-3" style="font-size: 14px; cursor:pointer;">Edit</div>
            </div>

            <div class="axle-configuration">
              <div class="axle">
                <h3>Front Axle</h3>
                <div class="axle-icon-container">
                  <div class="axle-connector">
                      <div class="axle-icon" @click="addAxle('Left Front (LF)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                      
                      <div class="connector-line"></div>
                  
                      <!-- <v-divider style="border:2px"></v-divider> -->
                      <div class="axle-icon" @click="addAxle('Right Front (RF)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                  </div>
                </div>
                
              </div>

              <div class="axle">
                <h3>Axle 2</h3>
                <div class="axle-icon-container">
                  <div class="axle-connector">
                      <div class="axle-icon" @click="addAxle('Left Outer (2LO)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                      <div class="axle-icon" style="margin-left: 5px;" @click="addAxle('Left Inner (2LI)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>

                      <div class="connector-line"></div>
                      
                      <div class="axle-icon" @click="addAxle('Right Inner (2RI)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                      <div class="axle-icon" style="margin-left: 5px;" @click="addAxle('Right Outer (2RO)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                  </div>
                </div>
              </div>

              <div class="axle">
                <h3>Axle 3</h3>
                <div class="axle-icon-container">
                  <div class="axle-connector">
                      <div class="axle-icon" @click="addAxle('Left Outer (3LO)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                      <div class="axle-icon" style="margin-left: 5px;" @click="addAxle('Left Inner (3LI)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                      
                      <div class="connector-line"></div>

                      <div class="axle-icon" @click="addAxle('Right Inner (3RI)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                      <div class="axle-icon" style="margin-left: 5px;" @click="addAxle('Right Outer (3RO)')">
                      <v-icon color="white">mdi-plus</v-icon>
                      </div>
                  </div>
                </div>
              </div>
            </div>
        </v-card>
    </v-col>

    <v-col cols="12" sm="6">
        <v-card height="330" style="overflow-y:auto;">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Installed Tires
                    </v-card-title></div>
                <div class="text-primary ml-auto mr-2 mt-3" @click="addAxle('2LO')" style="font-size: 14px; cursor:pointer;">
                    <v-icon>mdi-plus</v-icon>Add</div>
            </div>
            <div class="pa-4" style="font-size:small; color:grey; text-align: center;">
              <span><v-icon size="150">mdi-tire</v-icon></span>
                <p>There are no tires installed on this vehicle yet.</p>
            </div>
        </v-card>
    </v-col>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TireAddDialog from './TireAddDialog.vue'

const addAxle = (axlePosition: any) => {
    // Logique pour ajouter un nouvel essieu à la position donnée
    TireDialog.value = true;
    selectedTire.value.selectedPosition = axlePosition
};

const TireDialog = ref(false);
const selectedTire = ref({
    selectedTireModel: '',
    newTire: true,
    usedTire: false,
    tireMeter: 0,
    selectedAxle: [],
    selectedPosition: [],
    treadDepth: 0,
    pressure: 0,
    
  });

  const closeTireDialog = () => {
    TireDialog.value = false;
  };

</script>

<style scoped>
.axle-configuration {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.axle {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}

.axle-icon-container {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.axle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
  background-color: #1867C0;
  border-radius: 5%;
  padding-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.axle-icon:hover {
  background-color: #d0d0d0;
}

.axle-connector {
  position:relative;
  bottom: -20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.connector-line {
  width: 100%;
  height: 10px;
  margin-top: 35px;
  background-color: #c0c0c0;
}
</style>