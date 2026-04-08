import { Types, PipelineStage } from "mongoose";

import OrderModel, { Order } from "@models/order.model";

import { getCachedOrders, setCachedOrders } from "./helpers/redis";

import { FetchOrdersValidatorSchema } from "@validators/order/fetchOrders.validator";

type OrderFilters = {
  user: Types.ObjectId;
  status?: string;
};

type EventFilters = {
  "basic.title"?: {
    $regex: string;
    $options: "i";
  };
};

/**
 * A service function that retrieves multiple orders of a user.
 *
 * This function builds a filter based on query parameters. It uses
 * cache when no filters are applied, otherwise queries the database.
 *
 * @param {string} userID - The ID of the user.
 * @param {FetchOrdersValidatorSchema} query - The validated query parameters.
 *
 * @returns A list of orders.
 */
const fetchOrders = async (
  userID: string,
  query: FetchOrdersValidatorSchema,
) => {
  if (query.title) {
    return (await getOrders(userID, query)) as Order[];
  }

  const orders =
    (await getCachedOrders(userID)) ?? (await getOrders(userID, query));

  return orders as Order[];
};

const getOrders = async (userID: string, data: FetchOrdersValidatorSchema) => {
  const orderFilters: OrderFilters = {
    user: new Types.ObjectId(userID),
  };

  if (data.status) {
    orderFilters.status = data.status;
  }

  const eventFilters: EventFilters = {};

  if (data.title) {
    eventFilters["basic.title"] = {
      $regex: data.title,
      $options: "i",
    };
  }

  Object.keys(orderFilters).length === 0;

  const stages: PipelineStage[] = [
    ...(Object.keys(orderFilters).length === 0
      ? []
      : [
          {
            $match: orderFilters,
          },
        ]),
    {
      $lookup: {
        foreignField: "_id",
        localField: "event",
        from: "events",
        as: "event",
        pipeline: [
          ...(Object.keys(eventFilters).length === 0
            ? []
            : [
                {
                  $match: eventFilters,
                },
              ]),
          {
            $project: {
              _id: 0,
              id: "$_id",
              mode: 1,
              status: 1,
              visibility: 1,
              attendance: 1,
              approved: 1,
              basic: 1,
              address: 1,
              album: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$event",
      },
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

  const dbOrders = await OrderModel.aggregate(stages);

  await setCachedOrders(userID, dbOrders);

  return dbOrders;
};

export default fetchOrders;
