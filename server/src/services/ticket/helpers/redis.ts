import { client } from "@config/redis.config";

import { Ticket } from "@schemas/event/ticket.schema";

/**
 * Expiry configuration for ticket cache.
 *
 * Defines the time-to-live for an event's ticket and tickets data in seconds.
 */
export const EXPIRY = {
  PRIVATE_TICKET: 15 * 60,
  PRIVATE_TICKETS: 15 * 60,
} as const;

/**
 * A service helper function that generates the cache key for an event's ticket.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The Redis cache key for the event's ticket.
 */
export const ticketCacheKey = (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  return `owner:${ownerID}:event:${eventID}:ticket:${id}`;
};

/**
 * A service helper function that generates the cache key for an event's tickets.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The Redis cache key for the event's tickets.
 */
export const ticketsCacheKey = (eventID: string, ownerID: string) => {
  return `owner:${ownerID}:event:${eventID}:tickets`;
};

/**
 * A service helper function that retrieves an event's ticket from cache.
 *
 * This function attempts to fetch the ticket from Redis. It
 * returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The cached ticket if present, otherwise null.
 */
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

/**
 * A service helper function that retrieves an event's tickets from cache.
 *
 * This function attempts to fetch the tickets from Redis. It
 * returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The cached tickets if present, otherwise null.
 */
export const getCachedTickets = async (eventID: string, ownerID: string) => {
  try {
    const data = await client.json.get(ticketsCacheKey(eventID, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that stores an event's ticket in cache.
 *
 * This function saves the ticket in Redis with a defined expiry time.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {Ticket} ticket - The ticket data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
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

/**
 * A service helper function that stores an event's tickets in cache.
 *
 * This function saves the tickets list in Redis with a defined expiry time.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {Ticket[]} tickets - The tickets data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
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

/**
 * A service helper function that clears an event's ticket from cache.
 *
 * This function removes the ticket from Redis.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
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

/**
 * A service helper function that clears an event's tickets from cache.
 *
 * This function removes all tickets for the event from Redis.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedTickets = async (eventID: string, ownerID: string) => {
  try {
    await client.json.del(ticketsCacheKey(eventID, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};
