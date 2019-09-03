import request from '@/utils/request';

export function login(payload) {
  return request('/user/login', {
    method: 'post',
    data: payload,
  });
}

export function register(payload) {
  return request('/user/reg', {
    method: 'post',
    data: payload,
  });
}

export function changePwd(payload) {
  return request('/user/updateUser', {
    method: 'post',
    data: payload,
  });
}

export function logout(payload) {
  return request('/user/reg', {
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
          // icon: '',
        },
        {
          path: '/BasicData',
          name: 'BasicData',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        {
          path: '/CityInvest',
          name: 'CityInvest',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        {
          path: '/News',
          name: 'News',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        {
          path: '/Policy',
          name: 'Policy',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        /* 行业研究案例 */
        {
          path: '/ProfessionCase',
          name: 'ProfessionCase',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              hideInMenu: true,
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        /* 行业研究报告 */
        {
          path: '/ProfessionReport',
          name: 'ProfessionReport',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              hideInMenu: true,
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        {
          path: '/Organization',
          name: 'Organization',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        /* 项目合作 */
        {
          path: '/ProjectCooperation',
          name: 'ProjectCooperation',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
              component: './ProjectCooperation/List',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
              component: './ProjectCooperation/Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },

        {
          path: '/Magazine',
          name: 'Magazine',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        {
          path: '/Expert',
          name: 'Expert',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },

        // {
        //   path: '/Demo',
        //   name: 'Demo',
        //   icon: '',
        //   routes: [
        //     {
        //       path: 'AbsorbedMap',
        //       name: 'AbsorbedMap',
        //       icon: '',
        //     },
        //     {
        //       path: 'PdfPreview',
        //       name: 'PdfPreview',
        //       icon: '',
        //     },
        //     {
        //       path: 'ExpertPreview/:id',
        //       name: 'ExpertPreview',
        //       icon: '',
        //     },
        //   ],
        // },
        {
          path: '/User',
          name: 'User',
          icon: '',
          routes: [
            {
              path: 'List',
              name: 'List',
              icon: '',
            },
            {
              path: 'Form',
              name: 'Form',
              icon: '',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
              icon: '',
            },
          ],
        },
        {
          path: '/System',
          name: 'System',
          icon: '',
          routes: [
            {
              path: 'FrontConfig',
              name: 'FrontConfig',
              icon: '',
            },
            {
              path: 'About',
              name: 'About',
              icon: '',
            },
            // {
            //   path: 'Page',
            //   name: 'Page',
            //   icon: '',
            // },
            // {
            //   path: 'Role',
            //   name: 'Role',
            //   icon: '',
            // },
          ],
        },
        {
          path: '/Account',
          name: 'Account',
          icon: '',
          routes: [
            {
              path: 'Setting',
              name: 'Setting',
              icon: '',
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
  return request('/user/updateUser', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/user/getList', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/mock/mock-detail/user/' + payload);
}

export function del(payload) {
  return request('/mock/mock-delete/user', {
    method: 'delete',
    data: payload,
  });
}
