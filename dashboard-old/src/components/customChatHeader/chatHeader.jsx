import React from 'react';
import { ChatBubbleLeftRightIcon, PhoneIcon } from '@heroicons/react/24/solid';

const ChatHeader = ({ chat }) => {
  console.log('hello');
  return (
    <div className="chat-header">
      <div className="flexBetween">
        <ChatBubbleLeftRightIcon className="icon-chat" />
        <h3 className="header-text">{chat.title}</h3>
      </div>
      <div className="flxBetween">
        <PhoneIcon className="icon-phone" />
        {chat.description !== '⬅️ ⬅️ ⬅️' ? (
          <p className="header-text">{chat.description}</p>)
          : (<p className="header-text">No Chat Selected</p>)}
      </div>
    </div>
  );
};

export default ChatHeader;
