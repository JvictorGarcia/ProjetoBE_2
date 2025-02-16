const revokedTokens = new Set();

// Função para revogar um token
const revokeToken = (token) => {
  revokedTokens.add(token);
};

// Função para verificar se um token foi revogado
const isTokenRevoked = (token) => {
  return revokedTokens.has(token);
};

module.exports = {
  revokeToken,
  isTokenRevoked
};