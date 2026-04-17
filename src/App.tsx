import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LevelSelectPage } from "./pages/LevelSelectPage";
import { GamePage } from "./pages/GamePage";
import { ProgressPage } from "./pages/ProgressPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useGame } from "./context/GameContext";

export default function App() {
  const { session } = useGame();

  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50 px-4">
        <div className="rounded-[2rem] bg-white px-8 py-10 text-center shadow-lg">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" aria-hidden="true" />
          <p className="mt-4 text-lg font-bold text-slate-900">Loading Treasure Trails...</p>
          <p className="mt-2 text-sm text-slate-600">Preparing your maze, medals, and saved progress.</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/levels" element={<LevelSelectPage />} />
      <Route path="/play/:levelId" element={<GamePage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
