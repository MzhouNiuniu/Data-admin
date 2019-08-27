import './index.scss';
import React from 'react';
import { detail as expertDetail } from '@services/expert';
import { message } from 'antd';

class Detail extends React.Component {
  state = {
    formData: null,
  };

  componentDidMount() {
    if (!this.props.match.params.id) return;
    expertDetail(this.props.match.params.id).then(res => {
      const formData = res.data && res.data[0];
      if (!formData) {
        message.error('数据不存在');
        return;
      }
      // 对数组类型的数据处理
      ['languages', 'professional', 'registered', 'achievement'].forEach(item => {
        if (!formData[item] || !formData[item].length) {
          delete formData[item];
        }
      });

      this.setState({
        formData,
      });
    });
  }

  render() {
    const { formData } = this.state;
    if (!formData) return null;
    const DEFAULT_MSG = '待完善';
    return (
      <section style={{ backgroundColor: '#fff', width: '1000px', padding: '10px' }}>
        <table className="outmoded-table brief-table">
          <caption>专家信息</caption>
          <tbody>
            <tr>
              <th>姓 名</th>
              <td>{formData.name}</td>
              <th>性 别</th>
              <td>{formData.sex}</td>
              <td rowSpan={4}>
                <img className="avatar" alt="个人头像" src={formData.photos} />
              </td>
            </tr>
            <tr>
              <th>学 历</th>
              <td>{formData.education}</td>
              <th>学 位</th>
              <td>{formData.degree}</td>
            </tr>
            <tr>
              <th>专家类型</th>
              <td>{formData.experType}</td>
              <th>邮 箱</th>
              <td>{formData.mailbox}</td>
            </tr>
            <tr>
              <th>擅长领域</th>
              <td colSpan={4}>{formData.speciality}</td>
            </tr>
            {/*语言能力*/}
            <tr>
              <th rowSpan={1 + (!formData.languages ? 1 : formData.languages.length)}>语言能力</th>
              <td>序号</td>
              <td colSpan={2}>听说能力</td>
              <td>读写能力</td>
            </tr>
            {!formData.languages ? (
              <tr>
                <td colSpan={4}>{DEFAULT_MSG}</td>
              </tr>
            ) : (
              formData.languages.map((item, index) => (
                <tr key={'lang' + index}>
                  <td>{index + 1}</td>
                  <td colSpan={2}>{item.lsAbility}</td>
                  <td>{item.rwAbility}</td>
                </tr>
              ))
            )}
            {/*专业技术职称*/}
            <tr>
              <th rowSpan={1 + (!formData.professional ? 1 : formData.professional.length)}>
                专业技术职称
              </th>
              <td>序号</td>
              <td colSpan={2}>名称</td>
              <td>评定时间</td>
            </tr>
            {!formData.professional ? (
              <tr>
                <td colSpan={4}>{DEFAULT_MSG}</td>
              </tr>
            ) : (
              formData.professional.map((item, index) => (
                <tr key={'pro' + index}>
                  <td>{index + 1}</td>
                  <td colSpan={2}>{item.name}</td>
                  <td>{item.confirmTime}</td>
                </tr>
              ))
            )}
            {/*注册执业资格*/}
            <tr>
              <th rowSpan={1 + (!formData.registered ? 1 : formData.registered.length)}>
                注册执业资格
              </th>
              <td>序号</td>
              <td colSpan={2}>名称</td>
              <td>评定时间</td>
            </tr>
            {!formData.registered ? (
              <tr>
                <td colSpan={4}>{DEFAULT_MSG}</td>
              </tr>
            ) : (
              formData.registered.map((item, index) => (
                <tr key={'reg' + index}>
                  <td>{index + 1}</td>
                  <td colSpan={2}>{item.name}</td>
                  <td>{item.confirmTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <table className="outmoded-table project-table">
          <caption>PPP从业经历及工作成果</caption>
          {!formData.achievement ? (
            <tr>
              <td>{DEFAULT_MSG}</td>
            </tr>
          ) : (
            <tbody>
              {formData.achievement.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={4} className="item-title">
                      科研成果{index + 1}
                    </td>
                  </tr>
                  <tr>
                    <th> 名 称</th>
                    <td colSpan={3}>{item.name}</td>
                  </tr>
                  <tr>
                    <th>时 间</th>
                    <td>
                      {item.time[0]} ～ {item.time[1]}
                    </td>
                    <th>项目级别</th>
                    <td>{item.level}</td>
                  </tr>
                  <tr>
                    <th>参与主体性质</th>
                    <td colSpan={3}>{item.nature}</td>
                  </tr>
                  <tr>
                    <th>项目内容</th>
                    <td colSpan={3} className="text-left">
                      {item.content}
                    </td>
                  </tr>
                  <tr>
                    <th>承担角色</th>
                    <td colSpan={3}>{item.role}</td>
                  </tr>
                  <tr>
                    <th>工作职责</th>
                    <td colSpan={3} className="text-left">
                      {item.duty}
                    </td>
                  </tr>
                  <tr>
                    <th>工作成果</th>
                    <td colSpan={3} className="text-left">
                      {item.summary}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          )}
        </table>
      </section>
    );
  }
}

export default Detail;
