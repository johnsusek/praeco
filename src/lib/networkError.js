import { Notification } from 'element-ui';
import { logger } from '@/lib/logger.js';

export default function notifyError(error) {
  try {
    logger().error({
      serverData: error.response.data,
      serverError: error.response.data.error,
      serverMsg: error.response.data.message,
      serverCode: error.response.data.statusCode
    });
  } catch (err) {
    logger().error(err);
  }

  Notification.error({
    message: error.toString(),
    title: 'API error',
    duration: 0
  });

  return error;
}
