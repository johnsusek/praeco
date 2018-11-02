<template>
  <div>
    <h1>Praeco</h1>
    <ul>
      <li>
        To get started, <router-link to="/rule/add">create a new rule</router-link>.
      </li>
      <li>
        You can also <router-link to="/template/add">create a new template</router-link>.
      </li>
      <br>
      <li>
        For more assistance, this
        <a href="https://medium.com/@john_8166/praeco-walkthrough-5aada7e078a9" target="_blank">
        walkthrough guide</a> is available.
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>
