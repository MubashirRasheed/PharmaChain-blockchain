/* eslint-disable react/jsx-props-no-spreading */
// import React from 'react';
// import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from 'react-chat-engine-advanced';
// import Header from '../customChatHeader/chatHeader';

// const Chat = () => {
//   const chatProps = useMultiChatLogic(
//     process.env.REACT_APP_CHAT_PROJECT_ID,
//     'testuser',
//     '1234',
//   );

//   console.log(chatProps);

//   return (
//     <div style={{ flexBasis: '100%' }}>
//       <MultiChatSocket {...chatProps} />
//       <MultiChatWindow
//         {...chatProps}
//         style={{ height: '100vh' }}
//         renderChatHeader={(chat) => <div style={{ backgroundColor: 'red', height: '100px' }}>{chat.id}</div>}
//       />
//     </div>
//   );
// };

// export default Chat;

// import React, { useEffect, useState } from 'react';
// import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from 'react-chat-engine-advanced';
// import Header from '../customChatHeader/chatHeader';

// const Chat = () => {
//   const chatProps = useMultiChatLogic(
//     process.env.REACT_APP_CHAT_PROJECT_ID,
//     'testuser',
//     '1234',
//   );
//   console.log(chatProps);

//   return (
//     <div style={{ flexBasis: '100%' }}>
//       <MultiChatSocket {...chatProps} />
//       <MultiChatWindow
//         {...chatProps}
//         style={{ height: '100vh' }}
//         renderChatHeader={(chat) => <div style={{ backgroundColor: 'red', height: '100px' }}>{chat.id}</div>}
//       />
//     </div>
//   );
// };

// export default Chat;

import { captionActionComplete } from '@syncfusion/ej2-react-grids';
import React, { useState, useEffect } from 'react';
import {
  useMultiChatLogic,
  MultiChatSocket,
  MultiChatWindow,
} from 'react-chat-engine-advanced';
import { RiChatSettingsLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import ChatHeader from '../customChatHeader/chatHeader';
import StandardMessageForm from '../customMessageForms/StandardMessageForm';

const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [windowReady, setWindowReady] = useState(false);
  const user = useSelector((state) => state.user);
  console.log(user.fullname, user.chatId);
  const chatProps = useMultiChatLogic(
    process.env.REACT_APP_CHAT_PROJECT_ID,
    user.fullname,
    user.chatId,
  );

  useEffect(() => {
    if (chatProps) {
      setLoading(false);
    }
  }, [chatProps]);

  const handleWindowReady = () => {
    setWindowReady(true);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chatProps || chatProps.username === null) {
    return <div>Username is null</div>;
  }
  console.log(chatProps);
  // if (chatProps.activeChatId === undefined) {
  //   return <div>Loading chat data...</div>;
  // }

  return (
    <div style={{ flexBasis: '100%' }}>

      <MultiChatSocket {...chatProps} />
      <MultiChatWindow
        {...chatProps}
        style={{ height: '100vh' }}
        renderChatHeader={(chat) => (<ChatHeader chat={chat} />)}
        renderMessageForm={(props) => (
          <StandardMessageForm props={props} activeChat={chatProps.chat} />
        )}
      />

    </div>

  );
};

export default Chat;

