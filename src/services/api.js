import baseURL from '@config/baseUrl';

function genRestfulApi(namespace) {
  return {
    create: `/${namespace}/publish`,
    update: `/${namespace}/updateById`,
    list: `/${namespace}/getDetails`,
    detail: `/${namespace}/getDetails`,
    del: `/${namespace}/delById`,
  };
}

const api = {
  fileServer: {
    uploadFile: `${baseURL.fileServer}/upload`,
    uploadImage: `${baseURL.fileServer}/upload/base64`,
  },

  /**
   * 以下内容暂未使用，仅作文档说明
   * */
  /* 关于我们 */
  IndexConfig: {
    create: `/indexConfig/publish`,
    update: `/indexConfig/publish`,
    detail: `/indexConfig/getDetails`,
  },

  /* 关于我们 */
  about: {
    create: `/about/publish`,
    update: `/about/publish`,
    detail: `/about/getDetails`,
  },

  /* 用户 */
  user: {
    create: `/user/reg`,
    update: `/indexConfig/publish`,
    detail: `/indexConfig/getDetails`,
  },

  /* 登录 */
  login: {
    login: `/user/login`,
    // logout: `/user/logout`,
  },

  /* 基础数据 */
  basicData: genRestfulApi('basicData'),

  /* 项目合作 */
  collaborate: genRestfulApi('collaborate'),

  /* 城投数据 */
  companyData: genRestfulApi('companyData'),

  /* 专家库 */
  expert: genRestfulApi('expert'),

  /* 机构库 */
  organization: genRestfulApi('organization'),

  /* 杂志 */
  magazine: genRestfulApi('magazine'),

  /* 新闻 */
  news: genRestfulApi('news'),

  /* 行业报告 */
  ResearchReport: genRestfulApi('ResearchReport'),

  /* 行业案例 */
  ResearchScriptures: genRestfulApi('ResearchScriptures'),

  /* 行业案例 */
  statute: genRestfulApi('statute'),
};
export default api;
