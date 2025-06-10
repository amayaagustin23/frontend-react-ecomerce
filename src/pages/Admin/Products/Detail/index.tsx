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
  Spin,
  Upload,
  message,
  Space,
  Select,
  TreeSelect,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import styles from './DetailPage.module.scss';
import { ProductFormValues } from '@/types/Product';
import { useProduct } from '@/context/Product/ProductContext';
import { useCategory } from '@/context/Category/CategoryContext';

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
  const {
    product,
    setProduct,
    fetchProductById,
    updateProductById,
    loadBrandsAndVariants,
    variantColors,
    variantGenders,
    variantSizes,
    brands,
  } = useProduct();
  const [searchParams] = useSearchParams();

  const { categoriesOutPaginated, fetchCategoriesOutPaginated } = useCategory();

  const loadProduct = async () => {
    try {
      setLoading(true);
      await fetchProductById(id as string);
      form.setFieldsValue({
        ...product,
        brand: product?.brand?.id,
        categoryId: product?.category?.id,
        variants: product?.variants.map((v) => ({
          ...v,
          color: v.color?.id,
          size: v.size?.id,
          gender: v.gender?.id,
        })),
      });
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
    loadBrandsAndVariants();
    fetchCategoriesOutPaginated();
  }, [id, t]);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleRemoveVariant = (variantId?: string) => {
    if (!variantId) return;
    setVariantsToDelete((prev) => [...prev, variantId]);
    setProduct((prev) =>
      prev ? { ...prev, variants: prev.variants.filter((v) => v.id !== variantId) } : prev
    );
  };

  const treeData = categoriesOutPaginated.map((cat) => ({
    title: cat.name,
    value: cat.id,
    children: cat.subcategories.map((sub) => ({
      title: sub.name,
      value: sub.id,
    })),
  }));

  const handleSubmit = async (values: ProductFormValues): Promise<void> => {
    try {
      setLoading(true);
      const formData = new FormData();

      const variantsToDeleteCopy = [...variantsToDelete];
      const variants: any[] = [];

      values.variants?.forEach((v, idx) => {
        const isNew = !v.id;
        const tempId = isNew ? `temp-${idx}` : undefined;

        const colorObj = variantColors.find((c) => c.id === v.color);
        const sizeObj = variantSizes.find((s) => s.id === v.size);
        const genderObj = variantGenders.find((g) => g.id === v.gender);

        const variantPayload = {
          id: v.id,
          tempId,
          stock: v.stock,
          color: colorObj,
          size: sizeObj,
          gender: genderObj,
          images: v.images,
        };

        variants.push(variantPayload);

        if (v?.newFiles?.length) {
          v.newFiles.forEach((file: any) => {
            if (file.originFileObj) {
              const variantId = v.id || tempId || `v${idx}`;
              formData.append('files', file.originFileObj, `${variantId}__${file.name}`);
            }
          });
        }
      });

      const variantsToUpdate = variants.filter((v) => v.id);
      const variantsToCreate = variants.filter((v) => !v.id);

      const brandObj = brands.find((b) =>
        typeof values.brand === 'object'
          ? b.id === (values.brand as any)?.id
          : b.id === values.brand
      );

      formData.append('name', values.name);
      formData.append('price', String(values.price));
      formData.append('description', values.description);
      formData.append('categoryId', values.category?.id || '');
      formData.append('brandId', brandObj?.id || '');
      formData.append('isService', String(values.isService));
      formData.append('isActive', String(values.isActive));
      formData.append('hasDelivery', String(values.hasDelivery));

      formData.append('variants', JSON.stringify(variantsToCreate));
      formData.append('variantsToUpdate', JSON.stringify(variantsToUpdate));
      formData.append('variantsToDelete', JSON.stringify(variantsToDeleteCopy));
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj, `product-${file.name}`);
        }
      });

      await updateProductById(id as string, formData);

      setFileList([]);
      setIsEditing(false);
      message.success(t('product.updateSuccess'));
    } catch (error) {
      message.error(t('product.updateError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
        <Item
          name="categoryId"
          label={t('product.category')}
          rules={[{ required: true, message: t('product.categoryRequired') }]}
        >
          <TreeSelect
            treeData={treeData}
            treeDefaultExpandAll
            allowClear
            style={{ width: '100%' }}
          />
        </Item>

        <Item name="brand" label={t('product.brand')}>
          <Select
            disabled={!isEditing}
            placeholder={t('product.selectBrand')}
            options={brands.map((b) => ({
              label: b.name,
              value: b.id,
            }))}
          />
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
              <Title level={5}>{t('product.variants')}</Title>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    border: '1px solid #e5e5e5',
                    padding: '1rem',
                    borderRadius: 8,
                    marginBottom: '1.5rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={0}>
                      <Item {...restField} name={[name, 'id']} hidden>
                        <Input hidden />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item {...restField} name={[name, 'color']} label={t('product.color')}>
                        <Select
                          disabled={!isEditing}
                          options={variantColors.map((c) => ({ label: c.name, value: c.id }))}
                          placeholder={t('product.selectColor')}
                          allowClear
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item {...restField} name={[name, 'size']} label={t('product.size')}>
                        <Select
                          disabled={!isEditing}
                          options={variantSizes.map((s) => ({ label: s.name, value: s.id }))}
                          placeholder={t('product.selectSize')}
                          allowClear
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item {...restField} name={[name, 'gender']} label={t('product.gender')}>
                        <Select
                          disabled={!isEditing}
                          options={variantGenders.map((g) => ({ label: g.name, value: g.id }))}
                          placeholder={t('product.selectGender')}
                          allowClear
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item {...restField} name={[name, 'stock']} label={t('product.stock')}>
                        <InputNumber disabled={!isEditing} min={0} style={{ width: '100%' }} />
                      </Item>
                    </Col>

                    <Col span={24}>
                      <Typography.Text>{t('product.variantImages')}</Typography.Text>
                      <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
                        {form
                          .getFieldValue(['variants', name, 'images'])
                          ?.map((img: any, idx: number) => (
                            <Col key={img.id || idx}>
                              <img
                                src={img.url}
                                alt="variant"
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: 'cover',
                                  borderRadius: 4,
                                  border: '1px solid #ccc',
                                }}
                              />
                              {isEditing && (
                                <div style={{ textAlign: 'center', marginTop: 4 }}>
                                  <Button
                                    type="link"
                                    danger
                                    size="small"
                                    onClick={() => {
                                      const current = form.getFieldValue([
                                        'variants',
                                        name,
                                        'images',
                                      ]);
                                      form.setFieldValue(
                                        ['variants', name, 'images'],
                                        current.filter((i: any) => i.id !== img.id)
                                      );
                                      if (img.id) {
                                        setImagesToDelete((prev) => [...prev, img.id]);
                                      }
                                    }}
                                  >
                                    {t('product.delete')}
                                  </Button>
                                </div>
                              )}
                            </Col>
                          ))}
                      </Row>
                    </Col>

                    {isEditing && (
                      <Col span={24}>
                        <Item
                          name={[name, 'newFiles']}
                          valuePropName="fileList"
                          getValueFromEvent={(e) => e.fileList}
                        >
                          <Upload listType="picture-card" multiple beforeUpload={() => false}>
                            <div>
                              <UploadOutlined /> {t('product.uploadVariantImages')}
                            </div>
                          </Upload>
                        </Item>
                      </Col>
                    )}

                    {isEditing && (
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Button
                          danger
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => {
                            const variantId = form.getFieldValue(['variants', name, 'id']);
                            handleRemoveVariant(variantId);
                            remove(name);
                          }}
                        >
                          {t('product.deleteVariant')}
                        </Button>
                      </Col>
                    )}
                  </Row>
                </div>
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
    </div>
  );
};

export default ProductDetailPage;
