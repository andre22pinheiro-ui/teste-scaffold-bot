import React, { useState, useEffect } from "react";
import { 
  Plus, Search, CheckCircle2, Clock, AlertCircle, 
  Trash2, Filter, Share2, Sparkles, Smartphone, Layers
} from "lucide-react";

interface Item {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  category: string;
  createdAt: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem("teste-scaffold-bot_items");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "1",
        title: "Registo Inicial",
        description: "Configuração inicial da aplicação gerada autonomamente pelo Bot.",
        status: "completed",
        category: "Sistema",
        createdAt: new Date().toLocaleDateString("pt-PT")
      },
      {
        id: "2",
        title: "Análise de Requisitos",
        description: "Teste de deploy no Vercel",
        status: "in_progress",
        category: "Planeamento",
        createdAt: new Date().toLocaleDateString("pt-PT")
      }
    ];
  });

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Geral");

  useEffect(() => {
    localStorage.setItem("teste-scaffold-bot_items", JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: Item = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim() || "Sem descrição detalhada.",
      status: "pending",
      category: newCategory,
      createdAt: new Date().toLocaleDateString("pt-PT")
    };

    setItems([newItem, ...items]);
    setNewTitle("");
    setNewDesc("");
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const nextStatus = item.status === "completed" ? "pending" : "completed";
      return { ...item, status: nextStatus };
    }));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const total = items.length;
  const completed = items.filter(i => i.status === "completed").length;
  const pending = items.filter(i => i.status !== "completed").length;
  const progressPercent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/50 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Teste Scaffold Bot</h1>
              <p className="text-xs text-indigo-100 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> Web & Mobile App • André Pinheiro
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-3 py-2 rounded-xl text-sm shadow transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Registo</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center sm:items-start">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total</span>
            <span className="text-2xl font-black text-slate-800 mt-1">{total}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center sm:items-start">
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Pendentes</span>
            <span className="text-2xl font-black text-amber-600 mt-1">{pending}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center sm:items-start">
            <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Concluídos</span>
            <span className="text-2xl font-black text-emerald-600 mt-1">{progressPercent}%</span>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-950 flex flex-col gap-1">
          <span className="font-semibold text-indigo-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Prompt de Criação
          </span>
          <p className="text-slate-700 italic">"Teste de deploy no Vercel"</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar registos ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-medium text-slate-600">
            {["all", "pending", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filter === tab ? "bg-white text-indigo-600 shadow-sm font-bold" : "hover:text-slate-900"
                }`}
              >
                {tab === "all" ? "Todos" : tab === "pending" ? "Pendentes" : "Concluídos"}
              </button>
            ))}
          </div>
        </div>

        {/* List of Items */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300 text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold">Nenhum registo encontrado</p>
              <p className="text-xs">Clica em "Novo Registo" para adicionares o primeiro elemento.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition flex items-start justify-between gap-3"
              >
                <button
                  onClick={() => toggleStatus(item.id)}
                  className="mt-0.5 text-slate-300 hover:text-emerald-500 transition"
                >
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-emerald-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-base font-semibold leading-tight ${
                        item.status === "completed" ? "line-through text-slate-400" : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{item.createdAt}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal for New Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Criar Novo Registo</h2>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Título</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Tarefa / Cliente / Obra..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Categoria</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex: Geral, Finanças, Obras..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Descrição / Notas</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalhes adicionais..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
