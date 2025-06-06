import React, { useEffect, useCallback } from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TablePaginationConfig } from 'antd/es/table';
import CustomTable from '@/components/CustomTable';
import { useCoupon } from '@/context/Coupon/CouponContext';
import { PATH_PANEL_COUPON, PATH_ROUTE_PANEL_COUPONS_CREATE } from '@/router/paths';
import { useNavigate } from 'react-router-dom';
import { Coupon } from '@/types/Coupon';

const { Title } = Typography;

const CouponsPanelPage = () => {
  const { t } = useTranslation();
  const { coupons, fetchCoupons, pagination, deleteCouponById } = useCoupon();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons({ page: 1, size: 10 });
  }, [fetchCoupons]);

  const handleChangePage = useCallback(
    (pagination: TablePaginationConfig) => {
      const page = pagination.current || 1;
      const size = pagination.pageSize || 10;
      fetchCoupons({ page, size });
    },
    [fetchCoupons]
  );

  const handleView = (record: Coupon) => {
    navigate(PATH_PANEL_COUPON.getDetailPath(record.id));
  };

  const handleEdit = (record: Coupon) => {
    navigate(`${PATH_PANEL_COUPON.getDetailPath(record.id)}?edit=true`);
  };

  const handleDelete = (record: Coupon) => {
    deleteCouponById(record.id);
  };

  const handleCreate = () => {
    navigate(PATH_ROUTE_PANEL_COUPONS_CREATE);
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Col>
          <Title level={3}>{t('adminMenu.coupons')}</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('actions.create')}
          </Button>
        </Col>
      </Row>

      <CustomTable
        data={coupons}
        columnsKeys={['description', 'code', 'value', 'expiresAt']}
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

export default CouponsPanelPage;
