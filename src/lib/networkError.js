import { Notification } from 'element-ui';
import { logger } from '@/lib/logger.js';

export default function notifyError(error) {
  let baseUrl = '/api';

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
    title: `Cannot connect to API ${baseUrl}`,
    duration: 0
  });

  return error;
}
