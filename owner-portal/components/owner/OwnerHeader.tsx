export default function OwnerHeader({ owner }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold text-white">{owner.name}</h2>
      <p className="text-gray-400 mt-1">Owner ID: {owner.id}</p>
    </div>
  );
}
