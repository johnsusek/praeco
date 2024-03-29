import { Notification } from 'element-ui';
// TODO: error  Dependency cycle via @/store:5=>./configs:4  import/no-cycle
import { logger } from '@/lib/logger.js';

export default function notifyError(error) {
  console.error(error);

  try {
    logger().error({
      serverData: error.response.data,
      serverError: error.response.data.error,
      serverMsg: error.response.data.message,
      serverCode: error.response.data.statusCode
    });
  } catch (err) {
    console.error(err);
  }

  Notification.error({
    message: error.toString(),
    title: 'API error',
    duration: 0
  });

  return error;
}
