import {
    createContext,
    useContext,
    useState,
    type JSX,
} from "react";

interface IAdminScopeContext {
    selectedSegmentId: string | undefined;
    selectedCompanyId: number | undefined;
    selectedPartnerId: number | undefined;
    setSelectedSegmentId: (id: string | undefined) => void;
    setSelectedCompanyId: (id: number | undefined) => void;
    setSelectedPartnerId: (id: number | undefined) => void;
}

const AdminScopeContext = createContext<IAdminScopeContext | null>(null);

export function AdminScopeProvider({ children }: { children: JSX.Element }) {
    const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>(undefined);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined);
    const [selectedPartnerId, setSelectedPartnerId] = useState<number | undefined>(undefined);

    function handleSetSegmentId(id: string | undefined) {
        setSelectedSegmentId(id);
        setSelectedCompanyId(undefined);
        setSelectedPartnerId(undefined);
    }

    function handleSetCompanyId(id: number | undefined) {
        setSelectedCompanyId(id);
        setSelectedPartnerId(undefined);
    }

    return (
        <AdminScopeContext.Provider
            value={{
                selectedSegmentId,
                selectedCompanyId,
                selectedPartnerId,
                setSelectedSegmentId: handleSetSegmentId,
                setSelectedCompanyId: handleSetCompanyId,
                setSelectedPartnerId,
            }}
        >
            {children}
        </AdminScopeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminScope() {
    const context = useContext(AdminScopeContext);
    if (!context) throw new Error("useAdminScope must be used within an AdminScopeProvider");
    return context;
}
