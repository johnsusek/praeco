import { defineStore } from 'pinia'
import axios from 'axios'
import networkError from '../lib/networkError.js'

export const useServerStore = defineStore('server', {
  state: () => ({
    version: '',
    status: ''
  }),

  actions: {
    async fetchVersion() {
      try {
        let res = await axios.get('/api')
        this.version = res.data.version
      } catch (error) {
        networkError(error)
      }
    },

    async fetchStatus() {
      try {
        let res = await axios.get('/api/status')
        this.status = res.data.status
      } catch (error) {
        networkError(error)
      }
    }
  }
})