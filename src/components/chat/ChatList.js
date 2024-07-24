import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Search } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, fetchTogetherChatRooms } from '../../store/ChatSlice';

const ChatList = ({ selectedChat, handlePersonClick, isTogether }) => {
    const { token } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const dispatch = useDispatch();
    const updatedChatRooms = useSelector(state => state.chat.chatRooms);
    const updatedTogetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const status = useSelector(state => state.chat.status);
    const error = useSelector(state => state.chat.error);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
                dispatch(fetchChatRooms(decodedToken.email)).catch(err => {
                    console.error('Failed to fetch chat rooms:', err);
                });
                dispatch(fetchTogetherChatRooms()).catch(err => {
                    console.error('Failed to fetch together chat rooms:', err);
                });
            } catch (err) {
                console.error('Token decoding error:', err);
            }
        }
    }, [token, dispatch]);

    useEffect(() => {
        console.log('업데이트된 1:1 채팅방:', updatedChatRooms);
        console.log('업데이트된 단체 채팅방:', updatedTogetherChatRooms);
    }, [updatedChatRooms, updatedTogetherChatRooms]);

    const getProfileImage = useCallback((memberId) => {
        return `https://www.example.com/profiles/${memberId}.jpg`;
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '메시지가 없습니다'; 

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '잘못된 날짜';

        const now = new Date();
        const diff = now - date;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        return `${minutes}분 전`;
    };

    const getLastMessage = (room) => {
        return room.lastMessage || { message: '메시지가 없습니다', write_day: new Date().toISOString() };
    };

    const isUserInChat = (room) => {
        if (!isTogether || !room.members) return true;
        return room.members.includes(loggedInUserId);
    };

    const currentChatRooms = isTogether ? updatedTogetherChatRooms : updatedChatRooms;

    if (status === 'loading') {
        return <div>로딩 중...</div>;
    }

    if (status === 'failed') {
        return <div>오류 발생: {error}</div>;
    }


    return (
        <>
            <div className="chat-top d-flex align-items-center">
                <input type="text" className="form-control chat-search" placeholder="검색" />
                <Search className="search-icon ml-2" />
            </div>
            <ul className="chat-people list-unstyled">
                {currentChatRooms && currentChatRooms.length > 0 ? (
                    currentChatRooms.filter(isUserInChat).map(room => {
                        const lastMessage = getLastMessage(room);
                        return (
                            <li
                                key={room.roomId}
                                className={`chat-person ${selectedChat && selectedChat.roomId === room.roomId ? 'chat-active' : ''}`}
                                onClick={() => handlePersonClick(room.roomId)}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        {!isTogether && (
                                            <img
                                                src={getProfileImage(room.member1)}
                                                alt={`${room.member1}의 프로필`}
                                                className="rounded-circle mr-3"
                                                style={{ width: '40px', height: '40px' }}
                                            />
                                        )}
                                        <span className="chat-name">
                                            {isTogether ? `${room.togetherId}` : (room.member1 !== loggedInUserId ? room.member1 : room.member2)}
                                        </span>
                                    </div>
                                    <span className="chat-time">
                                        {formatDate(lastMessage.write_day)}
                                    </span>
                                </div>
                                <p className="chat-preview mt-1">
                                    {lastMessage.message}
                                </p>
                            </li>
                        );
                    })
                ) : (
                    <li className="no-messages">채팅이 없습니다</li>
                )}
            </ul>
        </>
    );
};

export default ChatList;
