import { reactive } from "vue";

export function useNotificaciones() {
  const notification = reactive({
    show: false,
    message: '',
    type: 'info'
  });

  const showNotification = (message, type = 'info') => {
    notification.message = message;
    notification.type = type;
    notification.show = true;
    setTimeout(() => notification.show = false, 3000);
  };

  return { notification, showNotification };
}
