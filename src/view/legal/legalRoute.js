export const resolveLegalRoute = (path) => {
  if (path === "/terms" || path === "/privacy") {
    return { name: "legal-document", document: path.slice(1) };
  }
  return null;
};
