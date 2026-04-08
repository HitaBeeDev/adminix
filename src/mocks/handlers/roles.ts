import { http, HttpResponse } from 'msw';
import { mockRoles, ALL_PERMISSIONS } from '@/mocks/seeds';
import type { Role, CreateRolePayload, UpdateRolePayload } from '@/types/role';

export const rolesHandlers = [
  http.get('/api/roles', () => {
    return HttpResponse.json({
      data: mockRoles,
      permissions: ALL_PERMISSIONS,
    });
  }),

  http.post('/api/roles', async ({ request }) => {
    const body = await request.json() as CreateRolePayload;

    if (!body.name || !body.description || !body.permissions?.length) {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const nameTaken = mockRoles.some(
      (r) => r.name.toLowerCase() === body.name.toLowerCase(),
    );
    if (nameTaken) {
      return HttpResponse.json({ message: 'Role name already exists' }, { status: 409 });
    }

    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: body.name,
      description: body.description,
      permissions: body.permissions,
      isSystem: false,
      usersCount: 0,
      createdDate: new Date().toISOString(),
    };

    mockRoles.push(newRole);

    return HttpResponse.json(newRole, { status: 201 });
  }),

  http.put('/api/roles/:id', async ({ params, request }) => {
    const index = mockRoles.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    if (mockRoles[index].isSystem) {
      return HttpResponse.json({ message: 'System roles cannot be modified' }, { status: 403 });
    }

    const body = await request.json() as UpdateRolePayload;

    if (body.name) {
      const nameTaken = mockRoles.some(
        (r) => r.name.toLowerCase() === body.name!.toLowerCase() && r.id !== params.id,
      );
      if (nameTaken) {
        return HttpResponse.json({ message: 'Role name already exists' }, { status: 409 });
      }
    }

    const updated: Role = { ...mockRoles[index], ...body };
    mockRoles[index] = updated;

    return HttpResponse.json(updated);
  }),

  http.delete('/api/roles/:id', ({ params }) => {
    const index = mockRoles.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    if (mockRoles[index].isSystem) {
      return HttpResponse.json({ message: 'System roles cannot be deleted' }, { status: 403 });
    }

    if (mockRoles[index].usersCount > 0) {
      return HttpResponse.json(
        { message: 'Cannot delete a role that has assigned users' },
        { status: 409 },
      );
    }

    mockRoles.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
