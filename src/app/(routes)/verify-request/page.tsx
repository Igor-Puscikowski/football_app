export default function VerifyRequest() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-center text-2xl font-bold mb-6">
          Check Your Email
        </h1>
        <p className="text-center">
          We sent a verification link to your email. Click it to verify your
          account.
        </p>
      </div>
    </div>
  );
}
