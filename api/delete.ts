import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Bookmark } from '../types/bookmark';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

interface DeleteBookmarkRequestBody {
	_id: ObjectId;
};

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {

  if (process.env.MONGODB_URI === undefined) {
    response.status(500).json({ error: "Database connection is undefined." });
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

	const { _id }: DeleteBookmarkRequestBody = request.body;

  async function run() {
    try {
      await client.connect();
      const collection = client.db("bkmkx").collection("bookmarks");
			await collection.deleteOne({ _id: _id});
      return;
    } catch (err) {
      return err;
    } finally {
      await client.close();
    }
  }

  run().then((results) => {
    response.status(200).json(results);
  }).catch((err) => {
    response.status(500).json({ error: err });
  });

}