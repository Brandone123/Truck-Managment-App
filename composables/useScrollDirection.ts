// useScrollDirection.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollDirection() {
    const lastScrollTop = ref(0);
    const scrollDirection = ref(0); // +1 for down, -1 for up

    const handleScroll = () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop.value) {
            scrollDirection.value = 1;
        } else if (st < lastScrollTop.value) {
            scrollDirection.value = -1;
        }
        lastScrollTop.value = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    return {
        scrollDirection,
    };
}
