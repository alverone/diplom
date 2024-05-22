'use server';

import { hashSync } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { OrderStatus } from '@prisma/client';

import { getAppSession } from './auth';
import prisma from './prisma';

const createSchema = z.object({
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

const updateSchema = z.object({
  email: z.string().email({ message: 'Невірний email' }),
  name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
  surname: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
  phone: z
    .string({
      required_error: 'Обовʼязкове поле',
    })
    .min(1),
});

const makeOrderSchema = z.object({
  email: z.string().email({ message: 'Невірний email' }),
  name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
  surname: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
  phone: z
    .string({
      required_error: 'Обовʼязкове поле',
    })
    .min(1),
  address: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
});

export interface ActionResponse<T> {
  message?: string;
  status?: number;
  errors?: T | undefined;
}

export interface CreateUserErrors {
  email?: string[] | undefined;
  password?: string[] | undefined;
  phone?: string[] | undefined;
  name?: string[] | undefined;
  surname?: string[] | undefined;
}

export interface UpdateUserErrors {
  email?: string[] | undefined;
  phone?: string[] | undefined;
  name?: string[] | undefined;
  surname?: string[] | undefined;
}

export interface MakeOrderErrors {
  name?: string[] | undefined;
  surname?: string[] | undefined;
  phone?: string[] | undefined;
  email?: string[] | undefined;
  address?: string[] | undefined;
}

export interface ValidateCategoryErrors {
  title?: string[] | undefined;
}
export interface ValidateAuthorErrors {
  name?: string[] | undefined;
}
export interface ValidatePublisherErrors {
  name?: string[] | undefined;
}

export async function createUser(
  fd: FormData,
): Promise<ActionResponse<CreateUserErrors>> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
    };

    const validatedFields = createSchema.safeParse(userPayload);
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

    const hashedPassword = hashSync(userPayload.password.trim(), 12);

    await prisma.user.create({
      data: {
        name: userPayload.name.trim(),
        surname: userPayload.surname.trim(),
        email: userPayload.email.trim(),
        password: hashedPassword,
        phone: userPayload.phone.trim(),
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

export async function updateUser(
  id: string,
  fd: FormData,
): Promise<ActionResponse<UpdateUserErrors>> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
    };

    const validatedFields = updateSchema.safeParse(userPayload);
    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: userPayload.name.trim(),
        surname: userPayload.surname.trim(),
        email: userPayload.email.trim(),
        phone: userPayload.phone.trim(),
      },
    });

    revalidatePath(`/account/user`);

    return {
      status: 204,
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

export async function addBookToWishes(bookId: string): Promise<boolean> {
  try {
    const session = await getAppSession();
    const currentUserId = session?.user?.id ?? '';

    if (currentUserId == null || bookId.length === 0) {
      return false;
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
      },
    });

    if (book == null) {
      return false;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
      select: {
        id: true,
        wishesIds: true,
      },
    });

    if (existingUser == null || existingUser.wishesIds.includes(bookId)) {
      return false;
    }

    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        wishesIds: {
          set: [...existingUser.wishesIds, bookId],
        },
      },
    });

    revalidatePath(`/book/${bookId}`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}

export async function removeBookFromWishes(bookId: string): Promise<boolean> {
  try {
    const session = await getAppSession();
    const currentUserId = session?.user?.id ?? '';

    if (currentUserId == null || bookId.length === 0) {
      return false;
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
      },
    });

    if (book == null) {
      return false;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
      select: {
        id: true,
        wishesIds: true,
      },
    });

    if (existingUser == null) {
      return false;
    }

    const updatedWishes = [
      ...existingUser.wishesIds.filter((id) => id !== bookId),
    ];

    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        wishesIds: updatedWishes,
      },
    });

    revalidatePath(`/book/${bookId}`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}

export async function createOrder(
  userId: string | null | undefined,
  order: BookAndCount[],
  fd: FormData,
): Promise<ActionResponse<MakeOrderErrors>> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      address: fd.get('address') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
      description: fd.get('description') as string,
    };

    const validatedFields = makeOrderSchema.safeParse(userPayload);
    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const bookIds = order.map((item) => item.id);
    const bookPrices = await prisma.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (!bookPrices || bookPrices.length === 0) {
      throw new Error('Internal server error');
    }

    const resultPrice = bookPrices.reduce(
      (acc, book) =>
        acc +
        book.price * (order.find((inner) => book.id == inner.id)?.count ?? 1),
      0,
    );
    const fullName = `${userPayload.name.trim()} ${userPayload.surname.trim()}`;

    await prisma.order.create({
      data: {
        fullName: fullName,
        email: userPayload.email,
        phone: userPayload.phone,
        address: userPayload.address.trim(),
        userId: userId ?? undefined,
        price: resultPrice,
        status: OrderStatus.CREATED,
        description: userPayload.description,
        bookIds: bookIds,
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

export async function updateCategory(
  fd: FormData,
): Promise<ActionResponse<ValidateCategoryErrors>> {
  try {
    const categoryPayload = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      id: fd.get('id') as string,
    };

    const validatedFields = z
      .object({
        title: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(categoryPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { title, description, id } = categoryPayload;

    await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(`/admin/categories/${id}`);

    return {
      status: 204,
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

export async function createCategory(
  fd: FormData,
): Promise<ActionResponse<ValidateCategoryErrors>> {
  try {
    const categoryPayload = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
    };

    const validatedFields = z
      .object({
        title: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(categoryPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { title, description } = categoryPayload;

    await prisma.category.create({
      data: {
        title: title.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(`/admin/categories`);

    return {
      status: 204,
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

export async function updateAuthor(
  fd: FormData,
): Promise<ActionResponse<ValidateAuthorErrors>> {
  try {
    const authorPayload = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      id: fd.get('id') as string,
    };

    const validatedFields = z
      .object({
        name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(authorPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { name, description, id } = authorPayload;

    await prisma.author.update({
      where: {
        id: id,
      },
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(`/admin/authors/${id}`);

    return {
      status: 204,
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

export async function createAuthor(
  fd: FormData,
): Promise<ActionResponse<ValidateAuthorErrors>> {
  try {
    const authorPayload = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
    };

    const validatedFields = z
      .object({
        name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(authorPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { name, description } = authorPayload;

    await prisma.author.create({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(`/admin/authors`);

    return {
      status: 204,
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

export async function updatePublisher(
  fd: FormData,
): Promise<ActionResponse<ValidatePublisherErrors>> {
  try {
    const publisherPayload = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      id: fd.get('id') as string,
    };
    const validatedFields = z
      .object({
        name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(publisherPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { name, description, id } = publisherPayload;

    await prisma.author.update({
      where: {
        id: id,
      },
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(`/admin/publisher/${id}`);

    return {
      status: 204,
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

export async function createPublisher(
  fd: FormData,
): Promise<ActionResponse<ValidatePublisherErrors>> {
  try {
    const publisherPayload = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
    };

    const validatedFields = z
      .object({
        name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(publisherPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { name, description } = publisherPayload;

    await prisma.publisher.create({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(`/admin/publishers`);

    return {
      status: 204,
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

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await prisma.category.delete({
      where: {
        id: id,
      },
    });

    revalidatePath(`/admin/categories`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}

export async function deleteAuthor(id: string): Promise<boolean> {
  try {
    await prisma.author.delete({
      where: {
        id: id,
      },
    });

    revalidatePath(`/admin/authors`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}

export async function deletePublisher(id: string): Promise<boolean> {
  try {
    await prisma.publisher.delete({
      where: {
        id: id,
      },
    });

    revalidatePath(`/admin/publishers`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}
