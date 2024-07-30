import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import ProfileCard from '../profile/ProfileCard';
import './tinderCards.css';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { 
  selectProfiles, 
  selectShuffledProfiles, 
  selectCurrentIndex, 
  setShuffledProfiles, 
  updateConfirmedList, 
  updateShowMessages, 
  decrementIndex, 
  resetIndex 
} from '../../store/MatchSlice';
import { AuthContext } from '../login/OAuth';
import axios from 'axios';

const TinderCards = () => {
  const dispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const [profileCards, setCards] = useState([]);
  const shuffledProfiles = useSelector(selectShuffledProfiles);
  const currentIndex = useSelector(selectCurrentIndex);
  const [showMessages, setShowMessages] = React.useState([]);
  const {memberEmail, serverUrl} = useContext(AuthContext);

  useEffect(() => {
    if (profiles.length > 0) {
      console.log(shuffledProfiles);
      const filteredProfiles = profiles.filter(profile =>
        profile.profile.locationOk === true && 
        profile.profile.matchOk === true && 
        profile.profile.email !== memberEmail &&
        !shuffledProfiles.includes(profile)
      );
      setCards([...filteredProfiles]);

      const shuffled = shuffleArray(filteredProfiles);
      dispatch(setShuffledProfiles(shuffled));
    }
  }, [dispatch, profiles]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const childRefs = useMemo(
    () => shuffledProfiles.map(() => React.createRef()),
    [shuffledProfiles]
  );

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, profileId, index) => {
    const newShowMessages = [...showMessages];
    newShowMessages[index] = direction === 'right' ? 'LIKE' : 'NOPE';

    // 백엔드에서 처리
    const formData = new FormData();
    formData.append('member1', memberEmail);
    formData.append('member2', profileId);
    formData.append('type', direction);
    axios.post(serverUrl + "/match/swipe", formData)
    .then((res)=>{
      if (res.data) {
        //sendMessage(res.data);
      }
      console.log(res)
    });

    setShowMessages(newShowMessages); // 상태 업데이트
    dispatch(updateConfirmedList(profileId));
    dispatch(decrementIndex());
    console.log(`Confirmedlist updated for profileId ${profileId}:`, shuffledProfiles[index].confirmedlist);
  };

  
  // 채팅방 생성 + 시스템 메시지 전송
  const sendMessage = async (data) => {
      if (!memberEmail) {
          console.log('Cannot send message: No selected chat, empty input, or missing user ID.');
          return;
      }

      const newRoom = {
        id : data.id,
        member1 : data.member1,
        member2 : data.member2
      }

      const newMessage = {
          sender_id: 'System',
          message: '매칭 성공! 즐거운 대화를 나누어 보아요',
          write_day: new Date().toISOString(),
          read: 0,
      };

      //socket.current.emit('sendMessage', newMessage);

      try {
          const endpoint = 'http://localhost:8889/api/messages';
          await axios.post(endpoint, newMessage);
          //dispatch(setMessageInput(''));
      } catch (error) {
          console.error('Error sending message:', error);
      }
  };

  const outOfFrame = (name, idx) => {
    if (idx === 0) {
      dispatch(resetIndex());
    }
  };

  const swipe = async (dir, index) => {
    if (!canSwipe || index < 0 || index >= shuffledProfiles.length || !childRefs[index]?.current) {
      return;
    }

    await childRefs[index].current.swipe(dir);
  };

  const handleSwipeLeft = async () => {
    if (!canSwipe || currentIndex <= 0) return;
    const index = currentIndex - 1;
    await swipe('left', index);
  };

  const handleSwipeRight = async () => {
    if (!canSwipe || currentIndex <= 0) return;
    const index = currentIndex - 1;
    await swipe('right', index);
  };

  return (
    <div className="tinderCard_container">
      {currentIndex === -1 ? (
        <div className="noMoreCardsMessage">
          <p>매칭 할 카드가 없습니다.</p>
          <p>함께 마셔요 게시판에는 있을지도~?</p>
        </div>
      ) : (
        <>
          <div className='cardContainer'>
            {profileCards ? profileCards.map((profile, index) => (
              <TinderCard
                ref={childRefs[index]}
                className='swipe'
                key={profile.profile.email}
                onSwipe={(dir) => swiped(dir, profile.profile.email, index)}
                onCardLeftScreen={() => outOfFrame(profile.profile.email, index)}
                preventSwipe={['up', 'down']}
              >
                <div className="card">
                  <ProfileCard profileInfo={profile} />
                  {showMessages[index] && (
                    <div className={`infoText ${showMessages[index] === 'LIKE' ? 'like' : 'nope'}`}>
                      {showMessages[index]}
                    </div>
                  )}
                </div>
              </TinderCard>
            )) : <></>}
          </div>
          {canSwipe && (
            <div className='swipeButtons'>
              <IconButton onClick={handleSwipeLeft} disabled={!canSwipe}>
                <div className="show-nope">Nope!</div>
                <CloseIcon fontSize='large' className="close_button" />
              </IconButton>
              <IconButton onClick={handleSwipeRight} disabled={!canSwipe}>
                <div className="show-like">Like!</div>
                <FavoriteIcon fontSize='large' className="favorite_button" />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TinderCards;