import prisma from "../utils/prisma";

export default class UserRepository {
  static async create(data: any) {
    return prisma.user.create({ data });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }
}
