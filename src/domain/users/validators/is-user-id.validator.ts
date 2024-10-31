import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/services';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserIdConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    async validate(id: number): Promise<boolean> {
        const record = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!record;
    }

    defaultMessage(): string {
        return 'User not found';
    }
}

export function IsUserId(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserIdConstraint,
        });
    };
}
