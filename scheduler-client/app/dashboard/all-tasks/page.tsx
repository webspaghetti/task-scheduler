import SharedTasksPage from "@/components/tasks/shared-tasks-page";
import { useAllTasksGrouped } from "@/hooks/useTasks";

export default function AllTasks() {
    return (
        <SharedTasksPage
            title="All tasks"
            description="A comprehensive list of all tasks across the platform."
            emptyTitle="No tasks exist"
            emptyDescription="There are no tasks created across any teams yet."
            useTasksHook={useAllTasksGrouped}
        />
    );
}