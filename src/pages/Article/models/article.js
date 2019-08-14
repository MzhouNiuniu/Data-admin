import {
  create,
  list,
  detail,
  update,
  del,
} from '@services/article'

export default {
  state: null,
  effects: {
    * create({ payload }) {
      return create(payload)
    },
    * list({ payload }) {
      return list(payload)
    },
    * detail({ payload }) {
      return detail(payload)
    },
    * update({ id, payload }) {
      return update(id, payload)
    },
    * del({ payload }) {
      return del(payload)
    },
  },
}
