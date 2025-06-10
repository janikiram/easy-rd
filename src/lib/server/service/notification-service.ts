import { DISCORD_WEBHOOK_URL } from '$env/static/private';
import type { Member } from '$lib/types';

/**
 * 디스코드에서 제공하는 WebhookClient는 노드 런타임에서만 돌아가기 때문에
 * 직접 구현했음.
 */
class WebhookClient {
	private _url: string;
	constructor({ url }: { url: string }) {
		this._url = url;
	}

	async send({ embeds }: { embeds: EmbedBuilder[] }) {
		const body = JSON.stringify({
			embeds: embeds.map((embed) => embed.toJSON())
		});

		await fetch(this._url, {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json'
			}
		}).catch((e) => {
			console.error(`Error sending discord message: ${body}`, e);
		});
	}
}

export default class NotificationService {
	private client: WebhookClient;

	constructor() {
		this.client = new WebhookClient({ url: DISCORD_WEBHOOK_URL });
	}

	async sendOnCreatedUser(user: Member): Promise<void> {
		const embed = new EmbedBuilder()
			.setColor(0x00ff00) // 초록색 (기쁜 일을 나타냄)
			.setTitle('🎉 새로운 사용자가 가입했습니다! 🎉')
			.setDescription(`${user.name}님이 우리 커뮤니티에 합류했습니다. 환영해주세요!`)
			.addFields(
				{ name: '이름', value: user.name, inline: true },
				{ name: '이메일', value: user.email, inline: true }
			)
			.setThumbnail(user.image) // 사용자 이미지를 썸네일로 사용
			.setTimestamp()
			.setFooter({ text: '이거 경사났네 경사났어' });

		await this.#sendMessageWithEmbed(embed);
	}

	async #sendMessageWithEmbed(embed: EmbedBuilder): Promise<void> {
		try {
			await this.client.send({ embeds: [embed] });
		} catch (error) {
			console.error('Error sending discord message:', error);
		}
	}
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
 *
 * Length limit: 6000 characters
 */
export interface APIEmbed {
	/**
	 * Title of embed
	 *
	 * Length limit: 256 characters
	 */
	title?: string;
	/**
	 * Type of embed (always "rich" for webhook embeds)
	 *
	 * @deprecated *Embed types should be considered deprecated and might be removed in a future API version*
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-types
	 */
	type?: EmbedType;
	/**
	 * Description of embed
	 *
	 * Length limit: 4096 characters
	 */
	description?: string;
	/**
	 * URL of embed
	 */
	url?: string;
	/**
	 * Timestamp of embed content
	 */
	timestamp?: string;
	/**
	 * Color code of the embed
	 */
	color?: number;
	/**
	 * Footer information
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
	 */
	footer?: APIEmbedFooter;
	/**
	 * Image information
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
	 */
	image?: APIEmbedImage;
	/**
	 * Thumbnail information
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
	 */
	thumbnail?: APIEmbedThumbnail;
	/**
	 * Video information
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
	 */
	video?: APIEmbedVideo;
	/**
	 * Provider information
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
	 */
	provider?: APIEmbedProvider;
	/**
	 * Author information
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
	 */
	author?: APIEmbedAuthor;
	/**
	 * Fields information
	 *
	 * Length limit: 25 field objects
	 *
	 * See https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
	 */
	fields?: APIEmbedField[];
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
 */
export interface APIEmbedAuthor {
	/**
	 * Name of author
	 *
	 * Length limit: 256 characters
	 */
	name: string;
	/**
	 * URL of author
	 */
	url?: string;
	/**
	 * URL of author icon (only supports http(s) and attachments)
	 */
	icon_url?: string;
	/**
	 * A proxied url of author icon
	 */
	proxy_icon_url?: string;
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
 */
export interface APIEmbedField {
	/**
	 * Name of the field
	 *
	 * Length limit: 256 characters
	 */
	name: string;
	/**
	 * Value of the field
	 *
	 * Length limit: 1024 characters
	 */
	value: string;
	/**
	 * Whether or not this field should display inline
	 */
	inline?: boolean;
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
 */
export interface APIEmbedFooter {
	/**
	 * Footer text
	 *
	 * Length limit: 2048 characters
	 */
	text: string;
	/**
	 * URL of footer icon (only supports http(s) and attachments)
	 */
	icon_url?: string;
	/**
	 * A proxied url of footer icon
	 */
	proxy_icon_url?: string;
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
 */
export interface APIEmbedImage {
	/**
	 * Source url of image (only supports http(s) and attachments)
	 */
	url: string;
	/**
	 * A proxied url of the image
	 */
	proxy_url?: string;
	/**
	 * Height of image
	 */
	height?: number;
	/**
	 * Width of image
	 */
	width?: number;
}

/**
 * A tuple satisfying the RGB color model.
 *
 * @see {@link https://developer.mozilla.org/docs/Glossary/RGB}
 */
type RGBTuple = [red: number, green: number, blue: number];

/**
 * The base icon data typically used in payloads.
 */
interface IconData {
	/**
	 * The URL of the icon.
	 */
	iconURL?: string;
	/**
	 * The proxy URL of the icon.
	 */
	proxyIconURL?: string;
}

/**
 * Represents the author data of an embed.
 */
interface EmbedAuthorData extends IconData, Omit<APIEmbedAuthor, 'icon_url' | 'proxy_icon_url'> {}

/**
 * Represents the author options of an embed.
 */
interface EmbedAuthorOptions extends Omit<EmbedAuthorData, 'proxyIconURL'> {}

/**
 * Represents the footer data of an embed.
 */
interface EmbedFooterData extends IconData, Omit<APIEmbedFooter, 'icon_url' | 'proxy_icon_url'> {}

/**
 * Represents the footer options of an embed.
 */
interface EmbedFooterOptions extends Omit<EmbedFooterData, 'proxyIconURL'> {}

/**
 * Represents the image data of an embed.
 */
interface EmbedImageData extends Omit<APIEmbedImage, 'proxy_url'> {
	/**
	 * The proxy URL for the image.
	 */
	proxyURL?: string;
}

/**
 * A builder that creates API-compatible JSON data for embeds.
 */
class EmbedBuilder {
	/**
	 * The API data associated with this embed.
	 */
	public readonly data: APIEmbed;

	/**
	 * Creates a new embed from API data.
	 *
	 * @param data - The API data to create this embed with
	 */
	public constructor(data: APIEmbed = {}) {
		this.data = { ...data };
		if (data.timestamp) this.data.timestamp = new Date(data.timestamp).toISOString();
	}

	/**
	 * Appends fields to the embed.
	 *
	 * @remarks
	 * This method accepts either an array of fields or a variable number of field parameters.
	 * The maximum amount of fields that can be added is 25.
	 * @example
	 * Using an array:
	 * ```ts
	 * const fields: APIEmbedField[] = ...;
	 * const embed = new EmbedBuilder()
	 * 	.addFields(fields);
	 * ```
	 * @example
	 * Using rest parameters (variadic):
	 * ```ts
	 * const embed = new EmbedBuilder()
	 * 	.addFields(
	 * 		{ name: 'Field 1', value: 'Value 1' },
	 * 		{ name: 'Field 2', value: 'Value 2' },
	 * 	);
	 * ```
	 * @param fields - The fields to add
	 */
	public addFields(...fields: RestOrArray<APIEmbedField>): this {
		const normalizedFields = normalizeArray(fields);

		if (this.data.fields) this.data.fields.push(...normalizedFields);
		else this.data.fields = normalizedFields;
		return this;
	}

	/**
	 * Removes, replaces, or inserts fields for this embed.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 * The maximum amount of fields that can be added is 25.
	 *
	 * It's useful for modifying and adjusting order of the already-existing fields of an embed.
	 * @example
	 * Remove the first field:
	 * ```ts
	 * embed.spliceFields(0, 1);
	 * ```
	 * @example
	 * Remove the first n fields:
	 * ```ts
	 * const n = 4;
	 * embed.spliceFields(0, n);
	 * ```
	 * @example
	 * Remove the last field:
	 * ```ts
	 * embed.spliceFields(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of fields to remove
	 * @param fields - The replacing field objects
	 */
	public spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this {
		if (this.data.fields) this.data.fields.splice(index, deleteCount, ...fields);
		else this.data.fields = fields;
		return this;
	}

	/**
	 * Sets the fields for this embed.
	 *
	 * @remarks
	 * This method is an alias for {@link EmbedBuilder.spliceFields}. More specifically,
	 * it splices the entire array of fields, replacing them with the provided fields.
	 *
	 * You can set a maximum of 25 fields.
	 * @param fields - The fields to set
	 */
	public setFields(...fields: RestOrArray<APIEmbedField>): this {
		this.spliceFields(0, this.data.fields?.length ?? 0, ...normalizeArray(fields));
		return this;
	}

	/**
	 * Sets the author of this embed.
	 *
	 * @param options - The options to use
	 */

	public setAuthor(options: EmbedAuthorOptions | null): this {
		if (options === null) {
			this.data.author = undefined;
			return this;
		}

		this.data.author = { name: options.name, url: options.url, icon_url: options.iconURL };
		return this;
	}

	/**
	 * Sets the color of this embed.
	 *
	 * @param color - The color to use
	 */
	public setColor(color: RGBTuple | number | null): this {
		if (Array.isArray(color)) {
			const [red, green, blue] = color;
			this.data.color = (red << 16) + (green << 8) + blue;
			return this;
		}

		this.data.color = color ?? undefined;
		return this;
	}

	/**
	 * Sets the description of this embed.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string | null): this {
		this.data.description = description ?? undefined;
		return this;
	}

	/**
	 * Sets the footer of this embed.
	 *
	 * @param options - The footer to use
	 */
	public setFooter(options: EmbedFooterOptions | null): this {
		if (options === null) {
			this.data.footer = undefined;
			return this;
		}

		this.data.footer = { text: options.text, icon_url: options.iconURL };
		return this;
	}

	/**
	 * Sets the image of this embed.
	 *
	 * @param url - The image URL to use
	 */
	public setImage(url: string | null): this {
		this.data.image = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the thumbnail of this embed.
	 *
	 * @param url - The thumbnail URL to use
	 */
	public setThumbnail(url: string | null): this {
		this.data.thumbnail = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the timestamp of this embed.
	 *
	 * @param timestamp - The timestamp or date to use
	 */
	public setTimestamp(timestamp: Date | number | null = Date.now()): this {
		this.data.timestamp = timestamp ? new Date(timestamp).toISOString() : undefined;
		return this;
	}

	/**
	 * Sets the title for this embed.
	 *
	 * @param title - The title to use
	 */
	public setTitle(title: string | null): this {
		this.data.title = title ?? undefined;
		return this;
	}

	/**
	 * Sets the URL of this embed.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string | null): this {
		this.data.url = url ?? undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): APIEmbed {
		return { ...this.data };
	}
}
/**
 * Normalizes data that is a rest parameter or an array into an array with a depth of 1.
 *
 * @typeParam ItemType - The data that must satisfy {@link RestOrArray}.
 * @param arr - The (possibly variadic) data to normalize
 */
function normalizeArray<ItemType>(arr: RestOrArray<ItemType>): ItemType[] {
	if (Array.isArray(arr[0])) return [...arr[0]];
	return arr as ItemType[];
}

/**
 * Represents data that may be an array or came from a rest parameter.
 *
 * @remarks
 * This type is used throughout builders to ensure both an array and variadic arguments
 * may be used. It is normalized with {@link normalizeArray}.
 */
type RestOrArray<Type> = Type[] | [Type[]];
/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
 */

interface APIEmbedProvider {
	/**
	 * Name of provider
	 */
	name?: string;
	/**
	 * URL of provider
	 */
	url?: string;
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
 */
interface APIEmbedVideo {
	/**
	 * Source url of video
	 */
	url?: string;
	/**
	 * A proxied url of the video
	 */
	proxy_url?: string;
	/**
	 * Height of video
	 */
	height?: number;
	/**
	 * Width of video
	 */
	width?: number;
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
 */
export interface APIEmbedThumbnail {
	/**
	 * Source url of thumbnail (only supports http(s) and attachments)
	 */
	url: string;
	/**
	 * A proxied url of the thumbnail
	 */
	proxy_url?: string;
	/**
	 * Height of thumbnail
	 */
	height?: number;
	/**
	 * Width of thumbnail
	 */
	width?: number;
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-types
 *
 * @deprecated *Embed types should be considered deprecated and might be removed in a future API version*
 */
export enum EmbedType {
	/**
	 * Generic embed rendered from embed attributes
	 */
	Rich = 'rich',
	/**
	 * Image embed
	 */
	Image = 'image',
	/**
	 * Video embed
	 */
	Video = 'video',
	/**
	 * Animated gif image embed rendered as a video embed
	 */
	GIFV = 'gifv',
	/**
	 * Article embed
	 */
	Article = 'article',
	/**
	 * Link embed
	 */
	Link = 'link',
	/**
	 * Auto moderation alert embed
	 *
	 * @unstable This embed type is currently not documented by Discord, but it is returned in the auto moderation system messages.
	 */
	AutoModerationMessage = 'auto_moderation_message'
}
