import { cleanUpDB } from "../helpers/utils";
import { AuthenticatedTestUser } from "../helpers/types";
import { createOrgWithMembers, createDocumentReq } from '../helpers/utils';
import { createTestUser } from '../helpers/utils';

describe('Documents: Create Document', () => {
    
    let orgId: number;
    let owner: AuthenticatedTestUser;
    let member: AuthenticatedTestUser;
    beforeEach(async () => {
        await cleanUpDB();

        const result = await createOrgWithMembers({ memberCount: 1 });

        orgId = result.orgId;
        owner = result.owner;
        const members = result.members;

        member = members[0];
    });

    afterEach(async () => {
        await cleanUpDB();
    });

    it('should owner or member create documents', async () => {
        const ownerDocRes = await createDocumentReq(orgId, 'Test Document', 'Test Content', owner.authToken);
        const memberDocRes = await createDocumentReq(orgId, 'Test Document', 'Test Content', member.authToken);

        // Owner should be able to create document
        expect(ownerDocRes.status).toBe(201);
        expect(ownerDocRes.body).toMatchObject({
            id: expect.any(Number),
            title: 'Test Document',
            content: 'Test Content'
        });

        // Member should be able to create document
        expect(memberDocRes.status).toBe(201);
        expect(memberDocRes.body).toMatchObject({
            id: expect.any(Number),
            title: 'Test Document',
            content: 'Test Content'
        });
    });

    it('should return 403 if non-member creates document', async () => {
        const nonMember = await createTestUser();
        const res = await createDocumentReq(orgId, 'Test Document', 'Test Content', nonMember.authToken);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });


        const otherOrg = await createOrgWithMembers({ memberCount: 1 });
        const otherOwner = otherOrg.owner;
        const otherOrgRes = await createDocumentReq(orgId, 'Test Document', 'Test Content', otherOwner.authToken);

        expect(otherOrgRes.status).toBe(403);
        expect(otherOrgRes.body).toMatchObject({
            error: expect.any(String)
        });
    });

    it('should return 400 if title or content is missing', async () => {
        const resMissingTitle = await createDocumentReq(orgId, '', 'Test Content', owner.authToken);

        expect(resMissingTitle.status).toBe(400);
        expect(resMissingTitle.body).toMatchObject({
            error: expect.any(String)
        });

        const resMissingContent = await createDocumentReq(orgId, 'Test Document', '', owner.authToken);

        expect(resMissingContent.status).toBe(400);
        expect(resMissingContent.body).toMatchObject({
            error: expect.any(String)
        });
    });

});