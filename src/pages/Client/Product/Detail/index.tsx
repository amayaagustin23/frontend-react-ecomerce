import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/services/calls/product.service';
import { DetailedProduct, DetailedVariant } from '@/types/Product';
import {
  Spin,
  Typography,
  Tag,
  Row,
  Col,
  Image,
  message,
  Button,
  Carousel,
  InputNumber,
  Grid,
} from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './ProductDetailPage.module.scss';
import { useCart } from '@/context/Cart/CartContext';

const { useBreakpoint } = Grid;

const SizeButton = ({
  size,
  selected,
  onClick,
  disabled,
}: {
  size: string;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${styles.sizeButton} ${
      disabled ? styles.disabled : selected ? styles.selected : styles.default
    }`}
  >
    {size}
  </button>
);

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<DetailedVariant>();
  const [quantity, setQuantity] = useState<number>(1);
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (error) {
        message.error(t('productDetail.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  if (loading || !product) {
    return (
      <div className={styles.spinner}>
        <Spin size="large" />
      </div>
    );
  }

  const uniqueColors = Array.from(
    new Map(
      product.variants
        .filter((v) => v.color?.id && v.color?.name)
        .map((v) => [v.color!.id, v.color!])
    ).values()
  );

  const allVariantImages = product.variants
    .flatMap((variant) => variant.images || [])
    .sort((a, b) => a.order - b.order);

  const parsedCartAdd = () => {
    if (!selectedVariant || !product || !selectedColor) return;

    addToCart({
      id: crypto.randomUUID(),
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      unitPrice: product.price,
      discount: 0,
      finalPrice: product.price,
      product,
      variant: {
        id: selectedVariant.id,
      },
    });
  };

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Carousel dots swipeToSlide draggable className={styles.carousel}>
            {allVariantImages.map((img) => (
              <div key={img.id} className={styles.imageWrapper}>
                <Image src={img.url} alt={product.name} className={styles.productImage} />
              </div>
            ))}
          </Carousel>
        </Col>

        <Col xs={24} md={12}>
          <div className={styles.info}>
            <Tag color="blue">{product.category?.name}</Tag>
            <Typography.Title level={3}>{product.name}</Typography.Title>

            <Typography.Title level={4} className={styles.price}>
              {product.price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
              })}
            </Typography.Title>

            <p className={styles.brand}>
              {t('productDetail.brand')}: <strong>{product.brand?.name}</strong>
            </p>

            <div style={{ margin: '1rem 0' }}>
              <p className={styles.label}>{t('productDetail.selectColor')}</p>
              <div className={styles.colors}>
                {uniqueColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color.id);
                      setSelectedVariant(undefined);
                    }}
                    className={`${styles.colorButton} ${
                      selectedColor === color.id ? styles.selected : ''
                    }`}
                    title={color.name}
                    style={{
                      backgroundColor: color.name,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: selectedColor === color.id ? '2px solid #000' : '1px solid #ccc',
                      marginRight: 8,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {selectedColor && (
              <>
                <p className={styles.label}>{t('productDetail.selectSize')}</p>
                <div className={styles.sizes}>
                  {product.variants
                    .filter((v) => v.color?.id === selectedColor)
                    .map((variant) => (
                      <SizeButton
                        key={variant.id}
                        size={variant?.size?.name || ''}
                        disabled={variant.stock === 0}
                        selected={selectedVariant?.id === variant.id}
                        onClick={() => setSelectedVariant(variant)}
                      />
                    ))}
                </div>
              </>
            )}

            <div style={{ margin: '1rem 0' }}>
              <p className={styles.label}>{t('productDetail.quantity')}</p>
              <InputNumber
                min={1}
                max={selectedVariant?.stock || 1}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
              />
            </div>

            <Button
              onClick={parsedCartAdd}
              type="primary"
              className={styles.addToCart}
              disabled={!selectedVariant || !selectedColor || selectedVariant.stock === 0}
            >
              {t('productDetail.addToCart')}
            </Button>
          </div>
        </Col>
      </Row>

      <Typography.Paragraph className={styles.description}>
        {product.description}
      </Typography.Paragraph>
    </div>
  );
};

export default ProductDetailPage;
