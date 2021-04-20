import S3 from "aws-sdk/clients/s3";
import {promises as fileSystem, createReadStream} from "fs";
import Thumbnail, { S3Thumbnail, ThumbnailConfig } from "./thumbnail";
import { decodeKey, isValidType } from "./util";
import FFmpeg from "./ffmpeg";


interface ThumbnailerConfig {
    ffmpegPath?: string // default path = '/opt/lib/ffmpeg'
    bucket?: string // null = use
    allowedFileTypes: string[]
};

interface S3Bucket {
    name: string,
    ownerIdentity: Object,
    arn: string
}

interface S3Object {
    key: string
    size: number
    eTag: string
    sequencer: string
}

export interface S3Record {
    s3SchemaVersion: number
    configurationId: string
    bucket: S3Bucket
    object: S3Object
}

export default class Thumbnailer {

    protected config: ThumbnailerConfig = {
        ffmpegPath: "/opt/bin/ffmpeg",
        allowedFileTypes: ["mov", "mpg", "mpeg", "mp4", "wmv","avi"],
    };
    private input: string;

    constructor(input: string, config?: ThumbnailerConfig) {
        this.input = input;
        this.config = {...this.config, ...config};
    }

    createThumbnail(config?: ThumbnailConfig): Promise<any> {
        const thumb: Thumbnail = new Thumbnail(this.input, config);

        return new Promise((resolve, reject)=>{
            this.generateThumbnail(thumb).then(()=>resolve(true), ()=>reject());
        });
    }

   generateThumbnail(thumbnail: Thumbnail): Promise<any> {

    const ffmpeg: FFmpeg = new FFmpeg(thumbnail, this.config.ffmpegPath);
    return new Promise((resolve, reject)=>{

        ffmpeg.generateThumbnail().then((value)=>{

            fileSystem.copyFile("/tmp/screenshot."+thumbnail.getType, thumbnail.getOutput()).then(()=>resolve(true), ()=>reject());

        }, (value)=>reject(value));

    });

   }

  }


  export class S3Thumbnailer extends Thumbnailer {

    private key: string;
    private bucket: string;
    private client: S3 = new S3();
    constructor(s3Record: S3Record, S3Config?: S3.ClientConfiguration,  config?: ThumbnailerConfig) {
        super("", config);
        this.key = decodeKey(s3Record.object.key);
        if (!isValidType(this.key, this.config.allowedFileTypes)) throw new Error("Invalid filetype supplied");
        this.bucket = s3Record.bucket.name;
        this.client = new S3(S3Config);
    }
    createThumbnail(config?: ThumbnailConfig): Promise<string> {
        const thumb = new S3Thumbnail(this.bucket, this.key, config);
        return this.generateThumbnail(thumb);
    }

    setS3Options(config: S3.ClientConfiguration) {
        this.client = new S3(config);
    }

    generateThumbnail(thumbnail: S3Thumbnail): Promise<string> {
        const ffmpeg: FFmpeg = new FFmpeg(thumbnail, this.config.ffmpegPath);

    return new Promise((resolve, reject)=>{

        ffmpeg.generateThumbnail().then((value)=>{
            const tmpFile = createReadStream("/tmp/screenshot."+ thumbnail.getType());
            const params: S3.PutObjectRequest ={
                Bucket: thumbnail.getBucket(),
                Key: thumbnail.getOutput(),
                Body: tmpFile,
                ContentType: "image/"+ thumbnail.getType(),
                Metadata: {
                  thumbnail: "TRUE"
                }
              };
            if (value !== 0) {
                reject(value);
            }
            else {
                this.client.upload(params,(err, _data) => {
                    if (!err) {
                        resolve("Successfully uploaded " + thumbnail.getOutput());
                    }
                    else {
                        reject(err) ;
                    }

                });
            }

        }, (value)=>reject(value));

    });

   }

   getKey(): string {return this.key; }
   getBucket(): string {return this.bucket; }

    setKey(key: string): ThisType<S3Thumbnailer> {
        this.key = key;
        return this;
    }

    setBucket(bucket: string): ThisType<S3Thumbnailer> {
        this.bucket = bucket;
        return this;
    }


  }
