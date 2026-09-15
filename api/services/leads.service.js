import Lead from "../models/Lead.js";

export const createLead = async (data) => {
  const lead = await Lead.create(data);

  return lead;
};
