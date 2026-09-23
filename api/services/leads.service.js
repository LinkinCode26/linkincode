import Lead from "../models/Lead.js";

export const createLead = async (data) => {
  const lead = await Lead.create(data);
  return lead;
};

export const getFilteredLeads = async (queryFilters, skip, limit) => {
  const leads = await Lead.find(queryFilters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Lead.countDocuments(queryFilters);
  return { leads, total };
};
