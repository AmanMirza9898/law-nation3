import type { Response } from "express";
import { RoleService } from "./roles.service.js";
import type { AuthRequest } from "@/types/auth-request.js";
import {
  roleCreateSchema,
  roleUpdateSchema,
  assignPermissionSchema,
  assignRoleToUserSchema,
} from "./validators/roles.validator.js";

// /src/modules/rbac/roles/role.controller.ts

// Exports
export const RoleController = {
  create,
  list,
  get,
  update,
  remove,
  assignPermission,
  removePermission,
  getPermissions,
  assignRoleToUser,
  removeRoleFromUser,
};

export default RoleController;

// Controller Functions Implementations
async function create(req: AuthRequest, res: Response) {
  try {
    const payload = roleCreateSchema.parse(req.body);
    const role = await RoleService.createRole({
      ...payload,
      description:
        payload.description === undefined ? null : payload.description,
    });
    return res.status(201).json(role);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: err.issues });
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}

async function list(_req: AuthRequest, res: Response) {
  const roles = await RoleService.listRoles();
  return res.json(roles);
}

async function get(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Role ID is required" });
  const role = await RoleService.getRoleById(id);
  if (!role) return res.status(404).json({ error: "Not found" });
  return res.json(role);
}

async function update(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const payload = roleUpdateSchema.parse(req.body);
    if (!id) return res.status(400).json({ error: "Role ID is required" });
    const role = await RoleService.updateRole(id, payload);
    return res.json(role);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: err.issues });
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}

async function remove(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Role ID is required" });
    await RoleService.deleteRole(id);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}

// Permissions
async function assignPermission(req: AuthRequest, res: Response) {
  try {
    const roleId = req.params.id;
    const { permissionId } = assignPermissionSchema.parse(req.body);
    if (!roleId) return res.status(400).json({ error: "Role ID is required" });
    const rp = await RoleService.assignPermission(roleId, permissionId);
    return res.status(201).json(rp);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: err.issues });
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}

async function removePermission(req: AuthRequest, res: Response) {
  try {
    const { id: roleId, permId } = req.params;
    if (!roleId) return res.status(400).json({ error: "Role ID is required" });
    if (!permId)
      return res.status(400).json({ error: "Permission ID is required" });
    const rp = await RoleService.removePermission(roleId, permId);
    return res.json(rp);
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}

async function getPermissions(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Role ID is required" });
  const perms = await RoleService.getRolePermissions(id);
  return res.json(perms);
}

// User-role
async function assignRoleToUser(req: AuthRequest, res: Response) {
  try {
    const payload = assignRoleToUserSchema.parse({
      ...req.body,
      roleId: req.body.roleId,
    });
    const ur = await RoleService.assignRoleToUser(
      payload.userId,
      payload.roleId
    );
    return res.status(201).json(ur);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: err.issues });
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}

async function removeRoleFromUser(req: AuthRequest, res: Response) {
  try {
    const { userId, roleId } = req.params;
    if (!userId || !roleId) {
      return res
        .status(400)
        .json({ error: "Both userId and roleId are required" });
    }
    const ur = await RoleService.removeRoleFromUser(userId, roleId);
    return res.json(ur);
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? "Bad Request" });
  }
}
