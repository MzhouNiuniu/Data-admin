import { create, list, detail, update, del } from '@services/ProjectCooperation';

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

// todo 行业案例-列表
