import request from '@/utils/request'

export async function login(payload) {
  return request('/a/user/login', {
    method: 'get',
    params: payload,
  })
}

export async function register(payload) {
  return request('/a/user/reg', {
    method: 'post',
    data: payload,
  })
}

export async function changePwd(payload) {
  return request('/a/user/updateUser', {
    method: 'post',
    data: payload,
  })
}

export async function logout(payload) {
  return request('/a/user/reg', {
    method: 'post',
    data: payload,
  })
}

export async function loadRoutes() {
  return new Promise(resolve => {
    setTimeout(function () {
      const routes = [
        {
          path: '/',
          name: 'welcome',
          icon: 'smile',
        },
        {
          path: '/Article',
          name: 'Article',
          icon: 'smile',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: 'smile',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: 'smile',
            },
            {
              hideInMenu: true,
              path: 'Form/:id',
              name: 'FormEdit',
              icon: 'smile',
            },
          ],
        },
        {
          path: '/User',
          name: 'User',
          icon: 'smile',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: 'smile',
            },
            {
              hideInMenu: true,
              path: 'Form/:id',
              name: 'FormEdit',
              icon: 'smile',
            },
          ],
        },
        {
          path: '/Demo',
          name: 'Demo',
          icon: 'smile',
          routes: [
            {
              path: 'AbsorbedMap',
              name: 'AbsorbedMap',
              icon: 'smile',
            },
          ],
        },
      ]

      // 追加默认路由（主要判断权限的，默认是把所有路由加载了）
      routes.push(
        {
          path: '/Exception',
          routes: [
            {
              path: '403',
            },
            {
              path: '404',
            },
            {
              path: '500',
            },
          ],
        },
        {
          path: '/Account',
          name: 'Account',
          icon: 'smile',
          routes: [
            {
              path: 'Setting',
              name: 'Setting',
              icon: 'smile',
            },
          ],
        },
      )

      resolve({
        code: 200,
        data: routes,
      })
    }, 1000)
  })
}


export async function update(id, payload) {
  return request('/mock/mock-update/user/' + id, {
    method: 'put',
    data: payload,
  })
}

export async function detail(payload) {
  return request('/mock/mock-detail/user/' + payload)
}

export async function create(payload) {
  return request('/mock/mock-form/user', {
    method: 'post',
    data: payload,
  })
}

export async function list(payload) {
  return request('/mock/mock-list/user', {
    params: payload,
  })
}

export async function del(payload) {
  return request('/mock/mock-delete/user', {
    method: 'delete',
    data: payload,
  })
}



