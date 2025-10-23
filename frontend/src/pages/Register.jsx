import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Building2, User, Mail, CreditCard, Phone, MapPin, Lock, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'

const Register = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(null)
  const [cpfAvailable, setCpfAvailable] = useState(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [checkingCpf, setCheckingCpf] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const email = watch('email')
  const cpf = watch('cpf')

  // Check email availability
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return
    
    setCheckingEmail(true)
    try {
      const response = await authAPI.checkEmail(email)
      setEmailAvailable(response.available)
    } catch (error) {
      console.error('Error checking email:', error)
      setEmailAvailable(null)
    } finally {
      setCheckingEmail(false)
    }
  }

  // Check CPF availability
  const checkCpfAvailability = async (cpf) => {
    if (!cpf || cpf.length !== 11) return
    
    setCheckingCpf(true)
    try {
      const response = await authAPI.checkCPF(cpf)
      setCpfAvailable(response.available)
    } catch (error) {
      console.error('Error checking CPF:', error)
      setCpfAvailable(null)
    } finally {
      setCheckingCpf(false)
    }
  }

  // CPF validation
  const validateCPF = (cpf) => {
    if (!cpf) return 'CPF é obrigatório'
    if (cpf.length !== 11) return 'CPF deve ter 11 dígitos'
    if (!/^\d{11}$/.test(cpf)) return 'CPF deve conter apenas números'
    
    // Basic CPF validation algorithm
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(9))) return 'CPF inválido'
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(10))) return 'CPF inválido'
    
    return true
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(data)
      
      if (response.success) {
        toast.success('Cadastro realizado com sucesso!')
        onLogin(response.data, 'mock-token') // In a real app, you'd get the token from the response
      } else {
        toast.error(response.message || 'Erro ao realizar cadastro')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(
        error.response?.data?.message || 
        'Erro ao conectar com o servidor. Verifique se o backend está rodando.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Hotel Imperium
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crie sua conta para começar
          </p>
        </div>

        {/* Registration Form */}
        <div className="card animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Nome deve ter no máximo 100 caracteres'
                    }
                  })}
                  type="text"
                  className={`input-field pl-10 ${errors.nome ? 'input-error' : ''}`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.nome && (
                <p className="form-error">{errors.nome.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    },
                    onChange: (e) => {
                      setTimeout(() => checkEmailAvailability(e.target.value), 500)
                    }
                  })}
                  type="email"
                  className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="seu@email.com"
                />
                {email && email.includes('@') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {checkingEmail ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    ) : emailAvailable === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : emailAvailable === false ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
              {emailAvailable === false && (
                <p className="form-error">Email já está em uso</p>
              )}
              {emailAvailable === true && (
                <p className="form-success">Email disponível</p>
              )}
            </div>

            {/* CPF Field */}
            <div className="form-group">
              <label htmlFor="cpf" className="form-label">
                CPF
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('cpf', {
                    required: 'CPF é obrigatório',
                    validate: validateCPF,
                    onChange: (e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      e.target.value = value
                      if (value.length === 11) {
                        setTimeout(() => checkCpfAvailability(value), 500)
                      }
                    }
                  })}
                  type="text"
                  maxLength="11"
                  className={`input-field pl-10 ${errors.cpf ? 'input-error' : ''}`}
                  placeholder="00000000000"
                />
                {cpf && cpf.length === 11 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {checkingCpf ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    ) : cpfAvailable === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : cpfAvailable === false ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.cpf && (
                <p className="form-error">{errors.cpf.message}</p>
              )}
              {cpfAvailable === false && (
                <p className="form-error">CPF já está cadastrado</p>
              )}
              {cpfAvailable === true && (
                <p className="form-success">CPF disponível</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="telefone" className="form-label">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('telefone', {
                    required: 'Telefone é obrigatório',
                    minLength: {
                      value: 10,
                      message: 'Telefone deve ter pelo menos 10 caracteres'
                    },
                    maxLength: {
                      value: 15,
                      message: 'Telefone deve ter no máximo 15 caracteres'
                    }
                  })}
                  type="tel"
                  className={`input-field pl-10 ${errors.telefone ? 'input-error' : ''}`}
                  placeholder="11999999999"
                />
              </div>
              {errors.telefone && (
                <p className="form-error">{errors.telefone.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="form-group">
              <label htmlFor="endereco" className="form-label">
                Endereço
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('endereco', {
                    required: 'Endereço é obrigatório',
                    minLength: {
                      value: 5,
                      message: 'Endereço deve ter pelo menos 5 caracteres'
                    },
                    maxLength: {
                      value: 200,
                      message: 'Endereço deve ter no máximo 200 caracteres'
                    }
                  })}
                  type="text"
                  className={`input-field pl-10 ${errors.endereco ? 'input-error' : ''}`}
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>
              {errors.endereco && (
                <p className="form-error">{errors.endereco.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Senha deve ter no máximo 50 caracteres'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.senha ? 'input-error' : ''}`}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="form-error">{errors.senha.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || emailAvailable === false || cpfAvailable === false}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Hotel Imperium. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
