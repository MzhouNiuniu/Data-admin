export default {
  public: {
    sex: [
      {
        label: '男',
        value: '男',
      },
      {
        label: '女',
        value: '女',
      },
    ],
    status: {
      audit: {
        '0': '未审核',
        '1': '通过',
        '2': '未通过',
      },
    },
  },
  news: {
    typeMap: {
      '0': '行业动态',
      '1': '智库新闻',
      '2': '智库动态',
      '3': '项目动态',
    },
    type: [
      {
        label: '行业动态',
        value: '0',
      },
      {
        label: '智库新闻',
        value: '1',
      },
      {
        label: '智库动态',
        value: '2',
      },
      {
        label: '项目动态',
        value: '3',
      },
    ],
  },
  policy: {
    typeMap: {
      '0': '政策法规',
      '1': '指南标准',
      '2': '国家性规范文件',
      '3': '地方规范文件',
      '4': '部门规范文件',
    },
    type: [
      {
        label: '政策法规',
        value: '0',
      },
      {
        label: '指南标准',
        value: '1',
      },
      {
        label: '国家性规范文件',
        value: '2',
      },
      {
        label: '地方规范文件',
        value: '3',
      },
      {
        label: '部门规范文件',
        value: '4',
      },
    ],
  },
  profession: {
    report: {
      type: [
        {
          label: '专题报告',
          value: '专题报告',
        },
        {
          label: '定期报告',
          value: '定期报告',
        },
      ],
    },
  },

  // old
  JSON: {
    degreeLevel: [
      {
        label: '学士学位',
        value: '学士学位',
      },
      {
        label: '硕士学位',
        value: '硕士学位',
      },
      {
        label: '博士学位',
        value: '博士学位',
      },
    ],
    eduLevel: [
      {
        label: '初中',
        value: '初中',
      },
      {
        label: '高中',
        value: '高中',
      },
      {
        label: '大专',
        value: '大专',
      },
      {
        label: '本科',
        value: '本科',
      },
      {
        label: '硕士研究生',
        value: '硕士研究生',
      },
      {
        label: '博士研究生',
        value: '博士研究生',
      },
    ],
    langMasterLevel: [
      {
        label: '母语',
        value: '母语',
      },
      {
        label: '熟练',
        value: '熟练',
      },
      {
        label: '一般',
        value: '一般',
      },
    ],
    subjectNatureLevel: [
      {
        label: '融资方',
        value: '融资方',
      },
      {
        label: '政府（实施机构）',
        value: '政府（实施机构）',
      },
      {
        label: '社会资本方',
        value: '社会资本方',
      },
      {
        label: '其它',
        value: '其它',
      },
    ],
    projectLevel: [
      {
        label: '国家级',
        value: '国家级',
      },
      {
        label: '省部级',
        value: '省部级',
      },
      {
        label: '地市级',
        value: '地市级',
      },
      {
        label: '其它',
        value: '其它',
      },
    ],
    roleLevel: [
      {
        label: '负责人',
        value: '负责人',
      },
      {
        label: '参与成员',
        value: '参与成员',
      },
    ],
  },
};
