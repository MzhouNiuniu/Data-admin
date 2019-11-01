import request from '@/utils/request';

/**
 * 获取对应名称的cookie
 * @param name cookie的名称
 * @returns {null} 不存在时，返回null
 */
var getCookie = function(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

  if ((arr = document.cookie.match(reg))) {
    console.log(arr);
    return unescape(arr[2]);
  } else {
    return null;
  }
};

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
          path: '/BasicData',
          name: 'BasicData',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },

            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },
        {
          path: '/CityInvest',
          name: 'CityInvest',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
            {
              path: 'FinancialList',
              name: 'FinancialList',
            },
            {
              path: 'FinancialForm',
              name: 'FinancialForm',
            },
            {
              path: 'FinancialForm/:id',
              name: 'FinancialFormEdit',
            },
          ],
        },
        {
          path: '/News',
          name: 'News',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },
        {
          path: '/Policy',
          name: 'Policy',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },
        /* 行业研究案例 */
        {
          path: '/ProfessionCase',
          name: 'ProfessionCase',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              hideInMenu: true,
              path: 'Form/:id',
              name: 'FormEdit',
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
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              hideInMenu: true,
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },
        {
          path: '/Organization',
          name: 'Organization',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },
        /* 项目合作 */
        {
          path: '/ProjectCooperation',
          name: 'ProjectCooperation',
          routes: [
            {
              path: 'List',
              name: 'List',
              component: './ProjectCooperation/List',
            },
            {
              path: 'Form',
              name: 'Form',
              component: './ProjectCooperation/Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },

        {
          path: '/Magazine',
          name: 'Magazine',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },
        {
          path: '/Expert',
          name: 'Expert',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        },

        {
          path: '/System',
          name: 'System',
          routes: [
            {
              path: 'FrontConfig',
              name: 'FrontConfig',
            },
            {
              path: 'About',
              name: 'About',
            },
            // {
            //   path: 'Page',
            //   name: 'Page',
            // },
            // {
            //   path: 'Role',
            //   name: 'Role',
            // },
          ],
        },
        {
          path: '/Account',
          name: 'Account',
          routes: [
            {
              path: 'Setting',
              name: 'Setting',
            },
          ],
        },
      ];

      // 追加默认路由（主要判断权限的，默认是把所有路由加载了）
      [
        {
          path: '/',
        },
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
      ].forEach(routes.push, routes);
      const role = getCookie('role');
      if (role == 'admin') {
        console.log(role);
        routes.push({
          path: '/User',
          name: 'User',
          routes: [
            {
              path: 'List',
              name: 'List',
            },
            {
              path: 'Form',
              name: 'Form',
            },
            {
              path: 'Form/:id',
              name: 'FormEdit',
            },
          ],
        });
        console.log('321');
      } else {
        console.log(role);
      }

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

export function updateById(id, payload) {
  return request('/user/updateById', {
    method: 'post',
    data: Object.assign({ id }, payload),
  });
}

export function list(payload) {
  return request('/user/getList', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/user/getDetails?id=' + payload);
}

export function del(payload) {
  return request('/user/delById', {
    method: 'post',
    data: payload,
  });
}
