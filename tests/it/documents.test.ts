import { cleanUpDB,
 createOrgWithMembers, 
 createDocumentReq, 
 getDocumentReq, 
 getDocumentsReq 
} from '../helpers/utils';
import { AuthenticatedTestUser } from '../helpers/types';
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

describe('Documents: View Documents in org', () => {

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

    it('should allow owner and member to view documents', async () => {
        const ownerDocRes = await createDocumentReq(
            orgId,
            'Test Document',
            'Test Content',
            owner.authToken
        );

        const memberDocRes = await createDocumentReq(
            orgId,
            'Test Document',
            'Test Content',
            member.authToken
        );

        const expectedDocs = [
            {
            id: ownerDocRes.body.id,
            username: owner.username
            },
            {
            id: memberDocRes.body.id,
            username: member.username
            }
        ];

        const assertDocumentsResponse = (res: any) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);

            expectedDocs.forEach(({ id, username }) => {
            expect(res.body).toEqual(
                expect.arrayContaining([
                expect.objectContaining({
                    id,
                    title: 'Test Document',
                    content: 'Test Content',
                    created_by_username: username
                })
                ])
            );
            });
        };

        // Owner request
        const resOwner = await getDocumentsReq(orgId, owner.authToken);
        assertDocumentsResponse(resOwner);

        // Member request
        const resMember = await getDocumentsReq(orgId, member.authToken);
        assertDocumentsResponse(resMember);
   });

   it('should return 403 if non-member views documents', async () => {
        const nonMember = await createTestUser();
        const res = await getDocumentsReq(orgId, nonMember.authToken);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });

        const otherOrg = await createOrgWithMembers({ memberCount: 1 });
        const otherOwner = otherOrg.owner;
        const otherOrgRes = await getDocumentsReq(orgId, otherOwner.authToken);

        expect(otherOrgRes.status).toBe(403);
        expect(otherOrgRes.body).toMatchObject({
            error: expect.any(String)
        });
    });
});

describe('Documents: Get Specific Document By Id', () => {

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

    it('should allow owner and member to view specific document', async () => {
        const ownerDocRes = await createDocumentReq(
            orgId,
            'Test Document',
            'Test Content',
            owner.authToken
        );

        const memberDocRes = await createDocumentReq(
            orgId,
            'Test Document',
            'Test Content',
            member.authToken
        );

        const assertSingleDocument = (res: any, expectedId: number, expectedUsername: string) => {
            expect(res.status).toBe(200);
            expect(res.body).toEqual(
            expect.objectContaining({
                id: expectedId,
                title: 'Test Document',
                content: 'Test Content',
                created_by_username: expectedUsername
            })
            );
        };

        // Owner request
        const resOwner = await getDocumentReq(orgId, ownerDocRes.body.id, owner.authToken);
        assertSingleDocument(resOwner, ownerDocRes.body.id, owner.username);

        // Member request
        const resMember = await getDocumentReq(orgId, memberDocRes.body.id, member.authToken);
        assertSingleDocument(resMember, memberDocRes.body.id, member.username);
   });

   it('should return 403 if non-member views documents', async () => {
        const nonMember = await createTestUser();
        const res = await getDocumentReq(orgId, 1, nonMember.authToken);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });
    });
});