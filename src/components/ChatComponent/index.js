import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { useAuth } from '../../contexts/AuthContext';
const ChatComponent = ({ datauser }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false);
    const newSocket = new WebSocket('wss://my-blog-server-696m.onrender.com?user-id=' + user._id);
    useEffect(() => {
        newSocket.onopen = () => {
            setSocket(newSocket);
            const data = {
                type: 'load_messages',
                senderId: user._id,
                receiverId: datauser._id
            };
            newSocket.send(JSON.stringify(data));
        };

        newSocket.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            setReceivedMessages((receivedMessages) => [...receivedMessages, messageData]);
        };

        newSocket.onclose = () => {
            setSocket(null);
        };

        // return () => {
        //     if (socket) {
        //         socket.close();
        //     }
        // };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket) {
            socket.send(JSON.stringify({
                text: message,
                sender: user._id,
                receiver: datauser._id
            }));
            setMessage('');
        }
    };

    const handleChat = (e) => {
        e.preventDefault();
        setIsChatting(!isChatting);
    };

    const filteredMessages = receivedMessages.filter(
        (msg) => msg.sender === datauser._id || msg.receiver === datauser._id
    );
    return (
        <div className="chatbox">
            <div className="chat-mg" onClick={handleChat}>
                <a title=""><img src={datauser.profilePictureUrl || `images/userava.jpg`} alt="" /></a>
            </div>
            <div className={`conversation-box ${isChatting ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
                <div className="con-title mg-3">
                    <div className="chat-user-info">
                        <img src={datauser.profilePictureUrl || `images/userava.jpg`} alt="" />
                        <h3>{datauser.lastName} <span className="status-info"></span></h3>
                    </div>
                    <div className="st-icons">
                        <button href="#" title=""><i className="la la-cog"></i></button>
                        <button onClick={handleChat} className="close-chat"><i className="la la-minus-square"></i></button>
                        <button onClick={handleChat} className="close-chat"><i className="la la-close"></i></button>
                    </div>
                </div>
                <div className="chat-hist">
                    {filteredMessages.map((msg, index) => (
                        <div className={`chat-msg ${msg.sender === datauser._id ? "st2" : ""}`} key={index}>
                            <p>{msg.message}</p>
                            <span>{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="typing-msg">
                    <form>
                        <textarea
                            placeholder="Nhập tin nhắn..."
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <button type="submit" onClick={sendMessage}><i className="fa fa-send"></i></button>
                    </form>
                    <ul className="ft-options">
                        <li><a href="#" title=""><i className="la la-smile-o"></i></a></li>
                        <li><a href="#" title=""><i className="la la-camera"></i></a></li>
                        <li><a href="#" title=""><i className="fa fa-paperclip"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;