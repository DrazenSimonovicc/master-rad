"use client";
import React, { FC } from "react";
import styles from "./Hero.module.scss";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation as CustomNavigation } from "../Navigation/Navigation";
import { CustomNavigationData } from "../Navigation/mockedData";
import { Button } from "@/Components/Button";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

SwiperCore.use([Autoplay, Pagination, Navigation]);

interface SliderType {
  image: string;
  title: string;
  description: string;
  linkTo: string;
}

type SliderProps = {
  data: SliderType[];
};

const HeroSlider: FC<SliderProps> = ({ data }) => {
  return (
    <div className={styles.heroSliderContainer}>
      <div className={styles.navigationContainer}>
        <CustomNavigation items={CustomNavigationData} />
      </div>
      <Swiper
        centeredSlides={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        effect="fade"
        speed={2500}
      >
        {data.map((slide: SliderType, index: number) => (
          <SwiperSlide key={index}>
            <div className={styles.heroSectionContainer}>
              {/*<Image
                alt={`Slide ${index + 1}`}
                src={slide.image}
                fill
                priority
                quality={100}
              />*/}
              <picture>
                <img alt={`Slide ${index + 1}`} src={slide.image} />
              </picture>

              <div className={styles.textContainer}>
                <h1 className={styles.title}>{slide.title}</h1>
                <p className={styles.text}>{slide.description}</p>
                <Button
                  title={"Saznaj više"}
                  themes={["height38", "standardWide"]}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
