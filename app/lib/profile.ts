const TWO_MONTHS_MS = 1000 * 60 * 60 * 24 * 60;

export function canEditSalary(salaryUpdatedAt?: Date | string | null) {
  if (!salaryUpdatedAt) {
    return true;
  }

  const lastUpdated = new Date(salaryUpdatedAt);
  if (Number.isNaN(lastUpdated.getTime())) {
    return true;
  }

  return Date.now() - lastUpdated.getTime() >= TWO_MONTHS_MS;
}

export function getSalaryUnlockDate(salaryUpdatedAt?: Date | string | null) {
  if (!salaryUpdatedAt) {
    return null;
  }

  const lastUpdated = new Date(salaryUpdatedAt);
  if (Number.isNaN(lastUpdated.getTime())) {
    return null;
  }

  return new Date(lastUpdated.getTime() + TWO_MONTHS_MS);
}

export function serializeProfileUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  region?: string;
  planningStyle?: string;
  monthlySalary?: number | null;
  salaryUpdatedAt?: Date | string | null;
  profileImage?: string;
}) {
  const salaryUpdatedAt = user.salaryUpdatedAt
    ? new Date(user.salaryUpdatedAt).toISOString()
    : null;

  return {
    userName: user.name,
    email: user.email,
    userId: user._id.toString(),
    region: user.region ?? "",
    planningStyle: user.planningStyle ?? "",
    monthlySalary:
      user.monthlySalary != null && !Number.isNaN(Number(user.monthlySalary))
        ? Number(user.monthlySalary)
        : null,
    salaryUpdatedAt,
    canEditSalary: canEditSalary(user.salaryUpdatedAt),
    salaryUnlockDate: getSalaryUnlockDate(user.salaryUpdatedAt)?.toISOString() ?? null,
    profileImage: user.profileImage ?? "",
  };
}
