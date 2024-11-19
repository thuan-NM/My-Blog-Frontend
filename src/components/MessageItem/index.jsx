// MessageItem.jsx
import React from "react";
import Highlighter from "react-highlight-words";

const MessageItem = React.memo(({ msg, searchTerm }) => {
  const isMatch = searchTerm
    ? msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    : false;
  const isCurrentMatch = false; // Tùy thuộc vào logic của bạn

  return (
    <div
      key={msg.id}
      id={`msg-${msg.id}`}
      className={`mb-4 flex ${
        msg.sender === user._id ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs px-3 py-2 rounded-lg ${
          msg.sender === user._id
            ? "bg-gray-200 text-black ml-2"
            : "bg-gray-200 text-black mr-2"
        } ${isMatch ? "border-l-4 border-blue-500" : ""}`}
      >
        <Highlighter
          highlightClassName="bg-yellow-200"
          searchWords={[searchTerm]}
          autoEscape={true}
          textToHighlight={msg.text}
        />
        <span className="text-xs block text-right mt-1">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
});

export default MessageItem;
