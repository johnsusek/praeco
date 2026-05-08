<template>
  <div>
    <praeco-form-item label="Host" prop="irisHost" required>
      <el-input v-model="irisHost" :disabled="viewOnly" />
      <label>
        Address of the Iris host. Exclude https:// For example: iris.example.com.
      </label>
    </praeco-form-item>

    <praeco-form-item label="irisApiToken" prop="irisApiToken" required>
      <el-input v-model="irisApiToken" :disabled="viewOnly" />
      <label>
        The API key of the user you created, which will be used to initiate alerts and cases on behalf of this user.
      </label>
    </praeco-form-item>

    <praeco-form-item label="CA Cert" prop="irisCaCert">
      <el-switch
        v-model="irisCaCert"
        :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="Customer Id" prop="irisCustomerId">
      <el-input-number v-model="irisCustomerId" :disabled="viewOnly" />
      <label>
        This field represents the unique identifier of the customer for whom an incident/case will be created within the system.
        Configure and view the existing options in the section Advanced -> Customers of your IRIS instance.
        The default value is: 1.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Ignore SSL Errors" prop="irisIgnoreSslErrors">
      <el-switch
        v-model="irisIgnoreSslErrors"
        :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="Description" prop="irisDescription">
      <el-input v-model="irisDescription" :disabled="viewOnly" />
      <label>
        Description of the alert or case.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Overwrite Timestamp" prop="irisOverwriteTimestamp">
      <el-switch
        v-model="irisOverwriteTimestamp"
        :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="Type" prop="irisType">
      <el-radio-group v-model="irisType" :disabled="viewOnly">
        <el-radio label="alert" border>
          alert
        </el-radio>
        <el-radio label="case" border>
          case
        </el-radio>
      </el-radio-group>
      <label>The type of object being created. It can be either alert or case. The default value is alert.</label>
    </praeco-form-item>

    <praeco-form-item label="Case template ID" prop="irisCaseTemplateId">
      <el-input-number v-model="irisCaseTemplateId" :disabled="viewOnly" />
      <label>
        Case template ID, if you want to apply a pre-prepared template.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Note" prop="irisAlertNote">
      <el-input v-model="irisAlertNote" :disabled="viewOnly" />
      <label>
        Note for the alert.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Tags" prop="irisAlertTags">
      <el-input v-model="irisAlertTags" :disabled="viewOnly" />
      <label>
        List of tags.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Status Id" prop="irisAlertStatusId">
      <el-input-number v-model="irisAlertStatusId" :disabled="viewOnly" :min="1" :max="7" />
      <label>
        The alert status of the alert, default value is 2. This parameter requires an integer input.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Source Link" prop="irisAlertSourceLink">
      <el-input v-model="irisAlertSourceLink" :disabled="viewOnly" />
      <label>
        Your custom link, if needed.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Severity Id" prop="irisAlertSeverityId">
      <el-input-number v-model="irisAlertSeverityId" :disabled="viewOnly" :min="1" :max="6" />
      <label>
        The severity level of the alert, default value is 1. This parameter requires an integer input.
      </label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertIris } from '@/composables/config/alert/useConfigAlertIris';

defineProps({
  viewOnly: Boolean
});

const {
  irisHost,
  irisApiToken,
  irisCustomerId,
  irisIgnoreSslErrors,
  irisCaCert,
  irisDescription,
  irisOverwriteTimestamp,
  irisType,
  irisCaseTemplateId,
  irisAlertNote,
  irisAlertTags,
  irisAlertStatusId,
  irisAlertSourceLink,
  irisAlertSeverityId
} = useConfigAlertIris();
</script>
