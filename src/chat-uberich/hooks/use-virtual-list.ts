import { useState, useMemo, useCallback, useEffect, useRef } from "react";

interface UseVirtualListOptions {
  itemsPerPage?: number;
  initialPage?: number;
  autoLoad?: boolean; // Carrega automaticamente quando chega no final
}

export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions = {}
) {
  const { itemsPerPage = 50, initialPage = 1, autoLoad = true } = options;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Ref para controlar o container de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref para detectar mudanças significativas na ordem dos itens
  const itemsHashRef = useRef<string>("");
  
  // Calcular estatísticas
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calcular hash dos primeiros itens para detectar reordenação
  const currentItemsHash = useMemo(() => {
    const firstItems = items.slice(0, 10).map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item);
      }
      return String(item);
    });
    return firstItems.join(',');
  }, [items]);
  
  // Detectar mudanças significativas na ordem e resetar se necessário
  useEffect(() => {
    if (itemsHashRef.current && itemsHashRef.current !== currentItemsHash) {
      // A ordem mudou significativamente, reseta para a primeira página
      if (currentPage > 1) {
        setCurrentPage(1);
      }
    }
    itemsHashRef.current = currentItemsHash;
  }, [currentItemsHash, currentPage]);
  
  // Calcular items visíveis (cumulativo - mostra todos até a página atual)
  const visibleItems = useMemo(() => {
    const endIndex = currentPage * itemsPerPage;
    return items.slice(0, endIndex);
  }, [items, currentPage, itemsPerPage]);
  
  // Função para carregar mais itens
  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simula um pequeno delay para UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 200);
    }
  }, [currentPage, totalPages, isLoadingMore]);
  
  // Handler para detectar scroll próximo ao final
  const handleScroll = useCallback((e: Event) => {
    if (!autoLoad) return;
    
    const container = e.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Detecta quando está próximo do final (90% do scroll)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight * 0.9;
    
    if (isNearBottom && currentPage < totalPages && !isLoadingMore) {
      loadMore();
    }
  }, [autoLoad, currentPage, totalPages, isLoadingMore, loadMore]);
  
  // Adiciona listener de scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && autoLoad) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, autoLoad]);
  
  // Funções de navegação tradicionais (para casos específicos)
  const goToPage = useCallback((page: number) => {
    const safePage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(safePage);
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  // Reset para primeira página quando items mudam drasticamente
  const resetToFirst = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  return {
    // Items
    visibleItems,
    totalItems,
    loadedItems: visibleItems.length,
    
    // Paginação
    currentPage,
    totalPages,
    itemsPerPage,
    
    // Estados de loading
    isLoadingMore,
    hasMoreToLoad: currentPage < totalPages,
    
    // Controles
    loadMore,
    goToPage,
    nextPage,
    prevPage,
    resetToFirst,
    
    // Ref para o container
    scrollContainerRef,
    
    // Estados legados (mantidos para compatibilidade)
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    
    // Informações de range
    startIndex: 1,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
  };
}
