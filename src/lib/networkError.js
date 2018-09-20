import { Notification } from 'element-ui';
import config from '../../praeco.config.js';

export default function notifyError(error) {
  Notification.error({
    message: error.toString(),
    title: `Cannot connect to API ${config.apiBaseUrl}`,
    duration: 0
  });
}
