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
      <li>
        For more assistance, this
        <a href="https://medium.com/@john_8166/praeco-walkthrough-5aada7e078a9" target="_blank" rel="noopener noreferrer">
          walkthrough guide</a> is available.
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
