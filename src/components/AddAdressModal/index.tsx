import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, Row, Col, AutoComplete } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './AddAddressModal.module.scss';
import { getAutocomplete, getPlaceDetails } from '@/services/calls/googlePlaces.service';

const { Item } = Form;

interface AddAddressModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: any;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  open,
  onCancel,
  onFinish,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [options, setOptions] = useState<{ value: string; placeId: string }[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const handleSearch = (value: string) => {
    if (value.length < 4) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const res = await getAutocomplete(value);
      const predictions: PlacePrediction[] = res.data || [];
      const formatted = predictions.map((p) => ({
        value: p.description,
        placeId: p.place_id,
      }));
      setOptions(formatted);
    }, 1500);
  };

  const handleSelect = async (_: string, option: { value: string; placeId: string }) => {
    const res = await getPlaceDetails(option.placeId);
    const data = res.data;

    form.setFieldsValue({
      address: {
        street: data.formattedAddress,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        lat: data.lat,
        lng: data.lng,
      },
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onFinish(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      title={t('register.address')}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={t('actions.save', 'Guardar')}
      cancelText={t('actions.cancel', 'Cancelar')}
      className={styles.modalContent}
    >
      <Form layout="vertical" form={form} initialValues={initialValues}>
        <Row gutter={16}>
          <Col span={12}>
            <Item
              name={['address', 'street']}
              label={t('fields.street')}
              rules={[{ required: true, message: t('errors.required') }]}
            >
              <AutoComplete
                placeholder={t('fields.street')}
                options={options}
                onSearch={handleSearch}
                onSelect={handleSelect}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item name={['address', 'city']} label={t('fields.city')}>
              <Input />
            </Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Item name={['address', 'province']} label={t('fields.province')}>
              <Input />
            </Item>
          </Col>
          <Col span={12}>
            <Item name={['address', 'postalCode']} label={t('fields.postalCode')}>
              <Input />
            </Item>
          </Col>
        </Row>

        <Item name={['address', 'lat']} hidden>
          <Input />
        </Item>
        <Item name={['address', 'lng']} hidden>
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};

export default AddAddressModal;
