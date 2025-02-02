import { ref } from 'vue'

export function useAbortController() {
    // Keep a list of controllers so we can abort them if needed
    const abortControllers = ref<AbortController[]>([])

    /**
     * Create a new AbortController and store it in our list.
     * @returns {AbortController} The newly created controller
     */
    function createController(): AbortController {
        const controller = new AbortController()
        abortControllers.value.push(controller)
        return controller
    }

    /**
     * Abort all controllers and clear the list.
     */
    function abortAllRequests() {
        abortControllers.value.forEach(controller => {
            controller.abort()
        })
        abortControllers.value = []
    }

    return {
        createController,
        abortAllRequests,
    }
}
