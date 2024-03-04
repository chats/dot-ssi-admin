import axios from "axios";

export interface Predicate {
    name: string;
    type: string;
    value: any;
}

export async function createInvitation(agentUrl: string, key: string) {
    const url = `${agentUrl}/connections/create-invitation`;
    try {
        const response = await axios.post(url, null, {
            headers: { "x-api-key": key, apikey: key },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

export async function deleteConnection(
    agentUrl: string,
    key: string,
    connection_id: string
) {
    const url = `${agentUrl}/connections/${connection_id}`;
    try {
        await axios.delete(url, {
            headers: { "x-api-key": key, apikey: key },
            signal: AbortSignal.timeout(5000),
        });
        console.log("delete connection=" + connection_id);
        return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}

export async function getConnections(agentUrl: string, key: string) {
    const url = `${agentUrl}/connections`;
    try {
        const result = await axios.get(url, {
            headers: { "x-api-key": key, apikey: key },
            signal: AbortSignal.timeout(5000),
        });
        //console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
    return null;
}

export async function isConnectionActive(
    agentUrl: string,
    key: string,
    connectionId: string
) {
    const url = `${agentUrl}/connections/${connectionId}`;
    try {
        const response = await axios.get(url, {
            headers: { "x-api-key": key, apikey: key },
        });
        console.log(response.data);
        if (response.data["state"] == "active") return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}

export async function createSchema(
    agentUrl: string,
    key: string,
    data: string
) {
    const url = `${agentUrl}/schemas`;
    console.log("data=" + JSON.stringify(data));
    try {
        return await axios.post(url, data, {
            headers: { "x-api-key": key, apikey: key },
            signal: AbortSignal.timeout(5000),
        });
    } catch (error) {
        console.log(error);
    }
    return false;
}

export async function getSchemas(agentUrl: string, key: string) {
    const url = `${agentUrl}/schemas/created`;
    try {
        return await axios.get(url, {
            headers: { "x-api-key": key, apikey: key },
            signal: AbortSignal.timeout(5000),
        });
    } catch (error) {
        console.log(error);
    }
    return false;
}

export async function getCredDefs(agentUrl: string, key: string) {
    const url = `${agentUrl}/credential-definitions/created`;
    try {
        return await axios.get(url, {
            headers: { "x-api-key": key, apikey: key },
            signal: AbortSignal.timeout(5000),
        });
    } catch (error) {
        console.log(error);
    }
    return false;
}

export async function createCredDefs(
    agentUrl: string,
    key: string,
    data: string
) {
    const url = `${agentUrl}/credential-definitions`;
    console.log("data=" + JSON.stringify(data));
    try {
        return await axios.post(url, data, {
            headers: { "x-api-key": key, apikey: key },
            signal: AbortSignal.timeout(5000),
        });
    } catch (error) {
        console.log(error);
    }
    return false;
}

export function createAttributes(data: any): any {
    const attrs: any = [];
    Object.entries(data).forEach(([key, value]) => {
        if (key != "address") {
            const obj = { name: key, value: String(value) };
            attrs.push(obj);
        }
    });
    return attrs;
}

export function createOffer(
    connection_id: string,
    cred_defs_id: string,
    data: any,
    comment: string = ""
) {
    const attributes = createAttributes(data);
    const offer = {
        comment: comment,
        trace: true,
        connection_id: connection_id,
        credential_preview: {
            "@type": "issue-credential/1.0/credential-preview",
            attributes: attributes,
        },
        cred_def_id: cred_defs_id,
        auto_remove: true,
        auto_issue: true,
    };
    return offer;
}

export async function sendOffer(agentUrl: string, key: string, offerDoc: any) {
    const url = `${agentUrl}/issue-credential/send-offer`;
    try {
        const response = await axios.post(url, offerDoc, {
            headers: { "x-api-key": key, apikey: key },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

export function createPresentation(
    credDefId: string,
    proofName: string,
    connectionId: string,
    reqAttrs: string[],
    reqPreds: Predicate[],
    comment: string = ""
): any {
    // create request attributes
    const attrs: any = {};
    reqAttrs.forEach((e) => {
        console.log(e);
        attrs[e] = {
            name: e,
            restrictions: [{ cred_def_id: credDefId }],
        };
    });

    // create request predicates
    const preds: any = {};
    reqPreds.forEach((e) => {
        preds[e.name] = {
            name: e.name,
            p_type: e.type,
            p_value: e.value,
            restrictions: [{ cred_def_id: credDefId }],
        };
    });

    // create proof request
    const proofReq: any = {};
    proofReq["name"] = proofName;
    proofReq["requested_attributes"] = attrs;
    proofReq["requested_predicates"] = preds;
    proofReq["version"] = "1.0";

    // create presetentation
    const presentation: any = {};
    presentation["comment"] = comment;
    presentation["connection_id"] = connectionId;
    presentation["proof_request"] = proofReq;
    return presentation;
}

export async function sendPresentationRequest(
    agentUrl: string,
    key: string,
    presentationDoc: any
) {
    const url = `${agentUrl}/present-proof/send-request`;
    try {
        const response = await axios.post(url, presentationDoc, {
            headers: { "x-api-key": key, apikey: key },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
    return null;
}

export async function getRevealedAttrs(
    agentUrl: string,
    key: string,
    pres_ex_id: string
) {
    const url = `${agentUrl}/present-proof/records/${pres_ex_id}`;
    try {
        const response = await axios.get(url, {
            headers: { "x-api-key": key, apikey: key },
        });
        if (response.data["state"] === "verified") {
            return response.data["presentation"]["requested_proof"][
                "revealed_attrs"
            ];
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

/*------------------
 * VC VERSION 2:
 *-----------------*/

/*
export function createOfferV2(
    connection_id: string,
    cred_def_id: string,
    data: any,
    comment: string = ""
) {
    const attributes = createAttributes(data);
    const offer = {
        comment: comment,
        trace: true,
        credential_preview: {
            "@type": "issue-credential/1.0/credential-preview",
            attributes: attributes,
        },
        filter: {
            indy: {
                cred_def_id: cred_def_id,
                issuer_did: issuer_did,
                schema_id: schema_id,
                schema_issuer_did: schema_issuer_did ?? issuer_did,
                schema_name: schema_name,
                schema_version: schema_version,
            },
            ld_proof: {
                credential: {
                    "@context": [
                        "https://www.w3.org/2018/credentials/v1",
                    ],
                    credentialSubject: attributes
                }
            }
        },
        replacement_id: replacement_id,
        auto_remove: true,
        auto_issue: true,
    };
    return offer;
}
*/
