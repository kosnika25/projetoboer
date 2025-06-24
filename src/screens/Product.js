import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/connection';
import styles from './Product.module.css';

const Product = () => {
  // Estados do formulário
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    price: '',
    unit: ''
  });
  
  // Estados da aplicação
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Referências das coleções
  const productsCollection = collection(db, 'products');
  const brandsCollection = collection(db, 'brands');

  // Carrega produtos e marcas
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(
      query(productsCollection, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      }
    );

    const unsubscribeBrands = onSnapshot(brandsCollection, (snapshot) => {
      const brandsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBrands(brandsData);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeBrands();
    };
  }, []);

  // Limpa mensagem após 3 segundos
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Manipuladores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.name || !product.brand || !product.price || !product.unit) {
      setMessage({ text: 'Preencha todos os campos', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...product,
        price: parseFloat(product.price),
        createdAt: Timestamp.now()
      };

      if (editId) {
        await updateDoc(doc(db, 'products', editId), productData);
        setMessage({ text: 'Produto atualizado!', type: 'success' });
      } else {
        await addDoc(productsCollection, productData);
        setMessage({ text: 'Produto cadastrado!', type: 'success' });
      }

      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      setMessage({ text: 'Erro ao salvar produto', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setProduct({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      unit: product.unit
    });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      setMessage({ text: 'Produto excluído!', type: 'success' });
    } catch (error) {
      console.error('Erro:', error);
      setMessage({ text: 'Erro ao excluir', type: 'error' });
    }
  };

  const resetForm = () => {
    setProduct({ name: '', brand: '', price: '', unit: '' });
    setEditId(null);
  };

  // Filtra produtos
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2>{editId ? 'Editar Produto' : 'Novo Produto'}</h2>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nome</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Nome do produto"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Marca</label>
          <select
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Preço (R$)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Unidade</label>
          <input
            type="text"
            name="unit"
            value={product.unit}
            onChange={handleChange}
            placeholder="Ex: kg, un, L"
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Salvando...' : editId ? 'Atualizar' : 'Cadastrar'}
        </button>

        {editId && (
          <button 
            type="button" 
            onClick={resetForm}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Mensagens */}
      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Busca */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Lista de Produtos */}
      <div className={styles.productsList}>
        <h3>Produtos Cadastrados</h3>
        {filteredProducts.length === 0 ? (
          <p>Nenhum produto encontrado</p>
        ) : (
          <ul>
            {filteredProducts.map(p => (
              <li key={p.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{p.name}</span>
                  <span className={styles.productBrand}>{p.brand}</span>
                  <span className={styles.productPrice}>
                    R$ {parseFloat(p.price).toFixed(2)}/{p.unit}
                  </span>
                  <span className={styles.productDate}>
                    {p.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.productActions}>
                  <button 
                    onClick={() => handleEdit(p)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Product;