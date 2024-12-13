import React from "react";

export default function LoginPage() {
  return (
    <div className="flex  items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <div className="text-center text-lg mb-6">
          <h1>Log In</h1>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email "
              className="mt-1 block px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="Password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="email"
              placeholder="Enter password"
              className="mt-1 block px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
            />
          </div>
          <div className="mb-4">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Log In
            </button>
          </div>
          <p>
            Dont have an account?{" "}
            <a href="/signUp" className="text-blue-500 hover:underline">
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
