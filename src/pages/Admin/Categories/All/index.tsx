import React, { useEffect, useCallback } from 'react';
import { useCategory } from '@/context/Category/CategoryContext';
import { Card, Typography, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TablePaginationConfig } from 'antd/es/table';
import CustomTable from '@/components/CustomTable';

const { Title } = Typography;

const CategoriesPanelPage = () => {
  const { t } = useTranslation();
  const { categories, loading, pagination, fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories({ page: 1, size: 10 });
  }, []);

  const handleChangePage = useCallback(
    (pagination: TablePaginationConfig) => {
      const page = pagination.current || 1;
      const size = pagination.pageSize || 10;
      fetchCategories({ page, size });
    },
    [fetchCategories]
  );

  const handleView = (record: any) => {
    console.log('Ver', record);
  };

  const handleEdit = (record: any) => {
    console.log('Editar', record);
  };

  const handleDelete = (record: any) => {
    console.log('Eliminar', record);
  };

  const handleCreate = () => {
    console.log('Crear nueva categoría');
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Col>
          <Title level={3}>{t('adminMenu.categories')}</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('actions.create')}
          </Button>
        </Col>
      </Row>

      <CustomTable
        data={categories}
        columnsKeys={['name', 'description']}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          ...pagination,
          pageSize: pagination.size,
          size: undefined,
        }}
        onChangePage={handleChangePage}
      />
    </Card>
  );
};

export default CategoriesPanelPage;
