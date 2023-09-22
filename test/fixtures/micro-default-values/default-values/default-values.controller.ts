import {
	Body,
	HeaderParams,
	Inject,
	JsonController,
	N9Log,
	Post,
	QueryParams,
	Service,
} from '../../../../src/index.js';
import { BodyModel } from './body.model.js';
import { HeadersModel } from './headers.model.js';
import { QueryParamsModel } from './query-params.model.js';

@Service()
@JsonController()
export class DefaultValuesController {
	@Inject('logger') private logger: N9Log;

	@Post('/default-values')
	public do(
		@Body() body: BodyModel,
		@QueryParams() queryParams: QueryParamsModel,
		@HeaderParams() headers: HeadersModel,
	): any {
		this.logger.info(`Received values are :`);
		this.logger.info(`body : ${JSON.stringify(body, null, 2)}`);
		this.logger.info(`queryParams : ${JSON.stringify(queryParams, null, 2)}`);
		this.logger.info(`headers : ${JSON.stringify(headers, null, 2)}`);
		return {
			queryParams,
			body,
			headers,
		};
	}
}
