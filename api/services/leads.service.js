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

export const updateLeadStatus = async (id, estado) => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { estado },
    { returnDocument: 'after', runValidators: true },
  );
  return lead;
};

export const getLeadCountsByProject = async () => {
  const rows = await Lead.aggregate([
    { $group: { _id: "$tipoProyecto", total: { $sum: 1 } } },
  ]);
  return rows.map(({ _id, total }) => ({ tipoProyecto: _id, total }));
};