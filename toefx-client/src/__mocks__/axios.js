export default {
    get: jest.fn(() => Promise.resolve({data: []})),
    post: jest.fn(() => Promise.resolve({status: 200, data: { success: true, token: "Bearer asdf"}})),
    defaults: {headers : {common: {Authorization: ""}}}
}