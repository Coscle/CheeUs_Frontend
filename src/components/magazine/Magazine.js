import React from "react";
import MagazineTop from "./MagazineTop";
import MagazineCategory from "./MagazineCategory";
import './Magazine.css';



const Magazine = () =>{
  return (
    <div className="board-pagelist-container">
      <MagazineTop/>
      <MagazineCategory />
    </div>
  );
};

export default Magazine;