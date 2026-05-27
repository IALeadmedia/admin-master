import { Select, Button, Tag, Spin } from "antd";
import { useState } from "react";
import { useUFs, useCities } from "@/hooks/useLocations";
import type { Coverage } from "@/types/IProduct.type";

// --- Row individual por UF ---
interface CoverageRowProps {
    uf: string;
    ufLabel: string;
    cities: string[];
    onCitiesChange: (cities: string[]) => void;
    onRemove: () => void;
}

function CoverageRow({ uf, ufLabel, cities, onCitiesChange, onRemove }: CoverageRowProps) {
    const [open, setOpen] = useState(false);

    const { data: cityOptions = [], isFetching } = useCities(open ? uf : null);

    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Tag color="blue" style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>
                    {ufLabel}
                </Tag>
                <Button type="text" danger size="small" onClick={onRemove}>
                    Remover
                </Button>
            </div>

            <Select
                mode="multiple"
                placeholder="Cidades específicas (opcional)"
                value={cities}
                onChange={onCitiesChange}
                onDropdownVisibleChange={setOpen}
                loading={isFetching}
                options={cityOptions.map((c) => ({ label: c.nome, value: c.nome }))} style={{ width: "100%" }}
                filterOption={(input, option) =>
                    String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={isFetching ? <Spin size="small" /> : "Nenhuma cidade encontrada"}
            />
        </div>
    );
}

// --- Campo principal ---
interface CoverageFieldProps {
    value?: Coverage[];
    onChange?: (value: Coverage[]) => void;
}

export function CoverageField({ value = [], onChange }: CoverageFieldProps) {
    const { data: ufOptions = [], isLoading: isLoadingUFs } = useUFs();

    const availableUFs = ufOptions.filter(
        (opt) => !value.find((c) => c.uf === opt.sigla)
    );

    function handleAddUF(uf: string) {
        onChange?.([...value, { uf, cities: [] }]);
    }

    function handleRemoveUF(uf: string) {
        onChange?.(value.filter((c) => c.uf !== uf));
    }

    function handleCitiesChange(uf: string, cities: string[]) {
        onChange?.(value.map((c) => (c.uf === uf ? { ...c, cities } : c)));
    }

    function getUFLabel(uf: string) {
        return ufOptions.find((opt) => opt.sigla === uf)?.nome ?? uf;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Select<string>
                placeholder="Adicionar UF de cobertura"
                loading={isLoadingUFs}
                options={availableUFs.map((u) => ({ label: u.nome, value: u.sigla }))}
                onSelect={(uf) => handleAddUF(uf)}
                value={undefined}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                    String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={isLoadingUFs ? <Spin size="small" /> : "Nenhum estado encontrado"}
            />

            {value.map(({ uf, cities }) => (
                <CoverageRow
                    key={uf}
                    uf={uf}
                    ufLabel={getUFLabel(uf)}
                    cities={cities}
                    onCitiesChange={(vals) => handleCitiesChange(uf, vals)}
                    onRemove={() => handleRemoveUF(uf)}
                />
            ))}
        </div>
    );
}