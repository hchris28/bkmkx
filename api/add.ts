import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Bookmark } from '../types/bookmark';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

interface AddBookmarkRequestBody {
	name: string;
	link: string;
	tags: string[];
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

	const { name, link, tags }: AddBookmarkRequestBody = request.body;

	const newBookmark : Bookmark = {
		_id: new ObjectId(),
		name: name,
		link: link,
		icon: "",
		order: 0,
		last_used: new Date(),
		tags: tags
	}

  async function run() {
    try {
      await client.connect();
      const collection = client.db("bkmkx").collection("bookmarks");
			await collection.insertOne(newBookmark);
      return newBookmark;
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