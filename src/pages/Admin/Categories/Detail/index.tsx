import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Typography, Space, Row, Col, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCategory } from '@/context/Category/CategoryContext';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './DetailPage.module.scss';

const { Title } = Typography;
const { useForm, List, Item } = Form;

const DetailCategoryPanelPage = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const { fetchCategoryById, updateCategory, category } = useCategory();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [initialSubcategories, setInitialSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 1. Cargar categoría y activar edición si hay ?edit=true
  useEffect(() => {
    const load = async () => {
      if (searchParams.get('edit') === 'true') {
        setIsEditing(true);
      }

      if (!id) return;

      await fetchCategoryById(id);
    };

    load();
  }, [id, searchParams]);

  // 2. Cargar datos en el form cuando llega category
  useEffect(() => {
    if (!category || category.id !== id) return;

    const mappedSubcategories = category.subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
    }));

    setInitialSubcategories(category.subcategories || []);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      subcategories: mappedSubcategories,
    });

    setLoading(false);
  }, [category, id, form]);

  const onFinish = async (values: any) => {
    const subcategoriesToUpdate = values.subcategories?.filter((s: any) => s.id);
    const subcategories = values.subcategories?.filter((s: any) => !s.id);
    const existingIds = values.subcategories?.map((s: any) => s.id).filter(Boolean);
    const subcategoriesToDelete = initialSubcategories
      .filter((sub) => !existingIds.includes(sub.id))
      .map((sub) => sub.id);
    await updateCategory(id!, {
      name: values.name,
      description: values.description,
      subcategories,
      subcategoriesToUpdate,
      subcategoriesToDelete,
    });
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin tip={t('common.loading')} size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3}>{t('categories.edit.title')}</Title>
        {!isEditing && (
          <Button
            type="primary"
            onClick={() => {
              searchParams.set('edit', 'true');
              setSearchParams(searchParams);
              setIsEditing(true);
            }}
          >
            {t('actions.edit')}
          </Button>
        )}
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish} disabled={!isEditing}>
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
                  <Item {...restField} name={[name, 'id']} hidden>
                    <Input type="hidden" />
                  </Item>
                  {isEditing && <MinusCircleOutlined onClick={() => remove(name)} />}
                </Space>
              ))}
              {isEditing && (
                <Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    {t('categories.actions.addSubcategory')}
                  </Button>
                </Item>
              )}
            </>
          )}
        </List>

        {isEditing && (
          <Item>
            <Button type="primary" htmlType="submit">
              {t('common.actions.save')}
            </Button>
          </Item>
        )}
      </Form>
    </div>
  );
};

export default DetailCategoryPanelPage;
