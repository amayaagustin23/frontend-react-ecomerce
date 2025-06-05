import React, { useEffect, useCallback } from 'react';
import { Card, Typography, Button, Spin } from 'antd';
import { useProduct } from '@/context/Product/ProductContext';
import { Product } from '@/types/Product';
import { useNavigate } from 'react-router-dom';
import CustomTable from '@/components/CustomTable';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PATH_PANEL_PRODUCT, PATH_ROUTE_PANEL_PRODUCTS_CREATE } from '@/router/paths';

const { Title } = Typography;

const ProductsPanelPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { products, loading, pagination, fetchProducts, toggleProductActive } = useProduct();

  useEffect(() => {
    fetchProducts({ page: 1, size: 10 });
  }, []);

  const handleCreate = () => navigate(PATH_ROUTE_PANEL_PRODUCTS_CREATE);

  const handleChangePage = useCallback(
    ({ current = 1, pageSize = 10 }) => {
      fetchProducts({ page: current, size: pageSize });
    },
    [fetchProducts]
  );

  const handleToggleActive = useCallback(
    (product: Product, active: boolean) => {
      toggleProductActive(product.id, active);
    },
    [toggleProductActive]
  );

  const handleView = (product: Product) => {
    navigate(PATH_PANEL_PRODUCT.getDetailPath(product.id));
  };

  const handleEdit = (product: Product) => {
    navigate(`${PATH_PANEL_PRODUCT.getDetailPath(product.id)}?edit=true`);
  };

  const handleDelete = (product: Product) => {
    console.log('Eliminar:', product);
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          {t('products.title')}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('products.create')}
        </Button>
      </div>

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <CustomTable<Product>
            data={products}
            columnsKeys={['images', 'name', 'price', 'brand.name', 'category.name', 'isActive']}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            pagination={{
              current: pagination.page,
              pageSize: pagination.size,
              total: pagination.total,
            }}
            onChangePage={handleChangePage}
          />
        )}
      </div>
    </Card>
  );
};

export default ProductsPanelPage;
