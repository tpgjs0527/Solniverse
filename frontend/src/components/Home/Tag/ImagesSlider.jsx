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

// interface IImages {
//   imageUrl: string;

export const ImagesSlider = ({ Images }) => {
  const [activeThumb, setActiveThumb] = useState();

  return (
    <>
      {/* sdfd */}
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
              {img.description}

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
  z-index: 0;
  width: 45vw;
  height: 60%;
  @media screen and (min-width: 1900px) {
    width: 48vw;
    height: 95%;
  }
  .swiper-slide {
    padding-top: 70%;
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
    color: rgb(255, 255, 255);
  }

  .swiper-button-next {
    right: 30;
    color: rgb(255, 255, 255);
  }
`;
const StyledLowerSwiper = styled(Swiper)`
  @media screen and (min-width: 1900px) {
    width: 48vw;
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
    padding-top: 65%;
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
