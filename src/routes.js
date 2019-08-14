/**
 * 此配置文件只保证路由可以访问，一些配置是没有用的，以服务器返回的路由为准
 * 例如：name
 * */
module.exports = [
  {
    path: '/Login',
    name: 'Login',
    component: './Login',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/components/Auth'],
    routes: [
      {
        path: '/',
        name: 'welcome',
        component: './Welcome',
      },
      {
        path: 'NoAuth',
        name: '权限测试页',
        component: './NoAuth',
      },
      {
        path: 'Exception',
        name: 'Exception',
        routes: [
          {
            path: '403',
            name: '403',
            component: './Exception/403',
          },
          {
            path: '404',
            name: '404',
            component: './Exception/404',
          },
          {
            path: '500',
            name: '500',
            component: './Exception/500',
          },
        ],
      },

      /* 文章管理 */
      {
        path: 'Article',
        name: 'Article',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './Article/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Article/Form',
          },
          {
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Article/Form',
          },
        ],
      },
      /* 用户管理 */
      {
        path: 'User',
        name: 'User',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './User/List',
          },
          {
            path: 'Form/:id',
            name: 'FormEdit',
            component: './User/Form',
          },
        ],
      },

      /* demo */
      {
        path: 'Demo',
        name: 'Demo',
        routes: [
          {
            path: 'AbsorbedMap',
            name: 'AbsorbedMap',
            component: './Demo/AbsorbedMap',
          },
        ],
      },

      /* 个人中心 */
      {
        path: 'Account',
        name: 'Account',
        routes: [
          {
            path: 'Setting',
            name: 'Setting',
            component: './Account/Setting',
          },
        ],
      },

      // /* 默认页，根据匹配规则，放在最后一个 */
      // {
      //   redirect: '/'
      // },
    ],
  },
]
