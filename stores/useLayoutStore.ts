import { defineStore } from "pinia";
import { watch } from 'vue'
interface MessageInfo {
  show?: boolean
  text: string
  color: string
}

export const useLayoutStore = defineStore('layout', () => {

  // spinner
  const overlay = ref<boolean>(false)
  const message = ref<MessageInfo>({
    show: false,
    text: '',
    color: 'primary'
  })

  function setStatusMessage(msg: string, color: string) {
    message.value.text = msg
    message.value.color = color
    message.value.show = true
  }

  function setOverlay(value: boolean) {
    overlay.value = value
  }

  //confirm dialog
  const confirmDialog = ref<boolean>(false)
  const confirmActionState = ref<Boolean>(false)
  const confirmDialogMessage = ref<String | null>(null)

  function showConfirmDialog(message: string) {
    return new Promise<{ confirm?: Boolean, cancel?: Boolean, }>(async (resolve, reject) => {
      confirmDialogMessage.value = message
      confirmDialog.value = true

      let stopWatcher = watch(confirmDialog, (newValue, oldValue) => {
        if (!newValue && oldValue) {
          if (confirmActionState.value) {
            resolve({ confirm: true })

            //stop the watcher
            stopWatcher()
          }
          else {
            reject({ cancel: true })

            //stop the watcher
            stopWatcher()
          }
        }
      }, {
        immediate: true,
      })
    })
  }

  function confirmAction(confirmState: Boolean) {
    confirmActionState.value = confirmState
    confirmDialog.value = false
    confirmDialogMessage.value = null
  }

  return {
    // overloay spinner
    overlay, setOverlay,

    //toast message update
    message, setStatusMessage,

    // confirm dialog
    confirmDialog, confirmDialogMessage, confirmAction,
    showConfirmDialog,
  }
})