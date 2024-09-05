<template>
  <v-card class="flex-card">
    <v-card-title>Recent Comments</v-card-title>
    <v-card-text class="fill-height pb-0" style="overflow-y:auto">
      <v-list lines="three" density="compact" item-props>
        <template v-for="(comment, index) in comments" :key="index">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="cyan">
                <v-img v-if="comment.user.image" :src="comment.user.image"></v-img>
                <span v-else class="text-white">{{ gettInitials(comment.user.name) }}</span>
              </v-avatar>
            </template>
            <v-list-item-title>
              <span class="username">{{ comment.user.name }}</span> commented on <span class="work-order">{{
                comment.workOrder }}</span>
            </v-list-item-title>
            <template v-slot:subtitle>
              <div v-html="comment.text"></div>
            </template>
            <template v-slot:append>
              <span>{{ comment.date }}</span>
            </template>
          </v-list-item>
          <v-divider v-if="index + 1 < comments.length"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">

const commentStore = useMaintenanceDashboardStore()
const {comments} = storeToRefs(commentStore)

function gettInitials(str: string) {
  if (!str) return '';

  // Split the string into words
  const words = str.trim().split(/\s+/);

  // Get the first initial of the first two words
  const initials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());

  // Join the initials together
  return initials.join('');
}
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 460px;
}

.username {
  font-weight: bold;
}

.work-order {
  color: blue;
}
</style>