export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateTaskTitle(title: string): boolean {
  return title.trim().length >= 1;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegisterData(data: {
  name: string;
  email: string;
  password: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateName(data.name)) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!validatePassword(data.password)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  return errors;
}

export function validateLoginData(data: {
  email: string;
  password: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
}

export function validateTaskData(data: {
  title: string;
  description?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateTaskTitle(data.title)) {
    errors.push({ field: 'title', message: 'Task title is required' });
  }

  return errors;
}