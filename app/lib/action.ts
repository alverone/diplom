'use server';

import { hashSync } from 'bcrypt';
import { z } from 'zod';
import prisma from './prisma';

const schema = z.object({
  email: z.string().email({ message: 'Невірний email' }),
  password: z
    .string()
    .min(8, { message: 'Пароль повинен містити не менше 8 символів' }),
  name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
  surname: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
  phone: z
    .string({
      required_error: 'Обовʼязкове поле',
    })
    .min(1),
});

export interface CreateUserResponse {
  message?: string;
  status?: number;
  errors?:
    | {
        email?: string[] | undefined;
        password?: string[] | undefined;
        phone?: string[] | undefined;
        name?: string[] | undefined;
        surname?: string[] | undefined;
      }
    | undefined;
}

export async function createUser(fd: FormData): Promise<CreateUserResponse> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
    };

    const validatedFields = schema.safeParse(userPayload);
    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: userPayload.email,
      },
    });

    if (existingUser != null) {
      return {
        status: 409,
        message:
          'Користувач з таким email вже існує. Перевірте правильність введених даних або авторизуйтесь.',
      };
    }

    if (userPayload.password.length < 8) {
      return {
        status: 400,
        message: 'Пароль повинен містити не менше 8 символів',
      };
    }

    const hashedPassword = hashSync(userPayload.password, 12);

    await prisma.user.create({
      data: {
        name: userPayload.name,
        surname: userPayload.surname,
        email: userPayload.email,
        password: hashedPassword,
      },
    });

    return {
      status: 201,
      message: 'Ок',
    };
  } catch (e) {
    console.error(e);

    return {
      status: 500,
      message: 'Internal server error',
    };
  }
}
