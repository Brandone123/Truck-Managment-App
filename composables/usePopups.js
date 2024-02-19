// usePopups.js
import { ref } from '@nuxtjs/composition-api';

export default function usePopups() {
  const popups = ref([]);

  // Open a new popup in a separate window
  function openPopupInWindow(component, props = {}) {
    const popupWindow = window.open('', '_blank', 'width=500,height=500');

    const id = Date.now().toString();
    popups.value.push({ id, window: popupWindow, component, props });

    // Communicate with the popup window
    popupWindow.addEventListener('beforeunload', () => {
      closePopup(id);
    });

    // Wait for the popup window to load
    popupWindow.addEventListener('load', () => {
      // Include Vue and Vuetify scripts in the popup window
      const vueScript = document.createElement('script');
      vueScript.src = 'https://cdn.jsdelivr.net/npm/vue@3.3.13/dist/vue.global.min.js';
      popupWindow.document.head.appendChild(vueScript);

      // Create a new Vue app and mount the component inside the popup window
      const app = Vue.createApp(component, props);
      app.mount(popupWindow.document.body);
    });
  }

  // Close a popup by its ID
  function closePopup(id) {
    const popup = popups.value.find((popup) => popup.id === id);
    if (popup) {
      popup.window.close();
      popups.value = popups.value.filter((popup) => popup.id !== id);
    }
  }

  return {
    popups,
    openPopupInWindow,
    closePopup,
  };
}
