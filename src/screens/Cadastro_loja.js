import React, { useState } from 'react';

const CadastreLoja = () => {
  const [nomeLoja, setNomeLoja] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [erro, setErro] = useState('');

  const buscarEndereco = () => {
    if (cep.length !== 8) {
      setErro('CEP deve conter 8 dígitos numéricos.');
      limparEndereco();
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          setErro('CEP não encontrado.');
          limparEndereco();
        } else {
          setEndereco(data.logradouro || '');
          setCidade(data.localidade || '');
          setUf(data.uf || '');
          setErro('');
        }
      })
      .catch(() => {
        setErro('Erro ao buscar o CEP.');
        limparEndereco();
      });
  };

  const limparEndereco = () => {
    setEndereco('');
    setCidade('');
    setUf('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nomeLoja || !cep || !endereco || !cidade || !uf) {
      setErro('Por favor, preencha todos os campos corretamente.');
      return;
    }

    alert(`✅ Loja cadastrada com sucesso!\n\n🏬 Nome: ${nomeLoja}\n📍 Endereço: ${endereco}, ${cidade} - ${uf}\n📪 CEP: ${cep}`);

    setNomeLoja('');
    setCep('');
    setEndereco('');
    setCidade('');
    setUf('');
    setErro('');
  };

  const containerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px'
  };

  const formStyle = {
    width: '400px',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
  };

  const inputStyle = {
    width: '95%',
    height: '50px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '15px',
    padding: '0 10px',
    boxSizing: 'border-box'
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Cadastro de Loja</h2>

        <input
          type="text"
          placeholder="Nome da Loja"
          value={nomeLoja}
          onChange={(e) => setNomeLoja(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="CEP (somente números)"
          value={cep}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
          onBlur={buscarEndereco}
          maxLength={8}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          readOnly
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Cidade"
          value={cidade}
          readOnly
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="UF"
          value={uf}
          readOnly
          style={inputStyle}
        />

        {erro && <p style={{ color: 'red', marginBottom: '10px' }}>{erro}</p>}

        <button
          type="submit"
          style={{
            width: '100%',
            height: '50px',
            fontSize: '16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastreLoja;
