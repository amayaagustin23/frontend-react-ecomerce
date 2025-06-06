import React, { use, useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Switch,
  Select,
  Typography,
  message,
  Card,
  Row,
  Col,
  Space,
  TreeSelect,
  ColorPicker,
} from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useProduct } from '@/context/Product/ProductContext';
import { useCategory } from '@/context/Category/CategoryContext';
import { useTranslation } from 'react-i18next';
import styles from './CreatePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { PATH_ROUTE_PANEL_PRODUCTS } from '@/router/paths';

const { Title } = Typography;

const CreateProductForm = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { createNewProduct, loadBrandsAndVariants, brands } = useProduct();
  const { categoriesOutPaginated, fetchCategoriesOutPaginated } = useCategory();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    loadBrandsAndVariants();
    fetchCategoriesOutPaginated();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const variantData = values.variants?.map((v: any) => {
        let color = v.color;

        if (typeof color === 'object' && color?.metaColor?.toHexString) {
          color = color.metaColor.toHexString();
        }
        return {
          color,
          size: v.size,
          stock: Number(v.stock),
        };
      });
      const { files: _omitFiles, ...rest } = values;

      const data = {
        ...rest,
        variants: JSON.stringify(variantData),
      };

      const files = fileList.filter((f) => f.originFileObj).map((f) => f.originFileObj as File);

      await createNewProduct(data, files);

      form.resetFields();
      setFileList([]);
      message.success(t('product.createSuccess'));
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

      if (errData?.message) {
        const errMsg = Array.isArray(errData.message)
          ? errData.message.join(', ')
          : errData.message;
        message.error(errMsg);
      } else {
        message.error(t('product.createError'));
      }
    }
  };

  const treeData = categoriesOutPaginated.map((cat) => ({
    title: cat.name,
    value: cat.id,
    children: cat.subcategories.map((sub) => ({
      title: sub.name,
      value: sub.id,
    })),
  }));

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
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label={t('product.name')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="price" label={t('product.price')} rules={[{ required: true }]}>
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
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={t('product.description')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="isService" label={t('product.isService')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isActive" label={t('product.isActive')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="hasDelivery" label={t('product.hasDelivery')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="categoryId"
              label={t('product.category')}
              rules={[{ required: true, message: t('product.categoryRequired') }]}
            >
              <TreeSelect
                treeData={treeData}
                placeholder={t('product.categoryPlaceholder')}
                treeDefaultExpandAll
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="brandId" label={t('product.brand')} rules={[{ required: true }]}>
              <Select
                placeholder={t('product.brandPlaceholder')}
                options={brands.map((brand) => ({
                  value: brand.id,
                  label: brand.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              <Title level={5}>{t('product.variants')}</Title>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="start" className={styles.variantRow}>
                  <Form.Item
                    {...restField}
                    name={[name, 'color']}
                    rules={[{ required: true, message: t('product.colorRequired') }]}
                    initialValue="#ffffff"
                  >
                    <ColorPicker
                      defaultValue="#ffffff"
                      format="hex"
                      className={styles.colorPicker}
                    />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'size']}>
                    <Input placeholder={t('product.size')} className={styles.variantInput} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'stock']}
                    rules={[{ required: true, message: t('product.stockRequired') }]}
                  >
                    <InputNumber
                      placeholder={t('product.stock')}
                      min={0}
                      className={styles.variantInput}
                    />
                  </Form.Item>

                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                    className={styles.removeBtn}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  {t('product.addVariant')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="files" label={t('product.images')}>
          <Upload
            multiple
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>{t('product.uploadImages')}</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" size="large">
            {t('product.create')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProductForm;
