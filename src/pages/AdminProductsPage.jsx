import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../api/http';

export default function AdminProductsPage({ user }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return <p>Bạn không có quyền truy cập trang này</p>;
  }

  const fetchProducts = async () => {
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const res = await http.get('/products', {
        params: search ? { search } : {},
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Không tải được danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;
    try {
      await http.delete(`/products/${id}`);
      setMsg('Đã xoá sản phẩm');
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError('Xoá sản phẩm thất bại');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/${id}/edit`);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h2 className="page-title">Quản lý sản phẩm</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/products/new')}
        >
          + Thêm sản phẩm
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-8 mt-12">
        <input
          className="input"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          Tìm kiếm
        </button>
      </form>

      {msg && <div className="alert alert-success mt-8">{msg}</div>}
      {error && <div className="alert alert-error mt-8">{error}</div>}
      {loading && <p className="mt-12">Đang tải...</p>}

      {!loading && (
        <table className="table mt-12">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{Number(p.price).toLocaleString()} đ</td>
                <td>{p.stock}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleEdit(p.id)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={6}>Chưa có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
