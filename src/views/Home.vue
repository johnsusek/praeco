<template>
  <div>
    <h1>Praeco</h1>
    <ul>
      <li>
        To get started, <router-link to="/rule/add">
          create a new rule
        </router-link>.
      </li>
      <li>
        You can also <router-link to="/template/add">
          create a new template
        </router-link>.
      </li>
    </ul>

    <br>

    <Alerts />
  </div>
</template>

<script>
import Alerts from './Alerts.vue';

export default {
  name: 'Home',

  components: {
    Alerts
  },
};
</script>
