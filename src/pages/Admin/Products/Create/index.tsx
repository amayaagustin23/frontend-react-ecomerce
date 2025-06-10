import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Switch,
  Select,
  Typography,
  Row,
  Col,
  Space,
  TreeSelect,
  message,
} from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useProduct } from '@/context/Product/ProductContext';
import { useCategory } from '@/context/Category/CategoryContext';
import { useTranslation } from 'react-i18next';
import styles from './CreatePage.module.scss';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Item, List, useForm } = Form;
const CreateProductForm = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    createNewProduct,
    loadBrandsAndVariants,
    brands,
    variantColors,
    variantSizes,
    variantGenders,
  } = useProduct();

  const { categoriesOutPaginated, fetchCategoriesOutPaginated } = useCategory();

  useEffect(() => {
    loadBrandsAndVariants();
    fetchCategoriesOutPaginated();
  }, []);

  const treeData = categoriesOutPaginated.map((cat) => ({
    title: cat.name,
    value: cat.id,
    children: cat.subcategories.map((sub) => ({
      title: sub.name,
      value: sub.id,
    })),
  }));

  const handleSubmit = async (values: any) => {
    try {
      const { files: _omitFiles, variants, ...rest } = values;

      const formattedVariants = variants.map((v: any, idx: number) => ({
        color: v.color,
        size: v.size,
        gender: v.gender,
        stock: Number(v.stock),
        tempId: `temp-${idx}`,
        newFiles: v.newFiles || [],
      }));

      const formData = new FormData();

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append(
        'variants',
        JSON.stringify(
          formattedVariants.map((variant: { newFiles: UploadFile[]; [key: string]: any }) => {
            const { newFiles, ...rest } = variant;
            return rest;
          })
        )
      );

      fileList.forEach((file) => {
        if (file.originFileObj instanceof File) {
          formData.append('files', file.originFileObj);
        }
      });

      formattedVariants.forEach((variant: any) => {
        variant.newFiles.forEach((file: any) => {
          if (file.originFileObj instanceof File) {
            formData.append(`variantImages-${variant.tempId}`, file.originFileObj);
          }
        });
      });

      await createNewProduct(formData);
      message.success(t('product.createSuccess'));
      form.resetFields();
      setFileList([]);
      navigate(-1);
    } catch (error: any) {
      const errData = error?.response?.data;
      if (errData?.errors?.length) {
        const fieldErrors = errData.errors.map((e: any) => ({
          name: e.property,
          errors: Object.values(e.constraints || {}),
        }));
        form.setFields(fieldErrors);
      }

      const errMsg = Array.isArray(errData?.message)
        ? errData.message.join(', ')
        : errData?.message || t('product.createError');
      message.error(errMsg);
    }
  };

  return (
    <div className={styles.container}>
      <Title level={3}>{t('product.createTitle')}</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isService: false,
          isActive: true,
          hasDelivery: false,
          variants: [{}],
        }}
        onFinishFailed={({ errorFields }) => {
          console.warn('Errores de validación:', errorFields);
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Item
              name="name"
              label={t('product.name')}
              rules={[{ required: true, message: t('product.nameRequired') }]}
            >
              <Input />
            </Item>
          </Col>
          <Col span={6}>
            <Item
              name="price"
              label={t('product.price')}
              rules={[{ required: true, message: t('product.priceRequired') }]}
            >
              <InputNumber
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
          <Col span={6}>
            <Item
              name="priceList"
              label={t('product.priceList')}
              rules={[{ required: true, message: t('product.priceListRequired') }]}
            >
              <InputNumber
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

        <Item
          name="description"
          label={t('product.description')}
          rules={[{ required: true, message: t('product.descriptionRequired') }]}
        >
          <Input />
        </Item>

        <Row gutter={16}>
          <Col span={8}>
            <Item name="isService" label={t('product.isService')} valuePropName="checked">
              <Switch />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="isActive" label={t('product.isActive')} valuePropName="checked">
              <Switch />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="hasDelivery" label={t('product.hasDelivery')} valuePropName="checked">
              <Switch />
            </Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Item
              name="brandId"
              label={t('product.brand')}
              rules={[{ required: true, message: t('product.brandRequired') }]}
            >
              <Select options={brands.map((b) => ({ label: b.name, value: b.id }))} allowClear />
            </Item>
          </Col>
        </Row>

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
                    marginBottom: '1rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={6}>
                      <Item
                        {...restField}
                        name={[name, 'color']}
                        rules={[{ required: true, message: t('product.colorRequired') }]}
                      >
                        <Select
                          placeholder={t('product.selectColor')}
                          options={variantColors.map((c) => ({ label: c.name, value: c.id }))}
                          allowClear
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item
                        {...restField}
                        name={[name, 'size']}
                        rules={[{ required: true, message: t('product.sizeRequired') }]}
                      >
                        <Select
                          placeholder={t('product.selectSize')}
                          options={variantSizes.map((s) => ({ label: s.name, value: s.id }))}
                          allowClear
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item {...restField} name={[name, 'gender']}>
                        <Select
                          placeholder={t('product.selectGender')}
                          options={variantGenders.map((g) => ({ label: g.name, value: g.id }))}
                          allowClear
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Item
                        {...restField}
                        name={[name, 'stock']}
                        rules={[{ required: true, message: t('product.stockRequired') }]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          placeholder={t('product.stock')}
                        />
                      </Item>
                    </Col>

                    <Col xs={24} md={18}>
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

                    <Col xs={24} md={6}>
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ marginTop: 8 }}
                      >
                        {t('product.deleteVariant') ?? 'Eliminar'}
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}

              <Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  {t('product.addVariant')}
                </Button>
              </Item>
            </>
          )}
        </List>

        <Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" size="large">
            {t('product.create')}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default CreateProductForm;
