"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  PiggyBank, 
  Calculator,
  Plus,
  Trash2,
  Edit2
} from "lucide-react"

interface Despesa {
  id: string
  nome: string
  valor: number
  tipo: 'fixa' | 'variavel'
}

interface Meta {
  id: string
  descricao: string
  valorAlvo: number
  prazo: string
}

export default function Home() {
  // Estados principais
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [faturamento, setFaturamento] = useState<number>(0)
  const [metaEconomia, setMetaEconomia] = useState<number>(20)
  const [metaLucro, setMetaLucro] = useState<number>(0)
  const [metas, setMetas] = useState<Meta[]>([])
  
  // Estados para formulários
  const [novaDespesa, setNovaDespesa] = useState({ nome: '', valor: '', tipo: 'fixa' as 'fixa' | 'variavel' })
  const [novaMeta, setNovaMeta] = useState({ descricao: '', valorAlvo: '', prazo: '' })
  const [novoFaturamento, setNovoFaturamento] = useState('')
  const [novaMetaLucro, setNovaMetaLucro] = useState('')

  // Carregar dados do localStorage
  useEffect(() => {
    const despesasSalvas = localStorage.getItem('despesas')
    const faturamentoSalvo = localStorage.getItem('faturamento')
    const metaEconomiaSalva = localStorage.getItem('metaEconomia')
    const metaLucroSalva = localStorage.getItem('metaLucro')
    const metasSalvas = localStorage.getItem('metas')

    if (despesasSalvas) setDespesas(JSON.parse(despesasSalvas))
    if (faturamentoSalvo) setFaturamento(parseFloat(faturamentoSalvo))
    if (metaEconomiaSalva) setMetaEconomia(parseFloat(metaEconomiaSalva))
    if (metaLucroSalva) setMetaLucro(parseFloat(metaLucroSalva))
    if (metasSalvas) setMetas(JSON.parse(metasSalvas))
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas))
  }, [despesas])

  useEffect(() => {
    localStorage.setItem('faturamento', faturamento.toString())
  }, [faturamento])

  useEffect(() => {
    localStorage.setItem('metaEconomia', metaEconomia.toString())
  }, [metaEconomia])

  useEffect(() => {
    localStorage.setItem('metaLucro', metaLucro.toString())
  }, [metaLucro])

  useEffect(() => {
    localStorage.setItem('metas', JSON.stringify(metas))
  }, [metas])

  // Cálculos financeiros
  const totalDespesas = despesas.reduce((acc, desp) => acc + desp.valor, 0)
  const lucro = faturamento - totalDespesas
  const margemLucro = faturamento > 0 ? (lucro / faturamento) * 100 : 0
  const pontoEquilibrio = totalDespesas
  const vendaNecessaria = totalDespesas / (1 - (metaEconomia / 100))
  const economiaAtual = lucro > 0 ? (lucro / faturamento) * 100 : 0
  const economiaReal = lucro > 0 ? lucro : 0
  
  // Novo cálculo: venda necessária para atingir meta de lucro
  const vendaParaMetaLucro = totalDespesas + metaLucro

  // Funções de gerenciamento
  const adicionarDespesa = () => {
    if (novaDespesa.nome && novaDespesa.valor) {
      const despesa: Despesa = {
        id: Date.now().toString(),
        nome: novaDespesa.nome,
        valor: parseFloat(novaDespesa.valor),
        tipo: novaDespesa.tipo
      }
      setDespesas([...despesas, despesa])
      setNovaDespesa({ nome: '', valor: '', tipo: 'fixa' })
    }
  }

  const removerDespesa = (id: string) => {
    setDespesas(despesas.filter(d => d.id !== id))
  }

  const adicionarMeta = () => {
    if (novaMeta.descricao && novaMeta.valorAlvo && novaMeta.prazo) {
      const meta: Meta = {
        id: Date.now().toString(),
        descricao: novaMeta.descricao,
        valorAlvo: parseFloat(novaMeta.valorAlvo),
        prazo: novaMeta.prazo
      }
      setMetas([...metas, meta])
      setNovaMeta({ descricao: '', valorAlvo: '', prazo: '' })
    }
  }

  const removerMeta = (id: string) => {
    setMetas(metas.filter(m => m.id !== id))
  }

  const atualizarFaturamento = () => {
    if (novoFaturamento) {
      setFaturamento(parseFloat(novoFaturamento))
      setNovoFaturamento('')
    }
  }

  const atualizarMetaLucro = () => {
    if (novaMetaLucro) {
      setMetaLucro(parseFloat(novaMetaLucro))
      setNovaMetaLucro('')
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Gestão Financeira Empresarial
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Organize e controle suas finanças de forma inteligente
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Faturamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatarMoeda(faturamento)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Receita total do mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                {formatarMoeda(totalDespesas)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {despesas.length} despesas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Lucro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${lucro >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                {formatarMoeda(lucro)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Margem: {margemLucro.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                Economia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                {economiaAtual.toFixed(1)}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formatarMoeda(economiaReal)} economizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Faturamento */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Atualizar Faturamento
                  </CardTitle>
                  <CardDescription>
                    Informe o faturamento total do mês
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faturamento">Valor do Faturamento (R$)</Label>
                    <Input
                      id="faturamento"
                      type="number"
                      placeholder="0.00"
                      value={novoFaturamento}
                      onChange={(e) => setNovoFaturamento(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button 
                    onClick={atualizarFaturamento}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    Atualizar Faturamento
                  </Button>
                </CardContent>
              </Card>

              {/* Análise Rápida */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Análise Rápida
                  </CardTitle>
                  <CardDescription>
                    Indicadores importantes do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ponto de Equilíbrio
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatarMoeda(pontoEquilibrio)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Venda Necessária ({metaEconomia}%)
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatarMoeda(vendaNecessaria)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status Financeiro
                      </span>
                      <span className={`text-sm font-bold ${lucro >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {lucro >= 0 ? 'Lucrando' : 'Prejuízo'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Meta de Lucro */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Meta de Lucro
                </CardTitle>
                <CardDescription>
                  Defina quanto você quer lucrar e veja quanto precisa vender
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaLucro">Meta de Lucro Desejado (R$)</Label>
                    <Input
                      id="metaLucro"
                      type="number"
                      placeholder="0.00"
                      value={novaMetaLucro}
                      onChange={(e) => setNovaMetaLucro(e.target.value)}
                      className="text-lg"
                    />
                    <Button 
                      onClick={atualizarMetaLucro}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      Definir Meta de Lucro
                    </Button>
                  </div>
                  
                  {metaLucro > 0 && (
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Venda Necessária para Lucro de {formatarMoeda(metaLucro)}
                        </p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-500">
                          {formatarMoeda(vendaParaMetaLucro)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Lucro Atual:</span>
                          <span className={`font-medium ${lucro >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatarMoeda(lucro)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Meta de Lucro:</span>
                          <span className="font-medium text-purple-600">
                            {formatarMoeda(metaLucro)}
                          </span>
                        </div>
                        <Progress 
                          value={metaLucro > 0 ? Math.min((lucro / metaLucro) * 100, 100) : 0} 
                          className="h-2"
                        />
                        <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                          {lucro >= metaLucro 
                            ? '🎉 Meta de lucro atingida!' 
                            : `Faltam ${formatarMoeda(metaLucro - lucro)} para atingir a meta`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progresso da Meta de Economia */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-blue-600" />
                  Meta de Economia
                </CardTitle>
                <CardDescription>
                  Acompanhe seu progresso em relação à meta de economia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Economia Atual: {economiaAtual.toFixed(1)}%
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Meta: {metaEconomia}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((economiaAtual / metaEconomia) * 100, 100)} 
                    className="h-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaEconomia">Ajustar Meta de Economia (%)</Label>
                  <Input
                    id="metaEconomia"
                    type="number"
                    value={metaEconomia}
                    onChange={(e) => setMetaEconomia(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Despesas */}
          <TabsContent value="despesas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adicionar Despesa */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    Adicionar Despesa
                  </CardTitle>
                  <CardDescription>
                    Cadastre uma nova despesa mensal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeDespesa">Nome da Despesa</Label>
                    <Input
                      id="nomeDespesa"
                      placeholder="Ex: Aluguel, Salários, Energia..."
                      value={novaDespesa.nome}
                      onChange={(e) => setNovaDespesa({...novaDespesa, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorDespesa">Valor (R$)</Label>
                    <Input
                      id="valorDespesa"
                      type="number"
                      placeholder="0.00"
                      value={novaDespesa.valor}
                      onChange={(e) => setNovaDespesa({...novaDespesa, valor: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoDespesa">Tipo</Label>
                    <select
                      id="tipoDespesa"
                      value={novaDespesa.tipo}
                      onChange={(e) => setNovaDespesa({...novaDespesa, tipo: e.target.value as 'fixa' | 'variavel'})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="fixa">Fixa</option>
                      <option value="variavel">Variável</option>
                    </select>
                  </div>
                  <Button 
                    onClick={adicionarDespesa}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Despesa
                  </Button>
                </CardContent>
              </Card>

              {/* Resumo de Despesas */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Resumo de Despesas</CardTitle>
                  <CardDescription>
                    Visão geral das suas despesas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Total de Despesas
                      </span>
                      <span className="text-lg font-bold text-red-600 dark:text-red-500">
                        {formatarMoeda(totalDespesas)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Despesas Fixas
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatarMoeda(despesas.filter(d => d.tipo === 'fixa').reduce((acc, d) => acc + d.valor, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Despesas Variáveis
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatarMoeda(despesas.filter(d => d.tipo === 'variavel').reduce((acc, d) => acc + d.valor, 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Despesas */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Despesas Cadastradas</CardTitle>
                <CardDescription>
                  Gerencie todas as suas despesas mensais
                </CardDescription>
              </CardHeader>
              <CardContent>
                {despesas.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Nenhuma despesa cadastrada ainda
                  </div>
                ) : (
                  <div className="space-y-2">
                    {despesas.map((despesa) => (
                      <div
                        key={despesa.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {despesa.nome}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              despesa.tipo === 'fixa' 
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400' 
                                : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400'
                            }`}>
                              {despesa.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {formatarMoeda(despesa.valor)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerDespesa(despesa.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculadora */}
          <TabsContent value="calculadora" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    Ponto de Equilíbrio
                  </CardTitle>
                  <CardDescription>
                    Quanto você precisa faturar para cobrir todas as despesas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Valor Mínimo de Vendas
                      </p>
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                        {formatarMoeda(pontoEquilibrio)}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Este é o valor mínimo que você precisa faturar para não ter prejuízo. 
                      Qualquer valor acima disso será lucro.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Venda Necessária para Meta
                  </CardTitle>
                  <CardDescription>
                    Quanto vender para atingir sua meta de economia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Faturamento Necessário ({metaEconomia}% de economia)
                      </p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                        {formatarMoeda(vendaNecessaria)}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Para alcançar sua meta de {metaEconomia}% de economia sobre o faturamento, 
                      você precisa faturar este valor.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Venda para Meta de Lucro
                  </CardTitle>
                  <CardDescription>
                    Quanto vender para atingir sua meta de lucro específica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metaLucro > 0 ? (
                      <>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Faturamento Necessário (Lucro de {formatarMoeda(metaLucro)})
                          </p>
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-500">
                            {formatarMoeda(vendaParaMetaLucro)}
                          </p>
                        </div>
                        <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Despesas Totais:</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formatarMoeda(totalDespesas)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Meta de Lucro:</span>
                            <span className="font-medium text-purple-600">{formatarMoeda(metaLucro)}</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-400">Venda Necessária:</span>
                            <span className="font-bold text-purple-600">{formatarMoeda(vendaParaMetaLucro)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Para ter um lucro de {formatarMoeda(metaLucro)}, você precisa faturar {formatarMoeda(vendaParaMetaLucro)}. 
                          Isso cobre suas despesas de {formatarMoeda(totalDespesas)} e garante o lucro desejado.
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          Defina uma meta de lucro no Dashboard para ver o cálculo aqui
                        </p>
                        <Button 
                          onClick={() => {
                            const tabs = document.querySelector('[value="dashboard"]') as HTMLElement
                            tabs?.click()
                          }}
                          variant="outline"
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          Ir para Dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Margem de Lucro
                  </CardTitle>
                  <CardDescription>
                    Percentual de lucro sobre o faturamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Margem Atual
                      </p>
                      <p className={`text-3xl font-bold ${margemLucro >= 0 ? 'text-orange-600 dark:text-orange-500' : 'text-red-600 dark:text-red-500'}`}>
                        {margemLucro.toFixed(2)}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Faturamento:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{formatarMoeda(faturamento)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Despesas:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{formatarMoeda(totalDespesas)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400">Lucro:</span>
                        <span className={`font-bold ${lucro >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatarMoeda(lucro)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-teal-600" />
                    Taxa de Economia Real
                  </CardTitle>
                  <CardDescription>
                    Quanto você está economizando atualmente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Economia Atual
                        </p>
                        <p className="text-3xl font-bold text-teal-600 dark:text-teal-500">
                          {economiaAtual.toFixed(2)}%
                        </p>
                        <p className="text-lg text-slate-700 dark:text-slate-300 mt-2">
                          {formatarMoeda(economiaReal)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Progress 
                          value={Math.min((economiaAtual / metaEconomia) * 100, 100)} 
                          className="h-3"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                          {economiaAtual >= metaEconomia 
                            ? '🎉 Meta de economia atingida!' 
                            : `Faltam ${(metaEconomia - economiaAtual).toFixed(1)}% para atingir a meta de ${metaEconomia}%`
                          }
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Meta de Economia:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{metaEconomia}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Economia Atual:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{economiaAtual.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Valor Economizado:</span>
                          <span className="font-bold text-teal-600">{formatarMoeda(economiaReal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Metas */}
          <TabsContent value="metas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adicionar Meta */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Adicionar Meta Financeira
                  </CardTitle>
                  <CardDescription>
                    Defina objetivos financeiros para sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="descricaoMeta">Descrição da Meta</Label>
                    <Input
                      id="descricaoMeta"
                      placeholder="Ex: Comprar equipamento novo, Reserva de emergência..."
                      value={novaMeta.descricao}
                      onChange={(e) => setNovaMeta({...novaMeta, descricao: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorMeta">Valor Alvo (R$)</Label>
                    <Input
                      id="valorMeta"
                      type="number"
                      placeholder="0.00"
                      value={novaMeta.valorAlvo}
                      onChange={(e) => setNovaMeta({...novaMeta, valorAlvo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prazoMeta">Prazo</Label>
                    <Input
                      id="prazoMeta"
                      type="month"
                      value={novaMeta.prazo}
                      onChange={(e) => setNovaMeta({...novaMeta, prazo: e.target.value})}
                    />
                  </div>
                  <Button 
                    onClick={adicionarMeta}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Meta
                  </Button>
                </CardContent>
              </Card>

              {/* Progresso Geral */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Progresso das Metas</CardTitle>
                  <CardDescription>
                    Acompanhe o progresso das suas metas financeiras
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Total de Metas
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {metas.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Valor Total das Metas
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatarMoeda(metas.reduce((acc, m) => acc + m.valorAlvo, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Economia Disponível
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                        {formatarMoeda(economiaReal)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Metas */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Metas Cadastradas</CardTitle>
                <CardDescription>
                  Gerencie todas as suas metas financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metas.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Nenhuma meta cadastrada ainda
                  </div>
                ) : (
                  <div className="space-y-4">
                    {metas.map((meta) => {
                      const progresso = economiaReal > 0 ? Math.min((economiaReal / meta.valorAlvo) * 100, 100) : 0
                      const prazoFormatado = new Date(meta.prazo + '-01').toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })
                      
                      return (
                        <div
                          key={meta.id}
                          className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                {meta.descricao}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Meta: {formatarMoeda(meta.valorAlvo)} • Prazo: {prazoFormatado}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerMeta(meta.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                Progresso: {progresso.toFixed(1)}%
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {formatarMoeda(economiaReal)} / {formatarMoeda(meta.valorAlvo)}
                              </span>
                            </div>
                            <Progress value={progresso} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
