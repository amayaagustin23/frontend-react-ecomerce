import ProductCard from '@/components/ProductCard';
import { useProduct } from '@/context/Product/ProductContext';
import { PATH_ROUTE_PRODUCT_DETAIL, PRODUCT_ROUTES } from '@/router/paths';
import { PRODUCT_ENDPOINTS } from '@/services/endpoints';
import { Col, Pagination, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { products, loading, pagination, fetchProducts } = useProduct();
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    fetchProducts({ page, size: pagination.size });
  };

  const redirect = (id: string) => {
    navigate(PRODUCT_ROUTES.getDetailPath(id));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={8}>
            <ProductCard product={product} onClick={() => redirect(product.id)} />
          </Col>
        ))}
      </Row>

      <Pagination
        current={pagination.page}
        pageSize={pagination.size}
        total={pagination.total}
        onChange={handlePageChange}
        style={{ marginTop: 24, textAlign: 'center' }}
      />
    </div>
  );
};

export default HomePage;
