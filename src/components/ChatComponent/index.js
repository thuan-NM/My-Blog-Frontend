import React, { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { useAuth } from "../../contexts/AuthContext";

const ChatComponent = ({ datauser }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false)

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3001');

        newSocket.onopen = () => {
            console.log('WebSocket connection established');
            setSocket(newSocket);
        };

        newSocket.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            setReceivedMessages((prevMessages) => [...prevMessages, messageData]);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
            setSocket(null);
        };

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket ) {
            socket.send(JSON.stringify({ text: message, sender: user._id, receiver: datauser._id })); // Sửa key 'message' thành 'text'
            setMessage('');
        }
    };

    const handlechat = (e) => {
        e.preventDefault();
        setIsChatting(!isChatting)
    }

    return (
        <div class="chatbox">
            <div class="chat-mg" onClick={handlechat}>
                <a href="#" title=""><img src={datauser.profilePictureUrl || `images/userava.jpg`} alt="" /></a>
                {/* <span>2</span> */}
            </div>
            <div className={`conversation-box ${isChatting ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
                <div className="con-title mg-3">
                    <div className="chat-user-info">
                        <img src={datauser.profilePictureUrl || `images/userava.jpg`} alt="" />
                        <h3>{datauser.lastName} <span className="status-info"></span></h3>
                    </div>
                    <div className="st-icons">
                        <button href="#" title=""><i className="la la-cog"></i></button>
                        <button onClick={handlechat} className="close-chat"><i className="la la-minus-square"></i></button>
                        <button onClick={handlechat} className="close-chat"><i className="la la-close"></i></button>
                    </div>
                </div>
                <div className="chat-hist">
                    {receivedMessages.map((msg, index) => (
                        <div className={`chat-msg ${index % 2 == 0 ? "st2" : ""}`} key={index}>
                            <p >{msg.message}</p>
                            {/* <p >{msg.sender}</p> */}
                            <span>{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>

                    ))}
                </div>
                <div className="typing-msg">
                    <form>
                        <textarea placeholder="Type a message here" type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}></textarea>
                        <button type="submit" onClick={sendMessage} ><i className="fa fa-send"></i></button>
                    </form>
                    <ul className="ft-options">
                        <li><a href="#" title=""><i className="la la-smile-o"></i></a></li>
                        <li><a href="#" title=""><i className="la la-camera"></i></a></li>
                        <li><a href="#" title=""><i className="fa fa-paperclip"></i></a></li>
                    </ul>
                </div>
            </div>
        </div >
    );
};

export default ChatComponent;
