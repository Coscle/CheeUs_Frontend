import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import MagazineTop from "./MagazineTop";
import Pagination from '@mui/material/Pagination';
import './Magazine.css';

const initialBoards = [
  {
    id: 1,
    title: "스크류드라이버 레시피",
    content: "간결해서 만들기 쉬운!",
    photoes: "/images/recipe1.jpg",
    author_id: 1,
    author_name: "관리자",
    like: 17,
    views: 151,
    category: 1
  },
  {
    id: 2,
    title: "쿠바 리브레 레시피",
    content: "실패할 수 없는 맛!",
    photoes: "/images/recipe2.jpg",
    author_id: 2,
    author_name: "관리자",
    like: 21,
    views: 78,
    category: 1
  },
  {
    id: 3,
    title: "데킬라 선라이즈 레시피",
    content: "사진잘받는 영롱한색!",
    photoes: "/images/recipe3.jpg",
    author_id: 2,
    author_name: "관리자",
    like: 5,
    views: 37,
    category: 1
  },
  {
    id: 4,
    title: "미도리사워 레시피",
    content: "모르는 사람은 있어도, 한잔만 마신 사람은 없다..!",
    photoes: "/images/recipe4.jpg",
    author_id: 2,
    author_name: "관리자",
    like: 34,
    views: 97,
    category: 1
  },
  {
    id: 5,
    title: "뉴욕 레시피",
    content: "라이위스키로 만드는 칵테일!",
    photoes: "/images/recipe5.jpg",
    author_id: 2,
    author_name: "관리자",
    like: 55,
    views: 138,
    category: 1
  },
];

const Recipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [boards, setBoards] = useState(initialBoards);
  const [searchQuery, setSearchQuery] = useState('');

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  // 게시물 추가 함수
  const addBoard = (newBoard) => {
    setBoards([...boards, newBoard]);
  };

  const handleCardClick = (id) => {
    navigate(`/board/magazineContent/detail/${id}`);
  };

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBoards = boards.filter(board => board.category === 1 && (board.title.includes(searchQuery) || board.content.includes(searchQuery))).slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(boards.filter(board => board.category === 1 && (board.title.includes(searchQuery) || board.content.includes(searchQuery))).length / itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <MagazineTop/>
      <div className="magazineContent-container">
        <div className="magazineContent-card-container">
          {currentBoards.map((board) => (
            <Card
              key={board.id}
              variant="plain"
              className="magazineContent-card"
              onClick={() => handleCardClick(board.id)}
            >
              <Box className="card-video">
                <AspectRatio ratio="4/3">
                  {board.photoes ? (
                    <CardCover className="card-cover">
                      <img
                        src={board.photoes}
                        alt="게시물 사진"
                        className="card-photo"
                      />
                      <div className="card-overlay-text">
                        {board.content}
                      </div>
                    </CardCover>
                  ) : (
                    <CardCover className="card-cover">
                      <div className="content-text">
                        {board.content}
                      </div>
                    </CardCover>
                  )}
                </AspectRatio>
              </Box>
              <Box>
                <div className="magazineContent-title">
                  {board.title}
                </div>
              </Box>
              <Box className="card-content">
                <Avatar
                  src={`https://images.unsplash.com/profile-${board.author_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                  size="sm"
                  sx={{ '--Avatar-size': '1.5rem' }}
                  className="card-avatar"
                />
                <div>
                  <div className="card-author-name">
                    {board.author_name}
                  </div>
                </div>
                <div className="card-icons-container">
                  <div className="card-icon">
                    <Favorite color="action" />
                    {board.like}
                  </div>
                  <div className="card-icon">
                    <Visibility />
                    {board.views}
                  </div>
                </div>
              </Box>
            </Card>
          ))}
        </div>
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'black',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'black',
            color: 'white',
          },
          '& .MuiPaginationItem-root:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
        className="pagination"
      />
    </>
  );
};

export default Recipe;
