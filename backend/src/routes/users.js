const express = require('express');
const User = require('../models/User');
const {
  validateUserCreate,
  validateUserUpdate,
  validateUserLogin,
  validateUUID,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// GET /api/users - List all users with pagination
router.get('/', validatePagination, async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const result = await User.findAll(page, limit);
    
    res.json({
      success: true,
      message: 'Usuários listados com sucesso',
      data: {
        users: result.users.map(user => user.toJSON()),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário encontrado com sucesso',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', validateUserCreate, async (req, res) => {
  try {
    const userData = req.validatedData;
    
    // Check if email already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', validateUUID, validateUserUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findByEmail(updateData.email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
    }
    
    await user.update(updateData);
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Soft delete user
router.delete('/:id', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBy = req.user?.id || id; // Use current user ID or self-delete
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    await user.softDelete(deletedBy);
    
    res.json({
      success: true,
      message: 'Usuário excluído com sucesso',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/users/login - User login
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, senha } = req.validatedData;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    const isValidPassword = await user.verifyPassword(senha);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/users/search - Search users by name or email
router.get('/search', validatePagination, async (req, res) => {
  try {
    const { q } = req.query;
    const { page, limit } = req.pagination;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Termo de busca deve ter pelo menos 2 caracteres'
      });
    }
    
    // This would need to be implemented in the User model
    // For now, we'll use the basic findAll and filter
    const result = await User.findAll(page, limit);
    const filteredUsers = result.users.filter(user => 
      user.nome.toLowerCase().includes(q.toLowerCase()) ||
      user.email.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json({
      success: true,
      message: 'Busca realizada com sucesso',
      data: {
        users: filteredUsers.map(user => user.toJSON()),
        query: q,
        pagination: {
          page,
          limit,
          total: filteredUsers.length
        }
      }
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/users/deleted - List soft deleted users
router.get('/deleted', validatePagination, async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const result = await User.findDeleted(page, limit);
    
    res.json({
      success: true,
      message: 'Usuários deletados listados com sucesso',
      data: {
        users: result.users.map(user => user.toJSON()),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error listing deleted users:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/users/:id/restore - Restore soft deleted user
router.post('/:id/restore', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;
    const restoredBy = req.user?.id || id; // Use current user ID or self-restore
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    if (user.active) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já está ativo'
      });
    }
    
    await user.restore(restoredBy);
    
    res.json({
      success: true,
      message: 'Usuário restaurado com sucesso',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;
