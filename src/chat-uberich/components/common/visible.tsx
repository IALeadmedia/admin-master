interface Props {
  children: React.ReactNode;
  when: boolean;
  asDiv?: boolean;
}

export function Visible({ when, children, asDiv }: Props) {
  if (!when) return asDiv ? <div /> : null;
  return children;
}
