import { useState, useEffect } from 'react'
import { Building2, Users, UserCheck, UserX, TrendingUp, Calendar } from 'lucide-react'
import { usersAPI } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    deletedUsers: 0,
    recentUsers: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load users data
      const [usersResponse, deletedResponse] = await Promise.all([
        usersAPI.getUsers(1, 5),
        usersAPI.getDeletedUsers(1, 5)
      ])

      setStats({
        totalUsers: usersResponse.data.pagination.total + deletedResponse.data.pagination.total,
        activeUsers: usersResponse.data.pagination.total,
        deletedUsers: deletedResponse.data.pagination.total,
        recentUsers: usersResponse.data.users
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Usuários Ativos',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Usuários Deletados',
      value: stats.deletedUsers,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do sistema Hotel Imperium</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Usuários Recentes</h3>
        </div>
        <div className="p-6">
          {stats.recentUsers.length > 0 ? (
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id_usuario} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {user.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Gerenciar Usuários</p>
            <p className="text-sm text-gray-500">Ver e editar usuários</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserX className="h-6 w-6 text-red-600 mb-2" />
            <p className="font-medium text-gray-900">Usuários Deletados</p>
            <p className="text-sm text-gray-500">Ver usuários excluídos</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Relatórios</p>
            <p className="text-sm text-gray-500">Ver estatísticas</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Agenda</p>
            <p className="text-sm text-gray-500">Ver eventos</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
