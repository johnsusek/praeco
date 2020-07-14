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
      // es7 compatibility, add a fake
      // doctype so structure is the same as es6
      if (mping.properties) mping = { doctype: mping };

      Object.values(mping).forEach(mp => {
        if (mp.properties === undefined) return;

        Object.entries(mp.properties).forEach(prop => {
          let name = prop[0];
          let field = fields[name];
          let value = prop[1];

          if (field) {
            // this field already exists in our mapping,
            // merge in extra fields (.raw, .keyword)
            // if they exist
            if (value.fields) {
              Object.entries(value.fields).forEach(([vfName, vfValue]) => {
                // vfName will be something like 'raw'
                if (!field.fields) field.fields = {};
                field.fields[vfName] = vfValue;
              });
            }
          } else {
            fields[name] = value;
          }
        });
      });
    });

  return fields;
}

export function buildMappingTypes(mapping) {
  let types = {};

  Object.values(mapping)
    .map(m => m.mappings)
    .forEach(m => Object.keys(m).forEach(k => {
      types[k] = true;
    }));

  return Object.keys(types).sort();
}
