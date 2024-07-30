import React, { useEffect, useState } from 'react';
import { usePosts } from './PostContext';
/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053"; // 카카오 API 키

const InputMap = ({ isEditing }) => {
  const { selectedPlace, setSelectedPlace } = usePosts();
  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [markers, setMarkers] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [places, setPlaces] = useState([]);
  const [currentOverlay, setCurrentOverlay] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      try {
        if (window.kakao && window.kakao.maps) {
          kakao.maps.load(() => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
              center: new kakao.maps.LatLng(37.5665, 126.9780),
              level: 3,
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            setMap(map);

            const mapTypeControl = new kakao.maps.MapTypeControl();
            map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
            const zoomControl = new kakao.maps.ZoomControl();
            map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            // 수정 모드일 때 마커 설정
            if (isEditing && selectedPlace) {
              setMarkerOnMap(selectedPlace, map);
            }
          });
        }
      } catch (error) {
        console.error('카카오맵 스크립트 로드 중 오류 발생:', error);
      }
    };

    script.onerror = () => {
      console.error('카카오맵 스크립트를 로드할 수 없습니다.');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isEditing && selectedPlace && map) {
      setMarkerOnMap(selectedPlace, map);
    }
  }, [isEditing, selectedPlace, map]);

  const setMarkerOnMap = (place, mapInstance) => {
    const placePosition = new kakao.maps.LatLng(place.latitude, place.longitude);
    const { marker, overlay } = addMarker(placePosition, 0, place.title, place.address);
    mapInstance.setCenter(placePosition);
    setMarkers([{ marker, overlay }]);
  };

  const handleSearch = () => {
    if (!map || searchInput === '') return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchInput, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        setPagination(pagination);
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  };

  const displayPlaces = (places) => {
    removeMarkers();
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = places.map((place, index) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      const { marker, overlay } = addMarker(placePosition, index, place.place_name, place.address_name);
      bounds.extend(placePosition);

      return { marker, overlay, place };
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const addMarker = (position, idx, title, addressName) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
      imageSize = new kakao.maps.Size(36, 37),
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
        offset: new kakao.maps.Point(13, 37)
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
      });

    marker.setMap(map);

    const generateCustomOverlayContent = (onClose) => {
      let content = `
        <div style="position: relative; display: inline-block; padding:15px; background-color:white; border-radius:10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5); border: none;">
          <button style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 10px; cursor: pointer; color: black;">✖</button>
          <h3 style="margin:0; padding-bottom:5px; border-bottom:1px solid #ccc;width: auto;">${title}</h3>
          <p style="margin:5px 0;">${addressName}</p>
          <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;"></div>
        </div>
      `;

      // DOM element 생성 후 이벤트 리스너 추가
      const div = document.createElement('div');
      div.innerHTML = content.trim();
      const button = div.querySelector('button');
      button.addEventListener('click', onClose);

      return div;
    };

    const overlay = new kakao.maps.CustomOverlay({
      content: generateCustomOverlayContent(() => {
        overlay.setMap(null);
        setCurrentOverlay(null);
      }),
      position: marker.getPosition(),
      yAnchor: 1.5,
      zIndex: 3,
      clickable: true
    });

    kakao.maps.event.addListener(marker, 'click', () => {
      if (currentOverlay) {
        currentOverlay.setMap(null);
      }
      overlay.setMap(map);
      setCurrentOverlay(overlay);
      const latlng = marker.getPosition();
      const message = `위도 : ${latlng.getLat()}, 경도 : ${latlng.getLng()}, 장소명 : ${title}, 주소 : ${addressName}`;
      console.log(message);

      setSelectedPlace({
        latitude: latlng.getLat(),
        longitude: latlng.getLng(),
        title,
        address: addressName,
      });
    });

    return { marker, overlay };
  };

  const removeMarkers = () => {
    markers.forEach(markerObj => {
      markerObj.marker.setMap(null);
      if (markerObj.overlay) {
        markerObj.overlay.setMap(null);
      }
    });
    setMarkers([]);
  };

  const displayPagination = () => {
    if (!pagination) return null;

    const fragment = [];
    for (let i = 1; i <= pagination.last; i++) {
      fragment.push(
        <a
          key={i}
          href="#"
          className={i === pagination.current ? 'on' : ''}
          onClick={(e) => {
            e.preventDefault();
            pagination.gotoPage(i);
          }}
        >
          {i}
        </a>
      );
    }

    return <div id="searchPagination">{fragment}</div>;
  };

  const handleListItemClick = (index) => {
    const markerObj = markers[index];
    if (markerObj) {
      kakao.maps.event.trigger(markerObj.marker, 'click');
      map.panTo(markerObj.marker.getPosition());
    } else {
      console.error('Marker object is undefined or null');
    }
  };

  return (
    <div className="board-right">
      <div className="map-search-box">
        <input
          type="text"
          id="keyword"
          placeholder="검색어를 입력하세요"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div id="map" className="map" style={{ height: '96vh' }}></div>
      <div className="search-result">
        <ul id="placesList">
          {places.map((place, index) => (
            <li key={index} className="item" onClick={() => handleListItemClick(index)}>
              <span className={`markerbg marker_${index + 1}`}></span>
              <div className="info">
                <h5>{place.place_name}</h5>
                {place.road_address_name ?
                  (<span>{place.road_address_name}<br /><span className="jibun gray">{place.address_name}</span></span>) :
                  (<span>{place.address_name}</span>)
                }
                <br /><span className="tel">{place.phone}</span>
              </div>
            </li>
          ))}
        </ul>
        <div id="searchPagination">
          {displayPagination()}
        </div>
      </div>
    </div>
  );
};

export default InputMap;
