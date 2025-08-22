import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidObjectId } from "mongoose";
import { connectDB, Task } from "@/lib/db";
import { APIError, handleAPIError } from "@/lib/utils";
import { validateTaskData } from "@/lib/validations";
import { verifyToken } from "@/lib/auth";

async function getAuthenticatedUser(request: NextRequest) {
  try {
    let userId = request.headers.get("x-user-id");

    if (userId) {
      return userId;
    }

    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token")?.value;

    if (!authToken) {
      throw new APIError("No authentication token provided", 401);
    }

    const userPayload = verifyToken(authToken);
    if (!userPayload || !userPayload.userId) {
      throw new APIError("Invalid authentication token", 401);
    }

    return userPayload.userId;
  } catch (error) {
    throw new APIError("Authentication failed", 401);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const completed = searchParams.get("completed");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const query: any = { userId };

    if (completed !== null) {
      query.completed = completed === "true";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return NextResponse.json({
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        completed: task.completed,
        userId: task.userId.toString(),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getAuthenticatedUser(request);

    const body = await request.json();
    const { title, description, completed = false } = body;

    const validationErrors = validateTaskData({ title, description });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      completed,
      userId,
    });

    await task.save();

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        task: {
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          completed: task.completed,
          userId: task.userId.toString(),
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getAuthenticatedUser(request);

    const body = await request.json();
    const { taskId, title, description, completed } = body;

    if (!taskId || !isValidObjectId(taskId)) {
      throw new APIError("Valid task ID is required", 400);
    }

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new APIError("Task not found", 404);
    }

    if (title !== undefined) {
      const titleValidation = validateTaskData({ title });
      if (titleValidation.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: titleValidation,
          },
          { status: 400 }
        );
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    await task.save();

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task: {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        completed: task.completed,
        userId: task.userId.toString(),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId || !isValidObjectId(taskId)) {
      throw new APIError("Valid task ID is required", 400);
    }

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!deletedTask) {
      throw new APIError("Task not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
