import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

const MagazineContext = createContext();

export const useMagazines = () => useContext(MagazineContext);

export const MagazineProvider = ({ children }) => {
  const [magazines, setMagazines] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/AdminMagazine');
        const fetchedMagazines = response.data;

        // 데이터 구조 확인
        console.log("Fetched Magazines Data:", fetchedMagazines);

        // 데이터 구조를 확인하고 적절하게 처리
        if (Array.isArray(fetchedMagazines)) {
          setMagazines({ magazine: fetchedMagazines }); // 배열을 객체 형태로 감싸기
        } else {
          setMagazines(fetchedMagazines); // 원래 형태를 유지
          console.log(" *EventContext* " + fetchedMagazines); // 데이터를 확인하는 부분
        }
      } catch (error) {
        console.error("Error fetching events data: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
      <MagazineContext.Provider value={{ magazines }}>
        {children}
      </MagazineContext.Provider>
  );
};


/*
const dummyData = {
  popup: {
    1: {
      id: 1,
      title: "이번주 가장핫한 성수 Label5 팝업!",
      title2: "이번주 가장핫한 성수 Label5 팝업!",
      photoes: "/images/popup1.jpg",
      content: "팝업소식",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
      category: "popup",
    },
    2: {
	  id: 2,
      title: "Absolute 팝업",
      title2: "보드카의 정석 Absolute 팝업",
      photoes: "/images/popup2.jpg",
      content: "팝업소식",
      admin_id: 1,
      admin_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
      category: "popup",
	},
	3: {
	  id: 3,
      title: "JackDaniel's pop-up",
      title2: "JackDaniel's pop-up",
      photoes: "/images/popup3.jpg",
      content: "팝업소식",
      admin_id: 1,
      admin_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
      category: "popup",
	},
	4: {
	  id: 4,
      title: "Devine 보드카 성수 pop-up",
      title2: "Devine 보드카 성수 pop-up",
      photoes: "/images/popup4.jpg",
      content: "팝업소식",
      admin_id: 1,
      admin_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
      category: "popup",
	},
	5: {
	   id: 5,
      title: "홍대 맥주시음 팝업",
      title2: "홍대 맥주 시음 팝업",
      photoes: "/images/popup5.jpg",
      content: "팝업소식",
      admin_id: 1,
      admin_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
      category: "popup",
	},
  },
  recipe: {
    1: {
     id: 1,
      title: "스크류드라이버 레시피",
      title2: "간결해서 만들기 쉬운!",
      photoes: "/images/recipe1.jpg",
      content: "레시피 : ",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
      category: "recipe",
    },
    2: {
	  id: 2,
      title: "쿠바 리브레 레시피",
      title2: "실패할 수 없는 맛!",
      photoes: "/images/recipe2.jpg",
      content: "레시피 : ",
      admin_id: 1,
      admin_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
      category: "recipe",
	},
	3: {
	  id: 3,
      title: "데킬라 선라이즈 레시피",
      title2: "사진잘받는 영롱한색!",
      photoes: "/images/recipe3.jpg",
      content: "레시피 : ",
      admin_id: 1,
      admin_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
      category: "recipe",
	},
	4: {
	   id: 4,
      title: "미도리사워 레시피",
      title2: "모르는 사람은 있어도, 한잔만 마신 사람은 없다..!",
      photoes: "/images/recipe4.jpg",
      content: "레시피 : ",
      admin_id: 2,
      admin_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
      category: "recipe",
	},
	5: {
	  id: 5,
      title: "뉴욕 레시피",
      title2: "라이위스키로 만드는 칵테일!",
      photoes: "/images/recipe5.jpg",
      content: "레시피 : ",
      admin_id: 2,
      admin_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
      category: "recipe",
	},
  },
  recommend: {
    1: {
      id: 1,
      title: "이주의 술집추천 : 성수동편",
      title2: "성수의 핫한 술집 추천!",
      photoes: "/images/recommend1.jpg",
      content: "술칩추천!",
      admin_id: 1,
      admin_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
      category: "recommend",
    },
    2: {
	  id: 2,
      title: "이주의 술집추천 : 이태원편",
      title2: "핫플 이태원의 술집추천",
      photoes: "/images/recommend2.jpg",
      content: "술칩추천!",
      admin_id: 2,
      admin_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
      category: "recommend",
	},
	3: {
	  id: 3,
      title: "이주의 술집추천 : 홍대편",
      title2: "패피들의 성지 홍대 술집추천!",
      photoes: "/images/recommend3.jpg",
      content: "술칩추천!",
      admin_id: 2,
      admin_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
      category: "recommend",
	},
	4: {
	  id: 4,
      title: "이주의 술집추천 : 을지로편",
      title2: "힙지로의 힙한 술집추천!",
      photoes: "/images/recommend4.jpg",
      content: "술칩추천!",
      admin_id: 2,
      admin_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
      category: "recommend",
	},
	5: {
	  id: 5,
      title: "이주의 술집추천 : 군자편",
      title2: "나만 아는 군자 술집 추천!",
      photoes: "/images/recommend5.jpg",
      content: "술칩추천!",
      admin_id: 2,
      admin_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
      category: "recommend",
	},
  },
  tmi: {
    1: {
      id: 1,
	  title: "스크류드라이버를 아시나요?",
	  title2: "광부들의 칵테일 스크류드라이버!",
	  photoes: "/images/tmi1.jpg",
	  content: "TMI!",
	  admin_id: 1,
	  admin_name: "관리자",
	  like: 17,
	  views: 151,
	  date: "2023-07-01",
	  category: "tmi",
    },
    2: {
      id: 2,
      title: "쿠바 리브레의 유래!",
      title2: "쿠바의 자유를 기념하여!",
      photoes: "/images/tmi2.jpg",
      content: "TMI!",
      admin_id: 2,
      admin_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
      category: "tmi",
	},
	3: {
      id: 3,
      title: "데킬라 선라이즈에 대하여.",
      title2: "일출을 떠오르게하는 색",
      photoes: "/images/tmi3.jpg",
      content: "TMI!",
      admin_id: 2,
      admin_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
      category: "tmi",
	},
	4: {
      id: 4,
      title: "초록빛 미도리 사워!",
      title2: "달콤상콤한 초록빛 멜론 칵테일",
      photoes: "/images/tmi4.jpg",
      content: "TMI!",
      admin_id: 2,
      admin_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
      category: "tmi",
	},
	5: {
      id: 5,
      title: "뉴욕! TMI",
      title2: "칵테일 NEW YORK",
      photoes: "/images/tmi5.jpg",
      content: "TMI!",
      admin_id: 2,
      admin_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
      category: "tmi",
	},
  },
};


export const MagazineProvider = ({ children }) => {
  const [magazines, setMagazines] = useState(dummyData);

  return (
    <MagazineContext.Provider value={{ magazines }}>
      {children}
    </MagazineContext.Provider>
  );
};

 */
