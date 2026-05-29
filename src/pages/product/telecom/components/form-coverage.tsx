import { Button, Divider, Select, Spin, Tooltip } from "antd";
import { useState } from "react";
import { useCities, useUFs } from "@/hooks/useLocations";
import type { Coverage } from "@/types/IProduct.type";

interface CoverageFieldProps {
    value?: Coverage[];
    onChange?: (value: Coverage[]) => void;
}

export function CoverageField({ value = [], onChange }: CoverageFieldProps) {
    const normalizedValue = Array.isArray(value) ? value : [];
    const { data: ufOptions = [], isLoading: isLoadingUFs } = useUFs();
    const [editingUF, setEditingUF] = useState<string | null>(null);
    const [ufDropdownOpen, setUfDropdownOpen] = useState(false);

    const selectedSiglasSet = new Set(normalizedValue.map((coverage) => coverage?.uf));
    const availableUFs = ufOptions.filter((option) => !selectedSiglasSet.has(option.sigla));
    const allUFsSelected = ufOptions?.length > 0 && availableUFs?.length === 0;

    function handleAddUF(uf: string) {
        onChange?.([...normalizedValue, { uf, cities: [] }]);
    }

    function handleToggleAllUFs() {
        if (allUFsSelected) {
            onChange?.([]);
            setEditingUF(null);
            return;
        }

        const current = new Set(normalizedValue.map((coverage) => coverage.uf));
        const toAdd = ufOptions
            .filter((uf) => !current.has(uf.sigla))
            .map((uf) => ({ uf: uf.sigla, cities: [] }));

        onChange?.([...normalizedValue, ...toAdd]);
    }

    function handleRemoveUF(uf: string) {
        onChange?.(normalizedValue.filter((coverage) => coverage.uf !== uf));
        if (editingUF === uf) setEditingUF(null);
    }

    function handleCitiesChange(uf: string, cities: string[]) {
        onChange?.(normalizedValue.map((coverage) => (coverage.uf === uf ? { ...coverage, cities } : coverage)));
    }

    const editingEntry = normalizedValue.find((coverage) => coverage?.uf === editingUF);

    function getCoverageLabel(cities: string[]) {
        if (cities?.length === 0) return "Todas";
        return `${cities?.length} cidade${cities?.length > 1 ? "s" : ""}`;
    }

    function getCitiesTooltip(cities: string[]) {
        if (cities?.length === 0) return "Todas as cidades deste estado";
        return cities.join(", ");
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <div style={{ flex: "0 1 240px", minWidth: 220 }}>
                    <Select<string>
                        mode="multiple"
                        placeholder="Adicionar estado de cobertura..."
                        loading={isLoadingUFs}
                        options={availableUFs.map((uf) => ({ label: uf.sigla, value: uf.sigla }))}
                        onSelect={handleAddUF}
                        open={ufDropdownOpen}
                        onDropdownVisibleChange={setUfDropdownOpen}
                        value={undefined}
                        maxTagCount={0}
                        maxTagPlaceholder={() => null}
                        style={{ width: "100%" }}
                        showSearch
                        filterOption={(input, option) => String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                        notFoundContent={isLoadingUFs ? <Spin size="small" /> : "Nenhum estado encontrado"}
                        dropdownRender={(menu) => (
                            <>
                                <div style={{ padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                                        {normalizedValue.length > 0 ? `${normalizedValue.length} selecionado${normalizedValue.length > 1 ? "s" : ""}` : "Nenhum selecionado"}
                                    </span>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={handleToggleAllUFs}
                                        disabled={isLoadingUFs}
                                        style={{ padding: 0, fontSize: 12 }}
                                    >
                                        {allUFsSelected ? "Desmarcar todos" : "Selecionar todos"}
                                    </Button>
                                </div>
                                <Divider style={{ margin: 0 }} />
                                {menu}
                            </>
                        )}
                    />
                </div>

                {normalizedValue.map(({ uf, cities }) => {
                    const hasSpecificCities = cities?.length > 0;
                    const isEditing = editingUF === uf;

                    return (
                        <Tooltip key={uf} title={getCitiesTooltip(cities)} mouseEnterDelay={0.35}>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "4px 6px 4px 10px",
                                    borderRadius: 999,
                                    border: `1px solid ${isEditing ? "#93c5fd" : hasSpecificCities ? "#bbf7d0" : "#bfdbfe"}`,
                                    background: isEditing ? "#eff6ff" : hasSpecificCities ? "#f0fdf4" : "#eff6ff",
                                }}
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    onClick={() => setEditingUF(isEditing ? null : uf)}
                                    style={{ padding: 0, height: 22, display: "inline-flex", alignItems: "center", gap: 6 }}
                                >
                                    <strong style={{ fontSize: 13, color: "#111827" }}>{uf}</strong>
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "1px 8px",
                                            borderRadius: 999,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: hasSpecificCities ? "#dcfce7" : "#dbeafe",
                                            color: hasSpecificCities ? "#166534" : "#1d4ed8",
                                        }}
                                    >
                                        {getCoverageLabel(cities)}
                                    </span>
                                </Button>

                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleRemoveUF(uf);
                                    }}
                                    style={{ padding: 0, width: 20, height: 20, minWidth: 20, lineHeight: "20px" }}
                                >
                                    ×
                                </Button>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            {editingUF && editingEntry && (
                <CitySelect
                    uf={editingUF}
                    cities={editingEntry.cities}
                    onChange={(cities) => handleCitiesChange(editingUF, cities)}
                />
            )}
        </div>
    );
}

function CitySelect({ uf, cities, onChange }: { uf: string; cities: string[]; onChange: (c: string[]) => void }) {
    const [open, setOpen] = useState(false);
    const normalizedCities = Array.isArray(cities) ? cities : [];
    const { data: cityOptions = [], isFetching } = useCities(open || normalizedCities.length > 0 ? uf : null);

    const allCityNames = cityOptions.map((city) => city.nome);
    const allSelected = allCityNames?.length > 0 && allCityNames.every((name) => normalizedCities.includes(name));

    function handleToggleAll() {
        onChange(allSelected ? [] : allCityNames);
    }

    return (
        <div style={{ border: "1px solid #dbeafe", borderRadius: 10, padding: 10, background: "#f8fbff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}>{uf} - escolher cidades específicas</div>

            </div>

            <Select
                mode="multiple"
                placeholder="Selecione cidades..."
                value={normalizedCities}
                onChange={onChange}
                onDropdownVisibleChange={setOpen}
                loading={isFetching}
                options={allCityNames.map((name) => ({ label: name, value: name }))}
                style={{ width: "100%" }}
                filterOption={(input, option) => String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                notFoundContent={isFetching ? <Spin size="small" /> : "Nenhuma cidade encontrada"}
                dropdownRender={(menu) => (
                    <>
                        <div style={{ padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: "#6b7280" }}>
                                {normalizedCities.length > 0 ? `${normalizedCities.length} selecionada${normalizedCities.length > 1 ? "s" : ""}` : "Nenhuma selecionada"}
                            </span>
                            <Button
                                type="link"
                                size="small"
                                onClick={handleToggleAll}
                                disabled={isFetching}
                                style={{ padding: 0, fontSize: 12 }}
                            >
                                {allSelected ? "Desmarcar todas" : "Selecionar todas"}
                            </Button>
                        </div>
                        <Divider style={{ margin: 0 }} />
                        {menu}
                    </>
                )}
            />
        </div>
    );
}