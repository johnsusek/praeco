<template>
  <div>
    <el-radio v-model="groupSqs" :disabled="viewOnly" label="profile" border @change="changeSqs">
      Profile
    </el-radio>
    <el-radio v-model="groupSqs" :disabled="viewOnly" label="notProfile" border @change="changeSqs">
      NotProfile
    </el-radio>

    <div v-if="groupSqs === 'notProfile'">
      <praeco-form-item label="SqsQueueUrl" prop="sqsQueueUrl" required>
        <el-input v-model="sqsQueueUrl" :disabled="viewOnly" />
        <label>The URL of the SQS queue. For example, https://sqs.us-east-1.amazonaws.com/123456789/mysqs</label>
      </praeco-form-item>
      <praeco-form-item label="SqsAwsAccessKeyId" prop="sqsAwsAccessKeyId" required>
        <el-input v-model="sqsAwsAccessKeyId" :disabled="viewOnly" />
        <label>An access key to connect to Amazon SQS with.</label>
      </praeco-form-item>
      <praeco-form-item label="SqsAwsSecretAccessKey" prop="sqsAwsSecretAccessKey" required>
        <el-input v-model="sqsAwsSecretAccessKey" :disabled="viewOnly" />
        <label>The secret key associated with the access key.</label>
      </praeco-form-item>
      <praeco-form-item label="SqsAwsRegion" prop="sqsAwsRegion" required>
        <el-input v-model="sqsAwsRegion" :disabled="viewOnly" />
        <label>The AWS region in which the Amazon SQS resource is located. For example, us-east-1</label>
      </praeco-form-item>
    </div>
    <div v-if="groupSqs === 'profile'">
      <praeco-form-item label="SqsQueueUrl" prop="sqsQueueUrl" required>
        <el-input v-model="sqsQueueUrl" :disabled="viewOnly" />
        <label>The URL of the Amazon SQS queue. For example, https://sqs.us-east-1.amazonaws.com/123456789/mysqs</label>
      </praeco-form-item>
      <praeco-form-item label="SqsAwsProfile" prop="sqsAwsProfile" required>
        <el-input v-model="sqsAwsProfile" :disabled="viewOnly" />
        <label>The AWS profile to use. If none specified, the default will be used.</label>
      </praeco-form-item>
    </div>
  </div>
</template>

<script setup>
import { useConfigAlertAwsSqs } from '@/composables/config/alert/useConfigAlertAwsSqs';

defineProps({
  viewOnly: Boolean
});

const {
  groupSqs,
  sqsQueueUrl,
  sqsAwsAccessKeyId,
  sqsAwsSecretAccessKey,
  sqsAwsRegion,
  sqsAwsProfile,
  changeSqs
} = useConfigAlertAwsSqs();
</script>
