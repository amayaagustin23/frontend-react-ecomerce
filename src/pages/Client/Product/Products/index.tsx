// Importaciones
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { FetchProductsParams, useProduct } from '@/context/Product/ProductContext';
import { useCategory } from '@/context/Category/CategoryContext';
import { PRODUCT_ROUTES } from '@/router/paths';
import {
  Col,
  Row,
  Pagination,
  Spin,
  Empty,
  Typography,
  Checkbox,
  Select,
  Drawer,
  Button,
  Grid,
  Collapse,
} from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ProductsPage.module.scss';
import { FilterOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const ProductsPage: React.FC = () => {
  const { products, loading, pagination, fetchProducts, loadBrandsAndVariants, brands } =
    useProduct();
  const { categories } = useCategory();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<string>('createdAt_desc');
  const [pageSize, setPageSize] = useState<number>(12);

  const redirect = (id: string) => {
    navigate(PRODUCT_ROUTES.getDetailPath(id));
  };

  const cleanObject = <T extends object>(obj: T): Partial<T> =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== '')
    ) as Partial<T>;

  function handleCategoryChange(checked: boolean, id: string, children: string[] = []) {
    const idsToToggle = [id, ...children];
    setSelectedCategories((prev) =>
      checked
        ? [...new Set([...prev, ...idsToToggle])]
        : prev.filter((catId) => !idsToToggle.includes(catId))
    );
  }

  const handlePageChange = (page: number) => {
    fetchProducts({
      page,
      size: pageSize,
      categoryIds: selectedCategories.length ? selectedCategories.join(',') : undefined,
      brandIds: selectedBrands.length ? selectedBrands.join(',') : undefined,
      orderBy,
    });
  };

  useEffect(() => {
    loadBrandsAndVariants();
    fetchProducts({ page: 1, size: pageSize });
  }, []);

  useEffect(() => {
    const rawParams: FetchProductsParams = {
      page: 1,
      size: pageSize,
      orderBy,
      brandIds: selectedBrands.join(','),
      categoryIds: selectedCategories.join(','),
    };

    const params = cleanObject(rawParams);
    fetchProducts(params);
  }, [selectedCategories, selectedBrands, orderBy, pageSize]);

  const FilterContent = (
    <div className={styles.sidebar}>
      <Collapse
        defaultActiveKey={[]}
        expandIconPosition="end"
        items={[
          {
            key: 'categories',
            label: t('products.categories'),
            children: (
              <>
                {categories.map((cat) => {
                  const subIds = cat.subcategories?.map((sub) => sub.id) || [];
                  const allSelected = [cat.id, ...subIds].every((id) =>
                    selectedCategories.includes(id)
                  );
                  return (
                    <div key={cat.id} style={{ marginBottom: '0.75rem' }}>
                      <Checkbox
                        checked={allSelected}
                        onChange={(e) => handleCategoryChange(e.target.checked, cat.id, subIds)}
                      >
                        {cat.name}
                      </Checkbox>
                      {cat.subcategories?.length > 0 && (
                        <div style={{ paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                          {cat.subcategories.map((sub) => (
                            <div key={sub.id}>
                              <Checkbox
                                checked={selectedCategories.includes(sub.id)}
                                onChange={(e) => handleCategoryChange(e.target.checked, sub.id)}
                              >
                                {sub.name}
                              </Checkbox>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ),
          },
          {
            key: 'brands',
            label: t('products.brands'),
            children: (
              <>
                {brands.map((brand) => (
                  <div key={brand.id}>
                    <Checkbox
                      checked={selectedBrands.includes(brand.id)}
                      onChange={(e) =>
                        setSelectedBrands((prev) =>
                          e.target.checked
                            ? [...prev, brand.id]
                            : prev.filter((id) => id !== brand.id)
                        )
                      }
                    >
                      {brand.name}
                    </Checkbox>
                  </div>
                ))}
              </>
            ),
          },
        ]}
      />
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {!isMobile && (
        <div className={styles.controlBar}>
          <div className={styles.controlGroup}>
            <Typography.Text strong>{t('products.orderBy')}</Typography.Text>
            <Select
              value={orderBy}
              onChange={(value) => setOrderBy(value)}
              style={{ width: '100%' }}
              options={[
                { value: 'createdAt_desc', label: t('products.sort.newest') },
                { value: 'price_asc', label: t('products.sort.lowToHigh') },
                { value: 'price_desc', label: t('products.sort.highToLow') },
                { value: 'name_asc', label: t('products.sort.nameAsc') },
                { value: 'name_desc', label: t('products.sort.nameDesc') },
              ]}
            />
          </div>
          <div className={styles.controlGroup}>
            <Typography.Text strong>{t('products.itemsPerPage')}</Typography.Text>
            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
              style={{ width: '100%' }}
              options={[
                { value: 12, label: '12' },
                { value: 24, label: '24' },
                { value: 36, label: '36' },
              ]}
            />
          </div>
        </div>
      )}

      <Row gutter={[24, 24]}>
        {isMobile ? (
          <>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => setFilterVisible(true)}
              style={{ margin: '1rem' }}
            >
              {t('products.filter')}
            </Button>
            <Drawer
              title={t('products.filter')}
              placement="left"
              onClose={() => setFilterVisible(false)}
              open={filterVisible}
              width={320}
            >
              {FilterContent}
            </Drawer>
          </>
        ) : (
          <Col xs={24} sm={6} md={6} lg={5}>
            {FilterContent}
          </Col>
        )}

        <Col xs={24} sm={18} md={18} lg={19}>
          {loading ? (
            <div className={styles.loading}>
              <Spin size="large" />
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <Empty description={t('products.empty')} />
            </div>
          ) : (
            <>
              <Typography.Title level={2} className={styles.title}>
                {t('products.title')}
              </Typography.Title>
              <Row gutter={[16, 16]}>
                {products.map((product) => (
                  <Col key={product.id} xs={12} sm={12} md={8} lg={8}>
                    <ProductCard product={product} onClick={() => redirect(product.id)} />
                  </Col>
                ))}
              </Row>
              <Pagination
                current={pagination.page}
                pageSize={pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                className={styles.pagination}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;
