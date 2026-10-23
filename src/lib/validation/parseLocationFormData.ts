export function parseLocationFormData(formData: FormData) {
  const get = (key: string) => {
    const val = formData.get(key);
    return typeof val === "string" ? val.trim() : "";
  };

  return {
    building: get("building"),
    floor: get("floor") || null,
    room: get("room") || null,
    kind: get("kind") || "room",
  };
}
