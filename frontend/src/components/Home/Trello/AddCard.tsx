import React, { useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  NativeSelect,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import TaskService, { TaskProps } from "../../../service/TaskService";

const content = "";

type Props = {
  closeForm: () => void;
};

function AddCard({ closeForm }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("TO_DO_LIST");
  const [date, setDate] = useState<Date | null>(new Date());
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: createTask } = TaskService.useCreateTask();

  const handleSave = async () => {
    if (title.trim() === "") {
      setError("Title is required");
      return;
    }

    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      const taskData: TaskProps = {
        title: title,
        dueDate: date || new Date(),
        isPublic: isPublic,
        from: from,
        description: description,
      };
      if (token) createTask({ token: token, taskData });

      closeForm();
      console.log("Success");
    } catch (error) {
      console.error("Error saving task:", error);
      setError("An error occurred while saving the task");
    }
  };

  return (
    <div>
      <Container>
        <div className="text-[18px] font-bold">Add New Task</div>
        <Grid gutter="xl" className="mt-6">
          <Grid.Col span={12}>
            <div className="font-bold mt-5">Title</div>
            <TextInput
              // label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title here"
              error={error}
            />
            {error && (
              <Text style={{ color: "red" }} size="sm" mt="xs">
                {error}
              </Text>
            )}
          </Grid.Col>
        </Grid>

        <Grid gutter="xl">
          <Grid.Col span={12}>
            <div className="font-bold mt-5 ">From</div>
            <NativeSelect
              value={from}
              onChange={(e) => setFrom(e.currentTarget.value)}
              // label="From"
              data={[
                { value: "TO_DO_LIST", label: "To Do" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "DONE", label: "Done" },
                { value: "CANCEL", label: "Cancel" },
              ]}
            />
          </Grid.Col>
        </Grid>

        <div className="font-bold mt-5 ">Date Time</div>
        <Grid gutter="xl" align="flex-end">
          <Grid.Col span={6}>
            <DateInput
              clearable
              value={date}
              onChange={setDate}
              placeholder="Pick date and time"
            />
          </Grid.Col>
          {/* {isPublic === true } */}

          <Grid.Col span={6}>
            <Checkbox
              label="Public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.checked)}
              size="md"
            />
          </Grid.Col>
        </Grid>

        <div className="font-bold mt-5">Description</div>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>

        <Button className="mt-5 ml-4" onClick={handleSave}>
          Save
        </Button>
      </Container>
    </div>
  );
}

export default AddCard;
