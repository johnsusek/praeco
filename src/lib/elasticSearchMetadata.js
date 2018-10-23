export function formatIndex(index) {
  if (!index) return;

  let formattedIndex = index;
  let now = new Date();

  formattedIndex = formattedIndex.replace('%Y', now.getFullYear());
  formattedIndex = formattedIndex.replace('%m', (now.getMonth() + 1).toString().padStart(2, 0));
  formattedIndex = formattedIndex.replace(
    '%d',
    now
      .getDate()
      .toString()
      .padStart(2, 0)
  );

  return formattedIndex;
}

export function buildMappingFields(mapping) {
  let fields = {};

  Object.values(mapping)
    .map(m => m.mappings)
    .forEach(mping => {
      Object.values(mping).forEach(mp => {
        Object.entries(mp.properties).forEach(prop => {
          fields[prop[0]] = prop[1];
        });
      });
    });

  return fields;
}

export function buildMappingTypes(mapping) {
  let types = {};

  Object.values(mapping)
    .map(m => m.mappings)
    .forEach(m =>
      Object.keys(m).forEach(k => {
        types[k] = true;
      }));

  return Object.keys(types).sort();
}
