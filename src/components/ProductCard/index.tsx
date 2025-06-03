import React from 'react';
import { Card } from 'antd';
import { Product } from '@/types/Product';
import styles from './ProductCard.module.scss';

type Props = {
  product: Product;
  onClick?: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  const mainImage = product.images[0]?.url || 'https://via.placeholder.com/500';
  const colorCount = product.variants.length;

  return (
    <Card
      hoverable
      onClick={onClick}
      className={styles.productCard}
      cover={<img alt={product.name} src={mainImage} className={styles.productImage} />}
    >
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.price}>
          {product.price.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
          })}
        </p>
        <p className={styles.brand}>{product.brand?.name}</p>
        <p className={styles.colors}>{colorCount} colores</p>
      </div>
    </Card>
  );
};

export default ProductCard;
