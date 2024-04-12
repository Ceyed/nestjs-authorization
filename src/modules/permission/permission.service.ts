import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {
  constructor() {}

  get(): string {
    return this._giveTheGoodNews('get');
  }

  post(): string {
    return this._giveTheGoodNews('post');
  }

  put(): string {
    return this._giveTheGoodNews('put');
  }

  delete(): string {
    return this._giveTheGoodNews('delete');
  }

  private _giveTheGoodNews(route: string): string {
    return `If you see this message, you have the '${route}' permission`;
  }
}
