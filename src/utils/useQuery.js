const tasksConverter = {
  toFirestore: (data) => data,
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      task: data.task || "",
      checked: data.checked || false,
      createdAt: data.createdAt || null,
      uid: data.uid || null,
      archivedAt: data.archivedAt || null,
    };
  },
};
