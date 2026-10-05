export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg">
      <nav className="p-4 space-y-4">
        <NavItem href="/owners" label="Owners" />
        <NavItem href="/documents" label="Documents" />
        <NavItem href="/checks" label="Checks" />
        <NavItem href="/risk" label="Risk" />
        <NavItem href="/pricing" label="Pricing" />
        <NavItem href="/pipeline" label="Pipeline" />
      </nav>
    </aside>
  );
}
