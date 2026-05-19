import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Row, Select, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import type { IPartner } from "@/types/IPartner.type";
import {
    entityPage,
    getUfName,
    normalizePartnerUfs,
    useListEntity,
    useUpdateEntity,
} from "./config-page.const";
import { PriorityTable, type PriorityRow } from "./components/table";
import type { IPartnerPriorityClientType } from "@/types/IPartnerPriority.type";

type AppliedFilters = {
    companyId: number;
    category: string;
};

type PriorityKey = `${IPartnerPriorityClientType}|${string}`;
type PrioritySelectionByType = Record<PriorityKey, Record<string, number | undefined>>;

function makeKey(clientType: IPartnerPriorityClientType, category: string): PriorityKey {
    return `${clientType}|${category}`;
}

export function PrioritiesPage() {
    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(null);
    const [overrides, setOverrides] = useState<PrioritySelectionByType>({} as PrioritySelectionByType);

    const { data: companiesData, isLoading: isCompaniesLoading } = useCompanyQuery();

    const { data: partnersData, isLoading: isPartnersLoading } = useQuery({
        queryKey: [dictionaryQueryClient.partners.key, "priority-screen"],
        queryFn: () => dictionaryQueryClient.partners.service.getAll(),
        retry: 2,
    });

    const updateMutation = useUpdateEntity();

    const { data: prioritiesData, isLoading: isPrioritiesLoading } = useListEntity(
        appliedFilters
            ? {
                company_id: appliedFilters.companyId,
                category: appliedFilters.category,
            }
            : undefined,
        { enabled: !!appliedFilters },
    );

    const categoryOptions = useMemo(() => {
        if (!companyId) return [];

        const partners = (partnersData?.partners ?? []).filter(
            (partner) => partner.company_id === companyId,
        );

        const categories = new Set<string>();
        partners.forEach((partner) => {
            (partner.category ?? []).forEach((cat: string) => categories.add(cat));
        });

        return Array.from(categories).sort().map((cat) => ({
            label: cat,
            value: cat,
        }));
    }, [companyId, partnersData]);

    const selectedPriorityByType = useMemo(() => {
        if (!appliedFilters) return { PF: {}, PJ: {} } as Record<IPartnerPriorityClientType, Record<string, number | undefined>>;

        const pfKey = makeKey("PF", appliedFilters.category);
        const pjKey = makeKey("PJ", appliedFilters.category);

        const fromApi: Record<IPartnerPriorityClientType, Record<string, number | undefined>> = {
            PF: {},
            PJ: {},
        };

        (prioritiesData ?? []).forEach((priority) => {
            if (priority.category === appliedFilters.category) {
                fromApi[priority.client_type][priority.uf] = priority.partner_id;
            }
        });

        return {
            PF: { ...fromApi.PF, ...(overrides[pfKey] ?? {}) },
            PJ: { ...fromApi.PJ, ...(overrides[pjKey] ?? {}) },
        };
    }, [prioritiesData, overrides, appliedFilters]);

    const companyOptions = useMemo(
        () =>
            companiesData?.companies.map((company) => ({
                label: company.company_name,
                value: company.company_id,
            })) ?? [],
        [companiesData],
    );

    const rows = useMemo<PriorityRow[]>(() => {
        if (!appliedFilters) return [];

        const partners = (partnersData?.partners ?? []).filter(
            (partner) =>
                partner.company_id === appliedFilters.companyId &&
                (partner.category ?? []).includes(appliedFilters.category),
        );

        const partnersByUf = new Map<string, IPartner[]>();

        partners.forEach((partner) => {
            normalizePartnerUfs(partner).forEach((uf) => {
                const currentPartners = partnersByUf.get(uf) ?? [];
                currentPartners.push(partner);
                partnersByUf.set(uf, currentPartners);
            });
        });

        const uniqueUfs = Array.from(partnersByUf.keys()).sort((a, b) => a.localeCompare(b));

        return uniqueUfs.map((uf) => {
            const partnersInUf = partnersByUf.get(uf) ?? [];

            const partnerOptionsPf = partnersInUf
                .filter((partner) => partner.client_type.includes("PF"))
                .map((partner) => ({
                    label: partner.partner_name,
                    value: partner.partner_id,
                }));

            const partnerOptionsPj = partnersInUf
                .filter((partner) => partner.client_type.includes("PJ"))
                .map((partner) => ({
                    label: partner.partner_name,
                    value: partner.partner_id,
                }));

            return {
                uf,
                stateName: getUfName(uf),
                partnerOptionsPf,
                partnerOptionsPj,
            };
        });
    }, [appliedFilters, partnersData]);

    function handleSearch() {
        if (!companyId || !category) return;

        setAppliedFilters({ companyId, category });
        setOverrides({} as PrioritySelectionByType);
    }

    function handleChangePriority(
        uf: string,
        clientType: IPartnerPriorityClientType,
        partnerId: number | undefined,
    ) {
        if (!appliedFilters) return;

        const key = makeKey(clientType, appliedFilters.category);

        setOverrides((prev) => ({
            ...prev,
            [key]: {
                ...(prev[key] ?? {}),
                [uf]: partnerId,
            },
        }));
    }

    function handleSave() {
        if (!appliedFilters) return;

        (["PF", "PJ"] as IPartnerPriorityClientType[]).forEach((clientType) => {
            const priorities = selectedPriorityByType[clientType];
            Object.entries(priorities).forEach(([uf, partnerId]) => {
                if (partnerId !== undefined) {
                    updateMutation.mutate({
                        company_id: appliedFilters.companyId,
                        partner_id: partnerId,
                        uf,
                        category: appliedFilters.category,
                        client_type: clientType,
                    });
                }
            });
        });
    }

    function handleChangeCompany(value: number | undefined) {
        setCompanyId(value);
        setCategory(undefined);
    }

    const isLoading = isCompaniesLoading || isPartnersLoading || isPrioritiesLoading;

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                    <Typography.Title level={3} style={{ marginBottom: 4 }}>
                        {entityPage.name}
                    </Typography.Title>
                </div>

                <Row gutter={16} align="bottom">
                    <Col>
                        <Typography.Text strong>Empresa</Typography.Text>
                        <Select
                            allowClear
                            placeholder="Selecione a empresa"
                            style={{ width: "100%", marginTop: 8 }}
                            options={companyOptions}
                            value={companyId}
                            onChange={handleChangeCompany}
                        />
                    </Col>
                    <Col>
                        <Typography.Text strong>Categoria</Typography.Text>
                        <Select
                            allowClear
                            placeholder="Selecione a categoria"
                            style={{ width: "100%", marginTop: 8 }}
                            options={categoryOptions}
                            value={category}
                            onChange={setCategory}
                            disabled={!companyId || categoryOptions.length === 0}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            block
                            disabled={!companyId || !category}
                            onClick={handleSearch}
                        >
                            Buscar Estados
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="default"
                            block
                            disabled={!appliedFilters || updateMutation.isPending}
                            loading={updateMutation.isPending}
                            onClick={handleSave}
                        >
                            Salvar Prioridades
                        </Button>
                    </Col>
                </Row>

                <div className="flex overflow-y-auto">
                    <PriorityTable
                        rows={rows}
                        isLoading={isLoading}
                        selectedByType={selectedPriorityByType}
                        onChangePriority={handleChangePriority}
                    />
                </div>
            </Space>
        </div>
    );
}