import * as fs from "fs";
import Thumbnail from "./thumbnail";
import {spawn } from "child_process";

export default class FFmpeg {

    private config: FFmpegConfig = {
        quality: 2,
        codec: "mjpeg",
        filter: "image2",
        timestamp: "00:00:10",
        width: 180,
        height: 180
    };
    private input = "";
    private path: string;
    private thumbnail: Thumbnail;

    constructor(thumbnail: Thumbnail, ffmpegPath?: string, config?: FFmpegConfig) {
        this.config = {...this.config, ...config};
        this.path = ffmpegPath || "/opt/lib/ffmpeg";
        this.thumbnail = thumbnail;
    }

    setConfig(config: FFmpegConfig) {
        this.config = {...this.config, ...config};
    }

    setInput(input: string) {
        if (!input.toLowerCase().match(/http[s]?:\/\//) && !fs.existsSync(input)) throw new FFmpegException("Invalid file path/url given.");
        this.input = input;
    }

    setFFmpegPath(path: string) {
        if (!this.testFFmpegPath(path)) throw new FFmpegException("Invalid file permissions.\n " + path + " is not executable");
            this.path = path;
    }

    private testFFmpegPath(path?: string): boolean {
        if (!path) path = this.path;
        if (!fs.existsSync(path)) throw new FFmpegException("Supplied FFmpeg path does not exist: " + path);
        try {
            fs.accessSync(path, fs.constants.X_OK);
            return true;
          }
 catch (err) {
            return false;
          }
    }

    public generateThumbnail(thumbnail?: Thumbnail): Promise<number> {
        if (!thumbnail) thumbnail = this.thumbnail;
        const writeStream = fs.createWriteStream("/tmp/screenshot." + thumbnail.getType());
        this.config = {...this.config, ...thumbnail.getFFmpegConfig()};
        this.setInput(thumbnail.getInput());

        const ffmpeg = spawn(this.path, this.generateArguements());

        return new Promise<number>((resolve, reject)=>{
            ffmpeg.on("error", (err: Error, stdout: Buffer|string, stderr: Buffer|string)=> {
                /*console.log(err);
                console.log('ffmpeg stdout:\n' + stdout);
                console.log('ffmpeg stderr:\n' + stderr);*/
                throw new FFmpegException("An error occurred while trying to executed FFmpeg: " + err);
              });
              ffmpeg.on("close", (code: number, signal: string) =>{
                if (code !== 0) {
                    reject("FFmpeg exited with code " + code + ".\n Signal : " + signal);
                }
                writeStream.end();
                resolve(code);

              });
              writeStream.on("error", (err: Error) =>{
                reject("An error occurred while writing to the file : " + err);
              });
              ffmpeg.on("end", function() {
                writeStream.end();
              });
              ffmpeg.stdout.pipe(writeStream)
              .on("error", function(err){
                reject("An error occurred while writing to the file : " + err);
              });
        });

    }

    private generateArguements(): string[] {

        const args: string[] = [
            "-ss", this.config.timestamp,
            "-i", this.input, // url to stream from
            "-vf", "thumbnail,scale="+this.config.width+":"+this.config.height,
            "-qscale:v" ,this.config.quality.toString(),
            "-frames:v", "1",
            "-f", this.config.filter || "image2",
            "-c:v", this.config.codec,
            "pipe:1"];

        return args;

    }

}

export interface FFmpegConfig {
    quality: number
    codec: string
    timestamp: string
    filter?: string,
    width: number,
    height: number
};

/**
 *
 *           "-ss","00:00:05", // time to take screenshot
          "-i", target, // url to stream from
          "-vf", "thumbnail,scale="+thumbWidth+":"+thumbHeight,
          "-qscale:v" ,"2",
          "-frames:v", "1",
          "-f", "image2",
          "-c:v", "mjpeg",
 */

 class FFmpegException extends Error {

 }