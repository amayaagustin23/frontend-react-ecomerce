import React from 'react';
import { Button, Card, Form, Input, Typography, Space, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCategory } from '@/context/Category/CategoryContext';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.scss';

const { Title } = Typography;
const { useForm, List, Item } = Form;

const CreateCategoryPanelPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { createCategory } = useCategory();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    await createCategory(values);
    form.resetFields();
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <Title level={3}>{t('categories.create.title')}</Title>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ subcategories: [] }}>
        <Row gutter={16}>
          <Col span={12}>
            <Item
              name="name"
              label={t('categories.fields.name')}
              rules={[{ required: true, message: t('categories.errors.nameRequired') }]}
            >
              <Input placeholder={t('categories.placeholders.name')} />
            </Item>
          </Col>
          <Col span={12}>
            <Item
              name="description"
              label={t('categories.fields.description')}
              rules={[{ required: true, message: t('categories.errors.descriptionRequired') }]}
            >
              <Input placeholder={t('categories.placeholders.description')} />
            </Item>
          </Col>
        </Row>

        <List name="subcategories">
          {(fields, { add, remove }) => (
            <>
              <Title level={4}>{t('categories.subcategories.title')}</Title>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[
                      { required: true, message: t('categories.errors.subcategoryNameRequired') },
                    ]}
                  >
                    <Input placeholder={t('categories.placeholders.subcategoryName')} />
                  </Item>
                  <Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[
                      {
                        required: true,
                        message: t('categories.errors.subcategoryDescriptionRequired'),
                      },
                    ]}
                  >
                    <Input placeholder={t('categories.placeholders.subcategoryDescription')} />
                  </Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  {t('categories.actions.addSubcategory')}
                </Button>
              </Item>
            </>
          )}
        </List>

        <Item>
          <Button type="primary" htmlType="submit">
            {t('common.actions.save')}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default CreateCategoryPanelPage;
