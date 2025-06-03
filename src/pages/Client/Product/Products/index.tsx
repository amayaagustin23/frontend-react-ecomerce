// Importaciones
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useProduct } from '@/context/Product/ProductContext';
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

const { useBreakpoint } = Grid;

const ProductsPage: React.FC = () => {
  const {
    products,
    loading,
    pagination,
    fetchProducts,
    loadBrandsAndVariants,
    variantColors,
    variantSizes,
    variantGenders,
    brands,
  } = useProduct();
  const { categories } = useCategory();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [filterVisible, setFilterVisible] = useState(false);
  const initialCategoryId = searchParams.get('categoryId');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryId ? [initialCategoryId] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<string>('createdAt_desc');
  const [pageSize, setPageSize] = useState<number>(12);

  const redirect = (id: string) => {
    navigate(PRODUCT_ROUTES.getDetailPath(id));
  };

  const handleCategoryChange = (checked: boolean, id: string, children: string[] = []) => {
    const idsToToggle = [id, ...children];
    setSelectedCategories((prev) =>
      checked
        ? [...new Set([...prev, ...idsToToggle])]
        : prev.filter((catId) => !idsToToggle.includes(catId))
    );
  };

  const handleVariantToggle = (value: string) => {
    setSelectedVariants((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handlePageChange = (page: number) => {
    fetchProducts({
      page,
      size: pageSize,
      categoryIds: selectedCategories.join(',') || undefined,
      brandIds: selectedBrands.join(',') || undefined,
      variantsName: selectedVariants.join(',') || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      orderBy,
    });
  };

  useEffect(() => {
    loadBrandsAndVariants();
  }, []);

  useEffect(() => {
    fetchProducts({
      page: 1,
      size: pageSize,
      categoryIds: selectedCategories.join(',') || undefined,
      brandIds: selectedBrands.join(',') || undefined,
      variantsName: selectedVariants.join(',') || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      orderBy,
    });
  }, [selectedCategories, priceRange, selectedBrands, selectedVariants, orderBy, pageSize]);

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
          {
            key: 'colors',
            label: t('products.colors'),
            children: (
              <div className={styles.colorGrid}>
                {variantColors.map((color) => {
                  const isSelected = selectedVariants.includes(color);
                  return (
                    <div
                      key={color}
                      className={`${styles.colorCircle} ${isSelected ? styles.selected : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleVariantToggle(color)}
                      title={color}
                    />
                  );
                })}
              </div>
            ),
          },
          {
            key: 'sizes',
            label: t('products.sizes'),
            children: (
              <>
                {variantSizes.map((size) => (
                  <div key={size}>
                    <Checkbox
                      checked={selectedVariants.includes(size)}
                      onChange={() => handleVariantToggle(size)}
                    >
                      {size}
                    </Checkbox>
                  </div>
                ))}
              </>
            ),
          },
          {
            key: 'genders',
            label: t('products.genders'),
            children: (
              <>
                {variantGenders.map((gender) => (
                  <div key={gender}>
                    <Checkbox
                      checked={selectedVariants.includes(gender)}
                      onChange={() => handleVariantToggle(gender)}
                    >
                      {gender}
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
              onClick={() => setFilterVisible(true)}
              style={{ marginBottom: '1rem' }}
            >
              {t('products.filter') || 'Filters'}
            </Button>
            <Drawer
              title={t('products.filter') || 'Filters'}
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
