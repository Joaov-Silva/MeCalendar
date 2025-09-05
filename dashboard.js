import React, { useState, useEffect } from "react";
import { Agendamento, Cliente } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Phone,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";
import { format, startOfWeek, endOfWeek, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsOverview from "../components/dashboard/StatsOverview";
import ProximosAgendamentos from "../components/dashboard/ProximosAgendamentos";
import ResumoDiario from "../components/dashboard/ResumoDiario";

export default function Dashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [agendamentosData, clientesData] = await Promise.all([
        Agendamento.list("-data"),
        Cliente.list("-created_date")
      ]);
      setAgendamentos(agendamentosData);
      setClientes(clientesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const agendamentosHoje = agendamentos.filter(a => 
    isToday(new Date(a.data))
  );

  const receitaHoje = agendamentosHoje
    .filter(a => a.status === 'realizado')
    .reduce((total, a) => total + (a.valor || 0), 0);

  const agendamentosSemana = agendamentos.filter(a => {
    const dataAgendamento = new Date(a.data);
    const inicioSemana = startOfWeek(new Date(), { locale: ptBR });
    const fimSemana = endOfWeek(new Date(), { locale: ptBR });
    return dataAgendamento >= inicioSemana && dataAgendamento <= fimSemana;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Bem-vindo ao MeCalendar! ✨
            </h1>
            <p className="text-slate-600 mt-1">
              {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Agendamentos")}>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </Link>
            <Link to={createPageUrl("Calendario")}>
              <Button variant="outline" className="shadow-sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver Calendário
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          agendamentosHoje={agendamentosHoje.length}
          receitaHoje={receitaHoje}
          totalClientes={clientes.length}
          agendamentosSemana={agendamentosSemana.length}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProximosAgendamentos 
              agendamentos={agendamentos}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-8">
            <ResumoDiario 
              agendamentosHoje={agendamentosHoje}
              isLoading={isLoading}
            />

            {/* Clientes Recentes */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Users className="w-5 h-5 text-blue-600" />
                  Clientes Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientes.slice(0, 5).map((cliente) => (
                    <div key={cliente.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200/60">
                      <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {cliente.nome?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{cliente.nome}</p>
                        <p className="text-sm text-slate-500">{cliente.telefone}</p>
                      </div>
                    </div>
                  ))}
                  
                  {clientes.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>Nenhum cliente cadastrado ainda</p>
                      <Link to={createPageUrl("Clientes")}>
                        <Button variant="outline" size="sm" className="mt-2">
                          Cadastrar Cliente
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}