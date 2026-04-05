import SharedTasksPage from "@/components/tasks/shared-tasks-page";
import { useMyTasksGrouped } from "@/hooks/useTasks";

export default function MyTasks() {
    return (
        <SharedTasksPage
            title="My tasks"
            description="Tasks that are currently assigned directly to you."
            emptyTitle="No tasks assigned"
            emptyDescription="You have no tasks assigned yet, or you're not a member of any team."
            useTasksHook={useMyTasksGrouped}
        />
    );
}