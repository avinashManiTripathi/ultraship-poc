"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const testGetAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hello");
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testPostAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealthAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-16 px-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={150}
            height={30}
            priority
          />
          <h1 className="text-4xl font-bold text-center text-black dark:text-white">
            Ultraship POC
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Next.js + Express Backend on Same Port
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Test API Endpoints
          </h2>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={testGetAPI}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              Test GET /api/hello
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white"
              />
              <button
                onClick={testPostAPI}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                Test POST /api/hello
              </button>
            </div>

            <button
              onClick={testHealthAPI}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              Test GET /api/health
            </button>
          </div>

          {apiResponse && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                API Response:
              </h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto text-sm text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            ℹ️ Setup Info
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>✅ Frontend (Next.js) and Backend (Express) run on same port</li>
            <li>✅ Express handles /api/* routes before Next.js</li>
            <li>✅ Custom server in server.js</li>
            <li>✅ Run with: npm run dev</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
