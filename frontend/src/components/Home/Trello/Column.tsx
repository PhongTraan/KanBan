import { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { PiExclamationMarkFill } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { FaTasks } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import Card from "./Card";
import AddCard from "./AddCard";
import TaskService from "../../../service/TaskService";
import { useDisclosure } from "@mantine/hooks";
import { SortableContext } from "@dnd-kit/sortable";
import { Task } from "../../../data/Task";
import { useSearchStore } from "../../../main";
import EditCard from "./EditCard";

type ColumnProps = {
  id: number;
  title: string;
  isPublic: boolean;
  status: string;
};

const Column = ({ id, title, isPublic, status }: ColumnProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { searchString } = useSearchStore((state) => ({
    searchString: state.searchString,
    setSearchString: state.setSearchString,
  }));

  const token = localStorage.getItem("authToken");

  if (!token) {
    return null;
  }

  const { data: tasksData } = TaskService.searchTaskAndGetTask(
    token,
    searchString,
    status,
    isPublic
  );

  const { mutate: takeTask } = TaskService.useTakeTask();
  const { mutate: cancelTakeTask } = TaskService.useCancelTakeTask();

  const cardStyle: CSSProperties = {
    transition: "background-color 0.3s ease",
    padding: "2px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const handleTakeTask = async (taskId: number) => {
    try {
      takeTask({ token, taskId });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCancelTakeTask = async (taskId: number) => {
    try {
      cancelTakeTask({ token, taskId });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    openEdit();
  };

  useEffect(() => {
    setTasks(tasksData || []);
  }, [tasksData]);

  const sortedTasks = tasksData
    ?.slice()
    .sort((a, b) => a.position - b.position);

  const listShortDataTaskId = useMemo(() => {
    if (tasksData) {
      const sortedTasks = tasksData
        .slice()
        .sort((a, b) => a.position - b.position);
      return sortedTasks.map((task) => task.id);
    }
    return [];
  }, [tasksData]);

  return (
    <>
      <Grid.Col span={3}>
        {/* Add Card Modal */}
        <Modal.Root opened={opened} onClose={close} size="xl">
          <Modal.Overlay />
          <Modal.Content bg="#f2f4f4">
            <Modal.Header py={0} bg="#f2f4f4">
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body>
              <AddCard closeForm={close} />
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>

        {/* Edit Task Modal */}
        <Modal.Root opened={editOpened} onClose={closeEdit} size="xl">
          <Modal.Overlay />
          <Modal.Content bg="#f2f4f4">
            <Modal.Header py={0} bg="#f2f4f4">
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body>
              {editTask && (
                <EditCard
                  closeForm={closeEdit}
                  cardData={editTask}
                  status={status}
                />
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>

        <div className="flex items-center justify-center">
          <Paper
            w="100%"
            p="md"
            shadow="xl"
            radius="8px"
            style={{ backgroundColor: "black" }}
          >
            <Text
              size="lg"
              mb="md"
              fw={700}
              w={500}
              style={{ color: "#a9b2b6" }}
            >
              {title} {tasksData?.length}
            </Text>
            <SortableContext id={status} items={listShortDataTaskId}>
              <ScrollArea.Autosize mah={300}>
                <Stack gap="lg">
                  {sortedTasks?.map((item) => (
                    <Menu
                      shadow="md"
                      width={200}
                      position="right-start"
                      key={item.id}
                    >
                      <Menu.Target>
                        <div
                          style={cardStyle}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "gray";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <Card item={item} />
                        </div>
                      </Menu.Target>
                      <Menu.Dropdown
                        style={{ marginLeft: "auto", marginTop: 10 }}
                      >
                        <Menu.Item
                          onClick={() => handleEditTask(item)}
                          leftSection={
                            <CiEdit style={{ width: 19, height: 19 }} />
                          }
                        >
                          <div className="font-semibold text-[15px]">Edit</div>
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <PiExclamationMarkFill
                              style={{ width: 19, height: 19 }}
                            />
                          }
                        >
                          <div className="font-semibold text-[15px]">
                            Details
                          </div>
                        </Menu.Item>
                        {isPublic ? (
                          <Menu.Item
                            leftSection={
                              <FaTasks style={{ width: 19, height: 19 }} />
                            }
                            onClick={() => handleTakeTask(item.id)}
                          >
                            <div className="font-semibold text-[15px]">
                              Take Task
                            </div>
                          </Menu.Item>
                        ) : (
                          <Menu.Item
                            leftSection={
                              <GiCancel style={{ width: 19, height: 19 }} />
                            }
                            onClick={() => handleCancelTakeTask(item.id)}
                          >
                            <div className="font-semibold text-[15px]">
                              Cancel Task
                            </div>
                          </Menu.Item>
                        )}{" "}
                      </Menu.Dropdown>
                    </Menu>
                  ))}
                </Stack>
              </ScrollArea.Autosize>
              {status === "TO_DO_LIST" && (
                <div className="mt-4">
                  <Button
                    onClick={open}
                    variant="gradient"
                    gradient={{ from: "#1e2a48", to: "#0f1829", deg: 35 }}
                    w="100%"
                    h={40}
                  >
                    Add Task
                  </Button>
                </div>
              )}
            </SortableContext>
          </Paper>
        </div>
      </Grid.Col>
    </>
  );
};

export default Column;
