'use server';

import { BookType, OrderStatus } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { hashSync } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAppSession } from './auth';
import prisma from './prisma';
import { bookTypeFromString, orderStatusFromString } from './utils';

export interface ActionResponse {
  message?: string;
  status?: number;
  errors?: FormErrors | undefined;
}

export async function createUser(fd: FormData): Promise<ActionResponse> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
    };

    console.log('phone : ', userPayload.phone);

    const validatedFields = z
      .object({
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
          .refine((phone) => !phone.includes('_'), {
            message: 'Обовʼязкове поле',
          }),
      })
      .safeParse(userPayload);

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
): Promise<ActionResponse> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
    };

    const validatedFields = z
      .object({
        email: z.string().email({ message: 'Невірний email' }),
        name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        surname: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        phone: z
          .string({
            required_error: 'Обовʼязкове поле',
          })
          .min(1),
      })
      .safeParse(userPayload);
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
): Promise<ActionResponse> {
  try {
    const userPayload = {
      email: fd.get('email') as string,
      address: fd.get('address') as string,
      name: fd.get('name') as string,
      surname: fd.get('surname') as string,
      phone: fd.get('phone') as string,
      description: fd.get('description') as string,
    };

    const validatedFields = z
      .object({
        email: z.string().email({ message: 'Невірний email' }),
        name: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        surname: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        phone: z
          .string({
            required_error: 'Обовʼязкове поле',
          })
          .min(1),
        address: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
      })
      .safeParse(userPayload);
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

export async function updateCategory(fd: FormData): Promise<ActionResponse> {
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

export async function createCategory(fd: FormData): Promise<ActionResponse> {
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

export async function updateAuthor(fd: FormData): Promise<ActionResponse> {
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

export async function createAuthor(fd: FormData): Promise<ActionResponse> {
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

export async function updatePublisher(fd: FormData): Promise<ActionResponse> {
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

export async function createPublisher(fd: FormData): Promise<ActionResponse> {
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

export async function deleteBook(id: string): Promise<boolean> {
  try {
    const idAndCover = await prisma.book.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        coverUrl: true,
      },
    });

    if (!idAndCover) {
      return false;
    }

    if (idAndCover?.coverUrl) {
      await del(idAndCover?.coverUrl);
    }

    await prisma.book.delete({
      where: {
        id: id,
      },
    });

    revalidatePath(`/admin/catalog`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}

export async function updateBook(
  bookId: string,
  fd: FormData,
): Promise<ActionResponse> {
  try {
    const bookPayload = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      price: parseFloat(fd.get('price') as string),
      pageLength: parseInt(fd.get('pageLength') as string),
      type: fd.get('type') as string,
      publishDate: new Date(fd.get('publishDate') as string),
      authorId: fd.get('authorId') as string,
      coverUrl: fd.get('coverUrl') as string,
      publisherId: fd.get('publisherId') as string,
      categoryId: fd.get('categoryId') as string,
      cover: fd.get('cover') as File,
    };

    const validatedFields = z
      .object({
        title: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        description: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        price: z
          .number({ message: 'Обовʼязкове поле' })
          .min(0.01, { message: 'Ціна повинна бути більше 0' }),
        pageLength: z
          .number({ message: 'Обовʼязкове поле' })
          .min(1, { message: 'Сторінок повинно бути більше 0' }),
        type: z.nativeEnum(BookType),
        publishDate: z.date(),
        authorId: z.string().trim().min(1),
        publisherId: z.string().trim().min(1),
        categoryId: z.string().trim().min(1),
      })
      .safeParse(bookPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }
    let coverUrl: string | undefined = undefined;

    if (bookPayload.cover && bookPayload.cover.size > 0) {
      const blob = await put(
        `images/${bookPayload.cover.name}`,
        bookPayload.cover,
        {
          access: 'public',
          addRandomSuffix: true,
        },
      );

      coverUrl = blob.url;
    } else {
      coverUrl = bookPayload.coverUrl;
    }

    const {
      title,
      description,
      price,
      pageLength,
      type,
      categoryId,
      publisherId,
      authorId,
      publishDate,
    } = bookPayload;
    const bookType = bookTypeFromString(type);

    await prisma?.book.update({
      where: { id: bookId },
      data: {
        title: {
          set: title,
        },
        description: {
          set: description,
        },
        price: {
          set: price,
        },
        pageLength: {
          set: pageLength,
        },
        type: {
          set: bookType ?? undefined,
        },
        publishDate: {
          set: publishDate,
        },
        authorId: {
          set: authorId,
        },
        publisherId: {
          set: publisherId,
        },
        categoryId: {
          set: categoryId,
        },
        ...(coverUrl && {
          coverUrl: {
            set: coverUrl,
          },
        }),
      },
    });

    revalidatePath(`/admin/catalog`);

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

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export async function createBook(fd: FormData): Promise<ActionResponse> {
  try {
    const bookPayload = {
      cover: fd.get('cover') as File,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      price: parseFloat(fd.get('price') as string),
      pageLength: parseInt(fd.get('pageLength') as string),
      type: fd.get('type') as string,
      coverUrl: fd.get('coverUrl') as string,
      publishDate: new Date(fd.get('publishDate') as string),
      authorId: fd.get('authorId') as string,
      authorName: fd.get('authorName') as string,
      publisherId: fd.get('publisherId') as string,
      publisherName: fd.get('publisherName') as string,
      categoryId: fd.get('categoryId') as string,
      categoryTitle: fd.get('categoryTitle') as string,
    };

    const validatedFields = z
      .object({
        title: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        description: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        price: z
          .number({ message: 'Обовʼязкове поле' })
          .min(0.01, { message: 'Ціна повинна бути більше 0' }),
        pageLength: z
          .number({ message: 'Обовʼязкове поле' })
          .min(1, { message: 'Сторінок повинно бути більше 0' }),
        type: z.nativeEnum(BookType),
        publishDate: z.date(),
        cover: z
          .any()
          .refine(
            (file) => file?.size <= MAX_FILE_SIZE,
            `Максимальний розмір зображення 5MB.`,
          )
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            'Підтримуються тільки формати .jpg, .jpeg, .png and .webp',
          ),
      })
      .safeParse(bookPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }
    let coverUrl: string | undefined = undefined;

    if (bookPayload.cover) {
      const blob = await put(
        `images/${bookPayload.cover.name}`,
        bookPayload.cover,
        {
          access: 'public',
          addRandomSuffix: true,
        },
      );

      coverUrl = blob.url;
    }

    const { title, description, price, pageLength, type, publishDate } =
      bookPayload;
    const bookType = bookTypeFromString(type);

    await prisma?.book.create({
      include: {
        author: true,
        publisher: true,
        category: true,
      },
      data: {
        coverUrl: coverUrl,
        title: title,
        description: description,
        price: price,
        pageLength: pageLength,
        type: bookType!,
        publishDate: publishDate,
        author: {
          connectOrCreate: {
            where: {
              id: bookPayload.authorId,
            },
            create: {
              name: bookPayload.authorName,
            },
          },
        },
        publisher: {
          connectOrCreate: {
            where: {
              id: bookPayload.publisherId,
            },
            create: {
              name: bookPayload.publisherName,
            },
          },
        },
        category: {
          connectOrCreate: {
            where: {
              id: bookPayload.categoryId,
            },
            create: {
              title: bookPayload.categoryTitle,
            },
          },
        },
      },
    });

    revalidatePath(`/admin/catalog`);

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

export async function updateOrder(fd: FormData): Promise<ActionResponse> {
  try {
    const orderPayload = {
      price: parseFloat(fd.get('price') as string),
      fullName: fd.get('fullName') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      address: fd.get('address') as string,
      status: fd.get('status') as string,
      //userId: fd.get('userId') as string,
      description: fd.get('description') as string,
      id: parseInt(fd.get('id') as string),
    };

    const validatedFields = z
      .object({
        fullName: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        email: z.string().email({ message: 'Невірний email' }),
        phone: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        address: z.string().trim().min(1, { message: 'Обовʼязкове поле' }),
        price: z.number().min(0.01, { message: 'Ціна повинна бути більше 0' }),
        status: z.nativeEnum(OrderStatus),
        id: z.number().int().positive(),
      })
      .safeParse(orderPayload);

    if (!validatedFields.success) {
      return {
        status: 400,
        message: 'Перевірте правильність введених даних',
        errors: validatedFields.error?.flatten().fieldErrors,
      };
    }

    const { price, fullName, email, phone, address, status, description, id } =
      orderPayload;

    const orderStatus = orderStatusFromString(status);

    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        price: {
          set: price,
        },
        fullName: {
          set: fullName,
        },
        email: {
          set: email,
        },
        phone: {
          set: phone,
        },
        address: {
          set: address,
        },
        ...(orderStatus && {
          status: {
            set: orderStatus!,
          },
        }),
        description: {
          set: description,
        },
      },
    });

    revalidatePath(`/admin/orders/${id}`);

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
