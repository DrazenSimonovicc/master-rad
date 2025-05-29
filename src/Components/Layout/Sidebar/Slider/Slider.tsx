"use client";
import { FC } from "react";
import styles from "./Slider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";

import SwiperCore from "swiper";
SwiperCore.use([Navigation, Autoplay]);
import { ImageType } from "@/Interfaces/BaseType";
import clsx from "clsx";
import { Autoplay, Navigation } from "swiper/modules";
import { Pagination } from "@mui/material";

interface SliderProps {
  images: ImageType[];
  className?: string;
}

export const Slider: FC<SliderProps> = ({ className, images }) => {
  return (
    <Swiper
      navigation={true}
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{ delay: 6000 }}
      allowTouchMove={false}
      className={clsx(styles.swiperContainer, className)}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className={styles.imageWrap}>
            <picture>
              <img src={image.url} alt={image.alt} className={styles.image} />
            </picture>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
