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

  const primaryColor = '#00bcd4';
  const primaryDark = '#0097a7';

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

      const paddingLeftRight = 10;
      const paddingTop = 5;
      const paddingBottom = 10;

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const availableWidth = pageWidth - paddingLeftRight * 2;
      const availableHeight = pageHeight - paddingTop - paddingBottom;

      const imgRatio = imgProps.width / imgProps.height;
      let finalWidth = availableWidth;
      let finalHeight = finalWidth / imgRatio;

      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = finalHeight * imgRatio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = paddingTop;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.setFontSize(10);
      pdf.text(`Página 1`, pageWidth / 2, pageHeight - 5, { align: 'center' });

      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      pdf.save(`dashboard_${formattedDate}.pdf`);
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

  const profitColumns = [
    { title: t('dashboard.products.name'), dataIndex: 'name', key: 'name' },
    {
      title: t('dashboard.products.profit'),
      dataIndex: 'profit',
      key: 'profit',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
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
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.cardPrimary}>
                <Title level={4}>{t('dashboard.totalProfit')}</Title>
                <Title level={2}>${data.kpis.totalProfit.toFixed(2)}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.cardPrimary}>
                <Title level={4}>{t('dashboard.totalRevenue')}</Title>
                <Title level={2}>${data.kpis.totalRevenue.toFixed(2)}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.cardPrimary}>
                <Title level={4}>{t('dashboard.averageOrderValue')}</Title>
                <Title level={2}>${data.kpis.averageOrderValue.toFixed(2)}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.cardPrimary}>
                <Title level={4}>{t('dashboard.customerLifetimeValue')}</Title>
                <Title level={2}>${data.kpis.customerLifetimeValue.toFixed(2)}</Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className={styles.section}>
            <Col xs={24} md={12}>
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Card className={styles.cardSecondary}>
                    <Title level={1}>{data.kpis.ordersCountPaid}</Title>
                    <Title level={5}>{t('dashboard.totalSales')}</Title>
                  </Card>
                </Col>
                <Col span={24}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card className={styles.cardSecondary}>
                        <Title level={1}>{data.kpis.usersCount}</Title>
                        <Title level={5}>{t('dashboard.users')}</Title>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card className={styles.cardSecondary}>
                        <Title level={1}>{data.kpis.productsCount}</Title>
                        <Title level={5}>{t('dashboard.productsTitle')}</Title>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
              <Card title={t('dashboard.ordersPerDay')} className={styles.dashboardChart}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.reports.orderListForDays}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke={primaryDark} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className={styles.section}>
            <Col xs={24} md={12}>
              <Card title={t('dashboard.cartStatus')} className={styles.dashboardChart}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.reports.cartStatusReport}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" tickFormatter={(value) => t(`cartStatus.${value}`)} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value: number) => [value, t('dashboard.totalSales')]}
                      labelFormatter={(label) => t(`cartStatus.${label}`)}
                    />
                    <Bar dataKey="count" fill={primaryColor} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={t('dashboard.paymentStatus')} className={styles.dashboardChart}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.reports.paymentStatusReport}>
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
            <Col xs={24} md={8}>
              <Card title={t('dashboard.topProducts')}>
                <Table
                  columns={productColumns}
                  dataSource={data.highlights.productsMostSoldWithDetails}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: true }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title={t('dashboard.topProfitableProducts')}>
                <Table
                  columns={profitColumns}
                  dataSource={data.highlights.topProfitableProducts}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: true }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title={t('dashboard.topCoupons')}>
                <Table
                  columns={couponColumns}
                  dataSource={data.highlights.couponsMostUsed}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: true }}
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
