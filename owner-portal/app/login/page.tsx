import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] text-gray-200">
      <div className="bg-gray-900 p-10 rounded-xl border border-gray-800 shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Owner Portal Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
