import React from 'react';
import { Table, Space, Tooltip, Switch, Popconfirm } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './CustomTable.module.scss';

type Props<T> = {
  data: T[];
  columnsKeys: string[];
  onView: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onToggleActive?: (record: T, active: boolean) => void;
  pagination?: TablePaginationConfig;
  onChangePage?: (pagination: TablePaginationConfig) => void;
};

const getValueByPath = (obj: any, path: string): any => {
  const keys = path.split('.');
  const value = keys.reduce((acc, key) => acc?.[key], obj);

  return keys.some((key) => key.toLowerCase().includes('price')) ? `$${value}` : value;
};

const CustomTable = <T extends { id: string; active?: boolean; images?: { url: string }[] }>({
  data,
  columnsKeys,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  pagination,
  onChangePage,
}: Props<T>) => {
  const { t } = useTranslation();

  const hasActive = data.some((item) => typeof item.active === 'boolean');

  const columns: ColumnsType<T> = [
    ...(columnsKeys.includes('images')
      ? [
          {
            title: t('products.columns.image', 'Imagen'),
            key: 'image',
            render: (_: unknown, record: T) =>
              record.images?.[0]?.url ? (
                <img src={record.images[0].url} alt="Imagen" className={styles.productImage} />
              ) : (
                '-'
              ),
          },
        ]
      : []),

    ...columnsKeys
      .filter((key) => key !== 'images' && key !== 'isActive')
      .map((key) => ({
        title: t(`products.columns.${key}`, key),
        dataIndex: key,
        key,
        render: (_: unknown, record: T) => getValueByPath(record, key) ?? '-',
      })),

    ...(onToggleActive
      ? [
          {
            title: t('products.columns.active', 'Estado'),
            key: 'active',
            render: (_: any, record: any) =>
              typeof record.isActive === 'boolean' ? (
                <Switch
                  checked={record.isActive}
                  onChange={(checked) => onToggleActive(record, checked)}
                />
              ) : (
                '-'
              ),
          },
        ]
      : []),

    {
      title: t('products.columns.actions', 'Acciones'),
      key: 'actions',
      render: (_: unknown, record: T) => (
        <Space>
          <Tooltip title={t('actions.view', 'Ver detalle')}>
            <EyeOutlined
              onClick={() => onView(record)}
              className={`${styles.actionIcon} ${styles.view}`}
            />
          </Tooltip>
          {onEdit && (
            <Tooltip title={t('actions.edit', 'Editar')}>
              <EditOutlined
                onClick={() => onEdit(record)}
                className={`${styles.actionIcon} ${styles.edit}`}
              />
            </Tooltip>
          )}
          {onDelete && (
            <Popconfirm
              title={t('confirm.delete.title', '¿Estás seguro de eliminar este elemento?')}
              okText={t('confirm.delete.ok', 'Sí')}
              cancelText={t('confirm.delete.cancel', 'No')}
              onConfirm={() => onDelete(record)}
            >
              <Tooltip title={t('actions.delete', 'Eliminar')}>
                <DeleteOutlined className={`${styles.actionIcon} ${styles.delete}`} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tableWrapper}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        onChange={(pagination) => onChangePage?.(pagination)}
      />
    </div>
  );
};

export default CustomTable;
