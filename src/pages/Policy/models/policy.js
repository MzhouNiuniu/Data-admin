import { create, list, detail, update, del, audit } from '@services/policy';

export default {
  state: null,
  effects: {
    *create({ payload }) {
      return create(payload);
    },
    *list({ payload }) {
      return list(payload);
    },
    *detail({ payload }) {
      return detail(payload);
    },
    *update({ payload }) {
      return update(payload);
    },
    *del({ payload }) {
      return del(payload);
    },
    *audit({ payload }) {
      return audit(payload);
    },
  },
};