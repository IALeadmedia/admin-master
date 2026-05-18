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
};

type PrioritySelectionByType = Record<IPartnerPriorityClientType, Record<string, number | undefined>>;

export function PrioritiesPage() {
    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(null);
    const [overridesByType, setOverridesByType] = useState<PrioritySelectionByType>({
        PF: {},
        PJ: {},
    });

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
            }
            : undefined,
        { enabled: !!appliedFilters },
    );

    const selectedPriorityByType = useMemo<PrioritySelectionByType>(() => {
        const fromApi: PrioritySelectionByType = {
            PF: {},
            PJ: {},
        };

        (prioritiesData ?? []).forEach((priority) => {
            fromApi[priority.client_type][priority.uf] = priority.partner_id;
        });

        return {
            PF: { ...fromApi.PF, ...overridesByType.PF },
            PJ: { ...fromApi.PJ, ...overridesByType.PJ },
        };
    }, [prioritiesData, overridesByType]);

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
            (partner) => partner.company_id === appliedFilters.companyId,
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
        if (!companyId)
            return;

        setAppliedFilters({ companyId });
        setOverridesByType({ PF: {}, PJ: {} });
    }

    function handleChangePriority(
        uf: string,
        clientType: IPartnerPriorityClientType,
        partnerId: number | undefined,
    ) {
        setOverridesByType((prev) => ({
            ...prev,
            [clientType]: {
                ...prev[clientType],
                [uf]: partnerId,
            },
        }));
    }

    function handleSave() {
        Object.entries(selectedPriorityByType).forEach(([clientType, priorities]) => {
            Object.entries(priorities).forEach(([uf, partnerId]) => {
                if (partnerId !== undefined) {
                    updateMutation.mutate({
                        company_id: appliedFilters!.companyId,
                        partner_id: partnerId,
                        uf,
                        client_type: clientType as IPartnerPriorityClientType,
                    });
                }
            });
        });
    }

    const isLoading = isCompaniesLoading || isPartnersLoading || isPrioritiesLoading;

    return (
        <div className="py-6 min-h-[calc(100vh-160px)]">
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                    <Typography.Title level={3} style={{ marginBottom: 4 }}>
                        {entityPage.plural}
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
                            onChange={setCompanyId}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            block
                            disabled={!companyId}
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
