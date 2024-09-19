import { Paper, Stack, Text } from "@mantine/core";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../../../data/Task";

type CardProps = {
  item: Task;
  onClick?: () => void;
};

const Card = ({
  item: { description, dueDate, id, isPublic, title, assignedUserId },
  onClick,
}: CardProps) => {
  // Format due date
  const renderDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Calculate remaining days
  const dueDateObj = new Date(dueDate || "");
  const today = new Date();
  const timeDiff = dueDateObj.getTime() - today.getTime();
  const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Set background color based on urgency
  let dueDateBgColor = "#4b4f54"; // Default color
  if (remainingDays <= 2) {
    dueDateBgColor = "#a53c48"; // Red color for urgent
  } else if (remainingDays <= 4) {
    dueDateBgColor = "#d8e32b"; // Yellow color for approaching deadline
  } else if (remainingDays > 7) {
    dueDateBgColor = "#307828"; // Green color for not urgent
  }

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }

  // Use the DnD hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      item: { description, dueDate, id, isPublic, title, assignedUserId },
      type: "Task",
    },
  });

  // Apply styles for dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Additional styling for card
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#454545",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={onClick}
    >
      <Paper
        p="xs"
        shadow="xs"
        bg={"#1c2328"}
        style={{
          opacity: isDragging ? 0 : 1,
        }}
      >
        <Stack gap="xs">
          <Text
            size="sm"
            w={500}
            // style={{ color: "#a9b2b6", fontSize: "18px", fontWeight: "bold" }}
            style={{
              color: "#a9b2b6",
              fontSize: "18px",
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {/* {title} */}
            {truncateText(title, 15)}
          </Text>

          <div className="flex gap-3 items-center justify-center ">
            {dueDate && (
              <div
                className="flex gap-2 items-center rounded-[5px] w-[170px] h-[24px]"
                style={{ backgroundColor: dueDateBgColor, color: "#e0e0e0" }}
              >
                <IoTimeOutline style={{ color: "#e0e0e0" }} />
                <Text size="sm" style={{ color: "#e0e0e0" }}>
                  {renderDate}
                </Text>
              </div>
            )}

            {description && description !== "<p></p>" && (
              <div className="mt-[2px]">
                <MdOutlineDescription
                  style={{ width: "20px", height: "20px", color: "#e0e0e0" }}
                />
              </div>
            )}

            <div className="flex ml-auto gap-3">
              {assignedUserId && (
                <FaRegUser
                  style={{ width: "18px", height: "18px", color: "#e0e0e0" }}
                />
              )}
              {isPublic && (
                <RiTeamLine
                  style={{ width: "20px", height: "20px", color: "#e0e0e0" }}
                />
              )}
            </div>
          </div>
        </Stack>
      </Paper>
    </div>
  );
};

export default Card;
