import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, RefreshCw, TrendingUp, ArrowLeftRight, Calculator, ArrowRight, X, Plus, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface HistoryEntry {
  amount: number;
  result: number;
  date: Date;
  id: number;
}

export default function CurrencyCard() {
  const [isInverse, setIsInverse] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);

  const fetchRate = async () => {
    const response = await fetch('https://api.nbp.pl/api/exchangerates/rates/A/EUR/last?format=json');
    if (!response.ok) {
      throw new Error('Błąd pobierania danych');
    }
    return response.json();
  };

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['eur-rate'],
    queryFn: fetchRate,
  });

  const rate = data?.rates?.[0]?.mid;

  const addToHistory = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || !rate) return;
    const newEntry: HistoryEntry = {
      amount: numAmount,
      result: numAmount * rate,
      date: new Date(),
      id: Date.now()
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 5));
    setAmount('');
  };

  if (error) {
    return (
      <div className="text-center p-8 space-y-4">
        <p className="text-red-500">Wystąpił problem z pobraniem kursu.</p>
        <Button onClick={() => refetch()} variant="outline">Spróbuj ponownie</Button>
      </div>
    );
  }

  const date = data?.rates?.[0]?.effectiveDate;

  const displayRate = isInverse && rate ? (1 / rate) : rate;
  const displayCode = isInverse ? "EUR" : "PLN";

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
             {isInverse ? "1 PLN =" : "1 EUR ="}
          </h2>
          <h1 className="text-3xl font-bold text-stone-900">
             {isInverse ? "Polski Złoty" : "Euro"}
          </h1>
        </div>
        <Button
            variant="outline"
            size="icon"
            onClick={() => setIsInverse(!isInverse)}
            className="rounded-full border-stone-200 hover:bg-stone-100"
        >
            <ArrowLeftRight className="w-4 h-4 text-stone-600" />
        </Button>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[240px] space-y-2 relative z-10">
          {isLoading ? (
            <div className="space-y-4 w-full flex flex-col items-center">
               <Skeleton className="h-16 w-48 bg-white/20" />
               <Skeleton className="h-4 w-32 bg-white/20" />
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-baseline space-x-2"
              >
                <span className="text-6xl font-bold tracking-tighter">
                  {displayRate?.toFixed(4)}
                </span>
                <span className="text-xl font-medium text-indigo-200">{displayCode}</span>
              </motion.div>
              <p className="text-sm text-indigo-200 font-light">
                Kurs średni NBP z dnia {date}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 space-y-4">
        <div className="flex items-center gap-2 text-stone-500 mb-2">
          <Calculator className="w-4 h-4" />
          <span className="text-sm font-medium uppercase tracking-wide">Kalkulator</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 space-y-1 min-w-[140px]">
            <label className="text-xs text-stone-400 font-medium ml-1">Kwota EUR</label>
            <div className="relative">
              <Input 
                type="number" 
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-bold h-12 pl-3 pr-20 bg-stone-50 border-stone-200 focus-visible:ring-indigo-500 w-full"
              />
              <div className="absolute right-3 top-0 h-full flex items-center gap-1">
                  {amount && (
                    <button 
                        onClick={() => setAmount('')}
                        className="p-1 rounded-full hover:bg-stone-200 text-stone-400 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-sm font-bold text-stone-400 w-6 text-center">€</span>
              </div>
            </div>
          </div>
          
          <ArrowRight className="w-5 h-5 text-stone-300 mt-6" />
          
          <div className="flex-1 space-y-2 min-w-[140px]">
            <label className="text-xs text-stone-400 font-medium ml-1">Wynik PLN</label>
            <div className="h-20 bg-indigo-600 rounded-2xl shadow-inner flex items-center px-4 justify-between relative overflow-hidden ring-4 ring-indigo-50 transition-all">
               <span className="text-4xl font-black text-white truncate pr-10 tracking-tight">
                 {amount && rate ? (parseFloat(amount) * rate).toFixed(2) : '0.00'}
               </span>
               <span className="text-xl font-bold text-indigo-200 absolute right-4">PLN</span>
            </div>
          </div>
          
          <Button 
            onClick={addToHistory}
            disabled={!amount}
            size="icon"
            className="mt-6 h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {history.length > 0 && (
            <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2 text-stone-400 mb-3">
                    <History className="w-3 h-3" />
                    <span className="text-xs font-medium uppercase">Ostatnie obliczenia</span>
                </div>
                <div className="space-y-2">
                    {history.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center text-sm bg-stone-50 p-2 rounded-lg">
                            <span className="font-medium text-stone-600">{entry.amount} €</span>
                            <ArrowRight className="w-3 h-3 text-stone-300" />
                            <span className="font-bold text-indigo-600">{entry.result.toFixed(2)} PLN</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <Button 
          onClick={() => refetch()} 
          disabled={isLoading || isRefetching}
          variant="ghost"
          className="text-stone-400 hover:text-stone-600 hover:bg-transparent"
        >
          {(isLoading || isRefetching) ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Odśwież dane
        </Button>
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
            <span className="text-stone-400 text-xs mb-1">Kupno (symulacja)</span>
            <span className="text-lg font-semibold text-stone-700">
                {rate ? (rate * 1.02).toFixed(4) : '-'}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
            <span className="text-stone-400 text-xs mb-1">Sprzedaż (symulacja)</span>
            <span className="text-lg font-semibold text-stone-700">
                 {rate ? (rate * 0.98).toFixed(4) : '-'}
            </span>
          </div>
      </div> */}
    </div>
  );
}