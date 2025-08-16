export function getFormattedApplications(data: []) {
  return data.map((application) => {
    const { id, company, applied_on, role, status } = application;
    return {
      id,
      company,
      date: new Date(applied_on).toUTCString(),
      status,
      role,
    };
  });
}
