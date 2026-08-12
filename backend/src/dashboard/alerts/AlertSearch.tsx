export default function AlertSearch({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search alerts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded px-3 py-2 w-full"
    />
  );
}
