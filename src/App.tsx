import React, {useEffect, useCallback, ReactElement, JSXElementConstructor} from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import moment from 'moment-timezone';
import 'moment/locale/vi';

import enUSIntl from 'antd/lib/locale/en_US';
import viVNIntl from 'antd/lib/locale/vi_VN';

import {useRecoilState} from 'recoil';
import { useTranslation } from 'react-i18next';
import { localeAtom } from './recoils/atoms';
import HomeLayout from './layouts/home/home.layout';
import ChatPage from './pages/chat/chat';
import AuthPage from './pages/auth/auth';
import CallPage from './pages/call/call';
import LivestreamPage from './pages/livestream/livestream';
type App = ReactElement<any, string | JSXElementConstructor<any>>[];
const App = () => {
  const [locale, setLocale] = useRecoilState(localeAtom);
  moment.tz.setDefault();

  const { i18n } = useTranslation();
  
  const setLanguageHandler = useCallback(
    (languageDetectByBrowser:any) => setLocale(languageDetectByBrowser),
    [locale],
  );

  useEffect(() => {
    // const languageDetectByBrowser = detectBrowserLanguage();
    // if (!languageDetectByBrowser) {
    //   setLanguageHandler(languageDetectByBrowser);
    // }
  }, [setLanguageHandler]);

  useEffect(() => {
    if (!locale || i18n.language === locale) return;
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigProvider locale={locale === 'vi' ? viVNIntl : enUSIntl}>
      <BrowserRouter>
        <HelmetProvider>
          {process.env.REACT_APP_ENV === 'dumuc' && (
            <Helmet>
              <title>DuMuc - Đồng hành vạn dặm</title>
            </Helmet>
          )}
          {process.env.REACT_APP_ENV === 'prod' && (
            <Helmet>
              <title>AppFunnel - "No Code" App Builder for Building a Community, Sales Funnels and Referral</title>
            </Helmet>
          )}
          <Routes>
            <Route path="/" element={<HomeLayout />}>
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:token" element={<AuthPage  />} />
              <Route path="/call" element={<CallPage />} />
              <Route path="/call/:token" element={<AuthPage />} />
              <Route path="/livestream" element={<LivestreamPage />} />
              <Route path="/livestream/:token" element={<AuthPage />} />
            </Route>
          </Routes>
          
        </HelmetProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
};

export default App;
