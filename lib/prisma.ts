import { PrismaClient } from '@prisma/client';

export class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  get value(): T | undefined {
    return (global as any)[this.sym] as T | undefined;
  }

  set value(value: T) {
    (global as any)[this.sym] = value;
  }
}

const prismaRef: GlobalRef<PrismaClient> = new GlobalRef<PrismaClient>(
  'app.prisma',
);

if (process.env.NODE_ENV === 'production') {
  prismaRef.value = new PrismaClient();
} else {
  if (!prismaRef.value) {
    prismaRef.value = new PrismaClient({
      /*log: ['query']*/
    });
  }
}

export default prismaRef!.value as PrismaClient;
