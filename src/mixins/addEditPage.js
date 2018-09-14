import RuleEditor from '../components/RuleEditor.vue';

export default {
  components: {
    RuleEditor
  },
  props: ['template'],
  computed: {
    mode() {
      let route = this.$route.matched.slice(-1)[0];
      return route.meta.mode;
    }
  }
};
