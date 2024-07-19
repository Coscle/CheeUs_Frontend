import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import './fonts/fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/main/Main';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import LoginCallback from './components/login/LoginCallback';
import SignupCallback from './components/signup/SignupCallback';
import Header from './components/app/Header';
import Footer from './components/app/Footer';
import MyProfilePage from './components/profile/MyProfilePage';
import EditProfile from './components/profile/EditProfile';
import UserProfilePage from './components/profile/UserProfilePage';
import Match from './components/match/Match';
import DTBoard from './components/dtboard/DTBoard';
import DTBInputForm from './components/dtboard/DTBInputForm';
import PostDetail from './components/dtboard/PostDetail';
import PostModify from './components/dtboard/PostModify';
import { PostProvider } from './components/dtboard/PostContext';
import BoardPage from './components/board/BoardPage';
import ShortForm from './components/shortform/ShortFrom';
import WriteShortForm from './components/shortform/WriteShortForm.js'
import EditShortForm from './components/shortform/EditShortForm'
import InputFrom from './components/toast/InputForm';
import FreeBoard from './components/freeboard/FreeBoard';
import DetailFreeBoard from './components/freeboard/DetailFreeBoard';
import WriteFreeBoard from './components/freeboard/WriteFreeBoard';
import EditFreeBoard from './components/freeboard/EditFreeBoard';
import EventBoard from './components/eventboard/EventBoard';
import DetailEventBoard from './components/eventboard/DetailEventBoard';
import WriteEventBoard from './components/eventboard/WriteEventBoard';
import EditEventBoard from './components/eventboard/EditEventBoard';
import DetailShortForm from './components/shortform/DetailShortForm';
import { AuthProvider } from './components/login/OAuth';
import scoket from './server';

const ChatPage = lazy(() => import('./components/chat/ChatPage'));

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <BrowserRouter>
        <PostProvider>
          <Header />
            <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signupcallback" element={<SignupCallback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logincallback" element={<LoginCallback />} />
              <Route path="/mypage" element={<MyProfilePage />} />
              <Route path="/userprofile/:id" element={<UserProfilePage />} />
              <Route path="/mypage/Edit/:id" element={<EditProfile />} />
              <Route path="/main" element={<Main />} />
              <Route path="/match" element={<Match />} />
              <Route path="/dtboard" element={<DTBoard />} />
              <Route path="/dtboard/input" element={<DTBInputForm />} />
              <Route path="/dtboard/post/:id" element={<PostDetail />} />
              <Route path="/dtboard/postModify/:id" element={<PostModify />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/shortform" element={<ShortForm />} />
              <Route path="/board/shortform/detail/:id" element={<DetailShortForm />} />
              <Route path="/board/shortform/Write" element={<WriteShortForm />} />
              <Route path="/board/shortform/edit/:id" element={<EditShortForm />} />
              <Route path="/board/freeboard" element={<FreeBoard />} />
              <Route path="/board/freeboard/detail/:id" element={<DetailFreeBoard />} />
              <Route path="/board/freeboard/write" element={<WriteFreeBoard />} />
              <Route path="/board/freeboard/edit/:id" element={<EditFreeBoard />} />
              <Route path="/board/eventboard" element={<EventBoard />} />
              <Route path="/board/eventboard/detail/:id" element={<DetailEventBoard />} />
              <Route path="/board/eventboard/write" element={<WriteEventBoard />} />
              <Route path="/board/eventboard/edit/:id" element={<EditEventBoard />} />
              <Route path="/chatpage" element={<ChatPage />} />
              <Route path="/input" element={<InputFrom />} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
            </Suspense>
          <Footer />
        </PostProvider>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
