import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Layout } from 'antd';
import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import '@zegocloud/zimkit-react/index.css'
import './styles.less';
import logo from '../../assets/dumuc/logo.png';
import { auth } from '../../utils/firebase';
import { getProfile } from '../../apis/users';
import { Common, ZIMKitChatListVM, ZIMKitConversationType, ZIMKitManager } from '../../ZIMKit/src';
import { connect, useDispatch } from 'react-redux';
import { addCacheUserToList, getCacheUserInfo, setCacheUserInfo } from '../../util';
import { ZIMKitUserInfoModel } from '../../ZIMKit/src/components/ZIMKitUser/Model';


const ChatPage = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState<any>(true);
  const [user, setUser] = useState<any>()

  const cacheUserInfo = getCacheUserInfo() as ZIMKitUserInfoModel;

  const appConfig = {
    appID: 2077418010,
    serverSecret: '9710a4e98061a5e094d4f8164bca58ef'
  };
  useEffect(() => {
    if (user?.username && loading === false) {
      const init = async()=> {
          const zimKit = new ZIMKitManager();
          const token = zimKit.generateKitTokenForTest(appConfig.appID, appConfig.serverSecret, `dumuc${user?.username}`);
          await zimKit.init(appConfig.appID);
          const userInfo = {
            userID: `dumuc${user?.username}`,
            userName: `dumuc${user?.username}`,
            userAvatarUrl: user?.photo ? user?.photo : 'https://staging.dumuc.me/dumuc/avatar.png',
        }
          await zimKit.connectUser(userInfo, token).then(() => {
            setCacheUserInfo(userInfo);
            addCacheUserToList(userInfo);
            // dispatch(login)
          })
          // console.log('zegocloud login: ', login)
      }
      init();
    }
  }, [user?.username, loading])

  useEffect(() => {
    auth.onAuthStateChanged(auth => { 
      if (auth) {
          auth
          .getIdToken(true)
          .then(async(token) => {
              //getProfile
              let profile = await getProfile(token);
              setUser(profile);
              setLoading(false)
          });
      } else {
        navigate(`${process.env.REACT_APP_HOMEPAGE_URL}/auth`)
      }
    });
  }, [])
  return (
    <Layout className="chat-page">
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}>
        <div onClick={() => window.location = 'https://staging.dumuc.me' as Location | (string & Location)}  style={{display: 'flex', flexDirection: 'row', marginTop: 10, cursor: 'pointer', paddingLeft: 10}}>
          <div><LeftOutlined /> <span>Back</span></div>
          <img src={logo} alt="DuMuc" style={{ height: 24, marginLeft: 10 }} />
        </div>
        <div style={{marginRight: 24, marginTop: 10}}>
          {user?.username && (
            <span style={{color: '#c80000', fontWeight: 'bold'}}>
              <UserOutlined /> dumuc{user?.username}
            </span>
          )}
        </div>
      </div>
      <div>
        {loading ?
        <div className="center">
          Đang tải ...
        </div>
        :
        <Common />
        }
      </div>
    </Layout>

  )
};

export default ChatPage;