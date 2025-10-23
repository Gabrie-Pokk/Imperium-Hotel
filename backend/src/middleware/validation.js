const Joi = require('joi');

// User validation schemas
const userCreateSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  cpf: Joi.string().length(11).pattern(/^\d{11}$/).required().messages({
    'string.length': 'CPF deve ter exatamente 11 dígitos',
    'string.pattern.base': 'CPF deve conter apenas números',
    'any.required': 'CPF é obrigatório'
  }),
  telefone: Joi.string().min(10).max(15).required().messages({
    'string.min': 'Telefone deve ter pelo menos 10 caracteres',
    'string.max': 'Telefone deve ter no máximo 15 caracteres',
    'any.required': 'Telefone é obrigatório'
  }),
  endereco: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Endereço deve ter pelo menos 5 caracteres',
    'string.max': 'Endereço deve ter no máximo 200 caracteres',
    'any.required': 'Endereço é obrigatório'
  }),
  senha: Joi.string().min(6).max(50).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'string.max': 'Senha deve ter no máximo 50 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

const userUpdateSchema = Joi.object({
  nome: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  cpf: Joi.string().length(11).pattern(/^\d{11}$/).optional(),
  telefone: Joi.string().min(10).max(15).optional(),
  endereco: Joi.string().min(5).max(200).optional(),
  senha: Joi.string().min(6).max(50).optional()
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser fornecido para atualização'
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  senha: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória'
  })
});

// Validation middleware
const validateUserCreate = (req, res, next) => {
  const { error, value } = userCreateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

const validateUserUpdate = (req, res, next) => {
  const { error, value } = userUpdateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

const validateUserLogin = (req, res, next) => {
  const { error, value } = userLoginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

// UUID validation middleware
const validateUUID = (req, res, next) => {
  const { id } = req.params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID deve ser um UUID válido'
    });
  }
  
  next();
};

// Pagination validation middleware
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: 'Página deve ser maior que 0'
    });
  }
  
  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limite deve estar entre 1 e 100'
    });
  }
  
  req.pagination = { page, limit };
  next();
};

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateUserLogin,
  validateUUID,
  validatePagination
};
