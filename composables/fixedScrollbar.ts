/*
 * This code block draws inspiration from 
 *  https://jsfiddle.net/TBnqw/2288/ 
 */

import { ref, onMounted, onUnmounted, watch } from 'vue';

interface UseFixedScrollbarOptions {
  fixedScrollbarSelector: string;
  isActive: boolean;
}

interface HTMLElementWithScroll extends HTMLElement {
  scrollWidth: number;
  scrollLeft: number;
}

export function useFixedScrollbar({ fixedScrollbarSelector, isActive }: UseFixedScrollbarOptions) {

  let showingOverflowParent = ref<boolean>(isActive)

  const scrollbar = ref<HTMLElementWithScroll | null>(null);
  const fakeContent = ref<HTMLElement | null>(null);
  const activeElement = ref<HTMLElementWithScroll | null>(null);
  let lastScroll: number | undefined = undefined;
  let observer: IntersectionObserver | null = null;
  let pageWrapperResizeOberver: ResizeObserver | null = null;
  let pageWrapper = (document.querySelector('.page-wrapper') as HTMLElementWithScroll)

  const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
  const bottom = (el: HTMLElement) => el.getBoundingClientRect().bottom + window.scrollY;

  const updateShowOverflowParent = (val: boolean) => {
    showingOverflowParent.value = val
  }

  const findActiveElement = () => {
    if (!scrollbar.value || !fakeContent.value) return;

    scrollbar.value.style.display = 'block';
    const fixedElements = document.querySelectorAll<HTMLElementWithScroll>(fixedScrollbarSelector);

    activeElement.value = null;

    fixedElements.forEach((el) => {
      if (top(el) < top(scrollbar.value as HTMLElement) && bottom(el) > bottom(scrollbar.value as HTMLElement)) {
        (fakeContent.value as HTMLElement).style.width = `${el.scrollWidth}px`;
        (fakeContent.value as HTMLElement).style.height = '1px';
        activeElement.value = el;
      }
    });
    fitActiveElement();
  };

  const fitActiveElement = () => {
    if (!activeElement.value) {
      (scrollbar.value as HTMLElementWithScroll).style.display = 'none';
      return;
    }

    // const activeRect = activeElement.value.getBoundingClientRect();
    // (scrollbar.value as HTMLElementWithScroll).style.left = `${activeRect.left}px`;
    // (scrollbar.value as HTMLElementWithScroll).style.width = `${activeRect.width}px`;
    // (fakeContent.value as HTMLElement).style.width = `${(activeElement.value as HTMLElementWithScroll).scrollWidth}px`;
    // (fakeContent.value as HTMLElement).style.height = '1px';

    // alternative to above commented code
    const activeRectParent = (document.querySelector('.page-wrapper') as HTMLElementWithScroll);
    const activeRect = activeRectParent.getBoundingClientRect();

    const styles = window.getComputedStyle(activeRectParent);
    const paddingLeft = styles.getPropertyValue('padding-left');
    const paddingRight = styles.getPropertyValue('padding-right');

    (scrollbar.value as HTMLElementWithScroll).style.left = `${activeRect.left + parseInt(paddingLeft)}px`;
    (scrollbar.value as HTMLElementWithScroll).style.width = `${activeRect.width - (parseInt(paddingLeft) + parseInt(paddingRight))}px`;
    (fakeContent.value as HTMLElement).style.width = `${(activeElement.value as HTMLElementWithScroll).scrollWidth}px`;
    (fakeContent.value as HTMLElement).style.height = '1px';
    // end of alternative

    lastScroll = undefined;
  };

  const onScroll = () => {
    const oldActive = activeElement.value;
    findActiveElement();
    if (oldActive && oldActive !== activeElement.value) {
      oldActive.removeEventListener('scroll', updateScroll);
    }
    if (activeElement.value && oldActive !== activeElement.value) {
      activeElement.value.addEventListener('scroll', updateScroll);
    }
    updateScroll();
  };

  const syncScroll = () => {
    if (!activeElement.value || !scrollbar.value) return;
    if (scrollbar.value.scrollLeft === lastScroll) return;
    lastScroll = scrollbar.value.scrollLeft;
    activeElement.value.scrollLeft = lastScroll;
  };

  const updateScroll = () => {
    if (!activeElement.value || !scrollbar.value) return;
    if (activeElement.value.scrollLeft === lastScroll) return;
    lastScroll = activeElement.value.scrollLeft;
    scrollbar.value.scrollLeft = lastScroll;
  };

  const handleVisibilityChange = (entries: IntersectionObserverEntry[]) => {
    if (!scrollbar.value) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (scrollbar.value as HTMLElement).style.display = 'block';
        onScroll()
      } else {
        if (!showingOverflowParent.value) {
          (scrollbar.value as HTMLElement).style.display = 'none';
        }
      }
    });
  };


  const observePageWrapper = () => {
    pageWrapper = (document.querySelector('.page-wrapper') as HTMLElementWithScroll)
    const pageWrapperResizeOberver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === pageWrapper) {
          unMountScrollbar()
          nextTick(() => {
            mountScrollbar()
          })
        }
      }
    });
    if (pageWrapper) pageWrapperResizeOberver.observe(pageWrapper);
  }

  const unobservePageWrapper = () => {
    if (pageWrapperResizeOberver && pageWrapper) {
      (pageWrapperResizeOberver as ResizeObserver).unobserve(pageWrapper);
    }
  }

  onMounted(() => {
    observePageWrapper()
    mountScrollbar()

    observer = new IntersectionObserver(handleVisibilityChange, { threshold: 0.1 });
    const observedElements = document.querySelectorAll(fixedScrollbarSelector);
    observedElements.forEach(el => observer?.observe(el));
  });

  const mountScrollbar = () => {
    scrollbar.value = document.createElement('div') as HTMLElementWithScroll;
    fakeContent.value = document.createElement('div');
    scrollbar.value.id = 'fixed-scrollbar';
    scrollbar.value.appendChild(fakeContent.value);
    document.body.appendChild(scrollbar.value);

    Object.assign(scrollbar.value.style, {
      overflowX: 'auto',
      position: 'fixed',
      width: '100%',
      bottom: '0',
      display: 'none',
    });

    scrollbar.value.addEventListener('scroll', syncScroll);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  const unMountScrollbar = () => {
    unobservePageWrapper()
    if (scrollbar.value) {
      scrollbar.value.removeEventListener('scroll', syncScroll);
      if (document.body.contains(scrollbar.value)) {
        document.body.removeChild(scrollbar.value);
      }

    }
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }

  onUnmounted(() => {
    unMountScrollbar();
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    scrollbar,
    fakeContent,
    updateShowOverflowParent
  };
}
