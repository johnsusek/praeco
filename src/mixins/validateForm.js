export const validateForm = {
  watch: {
    form: {
      deep: true,
      handler() {
        this.$emit('input', this.form);
      }
    }
  },
  methods: {
    async validate() {
      try {
        await this.$refs.form.validate();
        return this.form;
      } catch (error) {
        return false;
      }
    }
  }
};
