import { useQuery } from "@tanstack/react-query";
import { LocationsService } from "@/services/locations.service";

export function useUFs() {
  return useQuery({
    queryKey: ["locations", "ufs"],
    queryFn: () => LocationsService.getUFs(),
    staleTime: Infinity,
  });
}

export function useCities(uf: string | null) {
  return useQuery({
    queryKey: ["locations", "cities", uf],
    queryFn: () => LocationsService.getCitiesByUF(uf!),
    enabled: !!uf,
    staleTime: 1000 * 60 * 10,
  });
}
