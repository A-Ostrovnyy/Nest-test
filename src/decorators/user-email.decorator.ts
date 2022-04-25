import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Custom decorator get user email from request
 *
 * @param  {unknown} (data
 * @param  {ExecutionContext} ctx
 */
export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
