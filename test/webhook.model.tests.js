import sinon from "sinon";
import WebhookModel from "../models/webhookModel.js";

const nonMasterBranchBody = `
{
    "ref": "feature/tst-add-manifest-and-config",
    "ref_type": "branch",
    "master_branch": "master",
    "pusher_type": "user",
    "repository": {
      "id": 326921348,
      "node_id": "MDEwOlJlcG9zaXRvcnkzMjY5MjEzNDg=",
      "name": "sandbox-environments",
      "full_name": "thorstenbaek/sandbox-environments",
      "private": false,        
    }  
`;

const masterBranchBody = `
{
    "ref": "master",
    "ref_type": "branch",
    "master_branch": "master",
    "pusher_type": "user",
    "repository": {
      "id": 326921348,
      "node_id": "MDEwOlJlcG9zaXRvcnkzMjY5MjEzNDg=",
      "name": "sandbox-environments",
      "full_name": "thorstenbaek/sandbox-environments",
      "private": false,        
    }  
`;

describe('Webhook Model Tests', () => {    
    it('create', async () => { 
        var releaseMock = sinon.mock(applyRelease);
            releaseMock.expects('applyRelease')
                .once()
                .withArgs('test', '')
                .resolves(Promise.resolve('release'));        

        var webHookModel = new WebHookModel();

        await webHookModel.create(postedBody);
    });    
});