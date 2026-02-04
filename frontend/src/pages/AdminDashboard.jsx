import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit'
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);


  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
    setCurrentPage(1); // Reset to page 1 on tab switch
  }, [activeTab]);


  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await api.get('/users');
        setUsers(response.data);
      } else {
        const response = await api.get('/products');
        setProducts(response.data);
      }
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  // User Management Functions
  const openUserModal = (type, user = null) => {
    setModalType(type);
    setCurrentItem(user);
    if (user) {
      setUserForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setUserForm({ name: '', email: '', password: '', role: 'user' });
    }
    setShowModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!/^[A-Za-z\s]+$/.test(userForm.name)) {
      setError('Name must contain only alphabets');
      return;
    }
    if (!userForm.email.endsWith('@gmail.com')) {
      setError('Registration allowed only for @gmail.com addresses');
      return;
    }
    if (modalType === 'create' && userForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (modalType === 'create') {
        await api.post('/users', userForm);
        setSuccess('User created successfully');
      } else {
        const updateData = { ...userForm };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/users/${currentItem._id}`, updateData);
        setSuccess('User updated successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      setSuccess('User deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  // Product Management Functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openProductModal = (type, product = null) => {
    setModalType(type);
    setCurrentItem(product);
    if (product) {
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl
      });
    } else {
      setProductForm({ name: '', description: '', price: '', imageUrl: '' });
    }
    setShowModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (productForm.name.length < 3) {
      setError('Product name must be at least 3 characters');
      return;
    }
    if (productForm.description.length < 10) {
      setError('Product description must be at least 10 characters');
      return;
    }
    if (Number(productForm.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }

    try {
      if (modalType === 'create') {
        await api.post('/products', productForm);
        setSuccess('Product created successfully');
      } else {
        await api.put(`/products/${currentItem._id}`, productForm);
        setSuccess('Product updated successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setSuccess('Product deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="tabs">
          <button
            className={activeTab === 'users' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={activeTab === 'products' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('products')}
          >
            Product Management
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'users' ? (
            <div>
              <div className="content-header">
                <h2>Users</h2>
                <button className="btn-primary" onClick={() => openUserModal('create')}>
                  Add New User
                </button>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((user) => (
                          <tr key={user._id}>
                            <td data-label="Name">{user.name}</td>
                            <td data-label="Email">{user.email}</td>
                            <td data-label="Role">
                              <span className={`badge badge-${user.role}`}>{user.role}</span>
                            </td>
                            <td data-label="Created At">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td data-label="Actions">
                              <button
                                className="btn-edit"
                                onClick={() => openUserModal('edit', user)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => deleteUser(user._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn-secondary"
                    >
                      Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(users.length / itemsPerPage) || 1}</span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(users.length / itemsPerPage)))}
                      disabled={currentPage >= Math.ceil(users.length / itemsPerPage)}
                      className="btn-secondary"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="content-header">
                <h2>Products</h2>
                <button className="btn-primary" onClick={() => openProductModal('create')}>
                  Add New Product
                </button>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((product) => (
                          <tr key={product._id}>
                            <td data-label="Image">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-thumbnail"
                              />
                            </td>
                            <td data-label="Name">{product.name}</td>
                            <td data-label="Description" className="description-cell">{product.description}</td>
                            <td data-label="Price">Rs{product.price.toFixed(2)}</td>
                            <td data-label="Created At">{new Date(product.createdAt).toLocaleDateString()}</td>
                            <td data-label="Actions">
                              <button
                                className="btn-edit"
                                onClick={() => openProductModal('edit', product)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => deleteProduct(product._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn-secondary"
                    >
                      Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(products.length / itemsPerPage) || 1}</span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))}
                      disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
                      className="btn-secondary"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              {modalType === 'create' ? 'Create' : 'Edit'}{' '}
              {activeTab === 'users' ? 'User' : 'Product'}
            </h2>

            {activeTab === 'users' ? (
              <form onSubmit={handleUserSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password {modalType === 'edit' && '(leave blank to keep current)'}</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required={modalType === 'create'}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {modalType === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleProductSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={modalType === 'create'}
                  />
                  {productForm.imageUrl && (
                    <img
                      src={productForm.imageUrl}
                      alt="Preview"
                      style={{
                        marginTop: '10px',
                        maxWidth: '100%',
                        height: '150px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {modalType === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
