import React from 'react';
import { Carousel, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './BannerCarousel.module.scss';
import banner1 from '@/assets/images/banners/banner-1.png';
import { PATH_ROUTE_PRODUCTS } from '@/router/paths';

const BannerCarousel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToProducts = () => {
    navigate(`${PATH_ROUTE_PRODUCTS}?category=tecnologia`);
  };

  const goToServices = () => {
    navigate(`${PATH_ROUTE_PRODUCTS}?category=servicios`);
  };

  return (
    <Carousel autoplay draggable swipeToSlide className={styles.bannerCarousel}>
      <div className={styles.bannerSlideFull}>
        <img src={banner1} alt={t('home.banner1.alt')} className={styles.bannerImageFull} />
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerButtons}>
            <Button onClick={goToProducts}>{t('home.banner1.products')}</Button>
            <Button type="primary" onClick={goToServices}>
              {t('home.banner1.services')}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.bannerOnlyText}>
        <Typography.Title level={2}>{t('home.banner2.message')}</Typography.Title>
      </div>
    </Carousel>
  );
};

export default BannerCarousel;
