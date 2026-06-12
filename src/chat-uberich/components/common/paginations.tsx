import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

type PaginationProps = {
  itemsPerPage: number;
  changePage: (page: number) => void;
  changeItemsPerPage: (items: number) => void;
  currentPage: number;
  totalPages: number;
};

export function Pagination({
  itemsPerPage,
  changePage,
  changeItemsPerPage,
  currentPage,
  totalPages,
}: PaginationProps) {
  // const backPage = useCallback(() => {
  //   setCurrentPage((oldPage: number) => (oldPage > 1 ? oldPage - 1 : 1));
  // }, [setCurrentPage]);

  const backPage = () => {
    const canBack = currentPage >= 1;
    if (canBack) {
      changePage(currentPage - 1);
    }
  };

  const nextPage = () => {
    const canNext = currentPage < totalPages;
    if (canNext) {
      changePage(currentPage + 1);
    }
  };

  // const nextPage = useCallback(() => {
  //   setCurrentPage((oldPage: number) =>
  //     oldPage < totalPages ? oldPage + 1 : totalPages
  //   );
  // }, [setCurrentPage, totalPages]);

  return (
    <>
      {/* Paginação e seleção de quantidade de páginas */}
      <div className="flex items-center gap-4 justify-end mr-3 mt-4 text-[12px] ">
        <div className="flex items-center gap-1 text-muted-foreground">
          <label htmlFor="itemsPerPage" className="mr-2">
            Itens por página:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => changeItemsPerPage(Number(e.target.value))}
            className="bg-background  border p-1 rounded"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
        {/* Paginação */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={backPage}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={16} />
          </Button>
          <span className="text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            className="text-muted-foreground"
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
