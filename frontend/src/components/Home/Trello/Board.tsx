import { Grid, Divider } from "@mantine/core";
import Column from "./Column";

const privateColumns = [
  {
    id: 1,
    title: "To Do List",
    status: "TO_DO_LIST",
    isPublic: false,
  },
  { id: 2, title: "In Progress", status: "IN_PROGRESS", isPublic: false },
  { id: 3, title: "Done", status: "DONE", isPublic: false },
  { id: 4, title: "Cancel", status: "CANCEL", isPublic: false },
];

const publicColumns = [
  {
    id: 5,
    title: "To List",
    status: "TO_DO_LIST",
    isPublic: true,
  },
  { id: 6, title: "In Progress", status: "IN_PROGRESS", isPublic: true },
  { id: 7, title: "Done", status: "DONE", isPublic: true },
  { id: 8, title: "Cancel", status: "CANCEL", isPublic: true },
];

function Board() {
  return (
    <div>
      <div className="text-[20px] mb-7 border w-32 h-11 flex items-center justify-center bg-white font-bold  rounded-md">
        Your Task
      </div>
      <Grid columns={12}>
        {privateColumns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            isPublic={column.isPublic}
            status={column.status}
          />
        ))}
      </Grid>
      <Divider my="xl" />

      <div className="text-[20px] mb-7 border w-32 h-11 flex items-center justify-center bg-white font-bold rounded-md">
        Team Task
      </div>
      <Grid columns={12}>
        {publicColumns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            isPublic={column.isPublic}
            status={column.status}
          />
        ))}
      </Grid>
    </div>
  );
}

export default Board;
