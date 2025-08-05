export const debounceBatch = (func, wait) => {
	let timeout;
	const batch = new Map(); // field => Set of ids
	const resolvers = []; // { field, id, resolve, reject }

	return (field, id) => {
		return new Promise((resolve, reject) => {
			if (!batch.has(field)) batch.set(field, new Set());
			batch.get(field).add(id);

			resolvers.push({ field, id, resolve, reject });

			clearTimeout(timeout);
			timeout = setTimeout(async () => {
				const currentBatch = new Map(batch);
				batch.clear();

				const groupedResolvers = [...resolvers];
				resolvers.length = 0;

				for (const [field, idsSet] of currentBatch) {
					const ids = Array.from(idsSet);

					try {
						const { error, data } = await func(field, ids);

						for (const {
							field: f,
							id,
							resolve,
						} of groupedResolvers.filter(
							(r) => r.field === field
						)) {
							if (error) {
								resolve({ error, data: null });
							} else {
								// Check if the id is actually in the response (in case backend rejects some)
								const idIncluded =
									Array.isArray(data?.ids) &&
									data.ids.includes(id);
								resolve({
									error: null,
									data: idIncluded ? { field, id } : null,
								});
							}
						}
					} catch (err) {
						for (const {
							field: f,
							resolve,
						} of groupedResolvers.filter(
							(r) => r.field === field
						)) {
							resolve({ error: err, data: null });
						}
					}
				}
			}, wait);
		});
	};
};
