import { Paper, Stack, Text } from "@mantine/core";
import { IoTimeOutline } from "react-icons/io5";
import { Task } from "../../../data/Task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineDescription } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";

type CardProps = {
  item: Task;
  onClick?: () => void;
  isDragging?: boolean;
};

const Card = ({
  item: {
    description,
    dueDate,
    from,
    id,
    isPublic,
    position,
    title,
    assignedUserId,
  },
  onClick,
}: CardProps) => {
  const renderDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { title, description, type: "Task" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={onClick}
    >
      <Paper p="xs" shadow="xs" bg={"#454545"}>
        <Stack gap="xs">
          <Text
            size="sm"
            w={500}
            style={{ color: "#a9b2b6", fontSize: "16px", fontWeight: "bold" }}
          >
            {title}
          </Text>
          <div className="flex gap-3">
            {dueDate && (
              <div
                className="flex gap-2 items-center rounded-[5px] w-[140px] h-[24px]"
                style={{ backgroundColor: "#4b4f54", color: "#e0e0e0" }}
              >
                <IoTimeOutline style={{ color: "#e0e0e0" }} />
                <Text size="xs" style={{ color: "#e0e0e0" }}>
                  {renderDate}
                </Text>
              </div>
            )}
            {description.length !== 0 && description !== "<p></p>" && (
              <div className="mt-[2px]">
                <MdOutlineDescription
                  style={{ width: "20px", height: "20px", color: "#e0e0e0" }}
                />
              </div>
            )}

            <div className="flex ml-auto gap-3">
              <div className="">
                {assignedUserId && (
                  <FaRegUser
                    style={{ width: "18px", height: "18px", color: "#e0e0e0" }}
                  />
                )}
              </div>

              <div className="">
                {isPublic === true && (
                  <RiTeamLine
                    style={{ width: "20px", height: "20px", color: "#e0e0e0" }}
                  />
                )}
              </div>
            </div>
            {/* <div>{description}</div> */}
          </div>
        </Stack>
      </Paper>
    </div>
  );
};

export default Card;
