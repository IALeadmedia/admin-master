
const InputTypeTooltipContent = () => (
    <div style={{ fontSize: 12, maxWidth: 340, padding: "4px 0" }}>

        {/* checkbox */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: "0.5px solid rgba(0,0,0,0.12)" }}>
            <div style={{ flexShrink: 0, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 34, height: 18, background: "#1677ff", borderRadius: 9, position: "relative" }}>
                    <div style={{ position: "absolute", width: 14, height: 14, background: "#fff", borderRadius: "50%", top: 2, right: 2 }} />
                </div>
            </div>
            <div>
                <div><b>Switch</b></div>
                <div style={{ margin: "2px 0 0", color: "#555" }}>Opção única de ligar ou desligar (sim/não).</div>
                <div style={{ color: "#888", fontSize: 11 }}>Ex: Gravador virtual</div>
            </div>
        </div>

        {/* checkbox_group */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: "0.5px solid rgba(0,0,0,0.12)" }}>
            <div style={{ flexShrink: 0, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[true, false, true].map((checked, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                            <div style={{ width: 13, height: 13, border: `1.5px solid ${checked ? "#1677ff" : "#ccc"}`, borderRadius: 2, background: checked ? "#1677ff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><polyline points="1,3.5 3.5,6 8,1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <span>{["A", "B", "C"][i]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div><b>Grupo de Checkbox</b></div>
                <div style={{ margin: "2px 0 0", color: "#555" }}>Várias opções independentes.</div>
                <div style={{ color: "#888", fontSize: 11 }}>Ex: Canais individuais</div>
            </div>
        </div>

        {/* radio */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: "0.5px solid rgba(0,0,0,0.12)" }}>
            <div style={{ flexShrink: 0, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {["Básico", "Plus"].map((label, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                            <div style={{ width: 13, height: 13, borderRadius: "50%", border: `1.5px solid ${i === 0 ? "#1677ff" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {i === 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1677ff" }} />}
                            </div>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div><b>Radio</b></div>
                <div style={{ margin: "2px 0 0", color: "#555" }}>Apenas uma opção pode ser escolhida.</div>
                <div style={{ color: "#888", fontSize: 11 }}>Ex:Pacote</div>
            </div>
        </div>

        {/* select */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0" }}>
            <div style={{ flexShrink: 0, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 90, height: 22, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px", fontSize: 11, color: "inherit", background: "rgba(255,255,255,0.08)" }}>
                    <span>1 ponto</span>
                    <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
                </div>
            </div>
            <div>
                <div><b>Select</b></div>
                <div style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.65)" }}>Uma opção escolhida em uma lista suspensa.</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>Ex: Quantidade de pontos adicionais</div>
            </div>
        </div>

    </div>
);

export default InputTypeTooltipContent;