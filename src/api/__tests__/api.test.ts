// © Edmund Wallner
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invoke } from '@tauri-apps/api/core';
import * as api from '@/api';

const mockedInvoke = vi.mocked(invoke);

beforeEach(() => {
  mockedInvoke.mockReset();
  mockedInvoke.mockResolvedValue(undefined);
});

describe('PI API wrappers', () => {
  it('getAllPIs calls get_all_pis', async () => {
    mockedInvoke.mockResolvedValue([]);
    await api.getAllPIs();
    expect(mockedInvoke).toHaveBeenCalledWith('get_all_pis');
  });

  it('createPI passes camelCase params', async () => {
    await api.createPI('PI 25.3', '2025-10-01', '2025-12-31');
    expect(mockedInvoke).toHaveBeenCalledWith('create_pi', {
      piName: 'PI 25.3',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
    });
  });

  it('activatePI passes the id', async () => {
    await api.activatePI(5);
    expect(mockedInvoke).toHaveBeenCalledWith('activate_pi', { id: 5 });
  });
});

describe('People API wrappers', () => {
  it('getPeople passes activeOnly param', async () => {
    mockedInvoke.mockResolvedValue([]);
    await api.getPeople(true);
    expect(mockedInvoke).toHaveBeenCalledWith('get_people', { activeOnly: true });
  });

  it('createPerson passes all camelCase params with null defaults', async () => {
    await api.createPerson('John Doe', 'john@example.com');
    expect(mockedInvoke).toHaveBeenCalledWith('create_person', {
      fullName: 'John Doe',
      email: 'john@example.com',
      department: null,
      costCenter: null,
      hub: null,
      company: null,
    });
  });
});

describe('Membership API wrappers', () => {
  it('createMembership passes all params with camelCase conversion', async () => {
    await api.createMembership(1, 2, 'Dev', 80, 3);
    expect(mockedInvoke).toHaveBeenCalledWith('create_membership', {
      teamId: 1,
      personId: 2,
      role: 'Dev',
      ftePercent: 80,
      piId: 3,
    });
  });

  it('updateMembership passes id, role, and ftePercent', async () => {
    await api.updateMembership(10, 'SM', 50);
    expect(mockedInvoke).toHaveBeenCalledWith('update_membership', {
      id: 10,
      role: 'SM',
      ftePercent: 50,
    });
  });
});
