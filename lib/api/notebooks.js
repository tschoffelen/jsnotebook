export const saveNotebook = async (notebook) => {
  const result = await fetch(
    `https://schof.link/api/get-url?${new URLSearchParams({
      filename: "notebook.json",
      contentType: "application/json",
      editable: "true",
      id: notebook.id || undefined,
      unique: new Date().valueOf(),
    })}`
  );
  const { key, url } = await result.json();

  await fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      ...notebook,
      id: key,
      createdAt: notebook.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `inline; filename="notebook.json"`,
    },
  });

  return key;
};
