import { describe, it, expect } from 'vitest';
import { addRoleSchema } from '@/pages/RolesPage/roles.schema';
import { generateReportSchema } from '@/pages/ReportsPage/reports.schema';
import { editUserSchema } from '@/pages/UserDetailPage/userDetail.schema';
import { editAccountSchema } from '@/pages/AccountDetailPage/accountDetail.schema';

function firstError(result: ReturnType<typeof addRoleSchema.safeParse>): string {
  if (result.success) return '';
  return result.error.issues[0]?.message ?? '';
}

// ─── addRoleSchema ────────────────────────────────────────────────────────────

describe('addRoleSchema', () => {
  const valid = { name: 'Billing Admin', description: 'Manages billing only', permissions: ['billing:read'] };

  it('accepts valid input', () => {
    expect(addRoleSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = addRoleSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(firstError(result)).toMatch(/at least 2/i);
  });

  it('rejects description shorter than 5 characters', () => {
    const result = addRoleSchema.safeParse({ ...valid, description: 'Hi' });
    expect(result.success).toBe(false);
    expect(firstError(result)).toMatch(/at least 5/i);
  });

  it('rejects empty permissions array', () => {
    const result = addRoleSchema.safeParse({ ...valid, permissions: [] });
    expect(result.success).toBe(false);
    expect(firstError(result)).toMatch(/at least one permission/i);
  });
});

// ─── generateReportSchema ─────────────────────────────────────────────────────

describe('generateReportSchema', () => {
  const valid = {
    name: 'Monthly Report',
    type: 'Users' as const,
    from: '2024-01-01',
    to: '2024-01-31',
    format: 'CSV' as const,
  };

  it('accepts valid input', () => {
    expect(generateReportSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 3 characters', () => {
    const result = generateReportSchema.safeParse({ ...valid, name: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid report type', () => {
    const result = generateReportSchema.safeParse({ ...valid, type: 'Invoices' });
    expect(result.success).toBe(false);
  });

  it('rejects missing start date', () => {
    const result = generateReportSchema.safeParse({ ...valid, from: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing end date', () => {
    const result = generateReportSchema.safeParse({ ...valid, to: '' });
    expect(result.success).toBe(false);
  });

  it('rejects end date before start date', () => {
    const result = generateReportSchema.safeParse({ ...valid, from: '2024-03-01', to: '2024-01-01' });
    expect(result.success).toBe(false);
    const issue = !result.success && result.error.issues.find((i) => i.path.includes('to'));
    expect(issue).toBeTruthy();
    expect((issue as { message: string }).message).toMatch(/after start date/i);
  });

  it('accepts same from and to date', () => {
    expect(generateReportSchema.safeParse({ ...valid, from: '2024-01-01', to: '2024-01-01' }).success).toBe(true);
  });
});

// ─── editUserSchema ───────────────────────────────────────────────────────────

describe('editUserSchema', () => {
  const valid = { name: 'Jane Smith', email: 'jane@example.com', role: 'admin' as const };

  it('accepts valid input', () => {
    expect(editUserSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = editUserSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
    expect(firstError(result as ReturnType<typeof addRoleSchema.safeParse>)).toMatch(/at least 2/i);
  });

  it('rejects an invalid email', () => {
    const result = editUserSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown role', () => {
    const result = editUserSchema.safeParse({ ...valid, role: 'superuser' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid roles', () => {
    const roles = ['super_admin', 'admin', 'manager', 'editor', 'viewer', 'guest'] as const;
    for (const role of roles) {
      expect(editUserSchema.safeParse({ ...valid, role }).success).toBe(true);
    }
  });
});

// ─── editAccountSchema ────────────────────────────────────────────────────────

describe('editAccountSchema', () => {
  it('accepts a name with optional domain', () => {
    expect(editAccountSchema.safeParse({ name: 'Acme Corp', domain: 'acme.com' }).success).toBe(true);
  });

  it('accepts a name without domain', () => {
    expect(editAccountSchema.safeParse({ name: 'Acme Corp' }).success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = editAccountSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    expect(firstError(result as ReturnType<typeof addRoleSchema.safeParse>)).toMatch(/required/i);
  });
});
