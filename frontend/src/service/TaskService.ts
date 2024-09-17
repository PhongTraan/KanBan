import axios, { AxiosResponse } from "axios";
import { MoveTask, Task } from "../data/Task";
import { useMutation, useQuery, useQueryClient } from "react-query";

export type TaskProps = {
  title: string;
  from: string;
  isPublic: boolean;
  description: string;
  dueDate: Date;
};

class TaskService {
  static BASE_URL = "http://localhost:8080";

  //View And Search
  static searchTaskAndGetTask = (
    token: string,
    title?: string,
    status?: string,
    isPublic?: boolean
  ) => {
    const fetchAllTasks = async (
      token: string,
      title?: string,
      status?: string,
      isPublic?: boolean
    ): Promise<Task[]> => {
      const response = await axios.get<any, AxiosResponse<Task[]>>(
        `${TaskService.BASE_URL}/admin/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            title,
            status,
            isPublic,
          },
        }
      );
      return response.data;
    };

    return useQuery(
      ["getTasks", title, status, isPublic],
      () => fetchAllTasks(token, title, status, isPublic),
      {
        enabled: !!token,
        onError: (error) => {
          console.log("Get tasks failed", error);
        },
        refetchOnWindowFocus: false,
      }
    );
  };

  // Add Card
  public static async createTask(token: string, taskData: TaskProps) {
    try {
      const response = await axios.post(
        `${TaskService.BASE_URL}/admin/task`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }
  static useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation(
      ({ token, taskData }: { token: string; taskData: TaskProps }) =>
        this.createTask(token, taskData),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getTasks"]);
        },
      }
    );
  };

  // Update Task
  static async updateTask(
    token: string,
    taskId: number,
    updatedTaskData: Partial<TaskProps>
  ) {
    try {
      const response = await axios.put(
        `${TaskService.BASE_URL}/admin/task/${taskId}`,
        updatedTaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }
  // Custom hook for task update
  static useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation(
      ({
        token,
        taskId,
        updatedTaskData,
      }: {
        token: string;
        taskId: number;
        updatedTaskData: Partial<TaskProps>;
      }) => TaskService.updateTask(token, taskId, updatedTaskData),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getTasks"]);
        },
      }
    );
  };

  // Add Take Task
  static async takeTask(token: string, taskId: number) {
    try {
      const response = await axios.put(
        `${TaskService.BASE_URL}/admin/task/take/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error taking task:", error);
      throw error;
    }
  }

  static useTakeTask() {
    const queryClient = useQueryClient();
    return useMutation(
      ({ token, taskId }: { token: string; taskId: number }) =>
        TaskService.takeTask(token, taskId),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getTasks"]);
        },
        onError: (error) => {
          console.error("Error taking task:", error);
        },
      }
    );
  }

  // Add Take Task
  static async cancelTakeTask(token: string, taskId: number) {
    try {
      const response = await axios.put(
        `${TaskService.BASE_URL}/admin/task/cancel/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error taking task:", error);
      throw error;
    }
  }

  static useCancelTakeTask() {
    const queryClient = useQueryClient();
    return useMutation(
      ({ token, taskId }: { token: string; taskId: number }) =>
        TaskService.cancelTakeTask(token, taskId),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getTasks"]);
        },
        onError: (error) => {
          console.error("Error taking task:", error);
        },
      }
    );
  }

  // Move Task
  public static async moveTask(token: string, taskActivity: MoveTask) {
    try {
      const { taskId, overPosition, overStatus } = taskActivity;
      const url = `${TaskService.BASE_URL}/admin/move/${taskId}`;
      const response = await axios.put(
        url,
        { overPosition, overStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error moving task:", error);
      throw error;
    }
  }

  public static useMoveTask() {
    const queryClient = useQueryClient();
    return useMutation(
      ({ token, taskActivity }: { token: string; taskActivity: MoveTask }) =>
        TaskService.moveTask(token, taskActivity),
      {
        onSuccess: () => {
          console.log("MOVE OK");
          queryClient.invalidateQueries(["getTasks"]);
        },
        onError: (error) => {
          console.error("Error moving task in hook:", error);
        },
      }
    );
  }
}

export default TaskService;
