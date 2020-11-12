import { Injectable } from "@nestjs/common";
import { RolesEnum } from "enums/roles.enum";
import { BaseGuard } from "./base.guard";

@Injectable()
export class EmployeeGuard extends BaseGuard(RolesEnum.EMPLOYEE) { }
