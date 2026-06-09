import { initialBoard } from "./_components/data";
import { Kanban } from "./_components/kanban";

export default function Page() {
  return <Kanban initialBoard={initialBoard} />;
}
