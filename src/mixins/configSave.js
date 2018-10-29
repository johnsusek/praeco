export default {
  data() {
    return {
      saving: false
    };
  },

  methods: {
    async save() {
      try {
        await this.$refs.settings.$refs.form.validate();
        await this.$refs.alert.$refs.form.validate();
      } catch (error) {
        this.$message.error('Please fill out all required fields.');
        return;
      }

      let conditionsValid = await this.$refs.condition.validate();
      if (!conditionsValid) {
        this.$message.error('Please fill out all required fields.');
        return;
      }

      this.saving = true;

      let res = await this.$store.dispatch('config/save', {
        type: `${this.type}s`,
        overwrite: this.action === 'edit'
      });

      this.saving = false;

      if (res) {
        if (res.error) {
          this.$message.warning(res.error);
        } else {
          this.$message.success('Config saved.');
          let path = this.$store.state.config.settings.name;
          if (this.$store.state.config.path) {
            path = `${this.$store.state.config.path}/${path}`;
          }
          this.$router.push({
            path: `/${this.type}s/${path}`,
            query: { refreshTree: true }
          });
        }
      } else {
        this.$message.warning('Error saving config, are all fields filled out?');
      }
    }
  }
};
