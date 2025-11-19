import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../api/http';

export default function AdminEditProductPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  if (!user || user.role !== 'ADMIN') {
    return <p>Bạn không có quyền truy cập trang này</p>;
  }

  const loadProduct = async () => {
    setLoadingProduct(true);
    setError('');
    try {
      const res = await http.get(`/products/${id}`);
      const p = res.data;
      setName(p.name || '');
      setDescription(p.description || '');
      setPrice(p.price != null ? String(p.price) : '');
      setStock(p.stock != null ? String(p.stock) : '');
      setCurrentImageUrl(p.imageUrl || '');
    } catch (err) {
      console.error(err);
      setError('Không tải được thông tin sản phẩm');
    } finally {
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await http.patch(`/products/${id}`, formData);
      setMsg('Cập nhật sản phẩm thành công');
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setError(
        backendMessage || 'Cập nhật sản phẩm thất bại. Hãy kiểm tra lại dữ liệu.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="card">
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="card">
        <div className="flex justify-between items-center">
          <h2 className="page-title">Sửa sản phẩm #{id}</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/admin/products')}
          >
            ← Quay lại danh sách
          </button>
        </div>

        {currentImageUrl && (
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
            Ảnh hiện tại: <code>{currentImageUrl}</code>
          </p>
        )}

        {msg && <div className="alert alert-success mt-12">{msg}</div>}
        {error && <div className="alert alert-error mt-12">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-16">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về sản phẩm..."
            />
          </div>

          <div className="flex gap-8">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Giá (đ)</label>
              <input
                className="input"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tồn kho</label>
              <input
                className="input"
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh mới (nếu muốn thay)</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <small style={{ fontSize: 12, color: '#6b7280' }}>
              Nếu không chọn ảnh mới, ảnh cũ sẽ được giữ nguyên.
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-12"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}
