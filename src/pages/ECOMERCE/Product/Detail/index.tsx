import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/services/calls/product.service';
import { Product, Variant } from '@/types/Product';
import { Spin, Typography, Tag, Row, Col, Image, message, Button, Carousel } from 'antd';

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
    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-150
      ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : selected ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
  >
    {size}
  </button>
);

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant>();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (error) {
        message.error('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const sortedImages = [...product.images].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Carousel
            dots
            swipeToSlide
            draggable
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: '#f9f9f9' }}
          >
            {sortedImages.map((img) => (
              <div key={img.id} className="w-full h-[480px] flex justify-center items-center">
                <Image
                  src={img.url}
                  alt={product.name}
                  style={{ maxHeight: 460, objectFit: 'contain' }}
                  className="max-w-full"
                />
              </div>
            ))}
          </Carousel>
        </Col>

        <Col xs={24} md={12}>
          <div className="space-y-2">
            <Tag color="blue">{product.category?.name}</Tag>
            <Typography.Title level={3}>{product.name}</Typography.Title>

            <Typography.Title level={4} className="text-green-600">
              {product.price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
              })}
            </Typography.Title>

            <p className="text-gray-500">
              Marca: <strong>{product.brand?.name}</strong>
            </p>

            <div>
              <p className="font-medium mb-1 mt-4">Seleccioná tu talle:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: Variant) => (
                  <SizeButton
                    key={variant.id}
                    size={variant.size}
                    disabled={variant.stock === 0}
                    selected={selectedVariant === variant}
                    onClick={() => setSelectedVariant(variant)}
                  />
                ))}
              </div>
            </div>

            <Button
              type="primary"
              className="mt-4"
              disabled={
                !selectedVariant ||
                product.variants.find((v) => v.size === selectedVariant.size)?.stock === 0
              }
            >
              Agregar al carrito
            </Button>
          </div>
        </Col>
      </Row>

      <Typography.Paragraph className="mt-6 text-sm text-gray-700">
        {product.description}
      </Typography.Paragraph>
    </div>
  );
};

export default ProductDetailPage;
