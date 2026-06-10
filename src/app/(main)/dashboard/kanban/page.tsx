import { initialBoard } from "./_components/data";
import { Kanban } from "./_components/kanban";

export default function Page() {
  return (
    <div data-content-padding="false">
      <Kanban initialBoard={initialBoard} />
    </div>
  );
}
