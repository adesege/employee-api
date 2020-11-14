import { Request } from "express";

export const normalizeIpAddress = (req: Request): string => {
  let ipAddress = req.ip;

  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }

  return ipAddress;
}
