import { Notification } from 'element-ui';
import store from '../store';

export default function notifyError(error) {
  let baseUrl = store.state.config.config.apiBaseUrl;
  Notification.error({
    message: error.toString(),
    title: `Cannot connect to API ${baseUrl}`,
    duration: 0
  });
}
