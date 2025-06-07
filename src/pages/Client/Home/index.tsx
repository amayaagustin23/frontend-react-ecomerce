import React, { useEffect } from 'react';
import { useProduct } from '@/context/Product/ProductContext';
import ProductCard from '@/components/ProductCard';
import { Col, Row, Spin, Card, Typography, Divider } from 'antd';
import { SkinOutlined, LaptopOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PATH_ROUTE_PRODUCTS, PRODUCT_ROUTES } from '@/router/paths';
import styles from './HomePage.module.scss';
import { useCategory } from '@/context/Category/CategoryContext';
import BannerCarousel from '@/components/BannerCarousel';

const categoryIcons: Record<string, React.ReactNode> = {
  Deportes: <SkinOutlined />,
  Tecnologia: <LaptopOutlined />,
  Hogar: <HomeOutlined />,
};

const HomePage = () => {
  const { favoriteProducts, fetchFavoriteProducts, loading } = useProduct();
  const { categories } = useCategory();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);

  const redirect = (id: string) => {
    navigate(PRODUCT_ROUTES.getDetailPath(id));
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }
  const goToProductsByCategory = (name: string) => {
    navigate(`${PATH_ROUTE_PRODUCTS}?category=${name}`);
  };

  return (
    <div className={styles.container}>
      <BannerCarousel />
      <div className={styles.categoriesRow}>
        {categories.length > 0 && (
          <div className={styles.categoriesRow}>
            {categories.map((category) => (
              <Card
                key={category.id}
                className={styles.categoryCard}
                hoverable
                onClick={() => goToProductsByCategory(category.name)}
              >
                <div className={styles.icon}>
                  {categoryIcons[category.name] || <AppstoreOutlined />}
                </div>
                {!isMobile && (
                  <Typography.Text strong className={styles.textCategory}>
                    {category.name}
                  </Typography.Text>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      <Divider />
      <Typography.Title level={3}>Favoritos</Typography.Title>
      <Row gutter={[16, 16]}>
        {favoriteProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={6} lg={6}>
            <ProductCard product={product} onClick={() => redirect(product.id)} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
