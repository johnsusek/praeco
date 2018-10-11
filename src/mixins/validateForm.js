export const validateForm = {
  data() {
    return {
      form: {}
    };
  },

  watch: {
    form: {
      deep: true,
      handler() {
        console.log('emitting input on form...');
        this.$emit('input', this.form);
      }
    }
  },
  methods: {
    async validate() {
      console.log('validating ...');
      try {
        await this.$refs.form.validate();
        return this.form;
      } catch (error) {
        return false;
      }
    }
  }
};
