// import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import { login, getAllChat, getChat } from './api'

function App() {
  async function fetchLogin() {
    try {
      const res = await login('Qianqiu', 'Xwc03420');
      console.log(res);
      return res.userId;
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchGetAllChatInfos(userId: string) {
    try {
      const res = await getAllChat(userId);
      console.log(res);
      return res;
    }catch (err) {
      console.error(err);
    }
  }

  async function fetchGetChat(question: string, userId: string, conversationId?: number) {
    try {
      const res = await getChat(question, userId, conversationId);
      console.log(res);
      return res;
    }catch (err) {
      console.error(err);
    }
  }

  async function getChatInfos() {
    const userId = await  fetchLogin();
    console.log(userId);
    const res = await fetchGetAllChatInfos(userId);
    console.log(res.chatInfo);
    return res;
  }

  useEffect(() => {
    getChatInfos();
    fetchGetChat('你好,请告诉我计算机硬件有哪些？', '1112', 8);
  }, []);

  return (
    <>
    </>
  )
}

export default App
