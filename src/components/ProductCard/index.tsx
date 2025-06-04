import React, { useState } from 'react';
import { Card } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Product } from '@/types/Product';
import styles from './ProductCard.module.scss';
import { useAuth } from '@/context/Auth/AuthContext';

type Props = {
  product: Product;
  onClick?: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  const { addFavoriteProduct, deleteFavoriteProduct, isLogin } = useAuth();
  const mainImage = product.images[0]?.url || 'https://via.placeholder.com/500';
  const colorCount = product.variants.length;

  const [isFavorite, setIsFavorite] = useState(!!product.isFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLogin) return; // opcional: redirigir o mostrar login

    setLoading(true);
    try {
      if (isFavorite) {
        await deleteFavoriteProduct(product.id);
      } else {
        await addFavoriteProduct(product.id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error al cambiar favorito', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      className={styles.productCard}
      cover={
        <div className={styles.imageWrapper}>
          <img alt={product.name} src={mainImage} className={styles.productImage} />
          <div className={styles.heartIcon} onClick={toggleFavorite}>
            {isFavorite ? (
              <HeartFilled style={{ color: '#f5222d', fontSize: 20 }} />
            ) : (
              <HeartOutlined style={{ color: '#fff', fontSize: 20 }} />
            )}
          </div>
        </div>
      }
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
