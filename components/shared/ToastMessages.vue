<template>
  <div id="toast"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface ToastOptions {
  title?: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

// interface ToastElement extends HTMLDIvElement {
//   onclick: (e: MouseEvent) => void;
// }

const toastContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  const toast = ({ title = '', message = '', type = 'info', duration = 3000 }: ToastOptions) => {
    if (toastContainer.value) {
      const toastElement = document.createElement('div');

      // Auto remove toast
      const autoRemoveId = setTimeout(() => {
        toastContainer.value?.removeChild(toastElement);
      }, duration + 1000);

      // Remove toast when clicked
      toastElement.onclick = (e) => {
        if (e.target.closest('.toast__close')) {
          toastContainer.value?.removeChild(toastElement);
          clearTimeout(autoRemoveId);
        }
      };

      const icons: Record<string, string> = {
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-circle',
        error: 'fas fa-exclamation-circle'
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);

      toastElement.classList.add('toast', `toast--${type}`);
      toastElement.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

      toastElement.innerHTML = `
        <div class="toast__icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast__body">
          <h3 class="toast__title">${title}</h3>
          <p class="toast__msg">${message}</p>
        </div>
        <div class="toast__close">
          <i class="fas fa-times"></i>
        </div>
      `;

      toastContainer.value?.appendChild(toastElement);
    }
  };

  // Expose toast function globally
  window.toast = toast;
});
</script>

<style>
/* Add your custom toast styles here */
</style>