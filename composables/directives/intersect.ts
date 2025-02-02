// directives/intersect.ts
import type { DirectiveBinding } from 'vue'

export const intersect = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        const options = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1, // trigger when 10% of the element is visible
        }

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    binding.value(true)
                } else {
                    binding.value(false)
                }
            })
        }

        const observer = new IntersectionObserver(callback, options)
        observer.observe(el)

            // Store the observer instance on the element for later cleanup
            ; (el as any)._observer = observer
    },
    unmounted(el: HTMLElement) {
        const observer = (el as any)._observer
        if (observer) {
            observer.disconnect()
        }
    },
}
