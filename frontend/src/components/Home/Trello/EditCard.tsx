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
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";
import TaskService from "../../../service/TaskService";

type EditCardProps = {
  cardData: {
    id: number;
    title: string;
    from: string;
    isPublic: boolean;
    description: string;
    dueDate: Date;
    position: number;
  };
  closeForm: () => void;
  status: string;
};

const EditCard = ({ cardData, closeForm, status }: EditCardProps) => {
  const [title, setTitle] = useState(cardData.title);
  const [from, setFrom] = useState(cardData.from);
  const [date, setDate] = useState<Date | null>(new Date());
  const [isPublic, setIsPublic] = useState(cardData.isPublic);
  const [description, setDescription] = useState(cardData.description);

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
    content: cardData.description,
  });

  const { mutate: updateTask } = TaskService.useUpdateTask();

  useEffect(() => {
    if (editor) {
      const handleChange = () => {
        setDescription(editor.getHTML());
      };
      editor.on("update", handleChange);
      return () => {
        editor.off("update", handleChange);
      };
    }
  }, [editor]);

  const handleSave = async () => {
    const updatedTaskData = {
      title,
      from,
      dueDate: date || new Date(),
      isPublic,
      description: description || editor?.getHTML() || "",
    };

    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        updateTask({ token, taskId: cardData.id, updatedTaskData });
        closeForm();
        console.log("Task updated successfully");
      } else {
        console.error("No authentication token found");
      }
    } catch (error) {
      console.error("Update Task Error", error);
    }
  };

  return (
    <Box>
      <Container>
        <Box>
          <Grid gutter="xl" className="mt-6">
            <Grid.Col span={12}>
              <TextInput
                label="Title"
                placeholder="Enter title here"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </Grid.Col>
          </Grid>
          <Grid gutter="xl">
            <Grid.Col span={12}>
              <NativeSelect
                label="From"
                data={[
                  { value: "TO_DO_LIST", label: "To Do List" },
                  { value: "IN_PROGRESS", label: "In Progress" },
                  { value: "DONE", label: "Done" },
                  { value: "CANCEL", label: "Cancel" },
                ]}
                value={from}
                onChange={(e) => setFrom(e.currentTarget.value)}
              />
            </Grid.Col>
          </Grid>
          <Grid gutter="xl" align="flex-end">
            <Grid.Col span={6}>
              <DateInput
                label="Time Line"
                placeholder="Enter time line here"
                value={date}
                onChange={setDate}
              />
            </Grid.Col>
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
            <RichTextEditor.Toolbar sticky>
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
        </Box>
      </Container>

      <Button className="mt-5 ml-4" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default EditCard;
