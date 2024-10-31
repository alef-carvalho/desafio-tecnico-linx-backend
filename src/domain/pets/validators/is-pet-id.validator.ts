import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/services';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsPetIdConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    async validate(id: number): Promise<boolean> {
        const record = await this.prisma.pet.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!record;
    }

    defaultMessage(): string {
        return 'Pet not found';
    }
}

export function IsPetId(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPetIdConstraint,
        });
    };
}
