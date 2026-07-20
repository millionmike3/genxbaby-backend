"use client";

export default function QuickActionsDock({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={`
        fixed left-0 top-1/2 -translate-y-1/2 z-50
        transition-all duration-300
        ${collapsed ? "ml-24" : "ml-72"}
      `}
    >
      {/* Outer animated border */}
      <div className="p-[2px] rounded-2xl animate-gradientBorder">
        {/* Inner frosted panel */}
        <div className="
          bg-white/20 dark:bg-gray-900/30
          backdrop-blur-xl
          rounded-2xl
          shadow-xl
          flex flex-col space-y-4 p-4
        ">
          {[
            { icon: "add", label: "New Borrower" },
            { icon: "person_add", label: "New Investor" },
            { icon: "home", label: "New Property" },
            { icon: "attach_money", label: "New Deal" },
            { icon: "qr_code_scanner", label: "Scan" },
            { icon: "chat", label: "Chat" },
          ].map((item, i) => (
            <button
              key={i}
              className="
                w-12 h-12 flex items-center justify-center
                bg-black/40 dark:bg-gray-800/40
                rounded-xl text-white
                hover:scale-110 hover:-translate-y-1
                transition-all duration-300
                shadow-[0_0_12px_rgba(0,200,255,0.4)]
                hover:shadow-[0_0_18px_rgba(0,200,255,0.8)]
              "
              title={item.label}
            >
              <span className="material-icons text-2xl">{item.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
