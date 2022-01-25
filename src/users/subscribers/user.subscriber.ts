import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await bcrypt.hash(event.entity.password, 8);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity.password !== event.databaseEntity.password) {
      event.entity.password = await bcrypt.hash(event.entity.password, 8);
    }

    if (event.entity.refreshToken && event.entity.refreshToken !== event.databaseEntity.refreshToken) {
      event.entity.refreshToken = await bcrypt.hash(event.entity.refreshToken, 8);
    }
  }
}
