import { Sidebar } from "@/components/sidebar";
import { TasksSection } from "@/components/tasks-section";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { RewardNotification } from "@/components/reward-notification";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:flex-row">
        <TasksSection />
        <PomodoroTimer />
      </main>
      <RewardNotification />
    </div>
  );
}
