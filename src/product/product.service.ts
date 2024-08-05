import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { normalizeString } from 'src/utils/translate';
import {
  CreateProductDto,
  UpdateImageDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ search, sort, categoryName = [], page = 1, pageSize = 10 }) {
    const whereConditions: any = {
      isDeleted: false,
    };

    if (search) {
      whereConditions.OR = [
        { slug: { contains: search, mode: 'insensitive' } },
        {
          normalizeTitle: {
            contains: normalizeString(search),
            mode: 'insensitive',
          },
        },
      ];
    }

    if (categoryName.length > 0) {
      console.log(categoryName);
      for (const category of categoryName) {
        const existCategory = await this.prisma.category.findFirst({
          where: {
            name: { equals: category, mode: 'insensitive' },
          },
        });

        if (existCategory === null) {
          continue;
        }

        const categories = await this.prisma.category.findMany({
          where: {
            parentId: existCategory.id,
          },
          select: {
            name: true,
          },
        });

        const subCategory = categories.map((item) => item.name);

        if (subCategory.length > 0) {
          categoryName.filter((item) => item != category);
          categoryName = categoryName.concat(subCategory);
        }
      }

      whereConditions.category = {
        AND: [],
      };
      whereConditions.category.AND.push({
        name: { in: categoryName, mode: 'insensitive' },
      });
    }

    const sortCriteria = [];
    if (sort == 'moi-nhat') {
      sortCriteria.push({ updatedAt: 'desc' });
    } else if (sort == 'gia-thap-nhat') {
      sortCriteria.push({ price: 'asc' });
    } else if (sort == 'gia-cao-nhat') {
      sortCriteria.push({ price: 'desc' });
    } else if (sort == 'do-uu-tien') {
      sortCriteria.push({ priority: 'desc' });
    } else {
      sortCriteria.push({ priority: 'desc' });
    }

    const products = await this.prisma.product.findMany({
      where: whereConditions,
      select: {
        id: true,
        slug: true,
        title: true,
        thumbnail: true,
        price: true,
        salePercent: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        createBy: {
          select: {
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: sortCriteria,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.prisma.product.count({
      where: whereConditions,
    });
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      products: products.map((product) => ({
        ...product,
      })),
      paginate: {
        totalCount,
        pageCount,
        currentPage: page,
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createBy: {
          select: {
            email: true,
          },
        },
        updateBy: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ${slug}`);
    }

    return {
      product: { ...product, images: product.images.map((image) => image.url) },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: {
          equals: id,
          mode: 'insensitive',
        },
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createBy: {
          select: {
            email: true,
          },
        },
        updateBy: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ${id}`);
    }

    return { ...product, images: product.images.map((image) => image.url) };
  }

  async create(request: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        normalizeTitle: normalizeString(request.title),
        ...request,
      },
    });
  }

  async update(id: string, request: UpdateProductDto) {
    if (request && request.title !== null) {
      request.normalizeTitle = normalizeString(request.title);
    }
    const product = await this.prisma.product.update({
      where: { id },
      data: request,
    });
    return product;
  }

  async delete(id: string, userId: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        updateId: userId,
      },
    });
    return product;
  }

  async updateThumbnail(id: string, thumbnail: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { thumbnail },
    });
    return product;
  }

  async updateProductImage(request: UpdateImageDto) {
    const { id, thumbnails, oldUrl } = request;

    const oldUrls =
      oldUrl === undefined ? [] : Array.isArray(oldUrl) ? oldUrl : [oldUrl];

    await this.prisma.productImages.deleteMany({
      where: {
        productId: id,
        url: { notIn: oldUrls, mode: 'insensitive' },
      },
    });

    thumbnails.forEach(async (thumbnailUrl) => {
      await this.prisma.productImages.create({
        data: {
          productId: id,
          url: thumbnailUrl,
        },
      });
    });

    return await this.findById(id);
  }
}
