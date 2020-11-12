import { Injectable } from "@nestjs/common";
import { RolesEnum } from "enums/roles.enum";
import { BaseGuard } from "./base.guard";

@Injectable()
export class SystemAdminGuard extends BaseGuard(RolesEnum.SYSTEM_ADMIN) { }
