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
        path: '/NoAuth',
        name: '权限测试页',
        component: './NoAuth',
      },
      {
        path: '/Exception',
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
      /* 城投数据 */
      {
        path: '/CityInvest',
        name: 'CityInvest',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './CityInvest/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './CityInvest/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './CityInvest/Form',
          },
        ],
      },

      /* 新闻管理 */
      {
        path: '/News',
        name: 'News',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './News/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './News/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './News/Form',
          },
        ],
      },
      /* 政策法规 */
      {
        path: '/Policy',
        name: 'Policy',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './Policy/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Policy/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Policy/Form',
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
            component: './Profession/Case/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Profession/Case/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Profession/Case/Form',
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
            component: './Profession/Report/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Profession/Report/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Profession/Report/Form',
          },
        ],
      },
      /* 机构管理 */
      {
        path: '/Organization',
        name: 'Organization',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './Organization/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Organization/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Organization/Form',
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
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './ProjectCooperation/Form',
          },
        ],
      },
      /* 杂志管理 */
      {
        path: '/Magazine',
        name: 'Magazine',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './Magazine/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Magazine/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Magazine/Form',
          },
        ],
      },
      /* 专家管理 */
      {
        path: '/Expert',
        name: 'Expert',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './Expert/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './Expert/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './Expert/Form',
          },
        ],
      },

      /* 用户管理 */
      {
        path: '/User',
        name: 'User',
        routes: [
          {
            path: 'List',
            name: 'List',
            component: './User/List',
          },
          {
            path: 'Form',
            name: 'Form',
            component: './User/Form',
          },
          {
            hideInMenu: true,
            path: 'Form/:id',
            name: 'FormEdit',
            component: './User/Form',
          },
        ],
      },

      /* 系统管理 */
      {
        path: '/System',
        name: 'System',
        routes: [
          {
            path: 'FrontConfig',
            name: 'FrontConfig',
            component: './System/FrontConfig',
          },
          {
            path: 'About',
            name: 'About',
            component: './System/About',
          },
          {
            path: 'Page',
            name: 'Page',
            component: './System/Page',
          },
          {
            path: 'Role',
            name: 'Role',
            component: './System/Role',
          },
        ],
      },

      /* 个人中心 */
      {
        path: '/Account',
        name: 'Account',
        routes: [
          {
            path: 'Setting',
            name: 'Setting',
            component: './Account/Setting',
          },
        ],
      },

      /* demo */
      {
        path: '/Demo',
        name: 'Demo',
        routes: [
          {
            path: 'AbsorbedMap',
            name: 'AbsorbedMap',
            component: './Demo/AbsorbedMap',
          },
          {
            path: 'PdfPreview',
            name: 'PdfPreview',
            component: './Demo/PdfPreview',
          },
          {
            hideInMenu: true,
            path: 'ExpertPreview/:id',
            name: 'ExpertPreview',
            component: './Demo/ExpertPreview',
          },
        ],
      },
    ],
  },
];
