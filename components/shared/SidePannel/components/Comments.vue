<template>
    <v-sheet flat class="d-flex flex-column fill-height">
        <div v-if="comments" style="overflow-y:auto;" class="pa-2 d-flex flex-column flex-grow-1" ref="chatContainer">
            <div class="font-weight-bold pa-2">Comments</div>
            <template v-for="(comment, index) in comments" :key="index">
                <div class="d-flex mb-2">
                    <v-avatar size="30" class="mx-1" :style="{ order: auth.user?.id == comment.user_id ? 2 : 1 }"
                        :color="avatarColor(initials(`${comment.employee?.first_name} ${comment.employee?.last_name}`))">
                        {{ initials(`${comment.employee?.first_name} ${comment.employee?.last_name}`) }}
                    </v-avatar>
                    <v-col class="pa-0 text-caption" :style="{ order: auth.user?.id == comment.user_id ? 1 : 2 }">
                        <div class="d-flex" :class="{ 'justify-end': auth.user?.id == comment.user_id }">
                            <v-card flat class="pa-1 light-grey-background" style="max-width: calc(100% - 20px)">
                                <div v-if="auth.user?.id != comment.user_id" class="text-primary truncate">{{
                                    `${comment.employee?.first_name} ${comment.employee?.last_name}` }}</div>
                                <div class="text-subtitle-2">{{ comment.comment }}</div>
                                <div class="d-flex justify-end">
                                    <span class="font-italic small-text">{{ getRelativeDateTime(comment.created_at)
                                        }}</span>
                                </div>
                            </v-card>
                        </div>
                    </v-col>
                </div>
            </template>
            <div class="d-flex justify-center" v-if="loading">
                <v-progress-circular color="primary" indeterminate></v-progress-circular>
            </div>
        </div>
        <div class="text-center" v-else>No Comments Yet</div>
        <v-divider></v-divider>
        <div class="flex-shrink-1 pa-1">
            <v-textarea :rows="isFocused ? 4 : 1" @focus="isFocused = true" variant="outlined" v-model="newComment"
                placeholder="Add a Comment" no-details outlined hide-details class="expand-on-focus" />
            <v-expand-transition>
                <div class="d-flex justify-end mt-1" v-if="isFocused">
                    <v-btn color="primary" class="text-none" density="compact" variant="text"
                        @click="closeCommentInput">Cancel</v-btn>
                    <v-btn :disabled="!newComment" color="primary" class="text-none ml-2" density="compact"
                        @click="addComment">Comment</v-btn>
                </div>
            </v-expand-transition>
        </div>
    </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '~/types/maintenance/maintenaceDashboardTypes';
import moment from 'moment';

const auth = useAuthStore();

const props = defineProps({
    comments: {
        type: Array as PropType<Comment[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits(['addComment'])

const newComment = ref<string | null>(null);

const isFocused = ref<boolean>(false)

const chatContainer = ref<HTMLElement | null>(null)

const closeCommentInput = () => {
    isFocused.value = false;
    newComment.value = null
}

const addComment = () => {
    if (newComment.value) {
        emit('addComment', { comment: newComment.value })
        closeCommentInput()
        scrollToBottom()
    }
}

const getRelativeDateTime = (date: string) => {
    return moment(date).calendar(); //fromNow();
}

// const initials = (name: string) => {
//     return name?.split(' ').map((word: any) => word.charAt(0).toUpperCase()).join('') || 'N/A'
// }

const initials = (name: string) => {
    return name
        ?.split(' ')
        .slice(0, 2) // Get only the first two names
        .map((word: string) => word.charAt(0).toUpperCase()) // Get the first character of each name
        .join('') || 'N/A'; // Join the initials or return 'N/A' if the name is empty
};


const avatarColor = (initials: string) => {
    if (initials === 'N/A') {
        return 'grey'
    }

    const hue = initials.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 80%, 70%)`;
}


const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight; // Scroll to the bottom
        }
    })
};

watch(() => props.comments, () => {
    scrollToBottom()
})

</script>

<style scoped>
.expand-on-focus {
    transition: all 0.3s ease;
}

.expand-on-focus:focus-within {
    max-height: 200px;
    /* Desired expanded height */
}

.light-grey-background {
    background: #F1F3F4 !important;
}

.small-text {
    font-size: 0.6rem;
    /* Adjust as needed */
}

.truncate {
    white-space: nowrap;
    /* Prevents the text from wrapping to a new line */
    overflow: hidden;
    /* Hides the overflow text */
    text-overflow: ellipsis;
    /* Displays ellipsis (...) when text overflows */
}
</style>