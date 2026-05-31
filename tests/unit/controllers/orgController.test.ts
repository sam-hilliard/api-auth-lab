import {
  createOrg,
  getOrgById,
  inviteUser,
  removeMember,
} from '../../../src/controllers/orgController';

import * as orgRepo from '../../../src/repositories/orgRepository';
import * as orgService from '../../../src/services/orgService';

jest.mock('../../../src/repositories/orgRepository');
jest.mock('../../../src/services/orgService');

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('createOrg', () => {
  it('creates org and adds user as owner', async () => {
    const req: any = {
      body: { name: 'Test Org' },
      user: { id: 1 },
    };
    const res = mockRes();

    (orgRepo.insertOrg as jest.Mock).mockResolvedValue({ id: 10 });
    (orgService.addMember as jest.Mock).mockResolvedValue({
      id: 10,
      members: [{ userId: 1, role: 'owner' }],
    });

    await createOrg(req, res);

    expect(orgRepo.insertOrg).toHaveBeenCalledWith('Test Org');
    expect(orgService.addMember).toHaveBeenCalledWith(10, 1, 'owner');

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 10,
      members: [{ userId: 1, role: 'owner' }],
    });
  });
});

describe('getOrgById', () => {
  it('returns org with members', async () => {
    const req: any = { params: { orgId: '5' } };
    const res = mockRes();

    (orgRepo.getOrg as jest.Mock).mockResolvedValue({
      id: 5,
      name: 'Org',
    });

    (orgRepo.getMembers as jest.Mock).mockResolvedValue([{ id: 1, userId: 1 }]);

    await getOrgById(req, res);

    expect(orgRepo.getOrg).toHaveBeenCalledWith(5);
    expect(orgRepo.getMembers).toHaveBeenCalledWith(5);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 5,
      name: 'Org',
      members: [{ id: 1, userId: 1 }],
    });
  });
});

describe('inviteUser', () => {
  it('invites user to org successfully', async () => {
    const req: any = {
      params: { orgId: '7' },
      body: { username: 'john' },
    };
    const res = mockRes();

    (orgService.inviteUserToOrg as jest.Mock).mockResolvedValue({
      id: 1,
      username: 'john',
    });

    await inviteUser(req, res);

    expect(orgService.inviteUserToOrg).toHaveBeenCalledWith(7, 'john');

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: 'john',
    });
  });

  it('propagates NotFoundError when user does not exist', async () => {
    const req: any = {
      params: { orgId: '7' },
      body: { username: 'missingUser' },
    };
    const res = mockRes();

    (orgService.inviteUserToOrg as jest.Mock).mockRejectedValue(
      new Error('User does not exist with the username: missingUser'),
    );

    await expect(inviteUser(req, res)).rejects.toThrow();
  });

  it('throws ClientError when user already member', async () => {
    const req: any = {
      params: { orgId: '7' },
      body: { username: 'john' },
    };
    const res = mockRes();

    (orgService.inviteUserToOrg as jest.Mock).mockRejectedValue(
      new Error('User is already a member of the org'),
    );

    await expect(inviteUser(req, res)).rejects.toThrow();
  });
});

describe('removeMember', () => {
  it('removes member successfully', async () => {
    const req: any = {
      params: { orgId: '3', username: 'john' },
    };
    const res = mockRes();

    (orgService.removeMemberFromOrg as jest.Mock).mockResolvedValue(undefined);

    await removeMember(req, res);

    expect(orgService.removeMemberFromOrg).toHaveBeenCalledWith(3, 'john');

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('throws error when removal fails', async () => {
    const req: any = {
      params: { orgId: '3', username: 'john' },
    };
    const res = mockRes();

    (orgService.removeMemberFromOrg as jest.Mock).mockRejectedValue(
      new Error('Unable to remove member.'),
    );

    await expect(removeMember(req, res)).rejects.toThrow();
  });
});
