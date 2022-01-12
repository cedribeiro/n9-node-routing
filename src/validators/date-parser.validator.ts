import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

// TODO : consider sample https://github.com/typestack/class-transformer/tree/master/sample/sample5-custom-transformer
// eslint-disable-next-line @typescript-eslint/naming-convention
export function DateParser(
	dateFormat?: string,
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			propertyName,
			name: 'DateParser',
			target: object.constructor,
			constraints: [dateFormat],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments): boolean {
					const [dateFormat2] = args.constraints;
					(args.object as any)[propertyName] = moment(value, dateFormat2).toDate();
					return true;
				},
			},
		});
	};
}
