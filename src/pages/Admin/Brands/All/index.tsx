import React, { useEffect, useCallback } from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TablePaginationConfig } from 'antd/es/table';
import CustomTable from '@/components/CustomTable';
import { useBrand } from '@/context/Brand/BrandContext';

const { Title } = Typography;

const BrandsPanelPage = () => {
  const { t } = useTranslation();
  const { brands, fetchBrands, pagination, deleteBrandById } = useBrand();

  useEffect(() => {
    fetchBrands({ page: 1, size: 10 });
  }, [fetchBrands]);

  const handleChangePage = useCallback(
    (pagination: TablePaginationConfig) => {
      const page = pagination.current || 1;
      const size = pagination.pageSize || 10;
      fetchBrands({ page, size });
    },
    [fetchBrands]
  );

  const handleView = (record: any) => {
    console.log('Ver', record);
  };

  const handleEdit = (record: any) => {
    console.log('Editar', record);
  };

  const handleDelete = (record: any) => {
    deleteBrandById(record.id);
  };

  const handleCreate = () => {
    console.log('Crear nueva marca');
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Col>
          <Title level={3}>{t('adminMenu.brands', 'Marcas')}</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('actions.create', 'Crear marca')}
          </Button>
        </Col>
      </Row>

      <CustomTable
        data={brands}
        columnsKeys={['name']}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          ...pagination,
          size: undefined,
        }}
        onChangePage={handleChangePage}
      />
    </Card>
  );
};

export default BrandsPanelPage;
