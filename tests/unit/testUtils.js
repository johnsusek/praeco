import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export const mockAxios = new MockAdapter(axios);