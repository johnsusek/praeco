<template>
  <div>
    <el-radio v-model="groupSns" :disabled="viewOnly" label="profile" border @change="changeSns">
      Profile
    </el-radio>
    <el-radio v-model="groupSns" :disabled="viewOnly" label="notProfile" border @change="changeSns">
      NotProfile
    </el-radio>

    <div v-if="groupSns === 'notProfile'">
      <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
        <el-input v-model="snsTopicArn" :disabled="viewOnly" />
        <label>The SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsAccessKeyId" prop="snsAwsAccessKeyId" required>
        <el-input v-model="snsAwsAccessKeyId" :disabled="viewOnly" />
        <label>An access key to connect to Amazon SNS with.</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsSecretAccessKey" prop="snsAwsSecretAccessKey" required>
        <el-input v-model="snsAwsSecretAccessKey" :disabled="viewOnly" />
        <label>The secret key associated with the access key.</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsRegion" prop="snsAwsRegion" required>
        <el-input v-model="snsAwsRegion" :disabled="viewOnly" />
        <label>The AWS region in which the Amazon SNS resource is located. For example, us-east-1</label>
      </praeco-form-item>
    </div>
    <div v-if="groupSns === 'profile'">
      <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
        <el-input v-model="snsTopicArn" :disabled="viewOnly" />
        <label>The Amazon SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsProfile" prop="snsAwsProfile" required>
        <el-input v-model="snsAwsProfile" :disabled="viewOnly" />
        <label>The AWS profile to use. If none specified, the default will be used.</label>
      </praeco-form-item>
    </div>
  </div>
</template>

<script setup>
import { useConfigAlertAmazonSns } from '@/composables/config/alert/useConfigAlertAmazonSns';

defineProps({
  viewOnly: Boolean
});

const {
  groupSns,
  snsTopicArn,
  snsAwsAccessKeyId,
  snsAwsSecretAccessKey,
  snsAwsRegion,
  snsAwsProfile,
  changeSns
} = useConfigAlertAmazonSns();
</script>
