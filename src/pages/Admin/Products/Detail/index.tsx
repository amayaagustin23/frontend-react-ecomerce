import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Spin,
  Upload,
  message,
  Space,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import styles from './DetailPage.module.scss';
import { ColorPicker } from 'antd';
import { ProductFormValues } from '@/types/Product';
import { useProduct } from '@/context/Product/ProductContext';

const { Title } = Typography;
const { Item, List, useForm } = Form;

const ProductDetailPage = () => {
  const [form] = useForm();
  const { id } = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [variantsToDelete, setVariantsToDelete] = useState<string[]>([]);
  const { product, setProduct, fetchProductById, updateProductById } = useProduct();
  const [searchParams] = useSearchParams();

  const loadProduct = async () => {
    try {
      setLoading(true);
      await fetchProductById(id as string);
      form.setFieldsValue({ ...product });
      const editParam = searchParams.get('edit');
      if (editParam === 'true') {
        setIsEditing(true);
      }
    } catch (err) {
      message.error(t('productDetail.errorLoading'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id, t]);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleRemoveImage = (url: string) => {
    const imageToRemove = product?.images.find((img) => img.url === url);
    if (!imageToRemove) return;

    setImagesToDelete((prev) => [...prev, imageToRemove.id]);
    setProduct((prev) =>
      prev ? { ...prev, images: prev.images.filter((img) => img.url !== url) } : prev
    );
  };

  const handleRemoveVariant = (variantId?: string) => {
    if (!variantId) return;
    setVariantsToDelete((prev) => [...prev, variantId]);
    setProduct((prev) =>
      prev ? { ...prev, variants: prev.variants.filter((v) => v.id !== variantId) } : prev
    );
  };

  const handleSubmit = async (values: ProductFormValues): Promise<void> => {
    try {
      setLoading(true);
      const variants = values.variants?.map((v) => ({
        ...v,
        color: typeof v.color === 'object' ? v.color.metaColor.toHexString() : v.color,
      }));

      const variantsToUpdate = variants?.filter((v) => v.id);
      const variantsToCreate = variants?.filter((v) => !v.id);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', String(values.price));
      formData.append('description', values.description);
      formData.append('categoryId', values.category?.id || '');
      formData.append('brandId', values.brand?.id || '');
      formData.append('isService', String(values.isService));
      formData.append('isActive', String(values.isActive));
      formData.append('hasDelivery', String(values.hasDelivery));
      formData.append('variants', JSON.stringify(variantsToCreate));
      formData.append('variantsToUpdate', JSON.stringify(variantsToUpdate));
      formData.append('variantsToDelete', JSON.stringify(variantsToDelete));
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj as File);
        }
      });
      await updateProductById(id as string, formData);
      setFileList([]);
      setLoading(false);

      setIsEditing(false);
    } catch (error) {
      message.error(t('product.updateError'));
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <Row justify="center" className={styles.container}>
      <Col span={20}>
        <Card bordered className={styles.card}>
          <Title level={3}>{t('product.detailTitle')}</Title>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Item name="name" label={t('product.name')}>
                  <Input disabled={!isEditing} />
                </Item>
              </Col>
              <Col span={12}>
                <Item name="price" label={t('product.price')}>
                  <InputNumber
                    disabled={!isEditing}
                    style={{ width: '100%' }}
                    min={0}
                    max={999999}
                    formatter={(value) =>
                      value ? `ARS $ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                    }
                    parser={(value) => {
                      const parsed = value?.replace(/[^\d]/g, '');
                      if (!parsed) return 0;
                      const num = Number(parsed);
                      if (num <= 0) return 0;
                      if (num >= 999999) return 999999;
                      return num as 0 | 999999;
                    }}
                    onKeyDown={(e) => {
                      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

                      const isNumber = /^[0-9]$/.test(e.key);
                      if (!isNumber && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    stringMode
                  />
                </Item>
              </Col>
            </Row>

            <Item name="description" label={t('product.description')}>
              <Input disabled={!isEditing} />
            </Item>

            <Row gutter={16}>
              <Col span={8}>
                <Item name="isService" label={t('product.isService')} valuePropName="checked">
                  <Switch disabled={!isEditing} />
                </Item>
              </Col>
              <Col span={8}>
                <Item name="isActive" label={t('product.isActive')} valuePropName="checked">
                  <Switch disabled={!isEditing} />
                </Item>
              </Col>
              <Col span={8}>
                <Item name="hasDelivery" label={t('product.hasDelivery')} valuePropName="checked">
                  <Switch disabled={!isEditing} />
                </Item>
              </Col>
            </Row>

            <Title level={5}>{t('product.variants')}</Title>
            <List name="variants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="start" style={{ display: 'flex' }}>
                      <Item {...restField} name={[name, 'id']} hidden>
                        <Input type="hidden" />
                      </Item>
                      <Item {...restField} name={[name, 'color']}>
                        <ColorPicker disabled={!isEditing} />
                      </Item>
                      <Item {...restField} name={[name, 'size']}>
                        <Input disabled={!isEditing} />
                      </Item>
                      <Item {...restField} name={[name, 'stock']}>
                        <InputNumber disabled={!isEditing} />
                      </Item>
                      {isEditing && (
                        <MinusCircleOutlined
                          onClick={() => {
                            const variantId = form.getFieldValue(['variants', name, 'id']);
                            handleRemoveVariant(variantId);
                            remove(name);
                          }}
                        />
                      )}
                    </Space>
                  ))}
                  {isEditing && (
                    <Item>
                      <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        {t('product.addVariant')}
                      </Button>
                    </Item>
                  )}
                </>
              )}
            </List>

            <Title level={5}>{t('product.images')}</Title>
            <Row gutter={8} style={{ marginBottom: 16 }}>
              {product.images?.map((img, idx) => (
                <Col key={idx} span={6}>
                  <Card
                    cover={
                      <img
                        alt={`product-${idx}`}
                        src={img.url}
                        style={{ height: 100, objectFit: 'cover' }}
                      />
                    }
                    actions={
                      isEditing
                        ? [
                            <Button
                              key={`remove-image-${img.url}`}
                              danger
                              onClick={() => handleRemoveImage(img.url)}
                            >
                              Eliminar
                            </Button>,
                          ]
                        : []
                    }
                  />
                </Col>
              ))}
            </Row>

            {isEditing && (
              <Item name="files">
                <Upload
                  multiple
                  listType="picture"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>{t('product.uploadImages')}</Button>
                </Upload>
              </Item>
            )}

            <Item>
              {isEditing ? (
                <Space>
                  <Button onClick={toggleEdit}>{t('product.cancelEdit')}</Button>
                  <Button type="primary" htmlType="submit">
                    {t('product.save')}
                  </Button>
                </Space>
              ) : (
                <Button type="primary" onClick={toggleEdit}>
                  {t('product.edit')}
                </Button>
              )}
            </Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDetailPage;
