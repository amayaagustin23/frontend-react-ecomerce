import React, { useEffect } from 'react';
import { Card, Typography, Row, Col, Table, Button } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './DashboardPage.module.scss';
import { useDashboard } from '@/context/Panel/PanelContext';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const DashboardPage = () => {
  const { data, fetchDashboard } = useDashboard();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const exportToPDF = () => {
    const input = document.getElementById('dashboard-container');
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dashboard.pdf');
    });
  };

  const productColumns = [
    { title: t('dashboard.products.name'), dataIndex: 'name', key: 'name' },
    {
      title: t('dashboard.products.price'),
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => `$${value}`,
    },
    { title: t('dashboard.products.totalSold'), dataIndex: 'totalSold', key: 'totalSold' },
  ];

  const couponColumns = [
    { title: t('dashboard.coupons.code'), dataIndex: 'code', key: 'code' },
    { title: t('dashboard.coupons.description'), dataIndex: 'description', key: 'description' },
    { title: t('dashboard.coupons.total'), dataIndex: 'total', key: 'total' },
  ];

  return (
    <>
      <Row justify="end" className={styles.exportButtonRow}>
        <Col>
          <Button type="primary" onClick={exportToPDF}>
            {t('dashboard.exportPDF')}
          </Button>
        </Col>
      </Row>
      {data && (
        <div id="dashboard-container" className={styles.dashboardPage}>
          <Title level={3} className={styles.pageTitle}>
            {t('dashboard.title')}
          </Title>

          <Row gutter={16} className={styles.section}>
            <Col span={12}>
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Card>
                    <Title level={1}>{data.ordersCountPaid}</Title>
                    <Title level={5}>{t('dashboard.totalSales')}</Title>
                  </Card>
                </Col>
                <Col span={24}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card>
                        <Title level={1}>{data.usersCount}</Title>
                        <Title level={5}>{t('dashboard.users')}</Title>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card>
                        <Title level={1}>{data.productsCount}</Title>
                        <Title level={5}>{t('dashboard.productsTitle')}</Title>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Card title={t('dashboard.ordersPerDay')}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.orderListForDays}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#0097a7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className={styles.section}>
            <Col span={12}>
              <Card title={t('dashboard.cartStatus')}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.cartStatusReport}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" tickFormatter={(value) => t(`cartStatus.${value}`)} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value: number) => [value, t('dashboard.totalSales')]}
                      labelFormatter={(label) => t(`cartStatus.${label}`)}
                    />
                    <Bar dataKey="count" fill="#00bcd4" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={t('dashboard.paymentStatus')}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.paymentStatusReport}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="status"
                      tickFormatter={(value) => t(`paymentStatus.${value}`)}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value: number) => [value, t('dashboard.totalSales')]}
                      labelFormatter={(label) => t(`paymentStatus.${label}`)}
                    />
                    <Bar dataKey="count" fill="#b2ebf2" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className={styles.section}>
            <Col span={12}>
              <Card title={t('dashboard.topProducts')}>
                <Table
                  columns={productColumns}
                  dataSource={data.productsMostSoldWithDetails}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title={t('dashboard.topCoupons')}>
                <Table
                  columns={couponColumns}
                  dataSource={data.couponsMostUsed}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
