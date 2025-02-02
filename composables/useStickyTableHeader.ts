// useStickyTableHeader.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useStickyTableHeader(tableWrapperClass: string) {
  const headerElement = ref<HTMLElement | null>(null);
  const tableWrapper = ref<HTMLElement | null>(null);

  const handleScroll = () => {
    if (tableWrapper.value && headerElement.value) {
      const wrapperRect = tableWrapper.value.getBoundingClientRect();
      const stickyPoint = wrapperRect.top + window.scrollY;

      if (window.scrollY > stickyPoint) {
        headerElement.value.style.position = 'fixed';
        headerElement.value.style.top = '0';
        headerElement.value.style.left = `${wrapperRect.left - window.scrollX}px`;
        headerElement.value.style.width = `${wrapperRect.width}px`;
        headerElement.value.style.zIndex = '1000';
      } else {
        headerElement.value.style.position = 'static';
      }
    }
  };

  const syncHorizontalScroll = () => {
    if (headerElement.value && tableWrapper.value) {
      headerElement.value.style.left = `${-window.scrollX + tableWrapper.value.getBoundingClientRect().left}px`;
    }
  };

  onMounted(() => {
    tableWrapper.value = document.querySelector(`.${tableWrapperClass}`) as HTMLElement;
    if (tableWrapper.value) {
      headerElement.value = tableWrapper.value.querySelector('thead') as HTMLElement;
      window.addEventListener('scroll', handleScroll);
      tableWrapper.value.addEventListener('scroll', syncHorizontalScroll);
    }
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (tableWrapper.value) {
      tableWrapper.value.removeEventListener('scroll', syncHorizontalScroll);
    }
  });

  return {
    headerElement,
  };
}
