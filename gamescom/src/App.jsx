import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Trophy,
  Star,
  Check,
  ThumbsUp,
  Compass,
  Upload,
  RefreshCw
} from 'lucide-react';
import talksJsonData from '../talks.json';

// Dados baseados na página oficial + curadoria para o perfil de desenvolvimento/segurança
const initialTalksData = []; // Base limpa para você sincronizar os dados de 2026 diretamente da API

// Tags que definem o perfil do usuário
const userProfileTags = ["Programação", "Segurança", "Backend", "IA", "Otimização", "Dados", "Arquitetura"];

export default function App() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [myTrack, setMyTrack] = useState([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState('Todos');
  const [talksData, setTalksData] = useState(initialTalksData);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMessage, setImportMessage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Carrega o arquivo talks.json local como base
    const rawTalks = Array.isArray(talksJsonData) ? talksJsonData : (talksJsonData.talks || []);
    if (rawTalks.length > 0) {
      setTalksData(processRawApiData(rawTalks));
    }
  }, []);

  // Lógica para adicionar/remover da trilha
  const toggleTrack = (id) => {
    if (myTrack.includes(id)) {
      setMyTrack(myTrack.filter(item => item !== id));
    } else {
      setMyTrack([...myTrack, id]);
    }
  };

  // Função centralizada para mapear os dados crus da API para o formato do nosso app
  const processRawApiData = (apiTalks) => {
    return apiTalks.map(talk => {
      const textToAnalyze = `${talk.title} ${talk.description || ''}`.toLowerCase();
      const tags = [];

      if (textToAnalyze.includes('segurança') || textToAnalyze.includes('dados') || textToAnalyze.includes('proteção')) tags.push('Segurança');
      if (textToAnalyze.includes('arquitetura') || textToAnalyze.includes('backend') || textToAnalyze.includes('servidor')) tags.push('Arquitetura');
      if (textToAnalyze.includes('código') || textToAnalyze.includes('dev') || textToAnalyze.includes('programação')) tags.push('Programação');
      if (textToAnalyze.includes('ia') || textToAnalyze.includes('inteligência') || textToAnalyze.includes('ai')) tags.push('IA');
      if (textToAnalyze.includes('negócio') || textToAnalyze.includes('business') || textToAnalyze.includes('investimento')) tags.push('Business');

      if (tags.length === 0) tags.push('Geral');

      // Correção estrutural: Em 2025 era "30/abr/25", em 2026 veio "30/abr". 
      // Esta lógica é resiliente aos dois formatos.
      let rawDate = talk.day?.human || '';
      const dateParts = rawDate.split('/');
      let dateNormalized = rawDate;
      if (dateParts.length >= 2) {
        let month = dateParts[1].toLowerCase();
        if (month === 'abr') month = '04';
        if (month === 'mai') month = '05';
        dateNormalized = `${dateParts[0]}/${month}`;
      }

      return {
        id: talk.id,
        title: talk.title,
        date: dateNormalized,
        startTime: talk.starts_at_hour,
        endTime: talk.ends_at_hour,
        stage: talk.location?.name || 'Palco',
        category: talk.categories?.[0]?.name || 'Geral',
        description: talk.description || '',
        tags: tags
      };
    });
  };

  // Função para processar a importação segura do JSON
  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importText);
      // Pega o array de talks, seja vindo da estrutura original da API { talks: [...] } ou direto de um array
      const rawTalks = Array.isArray(parsedData) ? parsedData : (parsedData.talks || []);

      if (rawTalks.length > 0) {
        const mappedTalks = processRawApiData(rawTalks);
        setTalksData(mappedTalks);
        setImportMessage({ type: 'success', text: `${mappedTalks.length} palestras processadas e importadas com sucesso!` });
        setTimeout(() => {
          setShowImport(false);
          setImportMessage(null);
          setImportText('');
        }, 2500);
      } else {
        setImportMessage({ type: 'error', text: 'Erro: Não encontrei a lista de palestras no JSON.' });
      }
    } catch (e) {
      setImportMessage({ type: 'error', text: 'JSON inválido. Verifique se há erros de sintaxe ou vírgulas sobrando.' });
    }
  };

  // Função para buscar dados da API Oficial descoberta
  const handleApiSync = async () => {
    setIsSyncing(true);
    setImportMessage({ type: 'success', text: 'Conectando à API oficial (2026) e baixando cronograma...' });
    try {
      const baseUrl = 'https://latam.gamescom.global/wp-json/gamescom/v1/schedule/items?event=16&lang=pt-BR';
      const firstPageRes = await fetch(`${baseUrl}&page=1`);

      if (!firstPageRes.ok) throw new Error('Falha na requisição');

      const firstPageData = await firstPageRes.json();
      let allApiTalks = [...firstPageData.talks];
      const totalPages = firstPageData.page_count;

      // Buscar páginas restantes em paralelo
      const fetchPromises = [];
      for (let i = 2; i <= totalPages; i++) {
        fetchPromises.push(fetch(`${baseUrl}&page=${i}`).then(res => res.json()));
      }

      const restPagesData = await Promise.all(fetchPromises);
      restPagesData.forEach(pageData => {
        if (pageData && pageData.talks) {
          allApiTalks = [...allApiTalks, ...pageData.talks];
        }
      });

      const mappedTalks = processRawApiData(allApiTalks);

      setTalksData(mappedTalks);
      setImportMessage({ type: 'success', text: `${mappedTalks.length} palestras sincronizadas com sucesso da fonte oficial!` });
      setTimeout(() => { setShowImport(false); setImportMessage(null); }, 3000);

    } catch (error) {
      setImportMessage({ type: 'error', text: 'Erro ao sincronizar. O servidor bloqueou a requisição (CORS). Cole o JSON manualmente abaixo.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtragem de palestras recomendadas baseadas no perfil (Dev / Segurança)
  const recommendedTalks = useMemo(() => {
    return talksData.filter(talk => talk.tags.some(tag => userProfileTags.includes(tag)));
  }, [talksData]);

  // Palestras salvas pelo usuário
  const myTrackTalks = useMemo(() => {
    return talksData.filter(talk => myTrack.includes(talk.id));
  }, [talksData, myTrack]);

  // Lista base exibida dependendo da aba e do filtro de dia
  const displayedTalks = useMemo(() => {
    let baseList = talksData;
    if (activeTab === 'recommendations') baseList = recommendedTalks;
    if (activeTab === 'myTrack') baseList = myTrackTalks;

    if (selectedDayFilter !== 'Todos' && activeTab !== 'bestDay') {
      return baseList.filter(talk => talk.date === selectedDayFilter);
    }
    return baseList;
  }, [talksData, activeTab, recommendedTalks, myTrackTalks, selectedDayFilter]);

  // Análise de qual é o melhor dia para comprar o ingresso
  const bestDayAnalysis = useMemo(() => {
    const dayScores = {};

    // Contabiliza palestras recomendadas por dia
    recommendedTalks.forEach(talk => {
      if (!dayScores[talk.date]) {
        dayScores[talk.date] = { date: talk.date, recommendedCount: 0, talks: [] };
      }
      dayScores[talk.date].recommendedCount += 1;
      dayScores[talk.date].talks.push(talk);
    });

    const sortedDays = Object.values(dayScores).sort((a, b) => b.recommendedCount - a.recommendedCount);
    return sortedDays;
  }, [recommendedTalks]);

  // Componente de Card da Palestra
  const TalkCard = ({ talk }) => {
    const isRecommended = talk.tags.some(tag => userProfileTags.includes(tag));
    const isSaved = myTrack.includes(talk.id);
    const hasSecurity = talk.tags.includes('Segurança');

    return (
      <div className={`p-5 rounded-xl border mb-4 shadow-sm transition-all ${isSaved ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white hover:border-emerald-300'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {talk.title}
            {hasSecurity && <ShieldCheck className="w-5 h-5 text-blue-600" title="Foco em Segurança" />}
            {isRecommended && !hasSecurity && <Code2 className="w-5 h-5 text-emerald-600" title="Foco em Código/Dev" />}
          </h3>
          <button
            onClick={() => toggleTrack(talk.id)}
            className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${isSaved ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            {isSaved ? 'Na Trilha' : 'Adicionar'}
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{talk.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {talk.date}</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {talk.startTime} - {talk.endTime}</div>
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {talk.stage}</div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {talk.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-[#000000] text-white pt-10 pb-6 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Compass className="w-8 h-8 text-emerald-400" />
              <h1 className="text-2xl font-bold">gamescom latam | Tech Planner</h1>
            </div>
            <p className="text-gray-400 mt-2 text-sm max-w-2xl">
              Ferramenta curada para desenvolvedores com interesse em boas práticas e segurança.
              Filtre o conteúdo técnico, monte sua trilha e descubra o melhor dia para participar.
            </p>
          </div>
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-700 shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Base de Dados
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8">

        {/* Modal/Área de Importação */}
        {showImport && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Atualizar Programação</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mantenha o calendário atualizado. Você pode buscar os dados automaticamente do servidor oficial da Gamescom ou colar o JSON manualmente caso encontre bloqueios de CORS.
            </p>

            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Sincronização Automática (Recomendado)</h4>
                <p className="text-xs text-emerald-700 mt-1">Conecta na API (wp-json/gamescom/v1) e processa as tags do seu perfil.</p>
              </div>
              <button
                onClick={handleApiSync}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isSyncing ? 'Baixando...' : 'Sincronizar API'}
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Sincronização Manual (Fallback)</h4>
              <textarea
                className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm font-mono mb-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-y"
                placeholder='Cole o Array JSON aqui caso a API automática falhe...'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Importar JSON
                </button>
                <button
                  onClick={() => { setShowImport(false); setImportMessage(null); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>

            {importMessage && (
              <div className={`p-3 rounded-lg mt-4 text-sm font-medium ${importMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : importMessage.type === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                {importMessage.text}
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'recommendations' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Star className="w-4 h-4" /> Recomendadas
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'all' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Code2 className="w-4 h-4" /> Programação Completa
          </button>
          <button
            onClick={() => setActiveTab('myTrack')}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'myTrack' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Check className="w-4 h-4" /> Minha Trilha ({myTrack.length})
          </button>
          <button
            onClick={() => setActiveTab('bestDay')}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'bestDay' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Trophy className="w-4 h-4" /> Qual dia comprar?
          </button>
        </div>

        {/* Content Area */}
        {activeTab !== 'bestDay' ? (
          <div>
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
              <span className="text-sm font-medium text-gray-600 ml-2 whitespace-nowrap">Filtrar por dia:</span>
              {['Todos', ...Array.from(new Set(talksData.map(t => t.date))).sort()].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDayFilter(day)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap ${selectedDayFilter === day ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4">
              {displayedTalks.length > 0 ? (
                displayedTalks.map(talk => <TalkCard key={talk.id} talk={talk} />)
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                  <p className="text-gray-500">Nenhuma palestra encontrada com esses filtros.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Aba: Análise do Melhor Dia */
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                <ThumbsUp className="w-6 h-6 text-blue-600" /> Veredito para o seu Perfil
              </h2>
              <p className="text-blue-800 text-sm">
                Avaliamos todas as palestras em busca de temas focados em <strong>Arquitetura de Software, Segurança, Backend e Programação</strong>. Com base na densidade desse conteúdo, este é o ranking dos melhores dias para você garantir seu ingresso.
              </p>
            </div>

            {bestDayAnalysis.map((dayData, index) => {
              const isWinner = index === 0;
              return (
                <div key={dayData.date} className={`relative p-6 rounded-xl border ${isWinner ? 'border-emerald-500 bg-white shadow-md' : 'border-gray-200 bg-white opacity-80'}`}>
                  {isWinner && (
                    <div className="absolute -top-3 left-6 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> DIA RECOMENDADO
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black text-gray-800">Dia {dayData.date}</h3>
                    <div className="text-right">
                      <span className={`text-3xl font-bold ${isWinner ? 'text-emerald-600' : 'text-gray-500'}`}>{dayData.recommendedCount}</span>
                      <span className="text-gray-500 text-sm block">palestras técnicas</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">O que você vai encontrar:</p>
                    <ul className="space-y-2">
                      {dayData.talks.map(talk => (
                        <li key={talk.id} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {talk.tags.includes('Segurança') ? <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" /> : <Code2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                          <div>
                            <strong>{talk.title}</strong>
                            <div className="text-xs text-gray-500 mt-1">{talk.startTime} - {talk.endTime} • {talk.stage}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}