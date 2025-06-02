import React, { useEffect } from 'react';
import { useProduct } from '@/context/Product/ProductContext';
import ProductCard from '@/components/ProductCard';
import { Col, Row, Spin, Card, Typography } from 'antd';
import { SkinOutlined, LaptopOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTES } from '@/router/paths';
import styles from './HomePage.module.scss';
import { useCategory } from '@/context/Category/CategoryContext';
import BannerCarousel from '@/components/BannerCarousel';

const categoryIcons: Record<string, React.ReactNode> = {
  Moda: <SkinOutlined />,
  Tecnologia: <LaptopOutlined />,
  Hogar: <HomeOutlined />,
};

const HomePage = () => {
  const { products, loading, fetchProducts } = useProduct();
  const { categories } = useCategory();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({ page: 1, size: 4 });
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
                onClick={() => console.log('Seleccionar categoría:', category.name)}
              >
                <div className={styles.icon}>
                  {categoryIcons[category.name] || <AppstoreOutlined />}
                </div>
                <Typography.Text strong>{category.name}</Typography.Text>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={6} lg={6}>
            <ProductCard product={product} onClick={() => redirect(product.id)} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
