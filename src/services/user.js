import request from '@/utils/request';

export function login(payload) {
  return request('/a/user/login', {
    method: 'get',
    params: payload,
  });
}

export function register(payload) {
  return request('/a/user/reg', {
    method: 'post',
    data: payload,
  });
}

export function changePwd(payload) {
  return request('/a/user/updateUser', {
    method: 'post',
    data: payload,
  });
}

export function logout(payload) {
  return request('/a/user/reg', {
    method: 'post',
    data: payload,
  });
}

export function loadRoutes() {
  return new Promise(resolve => {
    setTimeout(function() {
      const routes = [
        {
          path: '/',
          name: 'welcome',
          icon: 'smile',
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
              path: 'Form',
              name: 'Form',
              icon: 'smile',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: 'smile',
            },
          ],
        },
        {
          path: '/News',
          name: 'News',
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
              path: 'Form/:id',
              name: 'FormEdit',
              icon: 'smile',
            },
          ],
        },
        {
          path: '/Policy',
          name: 'Policy',
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
              path: 'Form/:id',
              name: 'FormEdit',
              icon: 'smile',
            },
          ],
        },
        {
          path: '/Profession',
          name: 'Profession',
          icon: 'smile',
          routes: [
            {
              path: 'Case',
              name: 'Case',
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
                  path: 'Form/:id',
                  name: 'FormEdit',
                  icon: 'smile',
                },
              ],
            },
            {
              path: 'Report',
              name: 'Report',
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
                  path: 'Form/:id',
                  name: 'FormEdit',
                  icon: 'smile',
                },
              ],
            },
          ],
        },
        {
          path: '/Organization',
          name: 'Organization',
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
              path: 'Form/:id',
              name: 'FormEdit',
              icon: 'smile',
            },
          ],
        },
         /* 项目合作 */
        {
          path: '/ProjectCooperation',
          name: 'ProjectCooperation',
          icon: 'smile',
          routes: [
            {
            path: 'List',
            name: 'List',
            icon: 'smile',
            component: './ProjectCooperation/List',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: 'smile',
              component: './ProjectCooperation/Form'
            }
          ]
        },
        {
          path: '/Expert',
          name: 'Expert',
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
            {
              path: 'PdfPreview',
              name: 'PdfPreview',
              icon: 'smile',
            },
            {
              path: 'ExpertPreview/:id',
              name: 'ExpertPreview',
              icon: 'smile',
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
        {
          path: '/System',
          name: 'System',
          icon: 'smile',
          routes: [
            {
              path: 'About',
              name: 'About',
              icon: 'smile',
            },
            {
              path: 'Page',
              name: 'Page',
              icon: 'smile',
            },
            {
              path: 'Role',
              name: 'Role',
              icon: 'smile',
            },
          ],
        },
      ];

      // 追加默认路由（主要判断权限的，默认是把所有路由加载了）
      routes.push({
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
      });

      resolve({
        code: 200,
        data: routes,
      });
    }, 1000);
  });
}

export function update(id, payload) {
  return request('/mock/mock-update/user/' + id, {
    method: 'put',
    data: payload,
  });
}

export function detail(payload) {
  return request('/mock/mock-detail/user/' + payload);
}

export function list(payload) {
  return request('/mock/mock-list/user', {
    params: payload,
  });
}

export function del(payload) {
  return request('/mock/mock-delete/user', {
    method: 'delete',
    data: payload,
  });
}
