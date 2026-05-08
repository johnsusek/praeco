<template>
  <div>
    <el-radio v-model="groupSes" :disabled="viewOnly" label="profile" border @change="changeSes">
      Profile
    </el-radio>
    <el-radio v-model="groupSes" :disabled="viewOnly" label="notProfile" border @change="changeSes">
      NotProfile
    </el-radio>

    <div v-if="groupSes === 'notProfile'">
      <praeco-form-item label="ses_aws_access_key_id" prop="sesAwsAccessKeyId" required>
        <el-input v-model="sesAwsAccessKeyId" :disabled="viewOnly" />
        <label>An access key to connect to Amazon SES with.</label>
      </praeco-form-item>
      <praeco-form-item label="ses_aws_secret_access_key" prop="sesAwsSecretAccessKey" required>
        <el-input v-model="sesAwsSecretAccessKey" :disabled="viewOnly" />
        <label>The secret key associated with the access key.</label>
      </praeco-form-item>
      <praeco-form-item label="ses_aws_region" prop="sesAwsRegion" required>
        <el-input v-model="sesAwsRegion" :disabled="viewOnly" />
        <label>The AWS region in which the Amazon SES resource is located. For example, us-east-1</label>
      </praeco-form-item>
    </div>
    <div v-if="groupSes === 'profile'">
      <praeco-form-item label="ses_aws_profile" prop="sesAwsProfile" required>
        <el-input v-model="sesAwsProfile" :disabled="viewOnly" />
        <label>The AWS profile to use. If none specified, the default will be used.</label>
      </praeco-form-item>
    </div>

    <praeco-form-item
      v-if="!viewOnly || sesFromAddr"
      v-model="sesFromAddr"
      label="ses_from_addr"
      prop="sesFromAddr">
      <el-input v-model="sesFromAddr" :disabled="viewOnly" />
      <label>
        This sets the From header in the email.
        By default, the from address is ElastAlert2@
        and the domain will be set by the smtp server.
      </label>
    </praeco-form-item>

    <praeco-form-item
      v-if="!viewOnly || sesEmailReplyTo"
      v-model="sesEmailReplyTo"
      label="ses_email_reply_to"
      prop="sesEmailReplyTo">
      <el-input v-model="sesEmailReplyTo" :disabled="viewOnly" />
      <label>
        This sets the Reply-To header in the email.
        By default, the from address is ElastAlert2@ and the
        domain will be set by the smtp server.
      </label>
    </praeco-form-item>

    <el-form-item label="ses_email" prop="sesEmail" required>
      <el-input v-model="sesEmail" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item v-if="!viewOnly || sesCc" label="ses_cc" prop="sesCc">
      <el-input v-model="sesCc" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item v-if="!viewOnly || sesBcc" label="ses_bcc" prop="sesBcc">
      <el-input v-model="sesBcc" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item label="ses_email_from_field" prop="sesEmailFromField">
      <el-input v-model="sesEmailFromField" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="ses_email_add_domain" prop="sesEmailAddDomain">
      <el-input v-model="sesEmailAddDomain" :disabled="viewOnly" />
    </el-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertAmazonSes } from '@/composables/config/alert/useConfigAlertAmazonSes';

defineProps({
  viewOnly: Boolean
});

const {
  groupSes,
  sesFromAddr,
  sesEmailReplyTo,
  sesEmail,
  sesCc,
  sesBcc,
  sesEmailFromField,
  sesEmailAddDomain,
  sesAwsAccessKeyId,
  sesAwsSecretAccessKey,
  sesAwsRegion,
  sesAwsProfile,
  changeSes
} = useConfigAlertAmazonSes();
</script>
