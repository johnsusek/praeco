import { ElNotification } from 'element-plus';
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

  ElNotification({
    message: error.toString(),
    title: 'API error',
    duration: 0,
    type: 'error',
  });

  return error;
}
