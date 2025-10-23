const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id_usuario = data.id_usuario;
    this.nome = data.nome;
    this.email = data.email;
    this.cpf = data.cpf;
    this.telefone = data.telefone;
    this.endereco = data.endereco;
    this.senha = data.senha;
    this.created_at = data.created_at;
    this.active = data.active;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(userData.senha, 10);
      
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          nome: userData.nome,
          email: userData.email,
          cpf: userData.cpf,
          telefone: userData.telefone,
          endereco: userData.endereco,
          senha: hashedPassword,
          active: true
        }])
        .select();

      if (error) throw error;
      return new User(data[0]);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Get user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id_usuario', id)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      return data ? new User(data) : null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Get user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? new User(data) : null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Get all users with pagination
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return {
        users: data.map(user => new User(user)),
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`Error finding users: ${error.message}`);
    }
  }

  // Update user
  async update(updateData) {
    try {
      const updateFields = {};
      
      if (updateData.nome) updateFields.nome = updateData.nome;
      if (updateData.email) updateFields.email = updateData.email;
      if (updateData.cpf) updateFields.cpf = updateData.cpf;
      if (updateData.telefone) updateFields.telefone = updateData.telefone;
      if (updateData.endereco) updateFields.endereco = updateData.endereco;
      if (updateData.senha) {
        updateFields.senha = await bcrypt.hash(updateData.senha, 10);
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateFields)
        .eq('id_usuario', this.id_usuario)
        .select()
        .single();

      if (error) throw error;
      
      // Update current instance
      Object.assign(this, data);
      return this;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Soft delete user
  async softDelete(deletedBy) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          active: false,
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy
        })
        .eq('id_usuario', this.id_usuario)
        .select()
        .single();

      if (error) throw error;
      
      this.active = false;
      this.deleted_at = data.deleted_at;
      this.deleted_by = data.deleted_by;
      return this;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.senha);
  }

  // Get user data without sensitive information
  toJSON() {
    const { senha, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
