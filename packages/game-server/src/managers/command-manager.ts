import {
  ADMIN_COMMANDS,
  AdminCommand,
  AdminCommandType,
  CreateEntityCommand,
  CreateItemCommand,
  ChangeSkinCommand,
} from "@shared/commands/commands";
import { IEntityManager } from "@/managers/types";
import Positionable from "@/extensions/positionable";
import Vector2 from "@/util/vector2";
import { Player } from "@/entities/player";

export class CommandManager {
  private entityManager: IEntityManager;

  private commandMap: Record<AdminCommandType, (payload: AdminCommand["payload"]) => void>;

  constructor(entityManager: IEntityManager) {
    this.entityManager = entityManager;
    this.commandMap = {
      [ADMIN_COMMANDS.CREATE_ITEM]: this.createItem.bind(this),
      [ADMIN_COMMANDS.CREATE_ENTITY]: this.createEntity.bind(this),
      [ADMIN_COMMANDS.CHANGE_SKIN]: this.changeSkin.bind(this),
    };
  }

  handleCommand(command: AdminCommand) {
    const handler = this.commandMap[command.command];
    if (!handler) return;

    handler(command.payload);
  }

  private createItem(payload: CreateItemCommand["payload"]) {
    const item = this.entityManager.createEntityFromItem({
      itemType: payload.itemType,
    });
    item.getExt(Positionable).setPosition(payload.position);
    this.entityManager.addEntity(item);
  }

  private createEntity(payload: CreateEntityCommand["payload"]) {
    const entity = this.entityManager.createEntity(payload.entityType);
    if (!entity) return;
    entity
      .getExt(Positionable)
      .setPosition(new Vector2(payload.position.x + 32, payload.position.y));
    this.entityManager.addEntity(entity);
  }

  private changeSkin(payload: ChangeSkinCommand["payload"]) {
    const player = this.entityManager.getEntityById(payload.playerId);
    if (player instanceof Player) {
      player.setSkin(payload.skinType);
    }
  }
}
