import { client } from "@services/redis.service";

import { Ticket } from "@schemas/event/ticket.schema";

export const EXPIRY = {
  PRIVATE_TICKET: 15 * 60,
  PRIVATE_TICKETS: 15 * 60,
} as const;

export const ticketCacheKey = (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  return `owner:${ownerID}:event:${eventID}:ticket:${id}`;
};

export const ticketsCacheKey = (eventID: string, ownerID: string) => {
  return `owner:${ownerID}:event:${eventID}:tickets`;
};

export const getCachedTicket = async (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  try {
    const data = await client.json.get(ticketCacheKey(id, eventID, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

export const getCachedTickets = async (eventID: string, ownerID: string) => {
  try {
    const data = await client.json.get(ticketsCacheKey(eventID, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

export const setCachedTicket = async (
  id: string,
  eventID: string,
  ownerID: string,
  ticket: Ticket,
) => {
  const key = ticketCacheKey(id, eventID, ownerID);

  try {
    await client.json.set(key, "$", Object(ticket));
    await client.expire(key, EXPIRY.PRIVATE_TICKET);
    return true;
  } catch (err) {
    return false;
  }
};

export const setCachedTickets = async (
  eventID: string,
  ownerID: string,
  tickets: Ticket[],
) => {
  const key = ticketsCacheKey(eventID, ownerID);

  try {
    await client.json.set(key, "$", Object(tickets));
    await client.expire(key, EXPIRY.PRIVATE_TICKETS);
    return true;
  } catch (err) {
    return false;
  }
};

export const clearCachedTicket = async (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  try {
    await client.json.del(ticketCacheKey(id, eventID, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};

export const clearCachedTickets = async (eventID: string, ownerID: string) => {
  try {
    await client.json.del(ticketsCacheKey(eventID, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};
