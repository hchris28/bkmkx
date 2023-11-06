import { ObjectId } from "mongodb";

export interface Bookmark {
	_id: ObjectId;
	name: string;
	link: string;
	icon: string;
	order: number;
	last_used: Date;
	tags: string[];
}