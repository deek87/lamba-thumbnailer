import * as util from "./util";
import { FFmpegConfig, ffMpegThumbnailOption } from "./ffmpeg";
import S3 from "aws-sdk/clients/s3";
import { parse, posix } from "path";
import { URL } from "url";

export interface ThumbnailConfig {
    outputBucket?: string // If blank output in same bucket
    outputKey?: string //If blank output is same key
    path?: string // default to key
    width: number
    height: number
    time: string // hours:minutes:seconds format
    prefix: string // default to "thumbnails/"
    suffix?: string
    type?: string // default to jpg
    quality: number // 1 to 10 --- 1 best quality 10 worst quality
    thumbnailOption?: ffMpegThumbnailOption
};

export default class Thumbnail {
    protected config: ThumbnailConfig = {
        prefix: "thumbnails/",
        width: 180,
        height: 180,
        time: "00:00:05",
        type: "jpg",
        quality: 2
    };

    protected generated = false;
    protected type?: string;
    protected input: string;
    protected fileName = "";

    constructor(input: string, config?: ThumbnailConfig) {
        this.input = input;
        this.config = { ...this.config, ...config };
        this.setType(this.config.type || "jpg");
        if (this.config.quality > 10) this.config.quality = 10;
        if (this.config.quality < 1) this.config.quality = 1;
        if (input !== "") {
            this.parseInput(input);
        }
        else {
            this.fileName = "thumbnail";
        }
    }

    private parseInput(input: string) {

        if (input.toLowerCase().match(/(http[s]?:\/\/|\/\/)/)) {
            const fileDetails = new URL(input);
            this.fileName = posix.basename(fileDetails.pathname || "");
        }
        else {
            const fileDetails = parse(input);
            this.config.path = fileDetails.dir;
            this.fileName = fileDetails.name;
        }
    }

    public getOutput(): string {
        let output: string;
        let path: string = (this.config.path || "");
        if (path !== "") path += "/";
        output = path + (this.config.prefix || "") + util.getFileName(this.fileName) + (this.config.suffix || "");
        if (this.getType().toLowerCase().match(/jpg|jpeg/)) output += ".jpg";
        if (this.getType().toLowerCase() === "png") output += ".png";
        if (this.getType().toLowerCase() === "webp") output += ".webp";
        return output;
    }

    public isGenerated(): boolean {
        return this.generated;
    }
    public setTime(time: string) {
        if (!time.match(/\d\d:\d\d:\d\d/)) throw new ThumbnailException("Invalid time format must match format 00:00:00");
        this.config.time = time;
    }
    public getTime(): string {
        return this.config.time || "00:00:10";
    }
    public setType(type: string) {
        if (!type.toLowerCase().match(/jpg|jpeg|png|webp/)) throw new ThumbnailException("Invalid type given. Valid types are jpg, png or webp");
        this.type = type;
    }

    public getType(): string {
        return this.type || "jpg";
    }

    public getInput(): string {
        return this.input;
    }

    public getFFmpegConfig(): FFmpegConfig {
        const config: FFmpegConfig = {
            quality: this.config.quality,
            codec: "mjpeg",
            filter: "image2pipe",
            time: "00:00:10",
            width: this.config.width,
            height: this.config.height,
            thumbnailOption: this.config.thumbnailOption ?? "default"
        };

        if (this.getType().toLowerCase() === "png") config.codec = "png"; //default is png
        if (this.getType().toLowerCase() === "webp") {
            config.codec = "libwebp";
            config.quality = (11 - config.quality) * 10;
        }

        return config;

    }

    public getConfig(): ThumbnailConfig {
        return this.config;
    }

}

export class S3Thumbnail extends Thumbnail {
    private bucket: string;
    private originalBucket: string;
    private key: string;
    constructor(bucket: string, key: string, config?: ThumbnailConfig) {
        super("", config);
        this.bucket = this.config.outputBucket || bucket;
        this.originalBucket = bucket;
        this.key = key;
        this.fileName = util.getNewName(this.config.outputKey || this.key, this.getType());
    }

    public getS3Url(): string {
        const s3 = new S3();
        return s3.getSignedUrl("getObject", { Bucket: this.originalBucket, Key: this.key, Expires: 1100 });
    }

    public getInput(): string {
        return this.getS3Url();
    }

    public getBucket(): string {
        return this.bucket;
    }

    public getKey(): string {
        return this.key;
    }

}

class ThumbnailException extends Error {

}
