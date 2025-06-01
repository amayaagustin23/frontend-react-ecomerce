import React from 'react';
import { Card } from 'antd';
import { Product } from '@/types/Product';

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
      className="rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.02]"
      cover={
        <img
          alt={product.name}
          src={mainImage}
          className="w-full h-[220px] object-cover border-b block"
        />
      }
    >
      <Card.Meta
        title={
          <h3 className="text-sm font-semibold text-gray-800 leading-tight">{product.name}</h3>
        }
        description={
          <div className="text-xs text-gray-700 leading-tight space-y-[2px]">
            <p className="text-sm text-black font-bold leading-none">
              {product.price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-[11px] text-gray-500 leading-none">{product.brand?.name}</p>
            <p className="text-[11px] text-gray-500 leading-none">{colorCount} colores</p>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
