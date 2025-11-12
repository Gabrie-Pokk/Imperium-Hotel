const express = require('express');
const User = require('../models/User');
const {
  validateUserCreate,
  validateUserLogin
} = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register - Cadastro de usuário
router.post('/register', validateUserCreate, async (req, res) => {
  try {
    const userData = req.validatedData;
    
    // Verificar se email já existe (incluindo usuários deletados)
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }
    
    // Verificar se CPF já existe
    const existingCPF = await User.findByCPF(userData.cpf);
    if (existingCPF) {
      return res.status(409).json({
        success: false,
        message: 'CPF já está cadastrado',
        code: 'CPF_ALREADY_EXISTS'
      });
    }
    
    const user = await User.create(userData);
    
    const token = Buffer.from(`${user.id_usuario}-${Date.now()}`).toString('base64');
    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: user.toJSON(),
      token,
      code: 'USER_CREATED'
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor durante o cadastro',
      error: error.message
    });
  }
});

// POST /api/auth/login - Login de usuário
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, senha } = req.validatedData;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Verificar se usuário está ativo
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    const isValidPassword = await user.verifyPassword(senha);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const token = Buffer.from(`${user.id_usuario}-${Date.now()}`).toString('base64');
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: user.toJSON(),
      token,
      code: 'LOGIN_SUCCESS'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor durante o login',
      error: error.message
    });
  }
});

// POST /api/auth/check-email - Verificar se email está disponível
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }
    
    const user = await User.findByEmail(email);
    
    res.json({
      success: true,
      available: !user,
      message: user ? 'Email já está em uso' : 'Email disponível'
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/auth/check-cpf - Verificar se CPF está disponível
router.post('/check-cpf', async (req, res) => {
  try {
    const { cpf } = req.body;
    
    if (!cpf) {
      return res.status(400).json({
        success: false,
        message: 'CPF é obrigatório'
      });
    }
    
    const user = await User.findByCPF(cpf);
    
    res.json({
      success: true,
      available: !user,
      message: user ? 'CPF já está cadastrado' : 'CPF disponível'
    });
  } catch (error) {
    console.error('Error checking CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;
