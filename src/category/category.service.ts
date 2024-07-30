import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCount() {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        categories: {
          where: {
            isDeleted: false,
          },
          include: {
            products: true,
            categories: true,
            createBy: {
              select: {
                email: true,
              },
            },
          },
        },
        products: true,
        createBy: {
          select: {
            email: true,
          },
        },
      },
    });

    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      level: category.parentId == null ? 1 : 2,
      count: this.countProducts(category),
    }));

    return { categories: categoriesWithCount };
  }

  countProducts(category) {
    let count = category.products.length;

    if (category.categories.length > 0) {
      category.categories.forEach((subCategory) => {
        count += this.countProducts(subCategory);
      });
    }

    return count;
  }

  async findAll() {
    return {
      categories: await this.prisma.category.findMany({
        where: {
          parentId: null,
          isDeleted: false,
        },
        include: {
          categories: {
            where: {
              isDeleted: false,
            },
            include: {
              createBy: {
                select: {
                  email: true,
                },
              },
            },
          },
          createBy: {
            select: {
              email: true,
            },
          },
        },
      }),
    };
  }

  async findByName(name: string) {
    return {
      category: await this.prisma.category.findFirst({
        where: {
          name,
        },
        include: {
          categories: true,
        },
      }),
    };
  }

  async create(request: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        ...request,
      },
    });
  }

  async update(id: string, request: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: {
        ...request,
      },
    });
  }

  async delete(id: string, userId: string) {
    return await this.prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
        updateId: userId,
      },
    });
  }
}
