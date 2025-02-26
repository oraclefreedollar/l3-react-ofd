export class Chain {
	private static _id: number | undefined

	private constructor() {}

	public static setId(id: number) {
		this._id = id
	}

	public static getId(): number | undefined {
		return this._id
	}
}
