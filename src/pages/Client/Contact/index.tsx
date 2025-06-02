import React from 'react';
import { Card, Typography, Row, Col, Button, Space } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  LinkedinOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.scss';
import cvFile from '@/assets/docs/CV 2025.pdf';

const { Title, Text, Paragraph } = Typography;

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2}>{t('contact.title')}</Title>
        <Text type="secondary">{t('contact.subtitle')}</Text>

        <Paragraph className={styles.paragraph}>{t('contact.intro')}</Paragraph>

        <Row gutter={[16, 16]} className={styles.info}>
          <Col xs={24} sm={12}>
            <Space>
              <MailOutlined />
              <Text copyable>amayaagustin.2395@gmail.com</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <PhoneOutlined />
              <Text copyable>+54 381 3571707</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <EnvironmentOutlined />
              <Text>Yerba Buena, Tucumán, Argentina</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <GithubOutlined />
              <a href="https://github.com/amayaagustin23" target="_blank" rel="noopener noreferrer">
                {t('contact.github')}
              </a>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <LinkedinOutlined />
              <a
                href="https://linkedin.com/in/agustin-amaya"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('contact.linkedin')}
              </a>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <FilePdfOutlined />
              <a href={cvFile} target="_blank" rel="noopener noreferrer">
                {t('contact.cv')}
              </a>
            </Space>
          </Col>
        </Row>

        <div className={styles.buttonContainer}>
          <Button type="primary" size="large" href="mailto:amayaagustin.2395@gmail.com">
            {t('contact.contactMe')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Contact;
