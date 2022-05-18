// Swiper 라이브러리 typescript 에러로 인해 jsx로 개발
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Navigation, Thumbs } from "swiper";
import styled from "styled-components";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export const ImagesSlider = ({ Images }) => {
  const [activeThumb, setActiveThumb] = useState();

  return (
    <>
      <StyledUpperSwiper
        loop={true}
        navigation={true}
        modules={[Navigation, Thumbs]}
        grabCursor={true}
        thumbs={{ swiper: activeThumb }}
      >
        {Images.map((img, idx) => (
          <>
            <SwiperSlide key={idx}>
              <img src={`${process.env.PUBLIC_URL}/${img.imageUrl}`} />
            </SwiperSlide>
          </>
        ))}
      </StyledUpperSwiper>
      <StyledLowerSwiper
        onSwiper={setActiveThumb}
        loop={true}
        slidesPerView={4}
        modules={[Navigation, Thumbs]}
      >
        {Images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="images-slider-thumbs-wrapper">
              <img src={`${process.env.PUBLIC_URL}/${img.imageUrl}`} />
            </div>
          </SwiperSlide>
        ))}
      </StyledLowerSwiper>
    </>
  );
};

const StyledUpperSwiper = styled(Swiper)`
  /* width: 800px;
  height: 550px; */
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.2);

  z-index: 0;
  width: 45vw;
  height: 60%;
  @media screen and (min-width: 1700px) {
    width: 48vw;
    height: 72%;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    padding-top: 70%;
    @media screen and (max-width: 800px) {
      padding-top: 7%;
    }
    overflow: hidden;
    position: relative;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
  .swiper-button-prev {
    left: 30;
    color: ${(props) => props.theme.ownColor};
  }

  .swiper-button-next {
    right: 30;
    color: ${(props) => props.theme.ownColor};
  }
`;
const StyledLowerSwiper = styled(Swiper)`
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);

  @media screen and (min-width: 1700px) {
    width: 48vw;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 20%;
  }
  .swiper-slide {
    cursor: pointer;
    border: 1px solid #dddbdb;

    &-thumb-active {
      border-color: #a42dd3;
    }
  }

  .images-slider-thumbs-wrapper {
    width: 100%;
    padding-top: 50%;
    overflow: hidden;
    position: relative;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
`;
