const ToCamelCase = <UsersRow, Target>(rows: UsersRow[] | undefined) => {
  return rows?.map((row) => {
    const replaced = {} as UsersRow;

    for (let key in row) {
      const camelCase = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace("_", "")
      );

      replaced[camelCase as keyof UsersRow] = row[key as keyof UsersRow];
    }

    return replaced as unknown as Target;
  });
};

export default ToCamelCase;
