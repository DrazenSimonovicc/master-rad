import PocketBase from "pocketbase";

export const pb = new PocketBase("http://127.0.0.1:8090");

export const PocketBaseCollection = `${pb.baseUrl}/api/collections`;
